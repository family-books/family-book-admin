import request from './request'
import type { ApiResponse, PageResult, Referral } from '@/types'

export function getReferralList(params: {
  page: number
  pageSize: number
}): Promise<ApiResponse<PageResult<Referral>>> {
  return request.get('/api/admin/referral/list', { params })
}

export function getReferralStats(): Promise<ApiResponse<{ totalReferrals: number; totalPointsIssued: number }>> {
  return request.get('/api/admin/referral/stats')
}
