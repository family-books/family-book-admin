export interface User {
  id: number | string
  nickname: string
  avatarUrl?: string
  phone?: string
  sysRole?: string
  createdAt?: string
  familyCount?: number
  subscriptionStatus?: string
}

export interface Family {
  id: number
  name: string
  inviteCode: string
  creatorNickname: string
  memberCount: number
  createdAt: string
}

export interface FamilyMember {
  id: number
  userId: number
  nickname: string
  role: string
  joinedAt: string
}

export interface ModerationPost {
  id: string
  familyId: string
  userId: string
  userNickname?: string
  content?: string
  images?: string[]
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'manual_review'
  moderationReason?: string
  moderationAttempts?: number
  createdAt?: string
  moderatedAt?: string
}

export interface GazettePrintTask {
  id: string
  recipientId?: string
  recipientLabel?: string
  recipientName?: string
  printStatus: string
  expressCompany?: string
  trackingNo?: string
  shippedAt?: string
  deliveredAt?: string
  paymentLogId?: string
  wechatShippingStatus?: 'pending' | 'success' | 'failed' | 'not_applicable' | 'manual_review'
  wechatShippingError?: string
  wechatShippingSyncedAt?: string
}

export interface Gazette {
  id: string
  familyName: string
  issueNo: number
  postCount: number
  status: string
  generatedAt: string
  printId?: string
  printStatus: string
  expressCompany?: string
  trackingNo?: string
  shippedAt?: string
  deliveredAt?: string
  paymentLogId?: string
  wechatShippingStatus?: 'pending' | 'success' | 'failed' | 'not_applicable' | 'manual_review'
  wechatShippingError?: string
  wechatShippingSyncedAt?: string
  deliveryCount?: number
  shippedCount?: number
  canCancelGeneration?: boolean
  prints?: GazettePrintTask[]
}

export interface Payment {
  id: string
  userNickname: string
  orderNo: string
  amount: number
  wxAmount?: number
  walletAmount?: number
  payChannel?: string
  orderType?: string
  planType: string
  payStatus: string
  refundStatus?: 'unknown' | 'processing' | 'success' | 'closed' | 'abnormal'
  refundAmount?: number
  paidAt: string
}

export interface StorybookOrder {
  id: string
  orderNo: string
  userId: string
  projectId: string
  templateName: string
  childName: string
  childAge: number
  childInterest?: string
  photoUrl: string
  coverTitle: string
  dedication?: string
  quantity: number
  totalAmount: number
  orderStatus: string
  recipientName: string
  phone: string
  fullAddress: string
  expressCompany?: string
  trackingNo?: string
  paidAt?: string
  shippedAt?: string
  createdAt: string
}

export interface Referral {
  id: number
  referrerNickname: string
  refereeNickname: string
  referralCode: string
  status: string
  pointsEarned: number
  createdAt: string
}

export interface DashboardStats {
  totalUsers: number
  totalFamilies: number
  totalGazettes: number
  totalRevenue: number | string
  monthlyNewUsers: number
  monthlyRevenue: number | string
  activeSubscriptions: number
}


export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface LoginForm {
  account: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  userId: number | string
  nickname: string
  avatar: string
  isNewUser: boolean
}
