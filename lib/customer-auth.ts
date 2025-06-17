export interface CustomerProfile {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  preferences: {
    favoriteRestaurants: string[]
    dietaryRestrictions: string[]
    defaultDeliveryAddress?: string
  }
  rewards: {
    points: number
    level: "Bronce" | "Plata" | "Oro" | "Platino"
  }
  orderHistory: string[]
  createdAt: Date
  lastLoginAt?: Date
}

export interface CustomerSession {
  customer: CustomerProfile
  token: string
  expiresAt: Date
}

class CustomerAuthService {
  private static instance: CustomerAuthService
  private customers: Map<string, CustomerProfile> = new Map()
  private sessions: Map<string, CustomerSession> = new Map()

  static getInstance(): CustomerAuthService {
    if (!CustomerAuthService.instance) {
      CustomerAuthService.instance = new CustomerAuthService()
      CustomerAuthService.instance.initializeDefaultCustomers()
    }
    return CustomerAuthService.instance
  }

  private initializeDefaultCustomers() {
    // Clientes de demostración
    const demoCustomers: CustomerProfile[] = [
      {
        id: "customer-1",
        email: "maria@example.com",
        name: "María González",
        phone: "0414-123-4567",
        address: "Av. Principal, Edificio Torre Azul, Apt 5B",
        preferences: {
          favoriteRestaurants: ["al-andalus", "muna"],
          dietaryRestrictions: ["halal"],
          defaultDeliveryAddress: "Av. Principal, Edificio Torre Azul, Apt 5B",
        },
        rewards: { points: 1250, level: "Plata" },
        orderHistory: [],
        createdAt: new Date("2024-01-15"),
        lastLoginAt: new Date(),
      },
      {
        id: "customer-2",
        email: "carlos@example.com",
        name: "Carlos Rodríguez",
        phone: "0424-987-6543",
        address: "Centro Comercial Plaza Mayor, Torre C, Piso 8",
        preferences: {
          favoriteRestaurants: ["pizza-jardin", "maacaruna"],
          dietaryRestrictions: [],
          defaultDeliveryAddress: "Centro Comercial Plaza Mayor, Torre C, Piso 8",
        },
        rewards: { points: 480, level: "Bronce" },
        orderHistory: [],
        createdAt: new Date("2024-02-01"),
      },
      {
        id: "customer-3",
        email: "ana@example.com",
        name: "Ana Martínez",
        phone: "0412-555-0123",
        address: "Av. Principal, Edificio Torre Azul, Apt 5B",
        preferences: {
          favoriteRestaurants: ["zona-bodegon"],
          dietaryRestrictions: ["vegetarian"],
        },
        rewards: { points: 0, level: "Bronce" }, // Added rewards for Ana
        orderHistory: [],
        createdAt: new Date("2024-02-10"),
      },
    ]

    demoCustomers.forEach((customer) => {
      this.customers.set(customer.id, customer)
    })
  }

  private determineLevel(points: number): "Bronce" | "Plata" | "Oro" | "Platino" {
    if (points >= 5000) return "Platino"
    if (points >= 2500) return "Oro"
    if (points >= 1000) return "Plata"
    return "Bronce"
  }

  async login(email: string, password: string): Promise<CustomerSession | null> {
    try {
      const customer = Array.from(this.customers.values()).find((c) => c.email === email)
      if (!customer) return null

      const validPasswords: Record<string, string> = {
        "maria@example.com": "maria123",
        "carlos@example.com": "carlos123",
        "ana@example.com": "ana123",
      }

      if (validPasswords[email] !== password) return null

      customer.lastLoginAt = new Date()

      const token = `token-${customer.id}-${Date.now()}`
      const session: CustomerSession = {
        customer,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }

      this.sessions.set(customer.id, session)
      return session
    } catch (error) {
      console.error("Customer login error:", error)
      return null
    }
  }

  async register(data: {
    email: string
    password: string
    name: string
    phone?: string
    address?: string
  }): Promise<CustomerSession | null> {
    try {
      const existingCustomer = Array.from(this.customers.values()).find((c) => c.email === data.email)
      if (existingCustomer) {
        throw new Error("El email ya está registrado")
      }

      const customerId = `customer-${Date.now()}`
      const newCustomer: CustomerProfile = {
        id: customerId,
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address,
        preferences: {
          favoriteRestaurants: [],
          dietaryRestrictions: [],
          defaultDeliveryAddress: data.address,
        },
        rewards: { points: 50, level: "Bronce" }, // Puntos de bienvenida
        orderHistory: [],
        createdAt: new Date(),
      }

      this.customers.set(customerId, newCustomer)

      const token = `token-${customerId}-${Date.now()}`
      const session: CustomerSession = {
        customer: newCustomer,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }

      this.sessions.set(customerId, session)
      return session
    } catch (error) {
      console.error("Customer registration error:", error)
      return null
    }
  }

  addRewardPoints(customerId: string, orderTotal: number): CustomerProfile | null {
    const customer = this.customers.get(customerId)
    if (!customer) return null

    const pointsToAdd = Math.floor(orderTotal * 10) // 10 puntos por cada $1
    customer.rewards.points += pointsToAdd
    customer.rewards.level = this.determineLevel(customer.rewards.points)

    console.log(`Added ${pointsToAdd} points to ${customer.name}. New total: ${customer.rewards.points}`)
    return customer
  }

  logout(customerId: string): boolean {
    return this.sessions.delete(customerId)
  }

  getSession(customerId: string): CustomerSession | null {
    const session = this.sessions.get(customerId)
    if (!session || session.expiresAt < new Date()) {
      this.sessions.delete(customerId)
      return null
    }
    return session
  }

  updateProfile(customerId: string, updates: Partial<CustomerProfile>): boolean {
    const customer = this.customers.get(customerId)
    if (!customer) return false

    Object.assign(customer, updates)
    return true
  }

  addToFavorites(customerId: string, restaurantId: string): boolean {
    const customer = this.customers.get(customerId)
    if (!customer) return false

    if (!customer.preferences.favoriteRestaurants.includes(restaurantId)) {
      customer.preferences.favoriteRestaurants.push(restaurantId)
    }
    return true
  }

  removeFromFavorites(customerId: string, restaurantId: string): boolean {
    const customer = this.customers.get(customerId)
    if (!customer) return false

    customer.preferences.favoriteRestaurants = customer.preferences.favoriteRestaurants.filter(
      (id) => id !== restaurantId,
    )
    return true
  }
}

export const customerAuthService = CustomerAuthService.getInstance()
