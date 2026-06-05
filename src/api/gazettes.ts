import request from './request'
import type { ApiResponse, PageResult, Gazette } from '@/types'

export function getGazetteList(params: {
  page: number
  pageSize: number
  status?: string
}): Promise<ApiResponse<PageResult<Gazette>>> {
  return request.get('/api/admin/gazettes', { params })
}

export function updateGazetteStatus(gazetteId: number, status: string): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/gazettes/${gazetteId}/status`, { status })
}

export function updateTrackingNumber(gazetteId: number, trackingNumber: string): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/gazettes/${gazetteId}/tracking`, { trackingNumber })
}
