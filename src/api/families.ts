import request from './request'
import type { ApiResponse, PageResult, Family, FamilyMember } from '@/types'

export function getFamilyList(params: {
  page: number
  pageSize: number
  keyword?: string
}): Promise<ApiResponse<PageResult<Family>>> {
  return request.get('/api/admin/families', { params })
}

export function getFamilyMembers(familyId: number): Promise<ApiResponse<FamilyMember[]>> {
  return request.get(`/api/admin/families/${familyId}/members`)
}
