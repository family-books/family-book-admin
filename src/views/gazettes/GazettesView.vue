<template>
  <div class="gazettes-view">
    <!-- Search Bar -->
    <el-card class="search-card">
      <el-form inline>
        <el-form-item label="家庭名">
          <el-input
            v-model="familyKeyword"
            placeholder="搜索家庭名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态筛选">
          <el-select v-model="statusFilter" placeholder="全部状态" clearable @change="handleSearch">
            <el-option label="生成中" value="generating" />
            <el-option label="待印刷" value="pending_print" />
            <el-option label="印刷中" value="printing" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已送达" value="delivered" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Gazettes Table -->
    <el-card>
      <el-table :data="gazettes" stripe v-loading="loading">
        <el-table-column prop="familyName" label="家庭名" width="130" />
        <el-table-column prop="issueNumber" label="期号" width="70" />
        <el-table-column prop="contentCount" label="内容数" width="70" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="generatedAt" label="生成时间" width="170" />
        <el-table-column label="操作" min-width="280">
          <template #default="{ row }">
            <el-button size="small" :disabled="!row.pdfUrl" @click="viewPdf(row)">
              查看PDF
            </el-button>
            <el-dropdown
              v-if="getValidTransitions(row.status).length > 0"
              @command="(cmd: string) => updateStatus(row, cmd)"
              trigger="click"
            >
              <el-button size="small">更新状态</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="status in getValidTransitions(row.status)"
                    :key="status"
                    :command="status"
                  >
                    {{ getStatusLabel(status) }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button size="small" type="primary" @click="showTrackingDialog(row)">
              填写物流
            </el-button>
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
        @current-change="fetchGazettes"
        @size-change="fetchGazettes"
      />
    </el-card>

    <!-- Tracking Dialog -->
    <el-dialog v-model="trackingVisible" title="填写物流单号" width="400px">
      <el-form>
        <el-form-item label="物流单号">
          <el-input v-model="trackingNumber" placeholder="请输入物流单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="trackingVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTracking">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getGazetteList, updateGazetteStatus, updateTrackingNumber } from '@/api/gazettes'
import type { Gazette } from '@/types'

const loading = ref(false)
const gazettes = ref<Gazette[]>([])
const statusFilter = ref('')
const familyKeyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const trackingVisible = ref(false)
const trackingNumber = ref('')
const currentGazette = ref<Gazette | null>(null)

const VALID_TRANSITIONS: Record<string, string[]> = {
  'generating': [],
  'pending_print': ['printing'],
  'printing': ['shipped'],
  'shipped': ['delivered'],
  'delivered': [],
}

const statusMap: Record<string, string> = {
  generating: '生成中',
  pending_print: '待印刷',
  printing: '印刷中',
  shipped: '已发货',
  delivered: '已送达',
}

const statusTypeMap: Record<string, string> = {
  generating: 'info',
  pending_print: 'warning',
  printing: '',
  shipped: 'success',
  delivered: 'success',
}

function getStatusLabel(status: string) {
  return statusMap[status] || status
}

function getStatusType(status: string) {
  return statusTypeMap[status] || 'info'
}

function getValidTransitions(status: string): string[] {
  return VALID_TRANSITIONS[status] || []
}

async function fetchGazettes() {
  loading.value = true
  try {
    const res = await getGazetteList({
      page: page.value,
      pageSize: pageSize.value,
      status: statusFilter.value || undefined,
      familyName: familyKeyword.value || undefined,
    })
    gazettes.value = res.data.records
    total.value = res.data.total
  } catch {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchGazettes()
}

function viewPdf(gazette: Gazette) {
  if (gazette.pdfUrl) {
    window.open(gazette.pdfUrl, '_blank')
  }
}

async function updateStatus(gazette: Gazette, status: string) {
  ElMessageBox.confirm(
    `确定要将状态更新为「${getStatusLabel(status)}」吗？`,
    '确认状态变更',
    { type: 'warning' }
  )
    .then(async () => {
      try {
        await updateGazetteStatus(gazette.id, status)
        ElMessage.success('状态更新成功')
        fetchGazettes()
      } catch {
        // handled by interceptor
      }
    })
    .catch(() => {})
}

function showTrackingDialog(gazette: Gazette) {
  currentGazette.value = gazette
  trackingNumber.value = gazette.trackingNumber || ''
  trackingVisible.value = true
}

async function submitTracking() {
  if (!currentGazette.value) return
  if (!trackingNumber.value.trim()) {
    ElMessage.warning('请输入物流单号')
    return
  }
  try {
    await updateTrackingNumber(currentGazette.value.id, trackingNumber.value.trim())
    // Auto-update status to shipped when tracking number is filled
    if (currentGazette.value.status === 'printing' || currentGazette.value.status === 'pending_print') {
      await updateGazetteStatus(currentGazette.value.id, 'shipped')
    }
    ElMessage.success('物流单号已更新')
    trackingVisible.value = false
    fetchGazettes()
  } catch {
    // handled by interceptor
  }
}

onMounted(() => {
  fetchGazettes()
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
