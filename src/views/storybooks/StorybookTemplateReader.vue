<template>
  <el-card v-loading="loading">
    <el-alert v-if="failed" title="故事模板暂时无法加载" type="error" :closable="false" />
    <el-button v-if="failed" class="retry" @click="load">重新加载</el-button>
    <el-empty v-else-if="!loading && !books.length" description="暂无故事模板" />
    <template v-if="book">
      <div class="template-picker">
        <el-select v-model="selectedCode" aria-label="选择故事" class="book-select">
          <el-option v-for="item in books" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
        <span class="meta">{{ book.ageRange }} · {{ book.pages.length - 1 }} 页正文 · 内置模板 {{ book.version }}</span>
      </div>
      <section v-if="book.plot" class="plot">
        <h3>完整剧情</h3>
        <p>{{ book.plot }}</p>
      </section>
      <section v-if="book.options?.length" class="script">
        <h3>喜好选项</h3>
        <article v-for="option in book.options" :key="option.code" class="script-page">
          <h4>{{ option.label }} · 第 {{ option.page.number }} 页</h4>
          <p>{{ option.page.text }}</p>
          <details>
            <summary>查看分镜</summary>
            <p>{{ option.page.storyboard }}</p>
          </details>
          <p class="meta">{{ reviewLabels[option.review.status] }}<template v-if="option.review.model"> · {{ option.review.model }}</template></p>
          <p v-if="option.review.findings">{{ option.review.findings }}</p>
          <el-button v-if="option.review.status !== 'approved'" :loading="reviewing === option"
            :disabled="reviewing !== null" @click="reviewOption(book.code, option)">
            {{ option.review.status === 'rejected' ? '重新 AI 审读' : '开始 AI 审读' }}
          </el-button>
        </article>
      </section>
      <section class="script" :key="book.code">
        <h3>逐页正文与分镜</h3>
        <p v-if="book.pages.some(page => page.text.includes('{'))" class="meta">正文里的 {name} 和 {motif} 分别是姓名和兴趣的占位符。</p>
        <article v-for="page in book.pages" :key="page.number" class="script-page">
          <h4>第 {{ page.number }} 页 · {{ page.text ? page.title : '封面' }}</h4>
          <p v-if="page.text">{{ page.text }}</p>
          <details v-if="page.storyboard">
            <summary>查看分镜</summary>
            <p>{{ page.storyboard }}</p>
          </details>
        </article>
      </section>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getStorybookTemplateScripts, reviewStorybookInterestOption, type StorybookInterestOption,
  type StorybookTemplateScript } from '@/api/storybooks'

const books = ref<StorybookTemplateScript[]>([])
const selectedCode = ref('')
const book = computed(() => books.value.find(item => item.code === selectedCode.value))
const loading = ref(true)
const failed = ref(false)
const reviewing = ref<StorybookInterestOption | null>(null)
const reviewLabels = { pending: '待审读', rejected: '已退回', approved: '已通过 · 可用于新订单' }

async function reviewOption(code: string, option: StorybookInterestOption) {
  reviewing.value = option
  try {
    const { data } = await reviewStorybookInterestOption(code, option.code)
    option.review = data
  } catch {
    // The request interceptor reports the error.
  } finally {
    reviewing.value = null
  }
}

async function load() {
  loading.value = true
  failed.value = false
  try {
    const { data } = await getStorybookTemplateScripts()
    books.value = data
    selectedCode.value = data[0]?.code ?? ''
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.template-picker{display:flex;flex-wrap:wrap;align-items:center;gap:12px}
.book-select{width:260px;max-width:100%}
.meta{color:var(--el-text-color-secondary)}
.plot,.script{max-width:880px;margin-top:24px}
.plot p,.script-page p{margin:8px 0;line-height:1.7;white-space:pre-wrap}
.script-page{padding:14px 0;border-top:1px solid var(--el-border-color-lighter)}
.script-page h4{margin:0 0 8px}
.script-page summary{color:var(--el-color-primary);cursor:pointer;width:fit-content}
.retry{margin-top:12px}
</style>
