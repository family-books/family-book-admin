export interface User {
  id: number
  nickname: string
  avatarUrl: string
  phone: string
  systemRole: string
  createdAt: string
  status: number
}

export interface Family {
  id: number
  name: string
  inviteCode: string
  creatorName: string
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

export interface Gazette {
  id: number
  familyName: string
  issueNumber: number
  contentCount: number
  status: string
  pdfUrl: string
  generatedAt: string
  trackingNumber: string
}

export interface Payment {
  id: number
  userName: string
  orderNo: string
  amount: number
  planName: string
  status: string
  paidAt: string
}

export interface Referral {
  id: number
  referrerName: string
  refereeName: string
  status: string
  points: number
  createdAt: string
}

export interface DashboardStats {
  totalUsers: number
  totalFamilies: number
  totalGazettes: number
  totalRevenue: number
  monthlyNewUsers: number
  activeSubscriptions: number
}

export interface RevenueData {
  date: string
  amount: number
}

export interface RecentOrder {
  id: number
  userName: string
  orderNo: string
  amount: number
  planName: string
  status: string
  paidAt: string
}

export interface PageResult<T> {
  records: T[]
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
  phone: string
  password: string
}

export interface LoginResult {
  token: string
  user: User
}
