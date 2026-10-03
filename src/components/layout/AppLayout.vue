<template>
  <el-container class="layout-container">
    <Sidebar />
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="page-kicker">FAMILY BOOK / ADMIN</span>
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <a class="site-link" href="/" target="_blank">查看官网 ↗</a>
          <span class="divider"></span>
          <span class="avatar">{{ (userStore.userInfo?.nickname || '管').slice(0, 1) }}</span>
          <span class="user-name">{{ userStore.userInfo?.nickname || '管理员' }}</span>
          <el-button class="logout" text @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import Sidebar from './Sidebar.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const pageTitle = computed(() => (route.meta.title as string) || '数据看板')

onMounted(async () => {
  if (!userStore.userInfo) {
    await userStore.fetchUserInfo()
  }
})

function handleLogout() {
  ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' })
    .then(() => {
      userStore.logout()
      router.push('/admin/login')
    })
    .catch(() => {})
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  font-family: Inter, "SF Pro Display", "Helvetica Neue", "PingFang SC", sans-serif;
}

.header {
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 34px;
  border-bottom: 1px solid #e7e5e1;
  background: rgba(250, 249, 246, .92);
  backdrop-filter: blur(18px);
}

.header-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.page-title {
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -.035em;
  color: #181719;
}

.page-kicker {
  font-size: 9px;
  letter-spacing: .16em;
  color: #99958f;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 13px;
  color: #3d3a3a;
  font-weight: 550;
}

.avatar {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #19181a;
  color: #fff;
  font-size: 12px;
}

.site-link {
  color: #6e6965;
  text-decoration: none;
  font-size: 12px;
}

.site-link:hover { color: #ec6948; }
.divider { width: 1px; height: 20px; background: #dedbd5; margin: 0 5px; }
.logout { color: #9b9691; }

.main-content {
  background: #f4f2ee;
  padding: 32px 34px;
  overflow-y: auto;
}

.main-content :deep(.el-card),
.main-content :deep(.el-table) { border-color: #e4e0d9; border-radius: 10px; }
.main-content :deep(.el-card) { box-shadow: 0 10px 35px rgba(43, 37, 30, .035); }
.main-content :deep(.el-table th.el-table__cell) { background: #f7f5f1; color: #76716d; font-size: 11px; letter-spacing: .03em; }
.main-content :deep(.el-table td.el-table__cell) { color: #3c3937; }
.main-content :deep(.el-button--primary) { --el-button-bg-color: #1b1a1c; --el-button-border-color: #1b1a1c; --el-button-hover-bg-color: #ec6948; --el-button-hover-border-color: #ec6948; border-radius: 7px; }
.main-content :deep(.el-input__wrapper),
.main-content :deep(.el-select__wrapper) { border-radius: 7px; box-shadow: 0 0 0 1px #ddd9d2 inset; }
.main-content :deep(.el-pagination.is-background .el-pager li.is-active) { background: #1b1a1c; }

@media (max-width: 720px) {
  .header { padding: 0 18px; }
  .site-link, .divider, .user-name { display: none; }
  .main-content { padding: 22px 16px; }
}
</style>

<style scoped>
/* Restore the original admin blue-gray color system without losing the new layout. */
.header{background:rgba(255,255,255,.94);border-bottom-color:#e6e9ef}.page-kicker{color:#409eff}.page-title{color:#303133}.site-link{color:#606266}.site-link:hover{color:#409eff}.divider{background:#dcdfe6}.avatar{background:#409eff}.user-name{color:#606266}.logout{color:#909399}.main-content{background:#f5f7fa}.main-content :deep(.el-card),.main-content :deep(.el-table){border-color:#e4e7ed}.main-content :deep(.el-card){box-shadow:0 8px 28px rgba(48,65,86,.045)}.main-content :deep(.el-table th.el-table__cell){background:#f7f9fc;color:#606266}.main-content :deep(.el-table td.el-table__cell){color:#303133}.main-content :deep(.el-button--primary){--el-button-bg-color:#409eff;--el-button-border-color:#409eff;--el-button-hover-bg-color:#66b1ff;--el-button-hover-border-color:#66b1ff}.main-content :deep(.el-input__wrapper),.main-content :deep(.el-select__wrapper){box-shadow:0 0 0 1px #dcdfe6 inset}.main-content :deep(.el-pagination.is-background .el-pager li.is-active){background:#409eff}
</style>
