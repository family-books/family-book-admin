import request from './request'
import type { ApiResponse, PageResult, User, FamilyMember } from '@/types'

export function getUserList(params: {
  page: number
  pageSize: number
  keyword?: string
}): Promise<ApiResponse<PageResult<User>>> {
  return request.get('/api/admin/users', { params })
}

export function getUserDetail(userId: number): Promise<ApiResponse<User>> {
  return request.get(`/api/admin/users/${userId}`)
}

export function getUserFamilies(userId: number): Promise<ApiResponse<FamilyMember[]>> {
  return request.get(`/api/admin/users/${userId}/families`)
}

export function updateUserStatus(userId: number, status: number): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/users/${userId}/status`, { status })
}

export function updateUserRole(userId: number, role: string): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/users/${userId}/role`, { role })
}
