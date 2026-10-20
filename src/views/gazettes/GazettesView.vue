<template>
  <div class="gazettes-view">
    <el-alert
      v-if="shippingCapability && !shippingCapability.tradeManaged"
      :title="shippingCapability.message || '微信订单发货管理尚未开通'"
      description="本地发货状态可正常保存；开通微信权限后，可在列表中重试上报。"
      type="warning"
      :closable="false"
      show-icon
      class="capability-alert"
    />
    <el-alert
      v-else-if="shippingCapability?.tradeManaged"
      title="微信订单发货管理已接通"
      type="success"
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
        <el-table-column prop="familyName" label="家庭名" width="130" />
        <el-table-column prop="issueNo" label="期号" width="70" />
        <el-table-column prop="postCount" label="内容数" width="70" />
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
        <el-table-column label="物流信息" min-width="190">
          <template #default="{ row }">
            <template v-if="row.trackingNo">
              <div>{{ getExpressCompanyLabel(row.expressCompany) }}</div>
              <div class="tracking-no">{{ row.trackingNo }}</div>
            </template>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="微信上报" min-width="190">
          <template #default="{ row }">
            <div class="sync-status">
              <el-tag :type="getWechatShippingStatusType(row)" size="small">
                {{ getWechatShippingStatusLabel(row) }}
              </el-tag>
              <el-tooltip
                v-if="row.wechatShippingError"
                :content="row.wechatShippingError"
                placement="top"
                :show-after="200"
              >
                <span class="sync-error">查看原因</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="generatedAt" label="生成时间" width="170" />
        <el-table-column label="操作" min-width="330">
          <template #default="{ row }">
            <div class="row-actions">
            <el-button size="small" @click="openAddressDialog(row)">查看邮寄地址</el-button>
            <el-button size="small" :loading="downloading[`${row.id}:pdf`]" @click="downloadFile(row, 'pdf')">下载PDF</el-button>
            <el-button size="small" :loading="downloading[`${row.id}:zip`]" @click="downloadFile(row, 'zip')">下载图片包</el-button>
            <el-button size="small" @click="regenerate(row)">重新生成</el-button>
            <el-button
              v-if="canRetryWechatShipping(row)"
              size="small"
              type="warning"
              plain
              @click="retryWechat(row)"
            >重试微信上报</el-button>
            <el-dropdown
              v-if="getValidTransitions(row.printStatus).length > 0"
              @command="(cmd: string) => handleStatusCommand(row, cmd)"
              trigger="click"
            >
              <el-button size="small">更新状态</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="status in getValidTransitions(row.printStatus)"
                    :key="status"
                    :command="status"
                  >
                    {{ getPrintStatusLabel(status) }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
  shipGazette,
  updatePrintStatus,
  retryWechatShipping,
  getWechatShippingCapability,
  getGazetteAddress,
  downloadGazettePdf,
  downloadGazettePrintImages,
} from '@/api/gazettes'
import type { GazetteAddress, WechatShippingCapability } from '@/api/gazettes'
import type { Gazette } from '@/types'

const loading = ref(false)
const gazettes = ref<Gazette[]>([])
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const shippingVisible = ref(false)
const shippingSubmitting = ref(false)
const shippingGazette = ref<Gazette | null>(null)
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
function getWechatShippingStatusLabel(gazette: Gazette) {
  if (!['shipped', 'delivered'].includes(gazette.printStatus)) return '待发货'
  const status = gazette.wechatShippingStatus
  return status ? (wechatShippingStatusMap[status] || status) : '待上报'
}
function getWechatShippingStatusType(gazette: Gazette) {
  if (!['shipped', 'delivered'].includes(gazette.printStatus)) return 'info'
  const status = gazette.wechatShippingStatus
  return status ? (wechatShippingStatusTypeMap[status] || 'info') : 'info'
}

function getValidTransitions(status: string): string[] {
  return VALID_TRANSITIONS[status] || []
}

function handleStatusCommand(gazette: Gazette, status: string) {
  if (status === 'shipped') {
    openShippingDialog(gazette)
    return
  }
  updateStatus(gazette, status)
}

async function openAddressDialog(gazette: Gazette) {
  addressDetail.value = null
  addressVisible.value = true
  addressLoading.value = true
  try {
    const response = await getGazetteAddress(gazette.id)
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

async function downloadFile(gazette: Gazette, format: 'pdf' | 'zip') {
  const key = `${gazette.id}:${format}`
  if (downloading.value[key]) return
  downloading.value[key] = true
  try {
    const response = format === 'pdf'
      ? await downloadGazettePdf(gazette.id)
      : await downloadGazettePrintImages(gazette.id)
    if (!response.data.size) throw new Error('下载文件为空')
    const url = URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url
    link.download = `家书-${gazette.id}${format === 'pdf' ? '.pdf' : '-逐页图片.zip'}`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 60000)
  } catch (error) {
    if (error instanceof Error && error.message === '下载文件为空') ElMessage.error(error.message)
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

function openShippingDialog(gazette: Gazette) {
  shippingGazette.value = gazette
  shippingForm.value = {
    expressCompany: gazette.expressCompany || '',
    trackingNo: gazette.trackingNo || '',
  }
  shippingVisible.value = true
}

async function submitShipping() {
  if (!shippingGazette.value) return
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
    await shipGazette(shippingGazette.value.id, { expressCompany, trackingNo })
    ElMessage.success('家书已发货，微信上报结果请查看列表')
    shippingVisible.value = false
    await fetchGazettes()
  } finally {
    shippingSubmitting.value = false
  }
}

function canRetryWechatShipping(gazette: Gazette) {
  return ['shipped', 'delivered'].includes(gazette.printStatus)
    && gazette.wechatShippingStatus !== 'success'
    && gazette.wechatShippingStatus !== 'not_applicable'
}

async function retryWechat(gazette: Gazette) {
  try {
    await retryWechatShipping(gazette.id)
    ElMessage.success('已重新提交微信上报')
    await Promise.all([fetchGazettes(), fetchShippingCapability()])
  } catch {
    await fetchGazettes()
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

async function updateStatus(gazette: Gazette, status: string) {
  ElMessageBox.confirm(
    `确定要将家书状态更新为「${getPrintStatusLabel(status)}」吗？`,
    '确认状态变更',
    { type: 'warning' }
  )
    .then(async () => {
      try {
        await updatePrintStatus(gazette.id, status)
        ElMessage.success('状态更新成功')
        fetchGazettes()
      } catch {
        // handled by interceptor
      }
    })
    .catch(() => {})
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
