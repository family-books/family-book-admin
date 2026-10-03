<template>
  <div class="families-view">
    <!-- Search Bar -->
    <el-card class="search-card">
      <el-form inline>
        <el-form-item label="关键字">
          <el-input
            v-model="keyword"
            placeholder="搜索家庭名/邀请码"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Families Table -->
    <el-card>
      <el-table :data="families" stripe v-loading="loading">
        <el-table-column prop="name" label="家庭名" width="150" />
        <el-table-column prop="inviteCode" label="邀请码" width="120" />
        <el-table-column prop="creatorNickname" label="创建者" width="120" />
        <el-table-column prop="memberCount" label="成员数" width="80" />
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="showDetail(row)">查看详情</el-button>
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
        @current-change="fetchFamilies"
        @size-change="fetchFamilies"
      />
    </el-card>

    <el-dialog v-model="detailVisible" title="家庭详情" width="480px"><el-descriptions v-if="currentFamily" :column="1" border><el-descriptions-item label="家庭名">{{ currentFamily.name }}</el-descriptions-item><el-descriptions-item label="创建者">{{ currentFamily.creatorNickname }}</el-descriptions-item><el-descriptions-item label="成员数">{{ currentFamily.memberCount }}</el-descriptions-item><el-descriptions-item label="邀请码">{{ currentFamily.inviteCode }}</el-descriptions-item><el-descriptions-item label="创建时间">{{ currentFamily.createdAt }}</el-descriptions-item></el-descriptions></el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFamilyList } from '@/api/families'
import type { Family } from '@/types'

const loading = ref(false)
const families = ref<Family[]>([])
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const detailVisible = ref(false)
const currentFamily = ref<Family | null>(null)

async function fetchFamilies() {
  loading.value = true
  try {
    const res = await getFamilyList({ page: page.value, pageSize: pageSize.value, keyword: keyword.value })
    families.value = res.data.list
    total.value = res.data.total
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchFamilies()
}

function showDetail(family: Family) { currentFamily.value = family; detailVisible.value = true }

onMounted(() => {
  fetchFamilies()
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
