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
          <div v-if="loading" class="chart-container chart-loading">
            <el-skeleton :rows="5" animated />
          </div>
          <div v-else-if="loadError" class="chart-container chart-error">
            <el-empty description="数据加载失败">
              <el-button type="primary" @click="fetchData">重试</el-button>
            </el-empty>
          </div>
          <div v-else ref="chartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header>
            <span>最近订单</span>
          </template>
          <div v-if="loadError" class="chart-error">
            <el-empty description="数据加载失败">
              <el-button type="primary" @click="fetchData">重试</el-button>
            </el-empty>
          </div>
          <el-table v-else :data="recentOrders" size="small" stripe v-loading="loading">
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
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStats, getRevenueTrend, getRecentOrders } from '@/api/dashboard'
import type { DashboardStats, RevenueData, RecentOrder } from '@/types'

const chartRef = ref<HTMLElement>()
const loading = ref(true)
const loadError = ref(false)

let chartInstance: echarts.EChartsType | null = null

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

function handleResize() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const dates = revenueTrend.value.map(item => item.date)
  const amounts = revenueTrend.value.map(item => item.amount)

  chartInstance.setOption({
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

  window.addEventListener('resize', handleResize)
}

async function fetchData() {
  loading.value = true
  loadError.value = false
  try {
    const [statsRes, trendRes, ordersRes] = await Promise.all([
      getDashboardStats(),
      getRevenueTrend(),
      getRecentOrders(),
    ])
    stats.value = statsRes.data
    revenueTrend.value = trendRes.data
    recentOrders.value = ordersRes.data
    await nextTick()
    initChart()
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
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

.chart-loading,
.chart-error {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
