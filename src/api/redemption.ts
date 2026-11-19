import request from './request'
import type { ApiResponse, PageResult } from '@/types'

export type StorybookRedemptionProduct = 'digital' | 'softcover' | 'gift'

export interface RedemptionCode {
  storybookProductType?: StorybookRedemptionProduct
  storybookOrderId?: string
  id: string
  code: string
  status: 'unused' | 'redeemed' | 'disabled'
  source?: string
  createdBy: string
  redeemedBy?: string
  redeemedFamilyId?: string
  redeemedAt?: string
  subscriptionEndDate?: string
  createdAt: string
}

export interface UserChoice { id: string; nickname: string; phone?: string }
export interface FamilyChoice { id: string; name: string }

export const listCodes = (params: { page: number; pageSize: number; status?: string; code?: string; product?: string }): Promise<ApiResponse<PageResult<RedemptionCode>>> =>
  request.get('/api/admin/redemption/list', { params })
export const generateCodes = (count: number, source: string, storybookProductType?: StorybookRedemptionProduct): Promise<ApiResponse<RedemptionCode[]>> =>
  request.post('/api/admin/redemption/generate', { count, source, storybookProductType })
export const disableCode = (id: string): Promise<ApiResponse<null>> =>
  request.post(`/api/admin/redemption/${encodeURIComponent(id)}/disable`)
export const redeemForUser = (code: string, userId: string, familyId: string): Promise<ApiResponse<{ endDate: string }>> =>
  request.post(`/api/admin/redemption/${encodeURIComponent(code)}/redeem`, { userId, familyId })
export const findUsers = (keyword: string): Promise<ApiResponse<UserChoice[]>> =>
  request.get('/api/admin/redemption/users', { params: { keyword } })
export const familiesOf = (userId: string): Promise<ApiResponse<FamilyChoice[]>> =>
  request.get(`/api/admin/redemption/users/${encodeURIComponent(userId)}/families`)
