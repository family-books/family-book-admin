<template>
  <el-aside width="220px" class="sidebar">
    <div class="logo">
      <h2>家书管理后台</h2>
    </div>
    <el-menu
      :default-active="activeMenu"
      router
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <el-menu-item index="/">
        <el-icon><DataAnalysis /></el-icon>
        <span>数据看板</span>
      </el-menu-item>
      <el-menu-item index="/users">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="/families">
        <el-icon><House /></el-icon>
        <span>家庭管理</span>
      </el-menu-item>
      <el-menu-item index="/gazettes">
        <el-icon><Document /></el-icon>
        <span>报纸管理</span>
      </el-menu-item>
      <el-menu-item index="/payments">
        <el-icon><Money /></el-icon>
        <span>支付管理</span>
      </el-menu-item>
      <el-menu-item index="/referrals">
        <el-icon><Share /></el-icon>
        <span>推荐管理</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar {
  background-color: #304156;
  height: 100vh;
  overflow-y: auto;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #3d4d5e;
}

.logo h2 {
  color: #fff;
  font-size: 16px;
  margin: 0;
}

.el-menu {
  border-right: none;
}
</style>
