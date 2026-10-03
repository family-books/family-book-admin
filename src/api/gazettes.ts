import request from './request'
import type { ApiResponse, PageResult, Gazette } from '@/types'

export function getGazetteList(params: {
  page: number
  pageSize: number
  status?: string
}): Promise<ApiResponse<PageResult<Gazette>>> {
  return request.get('/api/admin/gazette/list', { params })
}

export function regenerateGazette(gazetteId: number): Promise<ApiResponse<null>> {
  return request.post(`/api/admin/gazette/${gazetteId}/generate`)
}

export function updatePrintStatus(gazetteId: number, printStatus: string): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/gazette/${gazetteId}/print-status`, { printStatus })
}

export function shipGazette(
  gazetteId: number,
  payload: { expressCompany: string; trackingNo: string },
): Promise<ApiResponse<null>> {
  return request.post(`/api/admin/gazette/${gazetteId}/ship`, payload)
}

export function retryWechatShipping(gazetteId: number): Promise<ApiResponse<null>> {
  return request.post(`/api/admin/gazette/${gazetteId}/wechat-shipping/retry`)
}

export interface WechatShippingCapability {
  enabled: boolean
  tradeManaged: boolean
  errCode?: number
  message?: string
}

export function getWechatShippingCapability(): Promise<ApiResponse<WechatShippingCapability>> {
  return request.get('/api/admin/gazette/wechat-shipping/capability')
}
