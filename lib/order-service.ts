import { inventoryService } from "./inventory-service"

export interface OrderItemCustomization {
  category: string
  option: string
  extraCost: number
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  customizations?: OrderItemCustomization[]
  totalPrice: number
}

export interface CustomerOrder {
  id: string
  restaurantId: string
  restaurantName: string
  items: OrderItem[]
  customerInfo: {
    name: string
    phone: string
    email?: string
    tableNumber?: string
  }
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  orderType: "delivery" | "pickup" | "dine-in"
  createdAt: Date
  estimatedTime?: number
  notes?: string
  paymentMethod?: string
  waiterId?: string
}

// Global orders storage (in-memory for this demo)
const globalOrders: CustomerOrder[] = [
  {
    id: "order-001",
    restaurantId: "al-andalus",
    restaurantName: "Al Andalus",
    items: [
      {
        id: "shawarma-pollo-andalus",
        name: "Shawarma de Pollo Al Andalus",
        price: 12,
        quantity: 2,
        totalPrice: 24,
        customizations: [
          { category: "Contorno", option: "Papas fritas", extraCost: 0 },
          { category: "Salsa", option: "Tahini", extraCost: 0 },
        ],
      },
    ],
    customerInfo: {
      name: "María González",
      phone: "0414-123-4567",
      email: "maria@email.com",
    },
    totalAmount: 24,
    status: "preparing",
    orderType: "delivery",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    estimatedTime: 20,
    paymentMethod: "card",
  },
  {
    id: "order-002",
    restaurantId: "muna",
    restaurantName: "Muna",
    items: [
      {
        id: "pinchos-pollo-muna",
        name: "Pinchos de Pollo Muna",
        price: 13,
        quantity: 1,
        totalPrice: 13,
      },
    ],
    customerInfo: {
      name: "Carlos Rodríguez",
      phone: "0424-987-6543",
      tableNumber: "5",
    },
    totalAmount: 13,
    status: "ready",
    orderType: "dine-in",
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    waiterId: "waiter-001",
  },
]

// Subscription system for real-time updates
type OrderListener = (orders: CustomerOrder[]) => void
const orderListeners: Set<OrderListener> = new Set()

const notifyListeners = () => {
  orderListeners.forEach((listener) => listener([...globalOrders]))
}

export const subscribeToOrders = (listener: OrderListener): (() => void) => {
  orderListeners.add(listener)
  // Send initial data
  listener([...globalOrders])
  return () => orderListeners.delete(listener)
}

export const createOrder = (orderData: Omit<CustomerOrder, "id" | "createdAt">): CustomerOrder => {
  const newOrder: CustomerOrder = {
    ...orderData,
    id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
  }

  globalOrders.unshift(newOrder) // Add to beginning

  // Decrement inventory for each item
  try {
    newOrder.items.forEach((item) => {
      inventoryService.decrementStock(newOrder.restaurantId, item.id, item.quantity)
    })
  } catch (error) {
    console.error("Error decrementing inventory:", error)
  }

  notifyListeners()
  console.log(`New order created: ${newOrder.id} for ${newOrder.restaurantName}`)
  return newOrder
}

export const getAllOrders = (restaurantId?: string): CustomerOrder[] => {
  if (restaurantId) {
    return globalOrders.filter((order) => order.restaurantId === restaurantId)
  }
  return [...globalOrders]
}

export const getOrderById = (orderId: string): CustomerOrder | null => {
  return globalOrders.find((order) => order.id === orderId) || null
}

export const updateOrderStatus = (orderId: string, status: CustomerOrder["status"]): boolean => {
  const orderIndex = globalOrders.findIndex((order) => order.id === orderId)
  if (orderIndex === -1) {
    console.error(`Order with ID ${orderId} not found`)
    return false
  }

  globalOrders[orderIndex].status = status
  notifyListeners()
  console.log(`Order ${orderId} status updated to ${status}`)
  return true
}

export const updateGlobalOrderStatus = updateOrderStatus // Alias for backward compatibility

// Get orders by status
export const getOrdersByStatus = (status: CustomerOrder["status"], restaurantId?: string): CustomerOrder[] => {
  let orders = globalOrders.filter((order) => order.status === status)
  if (restaurantId) {
    orders = orders.filter((order) => order.restaurantId === restaurantId)
  }
  return orders
}

// Get recent orders (last 24 hours)
export const getRecentOrders = (restaurantId?: string): CustomerOrder[] => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  let orders = globalOrders.filter((order) => order.createdAt >= yesterday)
  if (restaurantId) {
    orders = orders.filter((order) => order.restaurantId === restaurantId)
  }
  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
