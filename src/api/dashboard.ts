import request from './request'
import type { ApiResponse, DashboardStats, RevenueData, RecentOrder } from '@/types'

export function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return request.get('/api/admin/dashboard/stats')
}

export function getRevenueTrend(): Promise<ApiResponse<RevenueData[]>> {
  return request.get('/api/admin/dashboard/revenue-trend')
}

export function getRecentOrders(): Promise<ApiResponse<RecentOrder[]>> {
  return request.get('/api/admin/dashboard/recent-orders')
}
