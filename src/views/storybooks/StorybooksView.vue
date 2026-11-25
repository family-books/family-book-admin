<template>
  <div>
    <el-tabs v-model="activeTab" @tab-change="switchTab">
      <el-tab-pane label="订单管理" name="orders" />
      <el-tab-pane label="预览记录" name="previews" />
      <el-tab-pane label="故事模板" name="templates" />
    </el-tabs>
    <template v-if="activeTab === 'orders'">
    <el-card class="filter-card">
      <el-form inline>
        <el-form-item label="订单状态"><el-select v-model="status" clearable placeholder="全部状态" style="width:160px" @change="search"><el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="search">查询</el-button></el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="orders" stripe v-loading="loading">
        <el-table-column label="绘本" min-width="250">
          <template #default="{ row }">
            <div class="book">
              <el-image v-if="row.photoUrl" :src="row.photoUrl" fit="cover" :preview-src-list="[row.photoUrl]">
                <template #error><div class="book-photo-placeholder">加载失败</div></template>
              </el-image>
              <div v-else class="book-photo-placeholder">无照片</div>
              <div class="book-details">
                <b>{{ bookTitle(row) }}</b>
                <span v-if="hasBookDetails(row)">{{ [row.productName, row.childAge == null ? null : row.childAge + '岁', row.childInterest || '未填写兴趣'].filter(Boolean).join(' · ') }}</span>
                <span v-else>{{ row.productName }}</span>
                <small v-if="row.coverTitle">{{ row.coverTitle }}</small>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" width="195" show-overflow-tooltip />
        <el-table-column label="金额" width="130"><template #default="{row}"><div v-if="row.redeemedWithCode">兑换码兑换</div><template v-else><div>合计 ¥{{row.totalAmount}}</div><small>¥{{row.unitPrice}} × {{row.quantity}}</small></template></template></el-table-column>
        <el-table-column label="状态" width="100"><template #default="{row}"><el-tag :type="tagType(row.orderStatus)">{{statusLabel(row.orderStatus)}}</el-tag></template></el-table-column>
        <el-table-column label="交付信息" min-width="180">
          <template #default="{ row }">
            <template v-if="row.productType === 'digital'">
              <a v-if="row.digitalFileUrl" :href="row.digitalFileUrl" target="_blank" rel="noopener">查看电子绘本 PDF</a>
              <span v-else>{{ row.automaticArtwork ? '等待自动生成 PDF' : '等待上传电子文件' }}</span>
            </template>
            <template v-else>
              <div>{{ row.recipientName || '未填写收件人' }}</div>
              <div v-if="row.trackingNo">{{ row.expressCompany }} {{ row.trackingNo }}</div>
              <el-button link type="primary" @click="deliveryOrder = row">查看交付详情</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <div class="order-actions">
              <el-button size="small" :disabled="!hasBookDetails(row)" @click="copyProduction(row)">复制资料</el-button>
              <el-button v-if="row.artworkSupported" size="small" @click="openArtwork(row)">插画</el-button>
              <el-button v-if="row.orderStatus === 'confirming'" size="small" type="primary" @click="confirmOrder(row)">代确认</el-button>
              <el-upload v-if="canUploadPdf(row)" :show-file-list="false" accept="application/pdf" :http-request="(options:any)=>uploadDigital(row,options)">
                <el-button size="small" type="primary">{{ row.productType === 'digital' ? '上传电子 PDF' : '上传印刷 PDF' }}</el-button>
              </el-upload>
              <el-dropdown v-if="nextActions(row).length" @command="(value:string)=>changeStatus(row,value)">
                <el-button size="small">更新状态<el-icon class="el-icon--right"><ArrowDown/></el-icon></el-button>
                <template #dropdown><el-dropdown-menu><el-dropdown-item v-for="item in nextActions(row)" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item></el-dropdown-menu></template>
              </el-dropdown>
              <el-button v-if="row.orderStatus === 'printing'" size="small" type="primary" @click="openShip(row)">发货</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" v-model:current-page="page" v-model:page-size="pageSize" :total="total" layout="total, prev, pager, next, sizes" :page-sizes="[10,20,50]" @current-change="load" @size-change="load" />
    </el-card>
    </template>
    <el-card v-else-if="activeTab === 'previews'">
      <el-button class="preview-refresh" :loading="loading" @click="load">刷新记录</el-button>
      <el-table :data="previews" stripe v-loading="loading">
        <el-table-column prop="id" label="项目 ID" min-width="180" />
        <el-table-column prop="userId" label="用户 ID" min-width="180" />
        <el-table-column label="绘本" min-width="200"><template #default="{row}">{{ row.childName }} · {{ row.templateName }}<br/><small>{{ row.coverTitle }}</small></template></el-table-column>
        <el-table-column label="预览状态" min-width="120"><template #default="{row}">{{ previewStatus(row.aiStatus) }}</template></el-table-column>
        <el-table-column label="成书状态" min-width="120"><template #default="{row}">{{ row.productionStatus ? previewStatus(row.productionStatus) : '—' }}</template></el-table-column>
        <el-table-column label="错误信息" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">{{ row.aiError ? '预览：' + row.aiError : row.productionError ? '成书：' + row.productionError : '—' }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="110"><template #default="{row}"><el-button size="small" @click="openPreview(row)">查看预览</el-button></template></el-table-column>
      </el-table>
      <el-pagination class="pagination" v-model:current-page="page" v-model:page-size="pageSize" :total="total" layout="total, prev, pager, next, sizes" :page-sizes="[10,20,50]" @current-change="load" @size-change="load" />
    </el-card>
    <StorybookTemplateReader v-else />
    <el-dialog v-model="artworkVisible" title="绘本插画与分镜" width="min(820px, 94vw)" @closed="closeArtwork">
      <div v-loading="artworkBusy">
        <div class="artwork-actions">
          <el-button v-if="artworkOrder?.orderStatus === 'generating' && artwork?.status !== 'full_completed' && (!artworkOrder.automaticArtwork || artwork?.status === 'full_failed' || artwork?.status === 'full_partial')"
            type="primary" :disabled="!artwork || artworkBusy || artwork.status === 'full_running'" @click="generateArtwork()">
            {{ artworkOrder?.automaticArtwork ? '重试自动制作' : '生成缺少的插画' }}
          </el-button>
          <el-button v-if="artworkOrder && artwork?.readerPdfState === 'failed'" :loading="retryingPdf"
            @click="retryReaderPdf()">重试生成 PDF</el-button>
          <el-button :disabled="artworkBusy" @click="refreshArtwork()">刷新进度</el-button>
          <el-button v-if="artworkOrder && !artworkOrder.automaticArtwork && artwork?.status === 'full_completed' && artwork.pages[0]?.layout === 'COVER'"
            @click="printArtwork">打开打印 / 导出 PDF</el-button>
          <span v-if="artwork?.status === 'full_running'">正在后台生成</span>
          <span v-else-if="artwork?.status === 'full_completed'">{{ artworkOrder?.automaticArtwork ? '绘本已自动排版完成' : '插画已齐，可以进行人工校对' }}</span>
        </div>
        <el-alert v-if="artwork?.error" :title="artwork.error" type="warning" :closable="false" />
        <el-empty v-if="!artwork?.pages.length && !artworkBusy" :description="artworkLoadFailed ? '加载失败，请刷新重试' : artwork?.status === 'failed' ? '预览生成失败，暂无可查看页面' : '暂无可查看页面'" />
        <el-alert v-else-if="previewId && artwork?.pages.length && (artwork.status === 'partial' || artwork.status === 'failed' || isGenerating(artwork.status) || artwork.pages.some(page => !page.imageUrl || page.qualityStatus === 'caption_pending'))"
          title="部分预览尚未完成，以下为已保存的内容" type="info" :closable="false" />
        <div v-if="artwork" class="artwork-pages">
          <article v-for="page in artwork.pages" :key="page.number">
            <button v-if="page.imageUrl" type="button" class="artwork-thumbnail"
              :aria-label="`放大预览第 ${page.number} 页`" @click="expandedPageNumber = page.number">
              <StorybookPreviewPage :page="page" :template-code="artwork.templateCode" />
            </button>
            <strong>第 {{ page.number }} 页 · {{ page.title }}</strong>
            <p v-if="page.failure">
              {{ page.failure.stage ? page.failure.stage + ' · ' : '' }}{{ page.failure.code }} · 已尝试 {{ page.failure.attempts ?? 0 }} 次
            </p>
            <p v-if="(!page.layout || page.layout === 'LEGACY' || !page.imageUrl) && page.qualityStatus !== 'caption_pending'">{{ page.text }}</p>
            <el-button v-if="page.imageUrl && !artworkOrder?.automaticArtwork && artworkOrder?.orderStatus === 'generating' && artwork.status?.startsWith('full_')"
              size="small" :disabled="artworkBusy || artwork.status === 'full_running'" @click="generateArtwork(page.number)">只重画这一页</el-button>
          </article>
        </div>
      </div>
    </el-dialog>
    <el-dialog :model-value="!!deliveryOrder" title="交付详情" width="min(460px, 94vw)" @update:model-value="deliveryOrder = null">
      <template v-if="deliveryOrder">
        <p>订单号 {{ deliveryOrder.orderNo }}</p>
        <p>{{ deliveryOrder.recipientName }} {{ deliveryOrder.phone }}</p>
        <p>{{ deliveryOrder.fullAddress || '暂无收件地址' }}</p>
        <p>{{ deliveryOrder.trackingNo ? deliveryOrder.expressCompany + ' ' + deliveryOrder.trackingNo : '暂无物流单号' }}</p>
        <a v-if="deliveryOrder.digitalFileUrl" :href="deliveryOrder.digitalFileUrl" target="_blank" rel="noopener">查看印刷 PDF</a>
      </template>
    </el-dialog>
    <el-dialog v-model="expandedPreviewVisible" :title="expandedPage?.title || '绘本预览'" width="min(820px, 94vw)" append-to-body>
      <StorybookPreviewPage v-if="expandedPage" :page="expandedPage" :template-code="artwork?.templateCode" />
    </el-dialog>
    <el-dialog v-model="shipVisible" title="确认绘本发货" width="460px"><el-form label-width="90px"><el-form-item label="订单号">{{selected?.orderNo}}</el-form-item><el-form-item label="快递公司"><el-input v-model="expressCompany" placeholder="例如：顺丰速运"/></el-form-item><el-form-item label="快递单号"><el-input v-model="trackingNo" placeholder="请输入快递单号"/></el-form-item></el-form><template #footer><el-button @click="shipVisible=false">取消</el-button><el-button type="primary" :loading="submitting" @click="submitShip">确认发货</el-button></template></el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStorybookArtwork, getStorybookOrders, getStorybookPreviews, getStorybookPreviewArtwork, queueStorybookArtwork, retryStorybookReaderPdf, confirmStorybookOrder, shipStorybookOrder, updateStorybookOrderStatus, uploadStorybookDigitalFile } from '@/api/storybooks'
import type { StorybookArtwork, StorybookPreview } from '@/api/storybooks'
import StorybookPreviewPage from './StorybookPreviewPage.vue'
import StorybookTemplateReader from './StorybookTemplateReader.vue'
import { openStorybookPrint } from './storybookPrint'
import type { StorybookOrder } from '@/types'
const activeTab=ref('orders'), previews=ref<StorybookPreview[]>([]), previewId=ref<string | null>(null)
const isGenerating = (status?: string) => /^(queued|running|full_running|initializing|analyzing|plan|planning|character|cover|caption|delivery|scene_\d+)$/.test(status || '')
const previewLabels: Record<string, string> = {
  unavailable: '暂无预览', partial: '部分完成', completed: '预览完成', failed: '生成失败',
  full_running: '成书生成中', full_completed: '成书完成', full_failed: '成书生成失败', full_partial: '成书部分待重试',
}
const previewStatus = (status: string) => previewLabels[status] || (isGenerating(status) ? '生成中' : status || '—')
const switchTab=()=>{
  page.value=1
  if (activeTab.value === 'templates') {
    listVersion++
    loading.value = false
    return
  }
  void load()
}
const loading=ref(false),orders=ref<StorybookOrder[]>([]),status=ref(''),page=ref(1),pageSize=ref(20),total=ref(0),shipVisible=ref(false),submitting=ref(false),selected=ref<StorybookOrder|null>(null),expressCompany=ref('顺丰速运'),trackingNo=ref('')
const statusOptions=[{label:'待支付',value:'pending_payment'},{label:'已支付',value:'paid'},{label:'制作中',value:'generating'},{label:'待用户确认',value:'confirming'},{label:'人工校对',value:'reviewing'},{label:'印刷中',value:'printing'},{label:'已发货',value:'shipped'},{label:'已完成',value:'completed'},{label:'已取消',value:'cancelled'},{label:'已退款',value:'refunded'}]
const transitionMap:Record<string,Array<{label:string,value:string}>>={paid:[{label:'开始制作',value:'generating'}],generating:[{label:'提交人工校对',value:'reviewing'}],shipped:[{label:'确认完成',value:'completed'}]}
const nextActions=(row:StorybookOrder)=>row.automaticArtwork&&row.orderStatus!=='shipped'?[]:row.orderStatus==='reviewing'?(row.productType==='digital'?[{label:'退回制作',value:'generating'},...(row.digitalFileUrl?[{label:'确认交付完成',value:'completed'}]:[])]:[{label:'退回制作',value:'generating'},{label:'校对通过，进入印刷',value:'printing'}]):transitionMap[row.orderStatus]||[]
const statusLabel=(value:string)=>statusOptions.find(i=>i.value===value)?.label||({pending_payment:'待支付'} as Record<string,string>)[value]||value
const tagType=(value:string)=>value==='completed'?'success':value==='shipped'?'primary':value==='cancelled'?'info':value==='paid'?'warning':''
const deliveryOrder = ref<StorybookOrder | null>(null)
const canUploadPdf = (row: StorybookOrder) => !row.automaticArtwork &&
  (row.orderStatus === 'reviewing' || (row.productType === 'digital' && row.orderStatus === 'generating'))
let listVersion = 0
const load = async () => {
  const version = ++listVersion
  const tab = activeTab.value
  const params = { page: page.value, pageSize: pageSize.value }
  loading.value = true
  try {
    if (tab === 'previews') {
      const { data } = await getStorybookPreviews(params)
      if (version !== listVersion) return
      previews.value = data.list
      total.value = data.total
    } else {
      const { data } = await getStorybookOrders({ ...params, status: status.value || undefined })
      if (version !== listVersion) return
      orders.value = data.list
      total.value = data.total
    }
  } catch {
    // The request layer reports the failure.
  } finally {
    if (version === listVersion) loading.value = false
  }
}
const search=()=>{page.value=1;load()}
const changeStatus = async (row: StorybookOrder, value: string) => {
  if (value === 'printing') {
    if (!row.digitalFileUrl) {
      ElMessage.warning('请先上传并核对印刷成品 PDF')
      return
    }
    try {
      await ElMessageBox.confirm('请确认已核对该订单的印刷成品 PDF。', '确认进入印刷', { type: 'warning' })
    } catch { return }
  }
  await updateStorybookOrderStatus(row.id, value)
  ElMessage.success('状态已更新')
  await load()
}
const confirmOrder = async (row: StorybookOrder) => {
  try {
    await ElMessageBox.confirm('该绘本将按用户已确认处理，直接进入印刷/交付且不可撤回。', '人工代确认', { type: 'warning' })
  } catch { return }
  await confirmStorybookOrder(row.id)
  ElMessage.success('已确认')
  await load()
}
const openShip=(row:StorybookOrder)=>{selected.value=row;trackingNo.value='';shipVisible.value=true}
const submitShip=async()=>{if(!selected.value||!expressCompany.value.trim()||!trackingNo.value.trim()){ElMessage.warning('请填写完整快递信息');return}submitting.value=true;try{await shipStorybookOrder(selected.value.id,expressCompany.value,trackingNo.value);ElMessage.success('已确认发货');shipVisible.value=false;load()}finally{submitting.value=false}}
const uploadDigital=async(row:StorybookOrder,options:any)=>{try{await uploadStorybookDigitalFile(row.id,options.file as File);options.onSuccess?.({});ElMessage.success('电子绘本已上传');load()}catch(e){options.onError?.(e)}}
const hasBookDetails = (row: StorybookOrder) => !!row.childName && row.childName !== '已删除' && !!row.templateName
const bookTitle = (row: StorybookOrder) => {
  if (row.childName === '已删除') return '绘本资料已清理'
  if (hasBookDetails(row)) return `${row.childName}的${row.templateName}`
  return row.coverTitle || row.templateName || '绘本资料不可用'
}
const copyProduction=async(row:StorybookOrder)=>{const lines=[`订单：${row.orderNo}`,`版本：${row.productName}`,`模板：${row.templateName}`,`孩子：${row.childName}（${row.childAge}岁）`,`兴趣：${row.childInterest||'未填写'}`,`封面：${row.coverTitle||''}`,`寄语：${row.dedication||''}`,`数量：${row.quantity}`,`照片：${row.photoUrl}`];if(row.productType!=='digital')lines.push(`收件：${row.recipientName} ${row.phone} ${row.fullAddress}`);await navigator.clipboard.writeText(lines.join('\n'));ElMessage.success('制作资料已复制')}

const artworkVisible = ref(false)
const artworkBusy = ref(false)
const artworkLoadFailed = ref(false)
const artworkOrder = ref<StorybookOrder | null>(null)
const artwork = ref<StorybookArtwork | null>(null)
const expandedPageNumber = ref<number | null>(null)
const expandedPage = computed(() => artwork.value?.pages.find(page => page.number === expandedPageNumber.value))
const expandedPreviewVisible = computed({
  get: () => !!expandedPage.value,
  set: (visible) => { if (!visible) expandedPageNumber.value = null },
})
let artworkTimer: ReturnType<typeof setTimeout> | undefined
let artworkVersion = 0

const closeArtwork = () => {
  artworkVersion++
  clearTimeout(artworkTimer)
  artworkOrder.value = null
  previewId.value = null
  artwork.value = null
  artworkLoadFailed.value = false
  expandedPageNumber.value = null
}

const retryingPdf = ref(false)

const retryReaderPdf = async () => {
  const projectId = artworkOrder.value?.projectId
  if (!projectId || retryingPdf.value) return
  retryingPdf.value = true
  try {
    const { data } = await retryStorybookReaderPdf(projectId)
    if (data) ElMessage.success('已重新安排 PDF 生成')
    await refreshArtwork()
  } finally {
    retryingPdf.value = false
  }
}

const refreshArtwork = async () => {
  clearTimeout(artworkTimer)
  const id = previewId.value || artworkOrder.value?.id
  if (!id) return
  const version = ++artworkVersion
  const fromPreview = !!previewId.value
  const current = () => version === artworkVersion && artworkVisible.value &&
    (fromPreview ? previewId.value === id : artworkOrder.value?.id === id)
  const previousStatus = artwork.value?.status
  try {
    const response = fromPreview ? await getStorybookPreviewArtwork(id) : await getStorybookArtwork(id)
    if (!current()) return
    artworkLoadFailed.value = false
    artwork.value = response.data
    if (isGenerating(artwork.value.status) || ['queued', 'running'].includes(artwork.value.readerPdfState || '')) {
      artworkTimer = setTimeout(refreshArtwork, 5000)
    } else if ((isGenerating(previousStatus) || (!fromPreview && artworkOrder.value?.orderStatus === 'generating'
        && artwork.value.status === 'full_completed')) && activeTab.value === (fromPreview ? 'previews' : 'orders')) {
      await load()
      if (current() && !fromPreview) {
        artworkOrder.value = orders.value.find(order => order.id === id) ?? artworkOrder.value
      }
    }
  } catch {
    if (current()) artworkLoadFailed.value = true
  }
}

const printArtwork = async () => {
  if (!artwork.value) return
  try {
    await openStorybookPrint(artwork.value.pages)
  } catch (error) {
    ElMessage.warning(error instanceof Error ? error.message : '暂时无法打开绘本排版')
  }
}

const openPreview = async (project: StorybookPreview) => {
  closeArtwork()
  previewId.value = project.id
  artworkVisible.value = true
  await refreshArtwork()
}

const openArtwork = async (order: StorybookOrder) => {
  closeArtwork()
  artworkOrder.value = order
  artworkVisible.value = true
  await refreshArtwork()
}

const generateArtwork = async (pageNumber?: number) => {
  const id = artworkOrder.value?.id
  if (!id || artworkBusy.value) return
  artworkBusy.value = true
  try {
    await queueStorybookArtwork(id, pageNumber)
    await refreshArtwork()
  } finally {
    artworkBusy.value = false
  }
}

let listTimer: ReturnType<typeof setInterval> | undefined
onBeforeUnmount(() => {
  closeArtwork()
  clearInterval(listTimer)
  listVersion++
})
onMounted(() => {
  void load()
  listTimer = setInterval(() => {
    if (loading.value || document.hidden || activeTab.value === 'templates') return
    const pending = activeTab.value === 'orders'
      ? orders.value.some(row => row.automaticArtwork && row.orderStatus === 'generating')
      : previews.value.some(row => isGenerating(row.aiStatus) || isGenerating(row.productionStatus))
    if (pending) void load()
  }, 10000)
})
</script>

<style scoped>
.filter-card{margin-bottom:20px}.pagination{margin-top:20px;justify-content:flex-end}.book{display:flex;align-items:center;gap:12px}.book .el-image,.book-photo-placeholder{width:52px;height:66px;flex-shrink:0;border-radius:6px;background:#f4f4f5}.book-photo-placeholder{display:grid;place-items:center;color:#606266;font-size:12px}.book-details{display:flex;min-width:0;flex-direction:column;gap:4px}.book span,.book small,td small{color:#909399;font-size:12px}.book b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.artwork-actions{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.artwork-pages{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-top:16px}
.artwork-pages article{border:1px solid var(--el-border-color);border-radius:8px;padding:12px}
.artwork-thumbnail{display:block;width:100%;margin:0 0 8px;padding:0;border:0;background:none;text-align:left;cursor:zoom-in}
.order-actions{display:flex;align-items:center;flex-wrap:wrap;gap:6px}
.order-actions .el-button{margin:0}
.preview-refresh{margin-bottom:12px}
</style>
