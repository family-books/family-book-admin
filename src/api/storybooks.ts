import request from './request'
import type { ApiResponse, PageResult, StorybookOrder } from '@/types'

export const getStorybookOrders = (params: { page: number; pageSize: number; status?: string }): Promise<ApiResponse<PageResult<StorybookOrder>>> =>
  request.get('/api/admin/storybook/orders', { params })

export const updateStorybookOrderStatus = (id: string, status: string): Promise<ApiResponse<null>> =>
  request.put(`/api/admin/storybook/orders/${id}/status`, { status })

export const shipStorybookOrder = (id: string, expressCompany: string, trackingNo: string): Promise<ApiResponse<null>> =>
  request.post(`/api/admin/storybook/orders/${id}/ship`, { expressCompany, trackingNo })

export const uploadStorybookDigitalFile = (id: string, file: File): Promise<ApiResponse<null>> => {
  const data = new FormData()
  data.append('file', file)
  return request.post(`/api/admin/storybook/orders/${id}/digital-file`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
}
