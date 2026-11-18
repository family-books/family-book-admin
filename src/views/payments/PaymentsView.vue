<template>
  <div class="payments-view">
    <!-- Search Bar -->
    <el-card class="search-card">
      <el-form inline>
        <el-form-item label="状态筛选">
          <el-select v-model="statusFilter" placeholder="全部状态" clearable @change="handleSearch">
            <el-option label="已支付" value="success" />
            <el-option label="失败" value="failed" />
            <el-option label="待支付" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Payments Table -->
    <el-card>
      <el-table :data="payments" stripe v-loading="loading">
        <el-table-column prop="userNickname" label="用户" width="100" />
        <el-table-column prop="orderNo" label="订单号" width="180" show-overflow-tooltip />
        <el-table-column prop="amount" label="金额" width="80">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="planType" label="套餐" width="100" />
        <el-table-column prop="payStatus" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="getPaymentStatusType(row.payStatus)" size="small">
              {{ getPaymentStatusLabel(row.payStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paidAt" label="支付时间" width="170" />
        <el-table-column label="退款状态" width="150">
          <template #default="{ row }">
            <el-tag v-if="row.refundStatus" :type="refundTagType(row.refundStatus)" size="small">
              {{ refundStatusLabel(row.refundStatus) }} · ¥{{ row.refundAmount }}
            </el-tag>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="210">
          <template #default="{ row }">
            <el-button
              v-if="canRefund(row)"
              size="small"
              type="danger"
              @click="handleRefund(row)"
            >
              申请退款
            </el-button>
            <el-button v-if="row.refundStatus && row.refundStatus !== 'success'" size="small" @click="handleRefreshRefund(row)">查询退款结果</el-button>
            <span v-if="!canRefund(row) && !row.refundStatus">{{ row.payStatus === 'success' ? '需人工处理' : '—' }}</span>
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
        @current-change="fetchPayments"
        @size-change="fetchPayments"
      />
    </el-card>

    <el-dialog v-model="refundDialogVisible" title="申请微信支付退款" width="480px">
      <p class="refund-warning">仅支持纯微信支付的家书订阅或专属绘本；每笔订单只能申请一次（含部分退款）。微信受理不代表最终成功，请继续查询退款结果。</p>
      <el-form label-width="90px">
        <el-form-item label="订单号">{{ selectedPayment?.orderNo }}</el-form-item>
        <el-form-item label="微信实付">¥{{ selectedPayment?.wxAmount }}</el-form-item>
        <el-form-item label="退款金额">
          <el-input-number v-model="refundAmount" :min="0.01" :max="Number(selectedPayment?.wxAmount || 0)" :precision="2" :step="0.01" />
        </el-form-item>
        <el-form-item label="退款原因">
          <el-input v-model="refundReason" type="textarea" :rows="3" maxlength="80" show-word-limit placeholder="请填写实际退款原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="refundSubmitting" @click="submitRefund">向微信申请退款</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPaymentList, refundPayment, refreshRefund } from '@/api/payments'
import type { Payment } from '@/types'
import { useUserStore } from '@/stores/user'

const loading = ref(false)
const payments = ref<Payment[]>([])
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const refundDialogVisible = ref(false)
const refundSubmitting = ref(false)
const selectedPayment = ref<Payment | null>(null)
const refundAmount = ref(0)
const refundReason = ref('')
const userStore = useUserStore()

const statusMap: Record<string, string> = {
  success: '已支付',
  failed: '失败',
  pending: '待支付',
}

const statusTypeMap: Record<string, string> = {
  success: 'success',
  failed: 'danger',
  pending: 'info',
}

function getPaymentStatusLabel(status: string) {
  return statusMap[status] || status
}

function getPaymentStatusType(status: string) {
  return statusTypeMap[status] || 'info'
}

async function fetchPayments() {
  loading.value = true
  try {
    const res = await getPaymentList({
      page: page.value,
      pageSize: pageSize.value,
      status: statusFilter.value || undefined,
    })
    payments.value = res.data.list
    total.value = res.data.total
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchPayments()
}

function canRefund(payment: Payment) {
  return userStore.userInfo?.sysRole === 'super_admin'
    && payment.payStatus === 'success'
    && ['subscription', 'storybook'].includes(payment.orderType || '')
    && payment.payChannel === 'wxpay'
    && Number(payment.wxAmount) > 0
    && Number(payment.walletAmount || 0) === 0
    && !payment.refundStatus
}

function refundStatusLabel(status: string) {
  return ({ unknown: '结果待核实', processing: '处理中', success: '退款成功', closed: '已关闭', abnormal: '退款异常' } as Record<string, string>)[status] || status
}

function refundTagType(status: string) {
  return ({ success: 'success', closed: 'info', abnormal: 'danger', processing: 'warning', unknown: 'warning' } as Record<string, string>)[status] || 'info'
}

function handleRefund(payment: Payment) {
  selectedPayment.value = payment
  refundAmount.value = Number(payment.wxAmount || 0)
  refundReason.value = ''
  refundDialogVisible.value = true
}

async function submitRefund() {
  const payment = selectedPayment.value
  if (!payment || !canRefund(payment)) return
  if (!refundReason.value.trim()) {
    ElMessage.warning('请填写退款原因')
    return
  }
  if (refundAmount.value <= 0 || refundAmount.value > Number(payment.wxAmount)) {
    ElMessage.warning('退款金额须大于0且不超过微信实付金额')
    return
  }
  try {
    await ElMessageBox.confirm(
      `将向微信申请退还 ¥${refundAmount.value.toFixed(2)}，订单 ${payment.orderNo}。微信受理后仍需查询最终结果。确认继续？`,
      '最终确认',
      { type: 'warning', confirmButtonText: '确认向微信申请', cancelButtonText: '取消' },
    )
  } catch { return }
  refundSubmitting.value = true
  try {
    const result = await refundPayment(payment.id, { amount: refundAmount.value, reason: refundReason.value.trim() })
    ElMessage.info(`退款申请状态：${refundStatusLabel(result.data.status)}；请查询最终结果`)
    refundDialogVisible.value = false
  } finally {
    refundSubmitting.value = false
    await fetchPayments()
  }
}

async function handleRefreshRefund(payment: Payment) {
  try {
    const result = await refreshRefund(payment.id)
    ElMessage.info(`微信退款状态：${refundStatusLabel(result.data.status)}${result.data.lastError ? `；${result.data.lastError}` : ''}`)
  } finally {
    await fetchPayments()
  }
}

onMounted(() => {
  fetchPayments()
})
</script>

<style scoped>
.refund-warning { color: #b45309; line-height: 1.6; margin: 0 0 18px; }
.search-card {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
