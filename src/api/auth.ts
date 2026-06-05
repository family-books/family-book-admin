import request from './request'
import type { ApiResponse, LoginForm, LoginResult } from '@/types'

export function passwordLogin(data: LoginForm): Promise<ApiResponse<LoginResult>> {
  return request.post('/api/auth/password-login', data)
}
