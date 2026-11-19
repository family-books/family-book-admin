<template>
  <div>
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
        <el-table-column label="金额" width="130"><template #default="{row}"><div>合计 ¥{{row.totalAmount}}</div><small>¥{{row.unitPrice}} × {{row.quantity}}</small></template></el-table-column>
        <el-table-column label="状态" width="100"><template #default="{row}"><el-tag :type="tagType(row.orderStatus)">{{statusLabel(row.orderStatus)}}</el-tag></template></el-table-column>
        <el-table-column label="交付信息" min-width="240"><template #default="{row}"><template v-if="row.productType==='digital'"><a v-if="row.digitalFileUrl" :href="row.digitalFileUrl" target="_blank">查看电子绘本 PDF</a><span v-else>{{ row.automaticArtwork ? '等待自动生成 PDF' : '等待上传电子文件' }}</span></template><template v-else><div>{{row.recipientName}} {{row.phone}}</div><small>{{row.fullAddress}}</small><div v-if="row.digitalFileUrl"><a :href="row.digitalFileUrl" target="_blank" rel="noopener">下载印刷 PDF</a></div></template></template></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="360" fixed="right"><template #default="{row}"><el-button size="small" :disabled="!hasBookDetails(row)" @click="copyProduction(row)">复制资料</el-button><el-button v-if="row.artworkSupported" size="small" @click="openArtwork(row)">插画</el-button><el-upload v-if="!row.automaticArtwork&&row.productType==='digital'&&['generating','reviewing'].includes(row.orderStatus)" :show-file-list="false" accept="application/pdf" :http-request="(options:any)=>uploadDigital(row,options)"><el-button size="small" type="primary">上传PDF</el-button></el-upload><el-dropdown v-if="nextActions(row).length" @command="(value:string)=>changeStatus(row,value)"><el-button size="small">更新状态<el-icon class="el-icon--right"><ArrowDown/></el-icon></el-button><template #dropdown><el-dropdown-menu><el-dropdown-item v-for="item in nextActions(row)" :key="item.value" :command="item.value">{{item.label}}</el-dropdown-item></el-dropdown-menu></template></el-dropdown><el-button v-if="row.orderStatus==='printing'" size="small" type="primary" @click="openShip(row)">发货</el-button></template></el-table-column>
      </el-table>
      <el-pagination class="pagination" v-model:current-page="page" v-model:page-size="pageSize" :total="total" layout="total, prev, pager, next, sizes" :page-sizes="[10,20,50]" @current-change="load" @size-change="load" />
    </el-card>
    <el-dialog v-model="artworkVisible" title="绘本插画与分镜" width="min(820px, 94vw)" @closed="closeArtwork">
      <div v-loading="artworkBusy">
        <div class="artwork-actions">
          <el-button v-if="artworkOrder?.orderStatus === 'generating' && artwork?.status !== 'full_completed' && (!artworkOrder.automaticArtwork || artwork?.status === 'full_failed')"
            type="primary" :disabled="!artwork || artworkBusy || artwork.status === 'full_running'" @click="generateArtwork()">
            {{ artworkOrder?.automaticArtwork ? '重试自动制作' : '生成缺少的插画' }}
          </el-button>
          <el-button :disabled="artworkBusy" @click="refreshArtwork()">刷新进度</el-button>
          <el-button v-if="!artworkOrder?.automaticArtwork && artwork?.status === 'full_completed' && artwork.pages[0]?.layout === 'COVER'"
            @click="printArtwork">排版并保存 PDF</el-button>
          <span v-if="artwork?.status === 'full_running'">正在后台生成</span>
          <span v-else-if="artwork?.status === 'full_completed'">{{ artworkOrder?.automaticArtwork ? '绘本已自动排版完成' : '插画已齐，可以进行人工校对' }}</span>
        </div>
        <el-alert v-if="artwork?.error" :title="artwork.error" type="warning" :closable="false" />
        <div v-if="artwork" class="artwork-pages">
          <article v-for="page in artwork.pages" :key="page.number">
            <div v-if="page.imageUrl" class="artwork-frame">
              <el-image :src="page.imageUrl" fit="contain" :preview-src-list="[page.imageUrl]" preview-teleported />
              <p v-if="page.textBox" class="artwork-caption" :style="{
                left: page.textBox.left + '%', width: page.textBox.width + '%',
                [page.textBox.fromBottom ? 'bottom' : 'top']: page.textBox.offset + '%',
              }">{{ page.text }}</p>
            </div>
            <strong>第 {{ page.number }} 页 · {{ page.title }}</strong>
            <p v-if="!page.textBox || !page.imageUrl">{{ page.text }}</p>
            <el-button v-if="page.imageUrl && !artworkOrder?.automaticArtwork && artworkOrder?.orderStatus === 'generating' && artwork.status?.startsWith('full_')"
              size="small" :disabled="artworkBusy || artwork.status === 'full_running'" @click="generateArtwork(page.number)">只重画这一页</el-button>
          </article>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="shipVisible" title="确认绘本发货" width="460px"><el-form label-width="90px"><el-form-item label="订单号">{{selected?.orderNo}}</el-form-item><el-form-item label="快递公司"><el-input v-model="expressCompany" placeholder="例如：顺丰速运"/></el-form-item><el-form-item label="快递单号"><el-input v-model="trackingNo" placeholder="请输入快递单号"/></el-form-item></el-form><template #footer><el-button @click="shipVisible=false">取消</el-button><el-button type="primary" :loading="submitting" @click="submitShip">确认发货</el-button></template></el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getStorybookArtwork, getStorybookOrders, queueStorybookArtwork, shipStorybookOrder, updateStorybookOrderStatus, uploadStorybookDigitalFile } from '@/api/storybooks'
import type { StorybookArtwork } from '@/api/storybooks'
import { openStorybookPrint } from './storybookPrint'
import type { StorybookOrder } from '@/types'
const loading=ref(false),orders=ref<StorybookOrder[]>([]),status=ref(''),page=ref(1),pageSize=ref(20),total=ref(0),shipVisible=ref(false),submitting=ref(false),selected=ref<StorybookOrder|null>(null),expressCompany=ref('顺丰速运'),trackingNo=ref('')
const statusOptions=[{label:'已支付',value:'paid'},{label:'制作中',value:'generating'},{label:'人工校对',value:'reviewing'},{label:'印刷中',value:'printing'},{label:'已发货',value:'shipped'},{label:'已完成',value:'completed'},{label:'已取消',value:'cancelled'},{label:'已退款',value:'refunded'}]
const transitionMap:Record<string,Array<{label:string,value:string}>>={paid:[{label:'开始制作',value:'generating'}],generating:[{label:'提交人工校对',value:'reviewing'}],shipped:[{label:'确认完成',value:'completed'}]}
const nextActions=(row:StorybookOrder)=>row.automaticArtwork&&row.orderStatus!=='shipped'?[]:row.orderStatus==='reviewing'?(row.productType==='digital'?[{label:'退回制作',value:'generating'},...(row.digitalFileUrl?[{label:'确认交付完成',value:'completed'}]:[])]:[{label:'退回制作',value:'generating'},{label:'校对通过，进入印刷',value:'printing'}]):transitionMap[row.orderStatus]||[]
const statusLabel=(value:string)=>statusOptions.find(i=>i.value===value)?.label||({pending_payment:'待支付'} as Record<string,string>)[value]||value
const tagType=(value:string)=>value==='completed'?'success':value==='shipped'?'primary':value==='cancelled'?'info':value==='paid'?'warning':''
const load=async()=>{loading.value=true;try{const res=await getStorybookOrders({page:page.value,pageSize:pageSize.value,status:status.value||undefined});orders.value=res.data.list;total.value=res.data.total}finally{loading.value=false}}
const search=()=>{page.value=1;load()}
const changeStatus=async(row:StorybookOrder,value:string)=>{await updateStorybookOrderStatus(row.id,value);ElMessage.success('状态已更新');load()}
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
const artworkOrder = ref<StorybookOrder | null>(null)
const artwork = ref<StorybookArtwork | null>(null)
let artworkTimer: ReturnType<typeof setTimeout> | undefined

const closeArtwork = () => {
  clearTimeout(artworkTimer)
  artworkOrder.value = null
  artwork.value = null
}

const refreshArtwork = async () => {
  clearTimeout(artworkTimer)
  const id = artworkOrder.value?.id
  if (!id) return
  try {
    const response = await getStorybookArtwork(id)
    if (!artworkVisible.value || artworkOrder.value?.id !== id) return
    artwork.value = response.data
    if (artwork.value.status === 'full_running') artworkTimer = setTimeout(refreshArtwork, 5000)
  } catch {
    // The request layer displays the error. Refresh is available in the dialog.
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

onBeforeUnmount(closeArtwork)
onMounted(load)
</script>

<style scoped>
.filter-card{margin-bottom:20px}.pagination{margin-top:20px;justify-content:flex-end}.book{display:flex;align-items:center;gap:12px}.book .el-image,.book-photo-placeholder{width:52px;height:66px;flex-shrink:0;border-radius:6px;background:#f4f4f5}.book-photo-placeholder{display:grid;place-items:center;color:#606266;font-size:12px}.book-details{display:flex;min-width:0;flex-direction:column;gap:4px}.book span,.book small,td small{color:#909399;font-size:12px}.book b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.artwork-actions{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.artwork-pages{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-top:16px}
.artwork-pages article{border:1px solid var(--el-border-color);border-radius:8px;padding:12px}
.artwork-pages .el-image{display:block;width:100%;height:180px;margin-bottom:8px}
.artwork-frame{position:relative;width:100%}
.artwork-frame .el-image{display:block;width:100%}
.artwork-frame .artwork-caption{position:absolute;margin:0;pointer-events:none;padding:5px 7px;box-sizing:border-box;color:#fff8e9;background:rgba(9,19,34,.72);border-radius:5px;font-size:12px;line-height:1.5}
</style>
