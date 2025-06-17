// Simple inventory service without complex dependencies
class InventoryService {
  private static instance: InventoryService
  private inventory: Map<string, number> = new Map()
  private alerts: Array<{
    id: string
    productId: string
    productName: string
    type: "low_stock" | "out_of_stock"
    currentQuantity: number
    threshold: number
    timestamp: Date
    acknowledged: boolean
  }> = []

  static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService()
    }
    return InventoryService.instance
  }

  // Initialize with default stock levels
  private initializeDefaults() {
    // Set default stock for common items if not already set
    const defaultItems = [
      "shawarma-pollo-andalus",
      "shawarma-carne-andalus",
      "pizza-arabe-carne-andalus",
      "knafe-andalus",
      "falafel-andalus",
      "hummus-andalus",
      "tabbouleh-andalus",
      "pinchos-pollo-muna",
      "tabbouleh-muna",
      "margherita-jardin",
      "pasta-bolognesa-maacaruna",
      "coca-cola-bodegon",
      "mojito-bodegon",
      "agua-mineral-bodegon",
      "te-arabe-andalus",
      "cafe-turco-andalus",
    ]

    defaultItems.forEach((itemId) => {
      if (!this.inventory.has(itemId)) {
        const stock = Math.floor(Math.random() * 25) + 3 // 3-28 stock
        this.inventory.set(itemId, stock)

        // Generate some sample alerts for demonstration
        if (stock <= 8) {
          this.alerts.push({
            id: `alert-${itemId}-${Date.now()}`,
            productId: itemId,
            productName: itemId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            type: stock === 0 ? "out_of_stock" : "low_stock",
            currentQuantity: stock,
            threshold: 5,
            timestamp: new Date(),
            acknowledged: false,
          })
        }
      }
    })
  }

  // Get product availability status
  getProductAvailability(restaurantId: string, productId: string) {
    this.initializeDefaults()

    const stock = this.inventory.get(productId) ?? 10 // Default to 10 if not found

    return {
      isAvailable: stock > 0,
      reason: stock > 0 ? "available" : "out_of_stock",
      availableQuantity: stock,
      isManuallyEnabled: true,
    }
  }

  // Decrement stock when order is placed
  decrementStock(restaurantId: string, productId: string, quantity: number): boolean {
    this.initializeDefaults()

    const currentStock = this.inventory.get(productId) ?? 10

    if (currentStock >= quantity) {
      const newStock = currentStock - quantity
      this.inventory.set(productId, newStock)

      // Check if we need to create alerts
      this.checkLowStockAlerts(productId, newStock)

      console.log(`Stock decremented for ${productId}: ${currentStock} -> ${newStock}`)
      return true
    }

    console.warn(`Insufficient stock for ${productId}. Available: ${currentStock}, Requested: ${quantity}`)
    return false
  }

  // Check and create alerts for low stock
  private checkLowStockAlerts(productId: string, currentStock: number) {
    const threshold = 5

    // Remove existing alerts for this product
    this.alerts = this.alerts.filter((alert) => alert.productId !== productId)

    if (currentStock <= threshold) {
      this.alerts.push({
        id: `alert-${productId}-${Date.now()}`,
        productId,
        productName: productId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        type: currentStock === 0 ? "out_of_stock" : "low_stock",
        currentQuantity: currentStock,
        threshold,
        timestamp: new Date(),
        acknowledged: false,
      })
    }
  }

  // Get alerts for a restaurant
  getRestaurantAlerts(restaurantId: string) {
    this.initializeDefaults()
    return this.alerts.filter((alert) => !alert.acknowledged)
  }

  // Acknowledge an alert
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
      return true
    }
    return false
  }

  // Get current stock level
  getStockLevel(productId: string): number {
    this.initializeDefaults()
    return this.inventory.get(productId) ?? 10
  }

  // Set stock level (for admin use)
  setStockLevel(productId: string, stock: number): void {
    this.inventory.set(productId, Math.max(0, stock))
    this.checkLowStockAlerts(productId, stock)
  }

  // Get all inventory for a restaurant
  getRestaurantInventory(restaurantId: string): Array<{ productId: string; stock: number }> {
    this.initializeDefaults()

    const result: Array<{ productId: string; stock: number }> = []
    this.inventory.forEach((stock, productId) => {
      result.push({ productId, stock })
    })
    return result
  }

  // Get inventory statistics
  getInventoryStats(restaurantId: string) {
    this.initializeDefaults()

    const inventory = this.getRestaurantInventory(restaurantId)
    const alerts = this.getRestaurantAlerts(restaurantId)

    const stats = {
      totalProducts: inventory.length,
      availableProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
      totalAlerts: alerts.length,
      totalValue: 0,
    }

    inventory.forEach((item) => {
      const stock = this.getStockLevel(item.productId)
      if (stock === 0) {
        stats.outOfStockProducts++
      } else if (stock <= 5) {
        stats.lowStockProducts++
      } else {
        stats.availableProducts++
      }

      // Estimate value (assuming average price of $12 per item)
      stats.totalValue += stock * 12
    })

    return stats
  }
}

export const inventoryService = InventoryService.getInstance()
