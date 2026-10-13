import request from './request'
import type { ApiResponse } from '@/types'

export interface Enterprise {
  id: string
  name: string
  startDate: string
  endDate: string
  discount: number
  createdAt: string
}

export type CreateEnterprise = Pick<Enterprise, 'name' | 'startDate' | 'endDate' | 'discount'>

export const listEnterprises = (): Promise<ApiResponse<Enterprise[]>> =>
  request.get('/api/admin/enterprises')

export const createEnterprise = (data: CreateEnterprise): Promise<ApiResponse<Enterprise>> =>
  request.post('/api/admin/enterprises', data)

export const getEnterpriseQr = (id: string): Promise<ApiResponse<string>> =>
  request.get('/api/admin/enterprises/' + encodeURIComponent(id) + '/qr')
