"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Package, AlertTriangle, TrendingDown, Eye } from "lucide-react"
import { inventoryService } from "@/lib/inventory-service"
import Link from "next/link"

interface InventoryItem {
  productId: string
  stock: number
  productName: string
  status: "available" | "low_stock" | "out_of_stock"
}

export function InventorySummaryCard() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = () => {
    setIsLoading(true)
    try {
      const inventory = inventoryService.getRestaurantInventory("al-andalus")

      const processedItems = inventory
        .map((item) => {
          const stock = inventoryService.getStockLevel(item.productId)
          const productName = getProductName(item.productId)

          let status: "available" | "low_stock" | "out_of_stock" = "available"
          if (stock === 0) {
            status = "out_of_stock"
          } else if (stock <= 5) {
            status = "low_stock"
          }

          return {
            productId: item.productId,
            stock,
            productName,
            status,
          }
        })
        .sort((a, b) => {
          // Ordenar por prioridad: sin stock, stock bajo, disponible
          const priority = { out_of_stock: 0, low_stock: 1, available: 2 }
          return priority[a.status] - priority[b.status]
        })

      setInventoryItems(processedItems)
    } catch (error) {
      console.error("Error loading inventory:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getProductName = (productId: string): string => {
    // Convertir ID a nombre legible
    return productId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getStatusBadge = (status: string, stock: number) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500 text-white">Disponible</Badge>
      case "low_stock":
        return <Badge className="bg-yellow-500 text-white">Stock Bajo</Badge>
      case "out_of_stock":
        return <Badge variant="destructive">Sin Stock</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const getStockProgress = (stock: number, maxStock = 20) => {
    return Math.min((stock / maxStock) * 100, 100)
  }

  const criticalItems = inventoryItems
    .filter((item) => item.status === "out_of_stock" || item.status === "low_stock")
    .slice(0, 5)

  const stats = {
    total: inventoryItems.length,
    available: inventoryItems.filter((item) => item.status === "available").length,
    lowStock: inventoryItems.filter((item) => item.status === "low_stock").length,
    outOfStock: inventoryItems.filter((item) => item.status === "out_of_stock").length,
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Resumen de Inventario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Resumen de Inventario
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/consortium/inventory">
              <Eye className="w-4 h-4 mr-2" />
              Ver Todo
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-xs text-blue-600">Total</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            <p className="text-xs text-green-600">Disponibles</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            <p className="text-xs text-yellow-600">Stock Bajo</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            <p className="text-xs text-red-600">Sin Stock</p>
          </div>
        </div>

        {/* Items Críticos */}
        {criticalItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <h4 className="font-medium text-sm">Items que Requieren Atención</h4>
            </div>

            {criticalItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(item.status, item.stock)}
                    <span className="text-xs text-gray-600">{item.stock} unidades</span>
                  </div>
                  <Progress value={getStockProgress(item.stock)} className="h-2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {criticalItems.length === 0 && (
          <div className="text-center py-6">
            <Package className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-green-600">¡Todo el inventario está en buen estado!</p>
            <p className="text-xs text-gray-500">No hay productos con stock bajo o agotado</p>
          </div>
        )}

        {/* Acciones Rápidas */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href="/consortium/inventory">
              <Package className="w-4 h-4 mr-2" />
              Gestionar
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={loadInventoryData} className="flex-1">
            <TrendingDown className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
