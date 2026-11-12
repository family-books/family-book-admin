<template>
  <div class="moderation-view">
    <el-card class="filter-card">
      <el-form inline>
        <el-form-item label="审核状态">
          <el-select v-model="status" style="width: 180px" @change="handleFilter">
            <el-option label="需要人工复核" value="manual_review" />
            <el-option label="机器审核中" value="pending" />
            <el-option label="已拒绝" value="rejected" />
            <el-option label="已通过" value="approved" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="fetchList">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="items" stripe v-loading="loading" row-key="id">
        <el-table-column prop="userNickname" label="发布者" width="120" />
        <el-table-column label="内容" min-width="220">
          <template #default="{ row }">
            <div class="content-text">{{ row.content || '无文字说明' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="图片" min-width="250">
          <template #default="{ row }">
            <div class="image-list">
              <el-image
                v-for="image in row.images || []"
                :key="image"
                :src="image"
                :preview-src-list="row.images || []"
                fit="cover"
                class="review-image"
                preview-teleported
              />
              <span v-if="!row.images?.length" class="empty">无图片</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="moderationReason" label="机器结果" min-width="150" />
        <el-table-column prop="createdAt" label="发布时间" width="170" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="success" @click="decide(row, 'approve')">通过</el-button>
            <el-button size="small" type="danger" @click="decide(row, 'reject')">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && items.length === 0" description="当前没有需要处理的内容" />
      <el-pagination
        class="pagination"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, sizes"
        :page-sizes="[10, 20, 50]"
        @current-change="fetchList"
        @size-change="fetchList"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { decideModeration, getModerationList } from '@/api/moderation'
import type { ModerationPost } from '@/types'

const loading = ref(false)
const items = ref<ModerationPost[]>([])
const status = ref('manual_review')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

async function fetchList() {
  loading.value = true
  try {
    const response = await getModerationList({
      page: page.value,
      pageSize: pageSize.value,
      status: status.value,
    })
    items.value = response.data.list
    total.value = response.data.total
  } finally {
    loading.value = false
  }
}

function handleFilter() {
  page.value = 1
  fetchList()
}

async function decide(item: ModerationPost, decision: 'approve' | 'reject') {
  const action = decision === 'approve' ? '通过' : '拒绝'
  await ElMessageBox.confirm(`确认${action}这条内容？`, '人工复核', {
    type: decision === 'approve' ? 'success' : 'warning',
    confirmButtonText: action,
    cancelButtonText: '取消',
  })
  await decideModeration(item.id, decision, `管理员人工${action}`)
  ElMessage.success(`已${action}`)
  await fetchList()
}

onMounted(fetchList)
</script>

<style scoped>
.filter-card { margin-bottom: 16px; }
.content-text { white-space: pre-wrap; line-height: 1.55; }
.image-list { display: flex; flex-wrap: wrap; gap: 8px; }
.review-image { width: 64px; height: 64px; border-radius: 6px; }
.empty { color: #909399; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
