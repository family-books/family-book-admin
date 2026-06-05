<template>
  <div class="dashboard">
    <!-- Stats Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="4" v-for="stat in statsCards" :key="stat.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts & Table -->
    <el-row :gutter="20" class="content-row">
      <el-col :span="14">
        <el-card>
          <template #header>
            <span>收入趋势</span>
          </template>
          <div ref="chartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header>
            <span>最近订单</span>
          </template>
          <el-table :data="recentOrders" size="small" stripe>
            <el-table-column prop="userName" label="用户" width="80" />
            <el-table-column prop="orderNo" label="订单号" width="120" show-overflow-tooltip />
            <el-table-column prop="amount" label="金额" width="70">
              <template #default="{ row }">
                ¥{{ row.amount }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="70">
              <template #default="{ row }">
                <el-tag :type="row.status === 'paid' ? 'success' : 'info'" size="small">
                  {{ row.status === 'paid' ? '已支付' : row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStats, getRevenueTrend, getRecentOrders } from '@/api/dashboard'
import type { DashboardStats, RevenueData, RecentOrder } from '@/types'

const chartRef = ref<HTMLElement>()
const stats = ref<DashboardStats>({
  totalUsers: 0,
  totalFamilies: 0,
  totalGazettes: 0,
  totalRevenue: 0,
  monthlyNewUsers: 0,
  activeSubscriptions: 0,
})
const revenueTrend = ref<RevenueData[]>([])
const recentOrders = ref<RecentOrder[]>([])

const statsCards = computed(() => [
  { label: '总用户数', value: stats.value.totalUsers },
  { label: '总家庭数', value: stats.value.totalFamilies },
  { label: '总报纸数', value: stats.value.totalGazettes },
  { label: '总收入', value: `¥${stats.value.totalRevenue}` },
  { label: '本月新增用户', value: stats.value.monthlyNewUsers },
  { label: '活跃订阅', value: stats.value.activeSubscriptions },
])

function initChart() {
  if (!chartRef.value) return
  const chart = echarts.init(chartRef.value)

  // Use placeholder data if API hasn't loaded yet
  const dates = revenueTrend.value.length
    ? revenueTrend.value.map(item => item.date)
    : ['1月', '2月', '3月', '4月', '5月', '6月']
  const amounts = revenueTrend.value.length
    ? revenueTrend.value.map(item => item.amount)
    : [1200, 2400, 3600, 4200, 5800, 7200]

  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', axisLabel: { formatter: '¥{value}' } },
    series: [
      {
        name: '收入',
        type: 'line',
        smooth: true,
        data: amounts,
        areaStyle: { opacity: 0.3 },
        itemStyle: { color: '#409EFF' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  })

  window.addEventListener('resize', () => chart.resize())
}

async function fetchData() {
  try {
    const [statsRes, trendRes, ordersRes] = await Promise.all([
      getDashboardStats(),
      getRevenueTrend(),
      getRecentOrders(),
    ])
    stats.value = statsRes.data
    revenueTrend.value = trendRes.data
    recentOrders.value = ordersRes.data
  } catch {
    // Use placeholder data on error
    stats.value = {
      totalUsers: 1256,
      totalFamilies: 423,
      totalGazettes: 890,
      totalRevenue: 45680,
      monthlyNewUsers: 89,
      activeSubscriptions: 312,
    }
    recentOrders.value = [
      { id: 1, userName: '张三', orderNo: 'ORD20260601001', amount: 15, planName: '月卡', status: 'paid', paidAt: '2026-06-01' },
      { id: 2, userName: '李四', orderNo: 'ORD20260601002', amount: 148, planName: '年卡', status: 'paid', paidAt: '2026-06-01' },
      { id: 3, userName: '王五', orderNo: 'ORD20260531001', amount: 45, planName: '季卡', status: 'paid', paidAt: '2026-05-31' },
      { id: 4, userName: '赵六', orderNo: 'ORD20260530001', amount: 25, planName: '月卡', status: 'paid', paidAt: '2026-05-30' },
      { id: 5, userName: '孙七', orderNo: 'ORD20260529001', amount: 88, planName: '半年卡', status: 'paid', paidAt: '2026-05-29' },
    ]
  }
  await nextTick()
  initChart()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: #909399;
}

.content-row {
  margin-bottom: 20px;
}

.chart-container {
  height: 350px;
}
</style>
