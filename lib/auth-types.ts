export interface User {
  id: string
  email: string
  name: string
  role: "super_admin" | "consortium_admin" | "waiter"
  status: "active" | "inactive" | "suspended"
  createdAt: Date
  lastLoginAt?: Date
}

export interface ConsortiumAccount {
  id: string
  name: string
  description: string
  email: string
  phone: string
  address: string
  categories: string[]
  adminUserId: string
  status: "active" | "inactive" | "suspended" | "pending"
  createdAt: Date
  approvedAt?: Date
  approvedBy?: string
  settings: {
    commissionRate: number
    autoApproveOrders: boolean
    maxWaiters: number
    allowInventoryManagement: boolean
  }
}

export interface AuthSession {
  user: User
  consortium?: ConsortiumAccount
  permissions: string[]
  expiresAt: Date
}

export interface RegistrationRequest {
  id: string
  consortiumName: string
  description: string
  adminName: string
  adminEmail: string
  phone: string
  address: string
  categories: string[]
  status: "pending" | "approved" | "rejected"
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  rejectionReason?: string
}
