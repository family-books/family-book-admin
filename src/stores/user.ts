import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('admin_token') || '')
  const userInfo = ref<User | null>(null)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('admin_token', newToken)
  }

  function setUser(user: User) {
    userInfo.value = user
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('admin_token')
  }

  return {
    token,
    userInfo,
    setToken,
    setUser,
    logout,
  }
})
