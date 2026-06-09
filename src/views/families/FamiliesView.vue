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
        <el-table-column prop="creatorName" label="创建者" width="120" />
        <el-table-column prop="memberCount" label="成员数" width="80" />
        <el-table-column prop="createdAt" label="创建时间" width="170" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="showMembers(row)">查看成员</el-button>
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

    <!-- Members Dialog -->
    <el-dialog v-model="membersVisible" title="家庭成员" width="500px">
      <el-table :data="members" size="small" stripe v-loading="membersLoading">
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="row.role === 'owner' ? 'warning' : 'info'" size="small">
              {{ row.role === 'owner' ? '创建者' : '成员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinedAt" label="加入时间" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFamilyList, getFamilyMembers } from '@/api/families'
import type { Family, FamilyMember } from '@/types'

const loading = ref(false)
const families = ref<Family[]>([])
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const membersVisible = ref(false)
const members = ref<FamilyMember[]>([])

async function fetchFamilies() {
  loading.value = true
  try {
    const res = await getFamilyList({ page: page.value, pageSize: pageSize.value, keyword: keyword.value })
    families.value = res.data.records
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

const membersLoading = ref(false)

async function showMembers(family: Family) {
  membersVisible.value = true
  membersLoading.value = true
  members.value = []
  try {
    const res = await getFamilyMembers(family.id)
    members.value = res.data
  } catch {
    members.value = []
  } finally {
    membersLoading.value = false
  }
}

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
