<template>
  <div class="users-view">
    <!-- Search Bar -->
    <el-card class="search-card">
      <el-form inline>
        <el-form-item label="关键字">
          <el-input
            v-model="keyword"
            placeholder="搜索昵称/手机号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Users Table -->
    <el-card>
      <el-table :data="users" stripe v-loading="loading">
        <el-table-column prop="avatarUrl" label="头像" width="70">
          <template #default="{ row }">
            <el-avatar :size="36" :src="row.avatarUrl">
              <el-icon><User /></el-icon>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="sysRole" label="系统角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.sysRole === 'admin' ? 'danger' : 'info'" size="small">
              {{ row.sysRole === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="170" />
        <el-table-column label="操作" min-width="240">
          <template #default="{ row }">
            <el-button size="small" @click="showDetail(row)">查看详情</el-button>
            <el-button size="small" type="warning" @click="disableUser(row)">禁用</el-button>
            <el-dropdown @command="(cmd: string) => changeRole(row, cmd)" trigger="click">
              <el-button size="small">修改角色</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="user">普通用户</el-dropdown-item>
                  <el-dropdown-item command="admin">管理员</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
        @current-change="fetchUsers"
        @size-change="fetchUsers"
      />
    </el-card>

    <!-- Detail Dialog -->
    <el-dialog v-model="detailVisible" title="用户详情" width="600px">
      <div v-if="currentUser">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="昵称">{{ currentUser.nickname }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentUser.phone }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ currentUser.sysRole }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ currentUser.createdAt }}</el-descriptions-item>
        </el-descriptions>

        <el-descriptions style="margin-top: 16px" :column="2" border><el-descriptions-item label="家庭数量">{{ currentUser.familyCount ?? 0 }}</el-descriptions-item><el-descriptions-item label="订阅状态">{{ currentUser.subscriptionStatus || 'inactive' }}</el-descriptions-item></el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, getUserDetail, setUserEnabled, updateUserRole } from '@/api/users'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types'

const userStore = useUserStore()

const loading = ref(false)
const users = ref<User[]>([])
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const detailVisible = ref(false)
const currentUser = ref<User | null>(null)

async function fetchUsers() {
  loading.value = true
  try {
    const res = await getUserList({ page: page.value, pageSize: pageSize.value, keyword: keyword.value })
    users.value = res.data.list
    total.value = res.data.total
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchUsers()
}

async function showDetail(user: User) {
  currentUser.value = user
  detailVisible.value = true
  try {
    currentUser.value = (await getUserDetail(user.id)).data
  } catch {
  }
}

async function disableUser(user: User) {
  ElMessageBox.confirm(`确定禁用用户「${user.nickname}」吗？`, '确认禁用', { type: 'warning' })
    .then(async () => {
      try {
        await setUserEnabled(user.id, false)
        ElMessage.success('用户已禁用')
        fetchUsers()
      } catch {
        // handled by interceptor
      }
    })
    .catch(() => {})
}

async function changeRole(user: User, role: string) {
  // Prevent self-demotion
  if (userStore.userInfo && String(user.id) === String(userStore.userInfo.id) && role !== userStore.userInfo.sysRole) {
    ElMessage.warning('不能修改自己的角色')
    return
  }

  const roleName = role === 'admin' ? '管理员' : '普通用户'
  ElMessageBox.confirm(`确定要将该用户角色修改为「${roleName}」吗？`, '确认角色变更', { type: 'warning' })
    .then(async () => {
      try {
        await updateUserRole(user.id, role)
        ElMessage.success('角色修改成功')
        fetchUsers()
      } catch {
        // handled by interceptor
      }
    })
    .catch(() => {})
}

onMounted(() => {
  fetchUsers()
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
