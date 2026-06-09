<template>
  <div class="referrals-view">
    <!-- Stats Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ stats.totalReferrals }}</div>
          <div class="stat-label">总推荐数</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ stats.totalPoints }}</div>
          <div class="stat-label">总积分发放</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Search -->
    <el-card class="search-card">
      <el-form inline>
        <el-form-item label="搜索">
          <el-input
            v-model="keyword"
            placeholder="搜索推荐人/被推荐人"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Referrals Table -->
    <el-card>
      <el-table :data="filteredReferrals" stripe v-loading="loading">
        <el-table-column prop="referrerName" label="推荐人" width="120" />
        <el-table-column prop="refereeName" label="被推荐人" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'info'" size="small">
              {{ row.status === 'completed' ? '已完成' : '待完成' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="80" />
        <el-table-column prop="createdAt" label="时间" width="170" />
      </el-table>

      <el-pagination
        class="pagination"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 20, 50]"
        @current-change="fetchReferrals"
        @size-change="fetchReferrals"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getReferralList, getReferralStats } from '@/api/referrals'
import type { Referral } from '@/types'

const loading = ref(false)
const referrals = ref<Referral[]>([])
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const stats = ref({ totalReferrals: 0, totalPoints: 0 })

const filteredReferrals = computed(() => {
  if (!keyword.value.trim()) return referrals.value
  const k = keyword.value.trim().toLowerCase()
  return referrals.value.filter(
    r => r.referrerName?.toLowerCase().includes(k) || r.refereeName?.toLowerCase().includes(k)
  )
})

function handleSearch() {
  page.value = 1
  fetchReferrals()
}

async function fetchReferrals() {
  loading.value = true
  try {
    const res = await getReferralList({ page: page.value, pageSize: pageSize.value })
    referrals.value = res.data.records
    total.value = res.data.total
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    const res = await getReferralStats()
    stats.value = res.data
  } catch {
    // handled by interceptor
  }
}

onMounted(() => {
  fetchReferrals()
  fetchStats()
})
</script>

<style scoped>
.search-card {
  margin-bottom: 16px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: #909399;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
