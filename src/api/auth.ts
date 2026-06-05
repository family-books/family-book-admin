import request from './request'
import type { ApiResponse, LoginForm, LoginResult } from '@/types'

export function phoneLogin(data: LoginForm): Promise<ApiResponse<LoginResult>> {
  return request.post('/api/auth/phone-login', data)
}
