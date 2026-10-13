<template>
  <div class="enterprise-view">
    <el-card>
      <template #header>
        <div class="heading">
          <div>
            <h2>企业内购</h2>
            <p>创建企业优惠，生成专属小程序码供员工扫码订阅。</p>
          </div>
          <el-button type="primary" @click="openCreate">新建内购企业</el-button>
        </div>
      </template>
      <el-table :data="enterprises" v-loading="loading" stripe>
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column label="活动时间" min-width="260">
          <template #default="{ row }">{{ row.startDate }} 至 {{ row.endDate }}</template>
        </el-table-column>
        <el-table-column label="企业折扣" width="120">
          <template #default="{ row }">{{ Number(row.discount).toFixed(2) }} 折</template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="statusType(row)">{{ statusText(row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :loading="qrLoadingId === row.id" @click="showQr(row)">
              专属小程序码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createVisible" title="新建内购企业" width="480px">
      <el-form :model="form" label-width="95px">
        <el-form-item label="企业名称">
          <el-input v-model="form.name" maxlength="100" show-word-limit placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="form.startDate" value-format="YYYY-MM-DD" type="date" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="form.endDate" value-format="YYYY-MM-DD" type="date" style="width: 100%" />
        </el-form-item>
        <el-form-item label="企业折扣">
          <el-input-number v-model="form.discount" :min="0.01" :max="10" :precision="2" :step="0.1" />
          <span class="hint">8.50 表示在现有套餐价上再打 8.5 折</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">创建</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="qrVisible" :title="qrEnterprise?.name + ' · 专属小程序码'" width="430px" align-center>
      <div class="qr-content">
        <img v-if="qrData" :src="qrData" alt="企业专属小程序码" />
        <p>员工微信扫码后进入「我的订阅」，在有效期内享受企业折扣。</p>
        <a v-if="qrData" :href="qrData" :download="'家书-' + qrEnterprise?.name + '-小程序码.png'">下载小程序码</a>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createEnterprise, getEnterpriseQr, listEnterprises, type Enterprise } from '@/api/enterprises'

const enterprises = ref<Enterprise[]>([])
const loading = ref(false)
const saving = ref(false)
const createVisible = ref(false)
const qrVisible = ref(false)
const qrLoadingId = ref('')
const qrEnterprise = ref<Enterprise | null>(null)
const qrData = ref('')
const form = reactive({ name: '', startDate: '', endDate: '', discount: 8.5 })

const today = () => new Date().toLocaleDateString('sv-SE')
const statusText = (row: Enterprise) => today() < row.startDate ? '未开始' : today() > row.endDate ? '已结束' : '进行中'
const statusType = (row: Enterprise) => statusText(row) === '进行中' ? 'success' : 'info'

async function load() {
  loading.value = true
  try {
    enterprises.value = (await listEnterprises()).data || []
  } finally {
    loading.value = false
  }
}

function openCreate() {
  Object.assign(form, { name: '', startDate: '', endDate: '', discount: 8.5 })
  createVisible.value = true
}

async function save() {
  if (!form.name.trim() || !form.startDate || !form.endDate) {
    ElMessage.warning('请填写企业名称、开始时间和结束时间')
    return
  }
  if (form.endDate < form.startDate || form.discount <= 0 || form.discount > 10) {
    ElMessage.warning('请检查活动时间和折扣')
    return
  }
  saving.value = true
  try {
    await createEnterprise({ ...form, name: form.name.trim() })
    createVisible.value = false
    ElMessage.success('企业已创建')
    await load()
  } finally {
    saving.value = false
  }
}

async function showQr(row: Enterprise) {
  qrLoadingId.value = row.id
  try {
    qrData.value = (await getEnterpriseQr(row.id)).data
    qrEnterprise.value = row
    qrVisible.value = true
  } finally {
    qrLoadingId.value = ''
  }
}

onMounted(load)
</script>

<style scoped>
.heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.heading h2 { margin: 0 0 6px; font-size: 20px; }
.heading p { margin: 0; color: #909399; font-size: 13px; }
.hint { margin-left: 10px; font-size: 12px; color: #909399; }
.qr-content { text-align: center; }
.qr-content img { display: block; width: 280px; height: 280px; margin: 0 auto 16px; }
.qr-content p { color: #606266; line-height: 1.6; }
.qr-content a { color: #409eff; }
</style>
