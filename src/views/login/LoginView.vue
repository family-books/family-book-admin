<template>
  <div class="login-container">
    <a class="back-home" href="/">← 返回官网</a>
    <section class="visual-panel">
      <div class="visual-shade"></div>
      <div class="visual-brand"><span class="brand-mark"><i></i><i></i><i></i></span><b>家书</b></div>
      <div class="visual-copy"><span>FAMILY BOOK · ADMIN</span><h1>把每一个<br>家的故事，<br><em>认真守护。</em></h1><p>管理用户、家庭内容与每一期家书制作。</p></div>
    </section>
    <div class="form-panel">
      <div class="login-card">
      <span class="form-kicker">WELCOME BACK</span>
      <h2 class="login-title">登录管理后台</h2>
      <p class="login-desc">使用管理员账号继续</p>
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        label-width="0"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            prefix-icon="User"
            placeholder="管理员账号"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="Lock"
            type="password"
            placeholder="密码"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="submit"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <p class="security">仅限授权管理员访问 · 登录行为将被记录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { passwordLogin } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  account: '',
  password: '',
})

const rules: FormRules = {
  account: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const res = await passwordLogin(loginForm)
    userStore.setToken(res.data.accessToken)
    localStorage.setItem('admin_refreshToken', res.data.refreshToken)
    userStore.setUser({ id: res.data.userId, nickname: res.data.nickname })
    const admin = await userStore.fetchUserInfo()
    if (!admin || (admin.sysRole !== 'admin' && admin.sysRole !== 'super_admin')) {
      userStore.logout()
      ElMessage.error('当前账号没有管理员权限')
      return
    }
    ElMessage.success('登录成功')
    router.push('/admin')
  } catch {
    // Error handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  display: flex;
  min-height: 100vh;
  background: #0b0b0d;
  font-family: Inter, "SF Pro Display", "Helvetica Neue", "PingFang SC", sans-serif;
}
.visual-panel{position:relative;width:55%;min-height:100vh;background:url('/images/landing-family-v2.jpg') center/cover no-repeat;overflow:hidden}.visual-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,8,10,.18),rgba(8,8,10,.88)),linear-gradient(90deg,rgba(8,8,10,.2),transparent)}.visual-brand{position:absolute;z-index:2;left:48px;top:42px;display:flex;align-items:center;gap:12px;color:#fff;font-size:21px}.brand-mark{width:27px;display:grid;gap:3px;transform:skew(-18deg)}.brand-mark i{height:6px;border-radius:2px;background:linear-gradient(90deg,#ff7656,#a55fff)}.brand-mark i:nth-child(2){margin-left:5px;background:linear-gradient(90deg,#a55fff,#68d7be)}.brand-mark i:nth-child(3){background:linear-gradient(90deg,#68d7be,#c2ee72)}.visual-copy{position:absolute;z-index:2;left:48px;bottom:60px;color:#fff}.visual-copy>span,.form-kicker{font-size:9px;letter-spacing:.17em;color:#aaa7ad}.visual-copy h1{font-size:clamp(44px,5vw,76px);line-height:.98;letter-spacing:-.065em;font-weight:500;margin:20px 0}.visual-copy h1 em{font-style:normal;color:#ff7b59}.visual-copy p{color:#c1bec4;font-size:13px}.form-panel{width:45%;display:grid;place-items:center;background:#f4f2ed;padding:45px}.login-card{width:min(420px,100%)}.form-kicker{color:#ed6947}.login-title{color:#1b1a1c;margin:12px 0 8px;font-size:36px;letter-spacing:-.05em;font-weight:650}.login-desc{color:#918d88;font-size:13px;margin:0 0 34px}.login-card :deep(.el-input__wrapper){height:54px;border-radius:7px;background:#fff;box-shadow:0 0 0 1px #dedad3 inset}.login-card :deep(.el-input__wrapper.is-focus){box-shadow:0 0 0 1px #282629 inset}.submit{width:100%;height:52px;margin-top:7px;border:0;border-radius:7px;background:#171619;font-size:14px}.submit:hover{background:#ec6948}.security{text-align:center;color:#aaa6a0;font-size:10px;margin-top:25px}.back-home{position:absolute;right:32px;top:28px;z-index:3;color:#77736e;text-decoration:none;font-size:12px}.back-home:hover{color:#ec6948}@media(max-width:800px){.visual-panel{display:none}.form-panel{width:100%;min-height:100vh;padding:30px}.back-home{right:20px;top:20px}.login-title{font-size:32px}}
</style>

<style scoped>
.login-container{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}.visual-shade{background:linear-gradient(180deg,rgba(48,55,145,.25),rgba(42,35,96,.9)),linear-gradient(90deg,rgba(61,69,170,.3),transparent)}.brand-mark i{background:#7ab8ff}.brand-mark i:nth-child(2){background:#9f8cff}.brand-mark i:nth-child(3){background:#72d2dc}.visual-copy h1 em{color:#91c7ff}.form-panel{background:#f5f7fa}.form-kicker{color:#409eff}.login-title{color:#303133}.login-desc{color:#909399}.login-card :deep(.el-input__wrapper){box-shadow:0 0 0 1px #dcdfe6 inset}.login-card :deep(.el-input__wrapper.is-focus){box-shadow:0 0 0 1px #409eff inset}.submit{background:#409eff}.submit:hover{background:#66b1ff}.back-home{color:#606266}.back-home:hover{color:#409eff}.security{color:#909399}
</style>
