export interface InventoryItem {
  id: string
  productId: string
  restaurantId: string
  availableQuantity: number
  isManuallyEnabled: boolean
  lowStockThreshold: number
  lastUpdated: Date
  updatedBy?: string
}

export interface InventoryStatus {
  isAvailable: boolean
  reason: "available" | "out_of_stock" | "manually_disabled" | "both_disabled"
  availableQuantity: number
  isManuallyEnabled: boolean
}

export interface InventoryAlert {
  id: string
  productId: string
  productName: string
  type: "low_stock" | "out_of_stock"
  currentQuantity: number
  threshold: number
  timestamp: Date
  acknowledged: boolean
}

export interface InventoryUpdate {
  productId: string
  availableQuantity?: number
  isManuallyEnabled?: boolean
  lowStockThreshold?: number
}

export interface InventoryBulkUpdate {
  updates: InventoryUpdate[]
  reason?: string
}
