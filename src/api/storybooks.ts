import request from './request'
import type { ApiResponse, PageResult, StorybookOrder } from '@/types'

export const getStorybookOrders = (params: { page: number; pageSize: number; status?: string }): Promise<ApiResponse<PageResult<StorybookOrder>>> =>
  request.get('/api/admin/storybook/orders', { params })

export const updateStorybookOrderStatus = (id: string, status: string): Promise<ApiResponse<null>> =>
  request.put(`/api/admin/storybook/orders/${id}/status`, { status })

export const confirmStorybookOrder = (id: string): Promise<ApiResponse<null>> =>
  request.post(`/api/admin/storybook/orders/${id}/confirm`)

export const shipStorybookOrder = (id: string, expressCompany: string, trackingNo: string): Promise<ApiResponse<null>> =>
  request.post(`/api/admin/storybook/orders/${id}/ship`, { expressCompany, trackingNo })

export const uploadStorybookDigitalFile = (id: string, file: File): Promise<ApiResponse<null>> => {
  const data = new FormData()
  data.append('file', file)
  return request.post(`/api/admin/storybook/orders/${id}/digital-file`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export interface StorybookTextBox { left: number; offset: number; width: number; fromBottom: boolean }

export interface CaptionScrim {
  left: number
  top: number
  width: number
  height: number
  color?: string
  opacity?: number
  style?: string
  core?: { left: number; top: number; right: number; bottom: number }
}

interface StorybookCaption {
  color: string
  fontWidthPercent: number
  imageScale?: number
  outline?: boolean
  layoutVersion?: number
  scrim?: CaptionScrim
  lines: Array<{ text: string; left: number; top: number }>
}
export interface StorybookArtwork {
  templateCode?: string
  status?: string
  error?: string
  pages: Array<{ number: number; title: string; text?: string; imageUrl?: string; layout?: string; qualityStatus?: string; textBox?: StorybookTextBox; caption?: StorybookCaption; accentColor?: string; accentTokens?: string[]; captionBlockUrl?: string }>
}

export const getStorybookArtwork = (id: string): Promise<ApiResponse<StorybookArtwork>> =>
  request.get(`/api/admin/storybook/orders/${id}/artwork`)

export const queueStorybookArtwork = (id: string, pageNumber?: number): Promise<ApiResponse<null>> =>
  request.post(`/api/admin/storybook/orders/${id}/artwork`, null, { params: { pageNumber } })

export interface StorybookPreview {
  id: string; userId: string; templateName: string; childName: string; childAge: number
  coverTitle: string; status: string; aiStatus: string; productionStatus?: string
  aiError?: string; productionError?: string; createdAt: string
}
export const getStorybookPreviews = (params: { page: number; pageSize: number }): Promise<ApiResponse<PageResult<StorybookPreview>>> =>
  request.get('/api/admin/storybook/previews', { params })
export const getStorybookPreviewArtwork = (id: string): Promise<ApiResponse<StorybookArtwork>> =>
  request.get(`/api/admin/storybook/previews/${id}/artwork`)
