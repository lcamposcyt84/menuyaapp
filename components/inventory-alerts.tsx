"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package, X } from "lucide-react"
import { inventoryService } from "@/lib/inventory-service"

interface InventoryAlert {
  id: string
  productId: string
  productName: string
  type: "low_stock" | "out_of_stock"
  currentQuantity: number
  threshold: number
  timestamp: Date
  acknowledged: boolean
}

interface InventoryAlertsProps {
  restaurantId: string
}

export function InventoryAlerts({ restaurantId }: InventoryAlertsProps) {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])

  useEffect(() => {
    loadAlerts()
  }, [restaurantId])

  const loadAlerts = () => {
    try {
      const alertsData = inventoryService.getRestaurantAlerts(restaurantId)
      setAlerts(alertsData)
    } catch (error) {
      console.error("Error loading alerts:", error)
      setAlerts([])
    }
  }

  const handleAcknowledgeAlert = (alertId: string) => {
    try {
      const success = inventoryService.acknowledgeAlert(alertId)
      if (success) {
        setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
      }
    } catch (error) {
      console.error("Error acknowledging alert:", error)
    }
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="w-5 h-5" />
          Alertas de Inventario ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Package className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{alert.productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={alert.type === "out_of_stock" ? "destructive" : "secondary"} className="text-xs">
                      {alert.type === "out_of_stock" ? "Sin Stock" : "Stock Bajo"}
                    </Badge>
                    <span className="text-sm text-gray-600">{alert.currentQuantity} unidades disponibles</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAcknowledgeAlert(alert.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
