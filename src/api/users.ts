import request from './request'
import type { ApiResponse, PageResult, User } from '@/types'

export function getUserList(params: {
  page: number
  pageSize: number
  keyword?: string
}): Promise<ApiResponse<PageResult<User>>> {
  return request.get('/api/admin/user/list', { params })
}

export function getUserDetail(userId: number | string): Promise<ApiResponse<User>> {
  return request.get(`/api/admin/user/${userId}`)
}

export function setUserEnabled(userId: number | string, enabled: boolean): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/user/${userId}/${enabled ? 'enable' : 'disable'}`)
}

export function updateUserRole(userId: number | string, role: string): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/user/${userId}/role`, { sysRole: role })
}
