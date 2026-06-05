<template>
  <div class="payments-view">
    <!-- Search Bar -->
    <el-card class="search-card">
      <el-form inline>
        <el-form-item label="状态筛选">
          <el-select v-model="statusFilter" placeholder="全部状态" clearable @change="handleSearch">
            <el-option label="已支付" value="paid" />
            <el-option label="已退款" value="refunded" />
            <el-option label="待支付" value="pending" />
            <el-option label="已关闭" value="closed" />
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
        <el-table-column prop="userName" label="用户" width="100" />
        <el-table-column prop="orderNo" label="订单号" width="180" show-overflow-tooltip />
        <el-table-column prop="amount" label="金额" width="80">
          <template #default="{ row }">
            ¥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="planName" label="套餐" width="100" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="getPaymentStatusType(row.status)" size="small">
              {{ getPaymentStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paidAt" label="支付时间" width="170" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
              size="small"
              type="danger"
              :disabled="row.status !== 'paid'"
              @click="handleRefund(row)"
            >
              退款
            </el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPaymentList, refundPayment } from '@/api/payments'
import type { Payment } from '@/types'

const loading = ref(false)
const payments = ref<Payment[]>([])
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const statusMap: Record<string, string> = {
  paid: '已支付',
  refunded: '已退款',
  pending: '待支付',
  closed: '已关闭',
}

const statusTypeMap: Record<string, string> = {
  paid: 'success',
  refunded: 'warning',
  pending: 'info',
  closed: 'danger',
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
    const res = await getPaymentList({ page: page.value, pageSize: pageSize.value, status: statusFilter.value || undefined })
    payments.value = res.data.records
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

async function handleRefund(payment: Payment) {
  await ElMessageBox.confirm(
    `确定要对订单 ${payment.orderNo} 进行退款吗？退款金额：¥${payment.amount}`,
    '确认退款',
    { type: 'warning', confirmButtonText: '确认退款', cancelButtonText: '取消' }
  )
  try {
    await refundPayment(payment.id)
    ElMessage.success('退款成功')
    fetchPayments()
  } catch {
    // handled by interceptor
  }
}

onMounted(() => {
  fetchPayments()
})
</script>

<style scoped>
.search-card {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
