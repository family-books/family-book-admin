import request from './request'
import type { ApiResponse, PageResult, Payment } from '@/types'

export function getPaymentList(params: {
  page: number
  pageSize: number
  status?: string
}): Promise<ApiResponse<PageResult<Payment>>> {
  return request.get('/api/admin/payment/list', { params })
}

export function refundPayment(paymentId: number): Promise<ApiResponse<null>> {
  return request.post(`/api/admin/payment/${paymentId}/refund`)
}
