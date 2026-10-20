import request from './request'
import type { ApiResponse, PageResult, Payment } from '@/types'

export function getPaymentList(params: {
  page: number
  pageSize: number
  status?: string
}): Promise<ApiResponse<PageResult<Payment>>> {
  return request.get('/api/admin/payment/list', { params })
}

export interface RefundResult {
  outRefundNo: string
  amount: number
  status: 'unknown' | 'processing' | 'success' | 'closed' | 'abnormal'
  reason: string
  lastError?: string
}

export function refundPayment(paymentId: string, payload: { amount: number; reason: string }): Promise<ApiResponse<RefundResult>> {
  return request.post(`/api/admin/payment/${paymentId}/refund`, payload)
}

export function refreshRefund(paymentId: string): Promise<ApiResponse<RefundResult>> {
  return request.post(`/api/admin/payment/${paymentId}/refund/refresh`)
}
