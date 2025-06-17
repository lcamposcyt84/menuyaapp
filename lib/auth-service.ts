import type { User, ConsortiumAccount, AuthSession, RegistrationRequest } from "./auth-types"

export class AuthService {
  private static instance: AuthService
  private users: Map<string, User> = new Map()
  private consortiums: Map<string, ConsortiumAccount> = new Map()
  private sessions: Map<string, AuthSession> = new Map()
  private registrationRequests: Map<string, RegistrationRequest> = new Map()

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
      AuthService.instance.initializeDefaultData()
    }
    return AuthService.instance
  }

  private initializeDefaultData() {
    // Super Admin
    const superAdmin: User = {
      id: "super-admin-1",
      email: "admin@menuya.com",
      name: "Administrador General",
      role: "super_admin",
      status: "active",
      createdAt: new Date(),
    }
    this.users.set(superAdmin.id, superAdmin)

    // Crear todos los administradores de restaurantes
    const restaurantAdmins = [
      {
        id: "admin-al-andalus",
        email: "admin@shawarma.com",
        name: "Ahmed Al-Andalusi",
        consortiumId: "al-andalus",
        consortiumName: "Al Andalus",
        description: "Pizzas árabes, shawarmas y knafe - dulces árabes exquisitos",
        phone: "0414-123-4567",
        address: "Centro Comercial Plaza Mayor, Local 15",
        categories: ["Árabe", "Shawarma", "Pizza Árabe", "Dulces", "Halal"],
      },
      {
        id: "admin-muna",
        email: "admin@muna.com",
        name: "Fatima Muna",
        consortiumId: "muna",
        consortiumName: "Muna",
        description: "Pinchos árabes y comidas árabes variadas - tabbouleh, papas, salsa de ajo",
        phone: "0424-234-5678",
        address: "Avenida Principal, Edificio Torre Azul, PB",
        categories: ["Árabe", "Pinchos", "Tabbouleh", "Halal"],
      },
      {
        id: "admin-pizza-jardin",
        email: "admin@pizzajardin.com",
        name: "Marco Rossi",
        consortiumId: "pizza-jardin",
        consortiumName: "Pizza Jardín",
        description: "Pizzas italianas auténticas y marisquerías frescas del mediterráneo",
        phone: "0412-345-6789",
        address: "Calle Italia, Centro Histórico, Local 23",
        categories: ["Italiana", "Pizza", "Mariscos", "Mediterránea"],
      },
      {
        id: "admin-maacaruna",
        email: "admin@maacaruna.com",
        name: "Giuseppe Bianchi",
        consortiumId: "maacaruna",
        consortiumName: "Maacaruna",
        description: "Pastas italianas auténticas - boloñesa, carbonara, pasta a la carreta y más",
        phone: "0416-456-7890",
        address: "Boulevard Gastronómico, Torre Culinaria, Nivel 2",
        categories: ["Italiana", "Pasta", "Boloñesa", "Carbonara"],
      },
      {
        id: "admin-zona-bodegon",
        email: "admin@zonabodegon.com",
        name: "Carlos Mendoza",
        consortiumId: "zona-bodegon",
        consortiumName: "Zona Bodegón",
        description: "Bebidas gaseosas, cócteles refrescantes y chucherías variadas",
        phone: "0426-567-8901",
        address: "Plaza Central, Kiosco 15",
        categories: ["Bebidas", "Cócteles", "Refrescos", "Snacks"],
      },
    ]

    // Crear usuarios y consorcios
    restaurantAdmins.forEach((admin) => {
      // Crear usuario
      const user: User = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: "consortium_admin",
        status: "active",
        createdAt: new Date(),
      }
      this.users.set(user.id, user)

      // Crear consorcio
      const consortium: ConsortiumAccount = {
        id: admin.consortiumId,
        name: admin.consortiumName,
        description: admin.description,
        email: admin.email,
        phone: admin.phone,
        address: admin.address,
        categories: admin.categories,
        adminUserId: admin.id,
        status: "active",
        createdAt: new Date(),
        approvedAt: new Date(),
        settings: {
          commissionRate: 5,
          autoApproveOrders: true,
          maxWaiters: 10,
          allowInventoryManagement: true,
        },
      }
      this.consortiums.set(consortium.id, consortium)
    })

    // Solicitud pendiente de ejemplo
    const pendingRequest: RegistrationRequest = {
      id: "req-001",
      consortiumName: "Burger Palace",
      description: "Hamburguesas gourmet y comida rápida premium",
      adminName: "Carlos Rodriguez",
      adminEmail: "carlos@burgerpalace.com",
      phone: "0412-987-6543",
      address: "Centro Comercial Sambil, Nivel Feria",
      categories: ["Hamburguesas", "Comida Rápida", "Americana"],
      status: "pending",
      submittedAt: new Date(),
    }
    this.registrationRequests.set(pendingRequest.id, pendingRequest)
  }

  // Authentication
  async login(email: string, password: string): Promise<AuthSession | null> {
    try {
      // Find user by email
      const user = Array.from(this.users.values()).find((u) => u.email === email)
      if (!user || user.status !== "active") {
        return null
      }

      // Contraseñas de demostración
      const validPasswords: Record<string, string> = {
        "admin@menuya.com": "superadmin123",
        "admin@shawarma.com": "admin123",
        "admin@muna.com": "muna123",
        "admin@pizzajardin.com": "pizza123",
        "admin@maacaruna.com": "pasta123",
        "admin@zonabodegon.com": "bebidas123",
      }

      if (validPasswords[email] !== password) {
        return null
      }

      // Get consortium if user is consortium admin
      let consortium: ConsortiumAccount | undefined
      if (user.role === "consortium_admin") {
        consortium = Array.from(this.consortiums.values()).find((c) => c.adminUserId === user.id)
      }

      // Create session
      const session: AuthSession = {
        user,
        consortium,
        permissions: this.getUserPermissions(user, consortium),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }

      this.sessions.set(user.id, session)
      return session
    } catch (error) {
      console.error("Login error:", error)
      return null
    }
  }

  logout(userId: string): boolean {
    return this.sessions.delete(userId)
  }

  getSession(userId: string): AuthSession | null {
    const session = this.sessions.get(userId)
    if (!session || session.expiresAt < new Date()) {
      this.sessions.delete(userId)
      return null
    }
    return session
  }

  private getUserPermissions(user: User, consortium?: ConsortiumAccount): string[] {
    const permissions: string[] = []

    switch (user.role) {
      case "super_admin":
        permissions.push(
          "manage_consortiums",
          "approve_registrations",
          "view_all_data",
          "manage_users",
          "system_settings",
        )
        break
      case "consortium_admin":
        if (consortium?.status === "active") {
          permissions.push(
            "manage_own_products",
            "manage_own_orders",
            "manage_own_waiters",
            "view_own_analytics",
            "manage_own_inventory",
            "manage_own_promotions",
          )
        }
        break
      case "waiter":
        permissions.push("take_orders", "view_own_orders", "update_order_status")
        break
    }

    return permissions
  }

  // Registration Management
  async submitRegistration(request: Omit<RegistrationRequest, "id" | "status" | "submittedAt">): Promise<string> {
    const id = `req-${Date.now()}`
    const registrationRequest: RegistrationRequest = {
      ...request,
      id,
      status: "pending",
      submittedAt: new Date(),
    }

    this.registrationRequests.set(id, registrationRequest)
    return id
  }

  getPendingRegistrations(): RegistrationRequest[] {
    return Array.from(this.registrationRequests.values()).filter((req) => req.status === "pending")
  }

  async approveRegistration(requestId: string, approvedBy: string): Promise<boolean> {
    try {
      const request = this.registrationRequests.get(requestId)
      if (!request || request.status !== "pending") {
        return false
      }

      // Create user account
      const userId = `user-${Date.now()}`
      const user: User = {
        id: userId,
        email: request.adminEmail,
        name: request.adminName,
        role: "consortium_admin",
        status: "active",
        createdAt: new Date(),
      }
      this.users.set(userId, user)

      // Create consortium account
      const consortiumId = request.consortiumName.toLowerCase().replace(/\s+/g, "-")
      const consortium: ConsortiumAccount = {
        id: consortiumId,
        name: request.consortiumName,
        description: request.description,
        email: request.adminEmail,
        phone: request.phone,
        address: request.address,
        categories: request.categories,
        adminUserId: userId,
        status: "active",
        createdAt: new Date(),
        approvedAt: new Date(),
        approvedBy,
        settings: {
          commissionRate: 5,
          autoApproveOrders: true,
          maxWaiters: 5,
          allowInventoryManagement: true,
        },
      }
      this.consortiums.set(consortiumId, consortium)

      // Update request status
      request.status = "approved"
      request.reviewedAt = new Date()
      request.reviewedBy = approvedBy

      return true
    } catch (error) {
      console.error("Error approving registration:", error)
      return false
    }
  }

  async rejectRegistration(requestId: string, reason: string, rejectedBy: string): Promise<boolean> {
    try {
      const request = this.registrationRequests.get(requestId)
      if (!request || request.status !== "pending") {
        return false
      }

      request.status = "rejected"
      request.reviewedAt = new Date()
      request.reviewedBy = rejectedBy
      request.rejectionReason = reason

      return true
    } catch (error) {
      console.error("Error rejecting registration:", error)
      return false
    }
  }

  // Consortium Management
  getAllConsortiums(): ConsortiumAccount[] {
    return Array.from(this.consortiums.values())
  }

  getConsortiumById(id: string): ConsortiumAccount | null {
    return this.consortiums.get(id) || null
  }

  updateConsortiumStatus(consortiumId: string, status: ConsortiumAccount["status"]): boolean {
    const consortium = this.consortiums.get(consortiumId)
    if (!consortium) return false

    consortium.status = status
    return true
  }

  // User Management
  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null
  }
}

export const authService = AuthService.getInstance()
