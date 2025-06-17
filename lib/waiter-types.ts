export interface WaiterAccount {
  id: string
  username: string
  email: string
  name: string
  phone: string
  restaurantId: string
  status: "active" | "disabled" | "pending_authorization" | "rejected"
  createdBy: string
  createdByRole: "super_admin" | "consortium_admin"
  authorizedBy?: string
  authorizedByRole?: "super_admin" | "consortium_admin"
  createdAt: Date
  authorizedAt?: Date
  lastLoginAt?: Date
  assignedTables: string[]
  rewards?: {
    points: number
    level: "Bronce" | "Plata" | "Oro" | "Platino"
  }
}

export interface WaiterSession {
  waiter: WaiterAccount
  restaurant: {
    id: string
    name: string
  }
  permissions: string[]
  expiresAt: Date
}

export interface OrderItem {
  id: string
  restaurantId: string
  restaurantName: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: "pending" | "preparing" | "ready" | "delivered"
  estimatedTime?: number
}

export interface TableOrder {
  id: string
  tableNumber: string
  waiterId: string
  waiterName: string
  items: OrderItem[]
  status: "active" | "paid" | "cancelled"
  totalAmount: number
  createdAt: Date
  paidAt?: Date
  paymentMethod?: "cash" | "card" | "mobile"
}

export interface MobilePaymentQR {
  id: string
  tableNumber: string
  amount: number
  qrCode: string
  expiresAt: Date
  status: "pending" | "completed" | "expired"
}
