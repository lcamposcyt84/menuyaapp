import type { WaiterAccount, WaiterSession, TableOrder, OrderItem, MobilePaymentQR } from "./waiter-types"
import { authService } from "./auth-service"

export class WaiterService {
  private static instance: WaiterService
  private waiters: Map<string, WaiterAccount> = new Map()
  private waiterSessions: Map<string, WaiterSession> = new Map()
  private tableOrders: Map<string, TableOrder> = new Map()
  private mobilePayments: Map<string, MobilePaymentQR> = new Map()

  static getInstance(): WaiterService {
    if (!WaiterService.instance) {
      WaiterService.instance = new WaiterService()
      WaiterService.instance.initializeDefaultData()
    }
    return WaiterService.instance
  }

  private initializeDefaultData() {
    // Crear algunos meseros de ejemplo con puntos de recompensa
    const sampleWaiters = [
      {
        id: "waiter-001",
        username: "carlos_mesero",
        email: "carlos.mesero@menuya.com",
        name: "Carlos Rodríguez",
        phone: "0414-555-0001",
        restaurantId: "al-andalus",
        status: "active" as const,
        createdBy: "admin-al-andalus",
        createdByRole: "consortium_admin" as const,
        authorizedBy: "admin-al-andalus",
        authorizedByRole: "consortium_admin" as const,
        createdAt: new Date(),
        authorizedAt: new Date(),
        assignedTables: ["1", "2", "3", "4", "5"],
        rewards: { points: 850, level: "Bronce" as const }, // Añadido sistema de recompensas
      },
      {
        id: "waiter-002",
        username: "ana_mesera",
        email: "ana.mesera@menuya.com",
        name: "Ana López",
        phone: "0424-555-0002",
        restaurantId: "muna",
        status: "pending_authorization" as const,
        createdBy: "admin-muna",
        createdByRole: "consortium_admin" as const,
        createdAt: new Date(),
        assignedTables: ["6", "7", "8", "9", "10"],
        rewards: { points: 320, level: "Bronce" as const },
      },
      {
        id: "waiter-003",
        username: "luis_mesero",
        email: "luis.mesero@menuya.com",
        name: "Luis García",
        phone: "0412-555-0003",
        restaurantId: "pizza-jardin",
        status: "active" as const,
        createdBy: "super-admin-1",
        createdByRole: "super_admin" as const,
        authorizedBy: "super-admin-1",
        authorizedByRole: "super_admin" as const,
        createdAt: new Date(),
        authorizedAt: new Date(),
        assignedTables: ["11", "12", "13", "14", "15"],
        rewards: { points: 1450, level: "Plata" as const },
      },
    ]

    sampleWaiters.forEach((waiter) => {
      this.waiters.set(waiter.id, waiter)
    })

    // Crear algunas órdenes de ejemplo
    const sampleOrders = [
      {
        id: "order-001",
        tableNumber: "Mesa 3",
        waiterId: "waiter-001",
        waiterName: "Carlos Rodríguez",
        items: [
          {
            id: "item-001",
            restaurantId: "al-andalus",
            restaurantName: "Al Andalus",
            productId: "shawarma-pollo-andalus",
            productName: "Shawarma de Pollo Al Andalus",
            quantity: 2,
            unitPrice: 12,
            totalPrice: 24,
            status: "preparing" as const,
            estimatedTime: 15,
          },
        ],
        status: "active" as const,
        totalAmount: 24,
        createdAt: new Date(),
      },
    ]

    sampleOrders.forEach((order) => {
      this.tableOrders.set(order.id, order)
    })
  }

  private determineLevel(points: number): "Bronce" | "Plata" | "Oro" | "Platino" {
    if (points >= 5000) return "Platino"
    if (points >= 2500) return "Oro"
    if (points >= 1000) return "Plata"
    return "Bronce"
  }

  // Waiter Authentication
  async loginWaiter(username: string, password: string): Promise<WaiterSession | null> {
    try {
      // Find waiter by username
      const waiter = Array.from(this.waiters.values()).find((w) => w.username === username)
      if (!waiter || waiter.status !== "active") {
        return null
      }

      // Demo passwords for waiters
      const validPasswords: Record<string, string> = {
        carlos_mesero: "mesero123",
        ana_mesera: "mesero123",
        luis_mesero: "mesero123",
      }

      if (validPasswords[username] !== password) {
        return null
      }

      // Get restaurant info
      const restaurant = authService.getConsortiumById(waiter.restaurantId)
      if (!restaurant) {
        return null
      }

      // Create session
      const session: WaiterSession = {
        waiter,
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
        },
        permissions: ["take_orders", "view_orders", "process_payments", "manage_tables"],
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      }

      // Update last login
      waiter.lastLoginAt = new Date()
      this.waiterSessions.set(waiter.id, session)

      return session
    } catch (error) {
      console.error("Waiter login error:", error)
      return null
    }
  }

  logoutWaiter(waiterId: string): boolean {
    return this.waiterSessions.delete(waiterId)
  }

  getWaiterSession(waiterId: string): WaiterSession | null {
    const session = this.waiterSessions.get(waiterId)
    if (!session || session.expiresAt < new Date()) {
      this.waiterSessions.delete(waiterId)
      return null
    }
    return session
  }

  // Nuevo método para añadir puntos de recompensa a meseros
  addRewardPoints(waiterId: string, orderTotal: number): WaiterAccount | null {
    const waiter = this.waiters.get(waiterId)
    if (!waiter) return null

    const pointsToAdd = Math.floor(orderTotal * 5) // 5 puntos por cada $1 para meseros
    if (!waiter.rewards) {
      waiter.rewards = { points: 0, level: "Bronce" }
    }
    waiter.rewards.points += pointsToAdd
    waiter.rewards.level = this.determineLevel(waiter.rewards.points)

    console.log(`Added ${pointsToAdd} points to waiter ${waiter.name}. New total: ${waiter.rewards.points}`)
    return waiter
  }

  // Waiter Management
  async createWaiter(
    waiterData: Omit<WaiterAccount, "id" | "status" | "createdAt">,
    createdBy: string,
    createdByRole: "super_admin" | "consortium_admin",
  ): Promise<string> {
    const id = `waiter-${Date.now()}`
    const waiter: WaiterAccount = {
      ...waiterData,
      id,
      status: "pending_authorization",
      createdAt: new Date(),
      createdBy,
      createdByRole,
      rewards: { points: 0, level: "Bronce" }, // Inicializar con puntos
    }

    this.waiters.set(id, waiter)
    return id
  }

  async authorizeWaiter(
    waiterId: string,
    authorizedBy: string,
    authorizedByRole: "super_admin" | "consortium_admin",
  ): Promise<boolean> {
    try {
      const waiter = this.waiters.get(waiterId)
      if (!waiter || waiter.status !== "pending_authorization") {
        return false
      }

      waiter.status = "active"
      waiter.authorizedAt = new Date()
      waiter.authorizedBy = authorizedBy
      waiter.authorizedByRole = authorizedByRole

      return true
    } catch (error) {
      console.error("Error authorizing waiter:", error)
      return false
    }
  }

  async rejectWaiter(waiterId: string, rejectedBy: string): Promise<boolean> {
    try {
      const waiter = this.waiters.get(waiterId)
      if (!waiter || waiter.status !== "pending_authorization") {
        return false
      }

      waiter.status = "rejected"
      return true
    } catch (error) {
      console.error("Error rejecting waiter:", error)
      return false
    }
  }

  toggleWaiterStatus(waiterId: string): boolean {
    const waiter = this.waiters.get(waiterId)
    if (!waiter) return false

    waiter.status = waiter.status === "active" ? "disabled" : "active"
    return true
  }

  // Get waiters by different criteria
  getAllWaiters(): WaiterAccount[] {
    return Array.from(this.waiters.values())
  }

  getWaitersByRestaurant(restaurantId: string): WaiterAccount[] {
    return Array.from(this.waiters.values()).filter((w) => w.restaurantId === restaurantId)
  }

  getPendingWaiters(): WaiterAccount[] {
    return Array.from(this.waiters.values()).filter((w) => w.status === "pending_authorization")
  }

  getPendingWaitersByRestaurant(restaurantId: string): WaiterAccount[] {
    return this.getPendingWaiters().filter((w) => w.restaurantId === restaurantId)
  }

  // Order Management
  async createTableOrder(
    tableNumber: string,
    waiterId: string,
    items: Omit<OrderItem, "id" | "status">[],
  ): Promise<string> {
    const waiter = this.waiters.get(waiterId)
    if (!waiter) throw new Error("Waiter not found")

    const orderId = `order-${Date.now()}`
    const orderItems: OrderItem[] = items.map((item, index) => ({
      ...item,
      id: `${orderId}-item-${index}`,
      status: "pending",
    }))

    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)

    const order: TableOrder = {
      id: orderId,
      tableNumber,
      waiterId,
      waiterName: waiter.name,
      items: orderItems,
      status: "active",
      totalAmount,
      createdAt: new Date(),
    }

    this.tableOrders.set(orderId, order)

    // Añadir puntos al mesero por la orden
    this.addRewardPoints(waiterId, totalAmount)

    return orderId
  }

  getTableOrders(waiterId?: string): TableOrder[] {
    const orders = Array.from(this.tableOrders.values())
    return waiterId ? orders.filter((o) => o.waiterId === waiterId) : orders
  }

  getOrdersByTable(tableNumber: string): TableOrder[] {
    return Array.from(this.tableOrders.values()).filter((o) => o.tableNumber === tableNumber)
  }

  updateOrderItemStatus(orderId: string, itemId: string, status: OrderItem["status"]): boolean {
    const order = this.tableOrders.get(orderId)
    if (!order) return false

    const item = order.items.find((i) => i.id === itemId)
    if (!item) return false

    item.status = status
    return true
  }

  // Payment Management
  async generateMobilePaymentQR(tableNumber: string, amount: number): Promise<MobilePaymentQR> {
    const id = `payment-${Date.now()}`
    const qrCode = `MENUYA-PAY-${id}-${amount}-${tableNumber}`

    const payment: MobilePaymentQR = {
      id,
      tableNumber,
      amount,
      qrCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      status: "pending",
    }

    this.mobilePayments.set(id, payment)
    return payment
  }

  async completeTablePayment(tableNumber: string, paymentMethod: TableOrder["paymentMethod"]): Promise<boolean> {
    try {
      const orders = this.getOrdersByTable(tableNumber).filter((o) => o.status === "active")

      for (const order of orders) {
        order.status = "paid"
        order.paidAt = new Date()
        order.paymentMethod = paymentMethod
      }

      return true
    } catch (error) {
      console.error("Error completing table payment:", error)
      return false
    }
  }

  getMobilePayment(paymentId: string): MobilePaymentQR | null {
    return this.mobilePayments.get(paymentId) || null
  }
}

export const waiterService = WaiterService.getInstance()
