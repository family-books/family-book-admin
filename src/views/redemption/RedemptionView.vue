<template>
  <div class="redemption-view">
    <el-card>
      <template #header>
        <div class="heading"><div><h2>兑换码管理</h2><p>每张码可兑换一次。支持绘本各版本和家庭订阅。</p></div><el-button type="primary" @click="generateVisible = true">生成兑换码</el-button></div>
      </template>
      <div class="filters">
        <el-input v-model="queryCode" clearable placeholder="按兑换码搜索" style="width: 190px" @keyup.enter="query" />
        <el-select v-model="status" placeholder="全部状态" clearable style="width: 150px" @change="query">
          <el-option label="未兑换" value="unused" /><el-option label="已兑换" value="redeemed" /><el-option label="已停用" value="disabled" />
        </el-select>
        <el-select v-model="productFilter" clearable placeholder="全部规格" style="width: 150px" @change="query">
          <el-option v-for="(label, value) in productLabels" :key="value" :label="label" :value="value" />
        </el-select>
        <el-button @click="query">查询</el-button>
      </div>
      <el-table :data="codes" v-loading="loading" stripe>
        <el-table-column prop="code" label="兑换码" width="150">
          <template #default="{ row }"><el-button link @click="copyCodes([row.code])">{{ row.code }}</el-button></template>
        </el-table-column>
        <el-table-column label="规格" min-width="140"><template #default="{ row }">{{ productLabel(row) }}</template></el-table-column>
        <el-table-column prop="source" label="发放渠道/批次" min-width="150" />
        <el-table-column label="状态" width="110"><template #default="{ row }"><el-tag :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag></template></el-table-column>
        <el-table-column prop="createdAt" label="生成时间" min-width="180" />
        <el-table-column prop="redeemedBy" label="兑换用户ID" min-width="190" />
        <el-table-column prop="storybookOrderId" label="绘本订单ID" min-width="190" />
        <el-table-column prop="redeemedFamilyId" label="家庭ID" min-width="190" />
        <el-table-column prop="redeemedAt" label="兑换时间" min-width="180" />
        <el-table-column prop="subscriptionEndDate" label="兑换后到期日" min-width="140" />
        <el-table-column label="操作" fixed="right" width="160"><template #default="{ row }">
          <template v-if="row.status === 'unused'">
            <el-button v-if="!row.storybookProductType" link type="primary" @click="openRedeem(row)">代用户兑换</el-button>
            <el-button link type="danger" @click="disable(row)">停用</el-button>
          </template>
        </template></el-table-column>
      </el-table>
      <el-pagination v-model:current-page="page" :page-size="20" :total="total" layout="total, prev, pager, next" @current-change="load" />
    </el-card>

    <el-dialog v-model="generateVisible" title="生成兑换码" width="450px">
      <el-form label-width="95px">
        <el-form-item label="规格">
          <el-select v-model="product" style="width:100%">
            <el-option v-for="(label, value) in productLabels" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量"><el-input-number v-model="count" :min="1" :max="100" /></el-form-item>
        <el-form-item label="渠道/批次"><el-input v-model="source" maxlength="100" placeholder="例如：小红书首批、线下体验" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="generateVisible = false">取消</el-button><el-button type="primary" :loading="saving" @click="generate">生成</el-button></template>
    </el-dialog>

    <el-dialog v-model="generatedVisible" title="本次生成的兑换码" width="500px">
      <p>{{ generatedLabel }} · {{ generated.length }} 张</p>
      <p v-if="generatedProduct !== 'subscription'" class="hint">可以复制到小红书等平台发货，或把码发给测试人员。在小程序「解锁完整版」页面使用。</p>
      <el-input :model-value="generated.join('\n')" type="textarea" :rows="Math.min(12, Math.max(3, generated.length))" readonly />
      <template #footer><el-button @click="copyCodes(generated)">复制全部</el-button><el-button type="primary" @click="generatedVisible = false">完成</el-button></template>
    </el-dialog>

    <el-dialog v-model="redeemVisible" :title="'代用户兑换 · ' + selectedCode" width="500px">
      <p class="hint">先搜索微信用户，再选择该用户所属的家庭。兑换后无法撤销。</p>
      <el-form label-width="85px">
        <el-form-item label="查找用户"><el-input v-model="userKeyword" placeholder="输入至少2个字的昵称或完整手机号" @keyup.enter="searchUsers"><template #append><el-button @click="searchUsers">搜索</el-button></template></el-input></el-form-item>
        <el-form-item label="微信用户"><el-select v-model="selectedUser" placeholder="选择用户" style="width:100%" @change="loadFamilies">
          <el-option v-for="user in users" :key="user.id" :label="`${user.nickname || '未命名'} ${user.phone || ''} (${user.id})`" :value="user.id" />
        </el-select></el-form-item>
        <el-form-item label="订阅家庭"><el-select v-model="selectedFamily" placeholder="选择该用户的家庭" style="width:100%">
          <el-option v-for="family in families" :key="family.id" :label="`${family.name} (${family.id})`" :value="family.id" />
        </el-select></el-form-item>
      </el-form>
      <template #footer><el-button @click="redeemVisible = false">取消</el-button><el-button type="primary" :disabled="!selectedUser || !selectedFamily" :loading="saving" @click="redeem">确认兑换</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listCodes, generateCodes, disableCode, redeemForUser, findUsers, familiesOf, type RedemptionCode, type StorybookRedemptionProduct, type UserChoice, type FamilyChoice } from '@/api/redemption'

const productLabels: Record<StorybookRedemptionProduct | 'subscription', string> = {
  digital: '电子完整版',
  softcover: '标准实体版',
  gift: '送礼纪念版',
  subscription: '家庭订阅（30天）'
}
const productLabel = (row: RedemptionCode) => productLabels[row.storybookProductType || 'subscription']
const product = ref<StorybookRedemptionProduct | 'subscription'>('subscription')
const productFilter = ref('')
const generatedProduct = ref<StorybookRedemptionProduct | 'subscription'>('subscription')
const generatedLabel = computed(() => productLabels[generatedProduct.value])
const codes = ref<RedemptionCode[]>([])
const loading = ref(false)
const saving = ref(false)
const page = ref(1)
const total = ref(0)
const status = ref('')
const queryCode = ref('')
const generateVisible = ref(false)
const generatedVisible = ref(false)
const count = ref(10)
const source = ref('')
const generated = ref<string[]>([])
const redeemVisible = ref(false)
const selectedCode = ref('')
const userKeyword = ref('')
const users = ref<UserChoice[]>([])
const families = ref<FamilyChoice[]>([])
const selectedUser = ref('')
const selectedFamily = ref('')

const statusLabel = (value: string) => ({ unused: '未兑换', redeemed: '已兑换', disabled: '已停用' }[value] || value)
const statusType = (value: string) => value === 'unused' ? 'success' : value === 'redeemed' ? 'info' : 'danger'

function query() {
  page.value = 1
  return load()
}

async function load() {
  loading.value = true
  try {
    const result = await listCodes({ page: page.value, pageSize: 20, status: status.value || undefined, code: queryCode.value.trim() || undefined, product: productFilter.value || undefined })
    codes.value = result.data.list
    total.value = result.data.total
  } finally { loading.value = false }
}
async function generate() {
  if (!count.value || saving.value) return
  saving.value = true
  const selectedProduct = product.value
  try {
    const result = await generateCodes(count.value, source.value.trim(), selectedProduct === 'subscription' ? undefined : selectedProduct)
    generatedProduct.value = selectedProduct
    generated.value = result.data.map(item => item.code)
    generateVisible.value = false
    generatedVisible.value = true
    page.value = 1
    await load()
  } finally { saving.value = false }
}
async function copyCodes(values: string[]) {
  try {
    await navigator.clipboard.writeText(values.join('\n'))
    ElMessage.success('已复制')
  } catch {
    ElMessage.warning('浏览器未允许访问剪贴板，请手动复制')
  }
}
async function disable(row: RedemptionCode) {
  await ElMessageBox.confirm(`停用兑换码 ${row.code}？停用后不能再兑换。`, '确认停用', { type: 'warning' })
  await disableCode(row.id)
  ElMessage.success('已停用')
  await load()
}
function openRedeem(row: RedemptionCode) {
  selectedCode.value = row.code
  userKeyword.value = ''
  users.value = []
  families.value = []
  selectedUser.value = ''
  selectedFamily.value = ''
  redeemVisible.value = true
}
async function searchUsers() {
  if (userKeyword.value.trim().length < 2) { ElMessage.warning('请至少输入2个字'); return }
  users.value = (await findUsers(userKeyword.value.trim())).data
  selectedUser.value = ''
  selectedFamily.value = ''
  families.value = []
  if (!users.value.length) ElMessage.info('未找到用户')
}
async function loadFamilies() {
  selectedFamily.value = ''
  families.value = selectedUser.value ? (await familiesOf(selectedUser.value)).data : []
}
async function redeem() {
  if (!selectedUser.value || !selectedFamily.value) return
  await ElMessageBox.confirm(`确定将 ${selectedCode.value} 兑换给所选用户和家庭？`, '确认兑换', { type: 'warning' })
  saving.value = true
  try {
    const result = await redeemForUser(selectedCode.value, selectedUser.value, selectedFamily.value)
    ElMessage.success(`兑换成功，有效至 ${result.data.endDate}`)
    redeemVisible.value = false
    await load()
  } finally { saving.value = false }
}
onMounted(load)
</script>

<style scoped>
.heading { display:flex; align-items:center; justify-content:space-between; gap:16px; }
.heading h2 { margin:0 0 6px; font-size:20px; }
.heading p, .hint { color:#909399; font-size:13px; }
.filters { display:flex; align-items:center; gap:12px; margin-bottom:18px; }
</style>
