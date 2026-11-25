<template>
  <el-button @click="open">编辑绘本模板</el-button>
  <el-dialog v-model="visible" title="绘本模板编辑" width="min(1100px, 96vw)">
    <div v-loading="busy">
      <el-select v-model="code" style="width: 280px" placeholder="选择故事" @change="load">
        <el-option v-for="story in stories" :key="story.code" :value="story.code" :label="story.name" />
      </el-select>
      <template v-if="draft && published">
        <p>当前发布版本 {{ published.baseVersion }} · {{ published.pages.length + 1 }} 页</p>
        <p v-if="selectedStory?.minPageCount && selectedStory?.maxPageCount">用户生成成书范围 {{ selectedStory.minPageCount }}–{{ selectedStory.maxPageCount }} 页（含封面和寄语）</p>
        <p>编辑中 {{ draft.pages.length + 1 }} 页（含封面和寄语）</p>
        <el-alert v-if="!published.materials.length" title="这是首版素材草稿。请先重新编排整本并逐页审阅，再发布。" :closable="false" />
        <el-collapse>
          <el-collapse-item v-if="isFullBleed" title="全书配色">
            <el-input v-model="draft.palette" type="textarea" :rows="4" maxlength="650" show-word-limit
              placeholder="填写全书主色、道具固定颜色和留白要求" />
          </el-collapse-item>
          <el-collapse-item title="10 个固定素材">
            <article v-for="(material, index) in draft.materials" :key="index" class="material">
              <el-form label-position="top">
                <div class="fields">
                  <el-form-item label="素材名称"><el-input v-model="material.name" /></el-form-item>
                  <el-form-item label="固定外观"><el-input v-model="material.appearance" type="textarea" /></el-form-item>
                  <el-form-item label="剧情作用"><el-input v-model="material.role" type="textarea" /></el-form-item>
                  <el-form-item label="主展示页">
                    <el-select v-model="material.focus">
                      <el-option v-for="page in draft.pages" :key="page.number" :value="page.number" :label="'第 ' + page.number + ' 页'" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="出现页（含主展示页）">
                    <el-select v-model="material.pages" multiple collapse-tags>
                      <el-option v-for="page in draft.pages" :key="page.number" :value="page.number" :label="'第 ' + page.number + ' 页'" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="参考图（PNG，最多 2 MB）">
                    <input type="file" accept="image/png" @change="uploadReference(material, $event)" />
                    <div v-if="material.referenceId">
                      <el-button text @click="showReference(material.referenceId)">查看参考图</el-button>
                      <el-button text @click="material.referenceId = null">移除</el-button>
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </article>
          </el-collapse-item>
        </el-collapse>
        <div class="actions">
          <el-input-number v-if="isFullBleed" v-model="targetPageCount" :min="18" :max="maxEditorialPageCount"
            aria-label="整本目标页数（含封面和寄语）" />
          <el-button type="primary" @click="replan">重新编排整本</el-button>
          <el-button v-if="recommendedPageCount > draft.pages.length + 1" @click="loadExpanded">载入新版分镜</el-button>
          <el-button @click="save">保存草稿</el-button>
        </div>
        <p>建议复核 {{ impact.length ? impact.join('、') + ' 页' : '暂无' }}。</p>
        <el-collapse>
          <el-collapse-item title="局部修订">
            <p>适合调整素材外观、参考图或单页镜头。</p>
            <el-checkbox-group v-model="selected">
              <el-checkbox v-for="page in draft.pages" :key="page.number" :value="page.number">{{ page.number }}</el-checkbox>
            </el-checkbox-group>
            <div class="actions">
              <el-button @click="selectImpact">选择受影响页</el-button>
              <el-button :disabled="!selected.length" @click="revise">生成选中页修订</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="expanded">
          <el-collapse-item v-for="(page, index) in draft.pages" :key="page.number" :name="page.number"
            :title="pageLabel(page) + ' · ' + page.title + (changed(page, index) ? '（已修改）' : '')">
            <div class="comparison">
              <section>
                <strong>当前发布内容</strong>
                <p>{{ published.pages[index]?.title }}</p>
                <p>{{ published.pages[index]?.text }}</p>
                <p>{{ published.pages[index]?.wardrobe }}</p>
                <p>{{ published.pages[index]?.shot }}</p>
                <p v-if="published.pages[index]?.colorDirection">{{ published.pages[index]?.colorDirection }}</p>
              </section>
              <el-form label-position="top">
                <el-form-item label="页标题"><el-input v-model="page.title" /></el-form-item>
                <el-form-item v-if="index" label="正文"><el-input v-model="page.text" type="textarea" /></el-form-item>
                <el-form-item label="着装"><el-input v-model="page.wardrobe" /></el-form-item>
                <el-form-item label="剧情动作和画面分镜"><el-input v-model="page.shot" type="textarea" :rows="4" /></el-form-item>
                <el-form-item v-if="isFullBleed" label="本页配色与亮色焦点">
                  <el-input v-model="page.colorDirection" type="textarea" :rows="3" maxlength="350" show-word-limit
                    placeholder="填写本页主色、视觉焦点和正文留白的颜色" />
                </el-form-item>
                <div v-if="page.textBox" class="fields">
                  <el-form-item label="正文左边距 (%)"><el-input-number v-model="page.textBox.left" :min="5" :max="95 - page.textBox.width" /></el-form-item>
                  <el-form-item label="正文宽度 (%)"><el-input-number v-model="page.textBox.width" :min="33" :max="Math.min(75, 95 - page.textBox.left)" /></el-form-item>
                  <el-form-item label="正文上下边距 (%)"><el-input-number v-model="page.textBox.offset" :min="5" :max="55" /></el-form-item>
                  <el-form-item label="从底部定位"><el-switch v-model="page.textBox.fromBottom" /></el-form-item>
                </div>
                <el-form-item v-if="page.number > 1" label="复用前页图片">
                  <el-switch :model-value="!!page.photoInset" @change="toggleInset(page)" />
                </el-form-item>
                <div v-if="page.photoInset" class="fields">
                  <el-form-item label="原图页"><el-input-number v-model="page.photoInset.sourcePage" :min="1" :max="page.number - 1" /></el-form-item>
                  <el-form-item label="左边距 (%)"><el-input-number v-model="page.photoInset.x" :min="0" :max="95" /></el-form-item>
                  <el-form-item label="上边距 (%)"><el-input-number v-model="page.photoInset.y" :min="0" :max="95" /></el-form-item>
                  <el-form-item label="宽度 (%)"><el-input-number v-model="page.photoInset.width" :min="5" :max="100" /></el-form-item>
                  <el-form-item label="高度 (%)"><el-input-number v-model="page.photoInset.height" :min="5" :max="100" /></el-form-item>
                </div>
              </el-form>
            </div>
            <el-button @click="draw(page.number)">试画本页（喜好留空）</el-button>
            <p v-if="trials[page.number] && trials[page.number]?.snapshot !== snapshot">草稿已修改，下图来自上次试画。</p>
            <div v-if="trials[page.number]" class="trial-frame">
              <el-image class="trial" :src="trials[page.number]?.url"
                :preview-src-list="[trials[page.number]?.url || '']" preview-teleported />
              <div v-if="page.textBox" class="trial-caption" :style="captionStyle(page.textBox)">{{ page.text.split('{name}').join('小星').split('{motif}').join('小云朵') }}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="actions">
          <el-checkbox v-model="reviewed">已核对受影响页的分镜、正文和插画</el-checkbox>
          <el-button type="success" :disabled="!reviewed" @click="publish">发布新版本</el-button>
        </div>
      </template>
    </div>
  </el-dialog>
  <el-dialog v-model="referenceVisible" title="素材参考图" width="min(600px, 90vw)">
    <el-image class="trial" :src="referenceImage" fit="contain" />
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'
import type { StorybookTextBox } from '@/api/storybooks'
import type { ApiResponse } from '@/types'

interface Page {
  number: number
  title: string
  text: string
  wardrobe: string
  shot: string
  layout: string
  colorDirection?: string
  textBox?: StorybookTextBox | null
  photoInset?: { sourcePage: number; x: number; y: number; width: number; height: number } | null
}
interface Material {
  name: string
  appearance: string
  role: string
  focus: number
  pages: number[]
  referenceId?: string | null
}
interface Draft {
  baseVersion: string
  palette?: string
  previewNumbers?: number[]
  materials: Material[]
  pages: Page[]
}
interface Story { code: string; name: string; pageCount: number; minPageCount?: number; maxPageCount?: number }

const endpoint = '/api/admin/storybook/templates'
const visible = ref(false)
const busy = ref(false)
const code = ref('')
const isFullBleed = computed(() => code.value === 'space-station' || code.value === 'dinosaur'
  || draft.value?.pages[1]?.layout === 'FULL_BLEED')
const stories = ref<Story[]>([])
const draft = ref<Draft>()
const published = ref<Draft>()
const selected = ref<number[]>([])
const publishedPreviewNumbers = ref<number[]>([])
const previewNumbers = computed(() => draft.value?.previewNumbers ?? publishedPreviewNumbers.value)
const selectedStory = computed(() => stories.value.find(story => story.code === code.value))
const maxEditorialPageCount = computed(() => Math.min(24, selectedStory.value?.maxPageCount ?? 24))
const recommendedPageCount = computed(() => selectedStory.value?.pageCount ?? 0)
const expanded = ref<number[]>([])
const reviewed = ref(false)
const referenceVisible = ref(false)
const referenceImage = ref('')
const trials = ref<Record<number, { snapshot: string; url: string }>>({})
const targetPageCount = ref<number>()
watch(() => draft.value?.pages.length, count => { targetPageCount.value = count === undefined ? undefined : count + 1 })
const captionStyle = (box: StorybookTextBox) => ({
  left: box.left + '%', width: box.width + '%', [box.fromBottom ? 'bottom' : 'top']: box.offset + '%',
})
const snapshot = computed(() => JSON.stringify(draft.value))
watch(snapshot, () => { reviewed.value = false })

function pageLabel(page: Page) {
  if (page.number === 1) return '第 1 页（封面）'
  return '第 ' + page.number + ' 页' + (previewNumbers.value.includes(page.number) ? '（预览）' : '')
}

function changed(page: Page, index: number) {
  return JSON.stringify(page) !== JSON.stringify(published.value?.pages[index])
}

const impact = computed(() => {
  if (!draft.value || !published.value) return []
  const pages = draft.value.pages
  if ((draft.value.palette || '') !== (published.value.palette || '')) return pages.map(page => page.number)
  if (!published.value.materials.length) return pages.map(page => page.number)
  const affected = new Set<number>()
  draft.value.materials.forEach((material, index) => {
    const previous = published.value?.materials[index]
    if (JSON.stringify(material) === JSON.stringify(previous)) return
    for (const number of [...material.pages, ...(previous?.pages ?? [])]) {
      affected.add(number - 1)
      affected.add(number)
      affected.add(number + 1)
    }
  })
  for (const [index, page] of pages.entries()) {
    if (changed(page, index)) affected.add(page.number)
  }
  for (const page of pages) {
    if (page.photoInset && affected.has(page.photoInset.sourcePage)) affected.add(page.number)
  }
  return pages.filter(page => affected.has(page.number)).map(page => page.number)
})

function uploadReference(material: Material, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  void run(async () => {
    const form = new FormData()
    form.append('file', file)
    const result: ApiResponse<string> = await request.post(`${endpoint}/references`, form)
    material.referenceId = result.data
  })
}

function showReference(id: string) {
  void run(async () => {
    const result: ApiResponse<string> = await request.get(`${endpoint}/references/${id}`)
    referenceImage.value = 'data:image/png;base64,' + result.data
    referenceVisible.value = true
  })
}

function selectImpact() {
  selected.value = [...impact.value]
}

async function run(action: () => Promise<void>) {
  busy.value = true
  try {
    await action()
  } catch (error) {
    if (error instanceof Error) ElMessage.error(error.message)
  } finally {
    busy.value = false
  }
}

async function fetchDraft() {
  draft.value = undefined
  published.value = undefined
  trials.value = {}
  expanded.value = []
  selected.value = []
  const result: ApiResponse<{ draft: Draft; published: Draft; previewNumbers: number[] }> = await request.get(`${endpoint}/${code.value}`)
  draft.value = result.data.draft
  published.value = result.data.published
  publishedPreviewNumbers.value = result.data.previewNumbers
  selectImpact()
}

function open() {
  visible.value = true
  if (stories.value.length) return
  void run(async () => {
    const result: ApiResponse<Story[]> = await request.get(endpoint)
    stories.value = result.data
    code.value = stories.value[0]?.code ?? ''
    if (code.value) await fetchDraft()
  })
}

function load() {
  void run(fetchDraft)
}

function toggleInset(page: Page) {
  page.photoInset = page.photoInset ? null : { sourcePage: page.number - 1, x: 51, y: 61, width: 41, height: 24 }
}

async function editorialJob<T>(path: string, body: unknown): Promise<T> {
  const created: ApiResponse<string> = await request.post(path, body)
  const jobUrl = `${endpoint}/jobs/${created.data}`
  const deadline = Date.now() + 20 * 60 * 1000
  while (Date.now() < deadline) {
    await new Promise(resolve => window.setTimeout(resolve, 2500))
    const response: ApiResponse<{ status: string; result: T; error?: string }> = await request.get(jobUrl)
    if (response.data.status === 'pending') continue
    void request.delete(jobUrl).catch(() => undefined)
    if (response.data.status === 'completed') return response.data.result
    throw new Error(response.data.error || '绘本任务失败')
  }
  throw new Error('绘本任务等待超时，请稍后重试')
}

async function loadExpanded() {
  try {
    await ElMessageBox.confirm(
      `载入 ${recommendedPageCount.value} 页的新版素材和分镜，会替换编辑区中的内容。请先保存需要保留的修改。`,
      '载入新版分镜',
    )
  } catch {
    return
  }
  void run(async () => {
    const result: ApiResponse<Draft> = await request.get(`${endpoint}/${code.value}/expanded-draft`)
    draft.value = result.data
    selectImpact()
    expanded.value = []
  })
}

async function replan() {
  if (!draft.value || busy.value) return
  try {
    await ElMessageBox.confirm(
      '将根据这 10 个固定素材重写全书分镜和文案，并更新素材出现页。结果会替换编辑区中的当前草稿，已发布版本继续有效。',
      '重新编排整本',
      { confirmButtonText: '开始编排' },
    )
  } catch {
    return
  }
  void run(async () => {
    if (!draft.value) return
    const query = isFullBleed.value && targetPageCount.value ? `?pageCount=${targetPageCount.value}` : ''
    const revised = await editorialJob<Draft>(`${endpoint}/${code.value}/replan${query}`, draft.value)
    draft.value = revised
    selectImpact()
    expanded.value = [revised.pages[0]?.number ?? 1]
    ElMessage.success('整本编排已生成，可逐页对照、试画并保存草稿')
  })
}

function revise() {
  void run(async () => {
    if (!draft.value) return
    draft.value.pages = await editorialJob<Page[]>(`${endpoint}/${code.value}/revision`,
      { draft: draft.value, pages: selected.value })
    expanded.value = [...selected.value]
    ElMessage.success('联动修订已生成，请逐页审阅')
  })
}

function save() {
  void run(async () => {
    await request.put(`${endpoint}/${code.value}`, draft.value)
    ElMessage.success('已保存草稿')
  })
}

function draw(number: number) {
  void run(async () => {
    const before = snapshot.value
    const png = await editorialJob<string>(`${endpoint}/${code.value}/trial/${number}`, draft.value)
    trials.value[number] = { snapshot: before, url: 'data:image/png;base64,' + png }
  })
}

async function publish() {
  try {
    await ElMessageBox.confirm('发布后，新制作的绘本将使用这个版本。', '发布绘本模板')
  } catch {
    return
  }
  void run(async () => {
    await request.post(`${endpoint}/${code.value}/publish`, draft.value)
    await fetchDraft()
    ElMessage.success('模板已发布')
  })
}
</script>

<style scoped>
.fields, .comparison { display: grid; gap: 12px; }
.fields { grid-template-columns: repeat(auto-fit, minmax(155px, 1fr)); }
.comparison { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.material { border-bottom: 1px solid var(--el-border-color-light); padding-top: 10px; }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 14px 0; }
.trial-frame { position: relative; width: min(100%, 420px); }
.trial-caption { position: absolute; pointer-events: none; padding: 6px 8px; box-sizing: border-box;
  color: #fff8e9; background: rgba(9, 19, 34, .72); border-radius: 6px; font-size: 13px; line-height: 1.5; }
.trial { display: block; max-width: 420px; margin-top: 12px; }
</style>
