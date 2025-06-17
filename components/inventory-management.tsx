"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, AlertTriangle, CheckCircle, XCircle, RefreshCw, Search, Bell, TrendingDown } from "lucide-react"
import { inventoryService } from "@/lib/inventory-service"
import { getRestaurantById } from "@/lib/data"
import type { InventoryItem, InventoryAlert, InventoryStatus } from "@/lib/inventory-types"
import type { AuthSession } from "@/lib/auth"

// Update the component to get restaurantId from session
export function InventoryManagement() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const authData = localStorage.getItem("auth_session")
    if (authData) {
      const sessionData = JSON.parse(authData)
      setSession(sessionData)
      if (sessionData.consortium) {
        loadInventoryData(sessionData.consortium.id)
      }
    }
  }, [])

  const loadInventoryData = (restaurantId: string) => {
    setIsLoading(true)
    try {
      const restaurant = getRestaurantById(restaurantId)
      if (restaurant) {
        // Initialize inventory if not exists
        inventoryService.initializeRestaurantInventory(restaurantId, restaurant.menu)
        const inventoryData = inventoryService.getRestaurantInventory(restaurantId)
        const alertsData = inventoryService.getRestaurantAlerts(restaurantId)

        setInventory(inventoryData)
        setAlerts(alertsData)
      }
    } catch (error) {
      console.error("Error loading inventory:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const restaurant = session?.consortium ? getRestaurantById(session.consortium.id) : null

  const getProductName = (productId: string): string => {
    if (productId.includes("-")) {
      const [mainProductId, sideName] = productId.split("-", 2)
      const mainProduct = restaurant?.menu.find((item) => item.id === mainProductId)
      return mainProduct ? `${mainProduct.name} - ${sideName}` : productId
    }

    const product = restaurant?.menu.find((item) => item.id === productId)
    return product?.name || productId
  }

  const getAvailabilityStatus = (item: InventoryItem): InventoryStatus => {
    return inventoryService.getProductAvailability(session?.consortium?.id || "", item.productId)
  }

  const getStatusBadge = (status: InventoryStatus) => {
    switch (status.reason) {
      case "available":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disponible
          </Badge>
        )
      case "out_of_stock":
        return (
          <Badge variant="destructive">
            <Package className="w-3 h-3 mr-1" />
            Sin Stock
          </Badge>
        )
      case "manually_disabled":
        return (
          <Badge variant="secondary">
            <XCircle className="w-3 h-3 mr-1" />
            Desactivado
          </Badge>
        )
      case "both_disabled":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Sin Stock y Desactivado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const handleQuantityUpdate = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return

    const success = inventoryService.updateInventory(session?.consortium?.id || "", {
      productId,
      availableQuantity: newQuantity,
    })

    if (success) {
      loadInventoryData(session?.consortium?.id || "")
    }
  }

  const handleToggleAvailability = (productId: string, isEnabled: boolean) => {
    const success = inventoryService.updateInventory(session?.consortium?.id || "", {
      productId,
      isManuallyEnabled: isEnabled,
    })

    if (success) {
      loadInventoryData(session?.consortium?.id || "")
    }
  }

  const handleThresholdUpdate = (productId: string, newThreshold: number) => {
    if (newThreshold < 0) return

    const success = inventoryService.updateInventory(session?.consortium?.id || "", {
      productId,
      lowStockThreshold: newThreshold,
    })

    if (success) {
      loadInventoryData(session?.consortium?.id || "")
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    const success = inventoryService.acknowledgeAlert(alertId)
    if (success) {
      loadInventoryData(session?.consortium?.id || "")
    }
  }

  const filteredInventory = useMemo(() => {
    let filtered = inventory

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        getProductName(item.productId).toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      switch (selectedCategory) {
        case "available":
          filtered = filtered.filter((item) => getAvailabilityStatus(item).isAvailable)
          break
        case "low_stock":
          filtered = filtered.filter(
            (item) => item.availableQuantity <= item.lowStockThreshold && item.availableQuantity > 0,
          )
          break
        case "out_of_stock":
          filtered = filtered.filter((item) => item.availableQuantity === 0)
          break
        case "disabled":
          filtered = filtered.filter((item) => !item.isManuallyEnabled)
          break
      }
    }

    return filtered
  }, [inventory, searchTerm, selectedCategory, session])

  const stats = useMemo(() => {
    const total = inventory.length
    const available = inventory.filter((item) => getAvailabilityStatus(item).isAvailable).length
    const lowStock = inventory.filter(
      (item) => item.availableQuantity <= item.lowStockThreshold && item.availableQuantity > 0,
    ).length
    const outOfStock = inventory.filter((item) => item.availableQuantity === 0).length
    const disabled = inventory.filter((item) => !item.isManuallyEnabled).length

    return { total, available, lowStock, outOfStock, disabled }
  }, [inventory, session])

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Restaurante no encontrado</h3>
        <p className="text-gray-600">No se pudo cargar la información del restaurante</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Control de Inventario</h1>
          <p className="text-gray-600">Gestiona la disponibilidad y stock de tus productos</p>
        </div>
        <Button onClick={() => loadInventoryData(session?.consortium?.id || "")} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            Alertas de Inventario ({alerts.length})
          </h3>
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={alert.type === "out_of_stock" ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  <strong>{getProductName(alert.productId)}</strong> -
                  {alert.type === "low_stock"
                    ? ` Stock bajo (${alert.currentQuantity} unidades restantes)`
                    : " Sin stock disponible"}
                </span>
                <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                  Marcar como visto
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.available}</p>
                <p className="text-sm text-gray-600">Disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
                <p className="text-sm text-gray-600">Stock Bajo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
                <p className="text-sm text-gray-600">Sin Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.disabled}</p>
                <p className="text-sm text-gray-600">Desactivados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto">
                <TabsTrigger value="all" className="text-xs">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="available" className="text-xs">
                  Disponibles
                </TabsTrigger>
                <TabsTrigger value="low_stock" className="text-xs">
                  Stock Bajo
                </TabsTrigger>
                <TabsTrigger value="out_of_stock" className="text-xs">
                  Sin Stock
                </TabsTrigger>
                <TabsTrigger value="disabled" className="text-xs">
                  Desactivados
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Inventario */}
      <div className="grid gap-4">
        {filteredInventory.map((item) => {
          const status = getAvailabilityStatus(item)
          const productName = getProductName(item.productId)

          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Información del Producto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg truncate">{productName}</h3>
                      {getStatusBadge(status)}
                    </div>
                    <p className="text-sm text-gray-600">Última actualización: {item.lastUpdated.toLocaleString()}</p>
                  </div>

                  {/* Controles de Inventario */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 lg:w-auto">
                    {/* Control de Cantidad */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Cantidad Disponible</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={item.availableQuantity}
                          onChange={(e) => handleQuantityUpdate(item.productId, Number.parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <span className="text-xs text-gray-500">unidades</span>
                      </div>
                    </div>

                    {/* Umbral de Stock Bajo */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Alerta Stock Bajo</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={item.lowStockThreshold}
                          onChange={(e) => handleThresholdUpdate(item.productId, Number.parseInt(e.target.value) || 0)}
                          className="w-16"
                        />
                        <span className="text-xs text-gray-500">min</span>
                      </div>
                    </div>

                    {/* Toggle Manual */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Estado Manual</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.isManuallyEnabled}
                          onCheckedChange={(checked) => handleToggleAvailability(item.productId, checked)}
                        />
                        <span className="text-xs text-gray-600">
                          {item.isManuallyEnabled ? "Activo" : "Desactivado"}
                        </span>
                      </div>
                    </div>

                    {/* Estado Final */}
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Disponibilidad Final</Label>
                      <div className="flex items-center gap-2">
                        {status.isAvailable ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-xs font-medium">
                          {status.isAvailable ? "Disponible" : "No Disponible"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicador de Estado Detallado */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Estado del Sistema:</span>
                    <span className="text-gray-600">
                      {status.reason === "available" && "Activo y con stock suficiente"}
                      {status.reason === "out_of_stock" && "Agotado por falta de stock"}
                      {status.reason === "manually_disabled" && "Desactivado manualmente por el restaurante"}
                      {status.reason === "both_disabled" && "Sin stock y desactivado manualmente"}
                    </span>
                  </div>

                  {item.availableQuantity <= item.lowStockThreshold && item.availableQuantity > 0 && (
                    <div className="flex items-center gap-2 mt-2 text-yellow-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs">Stock bajo - considera reabastecer pronto</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all"
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay productos configurados en el inventario"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
