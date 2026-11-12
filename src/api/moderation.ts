import request from './request'
import type { ApiResponse, PageResult, ModerationPost } from '@/types'

export function getModerationList(params: {
  page: number
  pageSize: number
  status?: string
}): Promise<ApiResponse<PageResult<ModerationPost>>> {
  return request.get('/api/admin/content-moderation/list', { params })
}

export function decideModeration(
  postId: string,
  decision: 'approve' | 'reject',
  reason?: string
): Promise<ApiResponse<void>> {
  return request.put(`/api/admin/content-moderation/${postId}/decision`, { decision, reason })
}
