<template>
  <div class="dashboard" v-loading="loading">
    <div class="intro"><div><span class="eyebrow">OVERVIEW</span><p>家书运营概览</p><small>来自现有业务服务的实时汇总数据</small></div><div class="live"><i></i> 实时数据</div></div>
    <div class="card-grid">
      <article v-for="(item, index) in cards" :key="item.label" class="card" :class="`tone-${index % 4}`">
        <div class="card-top"><span>{{ String(index + 1).padStart(2, '0') }}</span><i>↗</i></div>
        <strong>{{ item.value }}</strong><p>{{ item.label }}</p>
      </article>
    </div>
    <el-alert v-if="loadError" class="alert" type="warning" title="数据暂时无法加载，请检查管理员权限与后端服务。" show-icon :closable="false">
      <template #default><el-button link type="primary" @click="fetchData">重新加载</el-button></template>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getDashboardStats } from '@/api/dashboard'
import type { DashboardStats } from '@/types'
const loading = ref(true)
const loadError = ref(false)
const stats = ref<DashboardStats>({ totalUsers: 0, totalFamilies: 0, totalGazettes: 0, totalRevenue: 0, monthlyNewUsers: 0, monthlyRevenue: 0, activeSubscriptions: 0 })
const cards = computed(() => [
  { label: '总用户数', value: stats.value.totalUsers }, { label: '总家庭数', value: stats.value.totalFamilies }, { label: '已生成家书', value: stats.value.totalGazettes }, { label: '累计收入', value: `¥${stats.value.totalRevenue}` }, { label: '本月新增用户', value: stats.value.monthlyNewUsers }, { label: '本月收入', value: `¥${stats.value.monthlyRevenue}` }, { label: '活跃订阅', value: stats.value.activeSubscriptions },
])
async function fetchData() { loading.value = true; loadError.value = false; try { stats.value = (await getDashboardStats()).data } catch { loadError.value = true } finally { loading.value = false } }
onMounted(fetchData)
</script>

<style scoped>
.dashboard{font-family:Inter,"SF Pro Display","PingFang SC",sans-serif}.intro{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px}.intro p{margin:5px 0 6px;font-size:30px;letter-spacing:-.05em;font-weight:650;color:#181719}.intro small{color:#92908b;font-size:12px}.eyebrow{font-size:9px;letter-spacing:.16em;color:#ec6948}.live{font-size:11px;color:#77736f;padding:9px 12px;background:#fff;border:1px solid #e6e2db;border-radius:999px}.live i{display:inline-block;width:6px;height:6px;background:#86bd57;border-radius:50%;box-shadow:0 0 8px #86bd57;margin-right:7px}.card-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.card{position:relative;min-height:190px;padding:22px;border-radius:12px;background:#fff;border:1px solid #e6e2dc;overflow:hidden;box-shadow:0 10px 35px rgba(43,37,30,.035)}.card:after{content:"";position:absolute;width:120px;height:120px;border-radius:50%;right:-50px;bottom:-65px;background:var(--accent);opacity:.14}.card-top{display:flex;justify-content:space-between;color:#aaa6a1;font-size:10px}.card-top i{font-style:normal;font-size:16px}.card strong{display:block;margin-top:39px;font-size:34px;letter-spacing:-.04em;color:#1e1c1d}.card p{margin:8px 0 0;color:#85817d;font-size:12px}.tone-0{--accent:#ff6c4b}.tone-1{--accent:#8758e8}.tone-2{--accent:#4cbba4}.tone-3{--accent:#d7a737}.alert{margin-top:18px}@media(max-width:1100px){.card-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.intro{align-items:flex-start}.live{display:none}.card{min-height:155px}.card strong{margin-top:28px;font-size:28px}}
</style>

<style scoped>
.intro p{color:#303133}.intro small{color:#909399}.eyebrow{color:#409eff}.live{color:#606266;border-color:#e4e7ed}.card{border-color:#e4e7ed;box-shadow:0 8px 28px rgba(48,65,86,.045)}.card strong{color:#303133}.card p{color:#909399}.tone-0{--accent:#409eff}.tone-1{--accent:#7a7de8}.tone-2{--accent:#67c23a}.tone-3{--accent:#e6a23c}
</style>
