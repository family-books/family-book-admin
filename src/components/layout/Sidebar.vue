<template>
  <el-aside width="220px" class="sidebar">
    <div class="logo">
      <span class="logo-mark"><i></i><i></i><i></i></span>
      <div><h2>家书</h2><small>FAMILY BOOK</small></div>
    </div>
    <p class="menu-label">工作台</p>
    <el-menu
      :default-active="activeMenu"
      router
    >
      <el-menu-item index="/admin">
        <el-icon><DataAnalysis /></el-icon>
        <span>数据看板</span>
      </el-menu-item>
      <el-menu-item index="/admin/users">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/families">
        <el-icon><House /></el-icon>
        <span>家庭管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/enterprises">
        <el-icon><OfficeBuilding /></el-icon>
        <span>企业内购</span>
      </el-menu-item>
      <el-menu-item index="/admin/gazettes">
        <el-icon><Document /></el-icon>
        <span>报纸管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/payments">
        <el-icon><Money /></el-icon>
        <span>支付管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/referrals">
        <el-icon><Share /></el-icon>
        <span>推荐管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { OfficeBuilding } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar {
  background: #111113;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid #29282c;
}

.logo {
  height: 92px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 25px;
  border-bottom: 1px solid #29282c;
}

.logo h2 {
  color: #fff;
  font-size: 19px;
  line-height: 1;
  letter-spacing: -.04em;
  margin: 0;
}
.logo small { display: block; color: #6d6b72; font-size: 7px; letter-spacing: .18em; margin-top: 7px; }
.logo-mark{width:27px;display:grid;gap:3px;transform:skew(-18deg)}.logo-mark i{height:6px;border-radius:2px;background:linear-gradient(90deg,#ff7656,#a55fff)}.logo-mark i:nth-child(2){margin-left:5px;background:linear-gradient(90deg,#a55fff,#68d7be)}.logo-mark i:nth-child(3){background:linear-gradient(90deg,#68d7be,#c2ee72)}
.menu-label { margin: 25px 25px 10px; color: #625f67; font-size: 9px; letter-spacing: .16em; }

.el-menu {
  border-right: none;
  background: transparent;
  padding: 0 12px;
}
:deep(.el-menu-item) {
  height: 48px;
  margin: 5px 0;
  border-radius: 8px;
  color: #96939b;
  font-size: 13px;
}
:deep(.el-menu-item:hover) { background: #1d1c20; color: #fff; }
:deep(.el-menu-item.is-active) { background: #f1eee8; color: #161518; font-weight: 650; }
:deep(.el-menu-item.is-active .el-icon) { color: #ec6948; }
@media(max-width:720px){.sidebar{width:72px!important}.logo{padding:0;justify-content:center}.logo>div,.menu-label,:deep(.el-menu-item span){display:none}.el-menu{padding:0 9px}:deep(.el-menu-item){justify-content:center;padding:0!important}:deep(.el-menu-item .el-icon){margin:0}}
</style>

<style scoped>
.sidebar{background:#304156;border-right-color:#3d4d5e}.logo{border-bottom-color:#3d4d5e}.logo-mark i{background:#409eff}.logo-mark i:nth-child(2){background:#66b1ff}.logo-mark i:nth-child(3){background:#79bbff}.logo small{color:#8293a7}.menu-label{color:#8192a6}:deep(.el-menu-item){color:#bfcbd9}:deep(.el-menu-item:hover){background:#263445;color:#fff}:deep(.el-menu-item.is-active){background:#263445;color:#409eff}:deep(.el-menu-item.is-active .el-icon){color:#409eff}
</style>
