import request from './request'
import type { ApiResponse, PageResult, Referral } from '@/types'

export function getReferralList(params: {
  page: number
  pageSize: number
}): Promise<ApiResponse<PageResult<Referral>>> {
  return request.get('/api/admin/referrals', { params })
}

export function getReferralStats(): Promise<ApiResponse<{ totalReferrals: number; totalPoints: number }>> {
  return request.get('/api/admin/referrals/stats')
}
