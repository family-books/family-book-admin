import request from './request'
import type { AxiosResponse } from 'axios'
import type { ApiResponse, PageResult, Gazette } from '@/types'

export function getGazetteList(params: {
  page: number
  pageSize: number
  status?: string
}): Promise<ApiResponse<PageResult<Gazette>>> {
  return request.get('/api/admin/gazette/list', { params })
}

export function regenerateGazette(gazetteId: string): Promise<ApiResponse<null>> {
  return request.post(`/api/admin/gazette/${gazetteId}/generate`)
}

export function updatePrintStatus(gazetteId: string, printStatus: string): Promise<ApiResponse<null>> {
  return request.put(`/api/admin/gazette/${gazetteId}/print-status`, { printStatus })
}

export function shipGazette(
  gazetteId: string,
  payload: { expressCompany: string; trackingNo: string },
): Promise<ApiResponse<null>> {
  return request.post(`/api/admin/gazette/${gazetteId}/ship`, payload)
}

export function retryWechatShipping(gazetteId: string): Promise<ApiResponse<null>> {
  return request.post(`/api/admin/gazette/${gazetteId}/wechat-shipping/retry`)
}

export interface GazetteAddress {
  recipientName: string
  phone: string
  province: string
  city: string
  district: string
  address: string
}

export function getGazetteAddress(gazetteId: string): Promise<ApiResponse<GazetteAddress>> {
  return request.get(`/api/admin/gazette/${gazetteId}/address`)
}

export function downloadGazettePdf(gazetteId: string): Promise<AxiosResponse<Blob>> {
  return request.get<Blob, AxiosResponse<Blob>>(`/api/admin/gazette/${gazetteId}/pdf`, {
    responseType: 'blob', timeout: 300000,
  })
}

export function downloadGazettePrintImages(gazetteId: string): Promise<AxiosResponse<Blob>> {
  return request.get<Blob, AxiosResponse<Blob>>(`/api/admin/gazette/${gazetteId}/print-images.zip`, {
    responseType: 'blob', timeout: 300000,
  })
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
