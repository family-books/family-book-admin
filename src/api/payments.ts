import request from './request'
import type { ApiResponse, PageResult, Payment } from '@/types'

export function getPaymentList(params: {
  page: number
  pageSize: number
  status?: string
  orderNo?: string
}): Promise<ApiResponse<PageResult<Payment>>> {
  return request.get('/api/admin/payments', { params })
}

export function refundPayment(paymentId: number): Promise<ApiResponse<null>> {
  return request.post(`/api/admin/payments/${paymentId}/refund`)
}
