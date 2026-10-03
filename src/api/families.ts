import request from './request'
import type { ApiResponse, PageResult, Family } from '@/types'

export function getFamilyList(params: {
  page: number
  pageSize: number
  keyword?: string
}): Promise<ApiResponse<PageResult<Family>>> {
  return request.get('/api/admin/family/list', { params })
}
