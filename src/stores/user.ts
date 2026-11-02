import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '@/api/request'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('admin_token') || '')

  // Hydrate userInfo from localStorage
  const savedUserInfo = localStorage.getItem('admin_userInfo')
  const userInfo = ref<User | null>(savedUserInfo ? JSON.parse(savedUserInfo) : null)

  const isAdmin = computed(() => {
    const role = userInfo.value?.sysRole
    return role === 'admin' || role === 'super_admin'
  })

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('admin_token', newToken)
  }

  function setUser(user: User) {
    userInfo.value = user
    localStorage.setItem('admin_userInfo', JSON.stringify(user))
    localStorage.setItem('admin_userId', String(user.id))
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_refreshToken')
    localStorage.removeItem('admin_userInfo')
    localStorage.removeItem('admin_userId')
  }

  function readUserIdFromToken(rawToken: string): string {
    try {
      const payload = rawToken.split('.')[1]
      if (!payload) return ''
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
      const parsed = JSON.parse(atob(padded)) as { sub?: string }
      return parsed.sub ? String(parsed.sub) : ''
    } catch {
      return ''
    }
  }

  async function fetchUserInfo() {
    try {
      const userId = readUserIdFromToken(token.value)
      if (!userId) return null
      const res = await request.get(`/api/admin/user/${encodeURIComponent(userId)}`)
      const user = res.data
      setUser(user)
      return user
    } catch (error) {
      return null
    }
  }

  return {
    token,
    userInfo,
    isAdmin,
    setToken,
    setUser,
    logout,
    fetchUserInfo,
  }
})
