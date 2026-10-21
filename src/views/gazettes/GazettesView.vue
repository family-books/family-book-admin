<template>
  <div class="gazettes-view">
    <el-alert
      v-if="shippingCapability && !shippingCapability.tradeManaged"
      :title="shippingCapability.message || '微信订单发货管理当前不可用'"
      description="本地发货不受影响。若微信尚未开放入口，请保持服务端上报关闭；仅在微信侧确认开通并完成授权后再开启。"
      type="warning"
      :closable="false"
      show-icon
      class="capability-alert"
    />
    <el-alert
      v-else-if="shippingCapability?.tradeManaged"
      :title="shippingCapability.enabled ? '微信订单发货上报已启用' : '微信侧已开通，服务端上报开关仍关闭'"
      :description="shippingCapability.enabled ? '发货时将自动上报；历史记录可按需补报。' : '请按上线 SOP 设置 WECHAT_ORDER_SHIPPING_ENABLED=true 并重启服务，随后补报历史记录。'"
      :type="shippingCapability.enabled ? 'success' : 'warning'"
      :closable="false"
      show-icon
      class="capability-alert"
    />
    <!-- Search Bar -->
    <el-card class="search-card">
      <el-form inline>
        <el-form-item label="家书状态">
          <el-select
            v-model="statusFilter"
            class="status-filter"
            placeholder="全部状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="待制作" value="pending" />
            <el-option label="制作中" value="printing" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已送达" value="delivered" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Gazettes Table -->
    <el-card>
      <el-table :data="gazettes" stripe v-loading="loading">
        <el-table-column type="expand" width="46">
          <template #default="{ row }">
            <div class="print-tasks">
              <div class="print-tasks-title">本期 {{ row.deliveryCount || 0 }} 个邮寄任务</div>
              <el-table :data="row.prints || []" border size="small">
                <el-table-column label="寄送至" min-width="130"><template #default="{ row: task }">{{ task.recipientLabel || task.recipientName || '默认地址' }}</template></el-table-column>
                <el-table-column label="状态" width="90"><template #default="{ row: task }"><el-tag :type="getPrintStatusType(task.printStatus)" size="small">{{ getPrintStatusLabel(task.printStatus) }}</el-tag></template></el-table-column>
                <el-table-column label="物流" min-width="180"><template #default="{ row: task }"><template v-if="task.trackingNo"><div>{{ getExpressCompanyLabel(task.expressCompany) }}</div><div class="tracking-no">{{ task.trackingNo }}</div></template><span v-else>—</span></template></el-table-column>
                <el-table-column label="微信上报" min-width="150"><template #default="{ row: task }"><el-tag :type="getWechatTaskStatusType(task)" size="small">{{ getWechatTaskStatusLabel(task) }}</el-tag><el-tooltip v-if="task.wechatShippingError" :content="task.wechatShippingError"><span class="sync-error"> 查看原因</span></el-tooltip></template></el-table-column>
                <el-table-column label="操作" min-width="500">
                  <template #default="{ row: task }"><div class="row-actions">
                    <el-button size="small" @click="openPrintAddressDialog(task)">查看地址</el-button>
                    <el-button size="small" :loading="downloading[`${task.id}:pdf`]" @click="downloadPrintFile(row, task, 'pdf')">下载PDF</el-button>
                    <el-button size="small" :loading="downloading[`${task.id}:zip`]" @click="downloadPrintFile(row, task, 'zip')">下载图片包</el-button>
                    <el-button v-if="canRetryPrintWechatShipping(task)" size="small" type="warning" plain @click="retryPrintWechat(task)">重试微信上报</el-button>
                    <el-dropdown v-if="getValidTransitions(task.printStatus).length" @command="(cmd: string) => handlePrintStatusCommand(task, cmd)" trigger="click"><el-button size="small">更新状态</el-button><template #dropdown><el-dropdown-menu><el-dropdown-item v-for="status in getValidTransitions(task.printStatus)" :key="status" :command="status">{{ getPrintStatusLabel(status) }}</el-dropdown-item></el-dropdown-menu></template></el-dropdown>
                  </div></template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="familyName" label="家庭名" width="130" />
        <el-table-column prop="issueNo" label="期号" width="70" />
        <el-table-column prop="postCount" label="内容数" width="70" />
        <el-table-column label="寄送进度" width="110"><template #default="{ row }">{{ row.shippedCount || 0 }}/{{ row.deliveryCount || 0 }}</template></el-table-column>
        <el-table-column prop="status" label="PDF状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="printStatus" label="家书状态" width="100">
          <template #default="{ row }"><el-tag v-if="row.printStatus" :type="getPrintStatusType(row.printStatus)" size="small">{{ getPrintStatusLabel(row.printStatus) }}</el-tag><span v-else>—</span></template>
        </el-table-column>
        <el-table-column prop="generatedAt" label="生成时间" width="170" />
        <el-table-column label="操作" width="170">
          <template #default="{ row }">
            <div class="row-actions">
            <el-button size="small" type="primary" plain @click="regenerate(row)">重新生成全部PDF</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 20, 50]"
        @current-change="fetchGazettes"
        @size-change="fetchGazettes"
      />
    </el-card>

    <el-dialog v-model="addressVisible" title="家书收件地址" width="520px" destroy-on-close>
      <div v-loading="addressLoading" class="address-detail">
        <template v-if="addressDetail">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="收件人">{{ addressDetail.recipientName || '—' }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ addressDetail.phone || '—' }}</el-descriptions-item>
            <el-descriptions-item label="省 / 市 / 区">{{ [addressDetail.province, addressDetail.city, addressDetail.district].filter(Boolean).join(' / ') || '—' }}</el-descriptions-item>
            <el-descriptions-item label="详细地址">{{ addressDetail.address || '—' }}</el-descriptions-item>
          </el-descriptions>
          <div class="address-actions">
            <el-button type="primary" @click="copyText([addressDetail.recipientName, addressDetail.phone, fullAddress].filter(Boolean).join('  '))">复制全部收件信息</el-button>
            <el-button @click="copyText(addressDetail.recipientName)">复制收件人</el-button>
            <el-button @click="copyText(addressDetail.phone)">复制电话</el-button>
            <el-button @click="copyText(fullAddress)">复制完整地址</el-button>
          </div>
        </template>
      </div>
      <template #footer><el-button @click="addressVisible = false">关闭</el-button></template>
    </el-dialog>

    <el-dialog v-model="shippingVisible" title="确认家书发货" width="460px">
      <el-alert
        title="请在包裹实际交给快递后再确认发货"
        type="warning"
        :closable="false"
        show-icon
        class="shipping-alert"
      />
      <el-form label-width="88px">
        <el-form-item label="快递公司" required>
          <el-select v-model="shippingForm.expressCompany" placeholder="请选择快递公司" filterable>
            <el-option
              v-for="company in EXPRESS_COMPANIES"
              :key="company.value"
              :label="company.label"
              :value="company.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" required>
          <el-input v-model="shippingForm.trackingNo" placeholder="请输入物流单号" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shippingVisible = false">取消</el-button>
        <el-button type="primary" :loading="shippingSubmitting" @click="submitShipping">确认发货</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getGazetteList,
  regenerateGazette,
  getWechatShippingCapability,
  getPrintAddress,
  downloadPrintPdf,
  downloadPrintImages,
  shipPrint,
  updatePrintTaskStatus,
  retryPrintWechatShipping,
} from '@/api/gazettes'
import type { GazetteAddress, WechatShippingCapability } from '@/api/gazettes'
import type { Gazette, GazettePrintTask } from '@/types'

const loading = ref(false)
const gazettes = ref<Gazette[]>([])
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const shippingVisible = ref(false)
const shippingSubmitting = ref(false)
const shippingPrint = ref<GazettePrintTask | null>(null)
const shippingForm = ref({ expressCompany: '', trackingNo: '' })
const shippingCapability = ref<WechatShippingCapability | null>(null)
const addressVisible = ref(false)
const addressLoading = ref(false)
const addressDetail = ref<GazetteAddress | null>(null)
const downloading = ref<Record<string, boolean>>({})
const fullAddress = computed(() => addressDetail.value
  ? [addressDetail.value.province, addressDetail.value.city, addressDetail.value.district, addressDetail.value.address].filter(Boolean).join('')
  : '')

const EXPRESS_COMPANIES = [
  { label: '顺丰速运', value: 'SF' },
  { label: '京东物流', value: 'JD' },
  { label: '中国邮政 / EMS', value: 'EMS' },
  { label: '中通快递', value: 'ZTO' },
  { label: '圆通速递', value: 'YTO' },
  { label: '申通快递', value: 'STO' },
  { label: '韵达快递', value: 'YD' },
  { label: '极兔速递', value: 'JTSD' },
]

const VALID_TRANSITIONS: Record<string, string[]> = {
  'pending': ['printing'],
  'printing': ['shipped'],
  'shipped': ['delivered'],
}

const statusMap: Record<string, string> = {
  draft: '草稿', generated: '已生成', printed: '已印刷', mailed: '已寄出',
}

const statusTypeMap: Record<string, string> = {
  draft: 'info', generated: 'success', printed: 'warning', mailed: 'success',
}

const printStatusMap: Record<string, string> = { pending: '待制作', printing: '制作中', shipped: '已发货', delivered: '已送达' }
const printStatusTypeMap: Record<string, string> = { pending: 'warning', printing: '', shipped: 'success', delivered: 'success' }
const wechatShippingStatusMap: Record<string, string> = {
  pending: '待上报',
  success: '已上报微信',
  failed: '上报失败',
  not_applicable: '无需上报',
  manual_review: '需人工处理',
}
const wechatShippingStatusTypeMap: Record<string, string> = {
  pending: 'info',
  success: 'success',
  failed: 'danger',
  not_applicable: 'info',
  manual_review: 'warning',
}

function getStatusLabel(status: string) {
  return statusMap[status] || status
}

function getStatusType(status: string) {
  return statusTypeMap[status] || 'info'
}

function getPrintStatusLabel(status: string) { return printStatusMap[status] || status }
function getPrintStatusType(status: string) { return printStatusTypeMap[status] || 'info' }
function getWechatTaskStatusLabel(task: GazettePrintTask) {
  if (!['shipped', 'delivered'].includes(task.printStatus)) return '待发货'
  return task.wechatShippingStatus ? (wechatShippingStatusMap[task.wechatShippingStatus] || task.wechatShippingStatus) : '待上报'
}
function getWechatTaskStatusType(task: GazettePrintTask) {
  if (!['shipped', 'delivered'].includes(task.printStatus)) return 'info'
  return task.wechatShippingStatus ? (wechatShippingStatusTypeMap[task.wechatShippingStatus] || 'info') : 'info'
}

function getValidTransitions(status: string): string[] {
  return VALID_TRANSITIONS[status] || []
}

function handlePrintStatusCommand(task: GazettePrintTask, status: string) {
  if (status === 'shipped') {
    openPrintShippingDialog(task)
    return
  }
  updateTaskStatus(task, status)
}

async function openPrintAddressDialog(task: GazettePrintTask) {
  addressDetail.value = null
  addressVisible.value = true
  addressLoading.value = true
  try {
    const response = await getPrintAddress(task.id)
    addressDetail.value = response.data
  } catch {
    addressVisible.value = false
  } finally {
    addressLoading.value = false
  }
}

async function copyText(value?: string) {
  const text = (value || '').trim()
  if (!text) return ElMessage.warning('暂无内容可复制')
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制')
  } catch {
    ElMessage.error('复制失败，请手动选中文字复制')
  }
}

async function downloadPrintFile(gazette: Gazette, task: GazettePrintTask, format: 'pdf' | 'zip') {
  const key = `${task.id}:${format}`
  if (downloading.value[key]) return
  downloading.value[key] = true
  try {
    const response = format === 'pdf' ? await downloadPrintPdf(task.id) : await downloadPrintImages(task.id)
    if (!response.data.size) throw new Error('下载文件为空')
    const url = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url
    const label = task.recipientLabel || task.recipientName || task.id
    link.download = `${gazette.familyName}-第${gazette.issueNo}期-${label}${format === 'pdf' ? '.pdf' : '-图片包.zip'}`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 60000)
  } finally {
    downloading.value[key] = false
  }
}

function getExpressCompanyLabel(value?: string) {
  return EXPRESS_COMPANIES.find((company) => company.value === value)?.label || value || '快递'
}

async function fetchGazettes() {
  loading.value = true
  try {
    const res = await getGazetteList({
      page: page.value,
      pageSize: pageSize.value,
      status: statusFilter.value || undefined,
    })
    gazettes.value = res.data.list
    total.value = res.data.total
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchGazettes()
}

async function regenerate(gazette: Gazette) { try { await regenerateGazette(gazette.id); ElMessage.success('已提交重新生成任务') } catch {} }

function openPrintShippingDialog(task: GazettePrintTask) {
  shippingPrint.value = task
  shippingForm.value = { expressCompany: task.expressCompany || '', trackingNo: task.trackingNo || '' }
  shippingVisible.value = true
}

async function submitShipping() {
  if (!shippingPrint.value) return
  const expressCompany = shippingForm.value.expressCompany.trim()
  const trackingNo = shippingForm.value.trackingNo.trim()
  if (!expressCompany) {
    ElMessage.warning('请选择快递公司')
    return
  }
  if (!trackingNo) {
    ElMessage.warning('请输入物流单号')
    return
  }
  shippingSubmitting.value = true
  try {
    await shipPrint(shippingPrint.value.id, { expressCompany, trackingNo })
    ElMessage.success('家书已发货，微信上报结果请查看列表')
    shippingVisible.value = false
    await fetchGazettes()
  } finally {
    shippingSubmitting.value = false
  }
}

function canRetryPrintWechatShipping(task: GazettePrintTask) {
  return shippingCapability.value?.enabled === true
    && shippingCapability.value?.tradeManaged === true
    && ['shipped', 'delivered'].includes(task.printStatus)
    && task.wechatShippingStatus !== 'success'
}

async function retryPrintWechat(task: GazettePrintTask) {
  try {
    await retryPrintWechatShipping(task.id)
    ElMessage.success('已重新提交微信上报')
  } finally {
    await Promise.all([fetchGazettes(), fetchShippingCapability()])
  }
}

async function fetchShippingCapability() {
  try {
    const res = await getWechatShippingCapability()
    shippingCapability.value = res.data
  } catch {
    // handled by interceptor
  }
}

async function updateTaskStatus(task: GazettePrintTask, status: string) {
  try {
    await ElMessageBox.confirm(`确定将该邮寄任务更新为「${getPrintStatusLabel(status)}」吗？`, '确认状态变更', { type: 'warning' })
    await updatePrintTaskStatus(task.id, status)
    ElMessage.success('状态更新成功')
    await fetchGazettes()
  } catch {
    // cancelled or handled by interceptor
  }
}


onMounted(() => {
  fetchGazettes()
  fetchShippingCapability()
})
</script>

<style scoped>
.search-card {
  margin-bottom: 16px;
}

.status-filter {
  width: 160px;
  min-width: 160px;
}

.address-detail {
  min-height: 130px;
}

.address-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.row-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

.capability-alert {
  margin-bottom: 16px;
}

.print-tasks { padding: 12px 18px 18px; background: #fafafa; }
.print-tasks-title { margin-bottom: 10px; font-weight: 600; color: #555; }

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.shipping-alert {
  margin-bottom: 20px;
}

.tracking-no {
  color: #909399;
  font-size: 12px;
  word-break: break-all;
}

.sync-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sync-error {
  color: #e6a23c;
  cursor: help;
  font-size: 12px;
}
</style>
