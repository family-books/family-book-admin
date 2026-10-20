import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

let isRefreshing = false
let pendingRequests: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function onTokenRefreshed(token: string) {
  pendingRequests.forEach(({ resolve }) => resolve(token))
  pendingRequests = []
}

function onTokenRefreshFailed(error: unknown) {
  pendingRequests.forEach(({ reject }) => reject(error))
  pendingRequests = []
}

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  async (response) => {
    if (response.config.responseType === 'blob') {
      if (response.data instanceof Blob && response.data.type.includes('application/json')) {
        const error = JSON.parse(await response.data.text())
        ElMessage.error(error.message || '下载失败')
        return Promise.reject(new Error(error.message || '下载失败'))
      }
      return response
    }
    const res = response.data
    if (res.code !== 0 && res.code !== 200) {
      // Do not show message for 401 — handled below via HTTP status
      if (res.code !== 401) {
        ElMessage.error(res.message || '请求失败')
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const userStore = useUserStore()
      const refreshToken = localStorage.getItem('admin_refreshToken')

      if (!refreshToken) {
        userStore.logout()
        router.push('/admin/login')
        ElMessage.error('登录已过期，请重新登录')
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${token}`
          return request(originalRequest)
        })
      }

      isRefreshing = true

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          { refreshToken }
        )
        const newToken = res.data.data?.token || res.data.token
        const newRefreshToken = res.data.data?.refreshToken || res.data.refreshToken

        userStore.setToken(newToken)
        if (newRefreshToken) {
          localStorage.setItem('admin_refreshToken', newRefreshToken)
        }

        isRefreshing = false
        onTokenRefreshed(newToken)

        // Retry original request
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return request(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        onTokenRefreshFailed(refreshError)
        userStore.logout()
        localStorage.removeItem('admin_refreshToken')
        router.push('/admin/login')
        ElMessage.error('登录已过期，请重新登录')
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.status !== 401) {
      ElMessage.error(error.response?.data?.message || error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
