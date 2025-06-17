"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Eye,
  DollarSign,
  Users,
  CreditCard,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { inventoryService } from "@/lib/inventory-service"
import { useState, useEffect } from "react"
import { InventorySummaryCard } from "./inventory-summary-card"

export function ConsortiumDashboard() {
  const [inventoryStats, setInventoryStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalAlerts: 0,
  })

  useEffect(() => {
    loadInventoryStats()
  }, [])

  const loadInventoryStats = () => {
    try {
      const inventory = inventoryService.getRestaurantInventory("al-andalus")
      const alerts = inventoryService.getRestaurantAlerts("al-andalus")

      const lowStock = inventory.filter((item) => {
        const stock = inventoryService.getStockLevel(item.productId)
        return stock > 0 && stock <= 5
      }).length

      const outOfStock = inventory.filter((item) => {
        const stock = inventoryService.getStockLevel(item.productId)
        return stock === 0
      }).length

      setInventoryStats({
        totalProducts: inventory.length,
        lowStockItems: lowStock,
        outOfStockItems: outOfStock,
        totalAlerts: alerts.length,
      })
    } catch (error) {
      console.error("Error loading inventory stats:", error)
    }
  }

  const stats = [
    {
      title: "Productos Activos",
      value: inventoryStats.totalProducts.toString(),
      change: "+2 este mes",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pedidos Hoy",
      value: "24",
      change: "+18% vs ayer",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Stock Bajo",
      value: inventoryStats.lowStockItems.toString(),
      change: inventoryStats.lowStockItems > 0 ? "Requiere atención" : "Todo bien",
      icon: AlertTriangle,
      color: inventoryStats.lowStockItems > 0 ? "text-yellow-600" : "text-green-600",
      bgColor: inventoryStats.lowStockItems > 0 ? "bg-yellow-100" : "bg-green-100",
    },
    {
      title: "Sin Stock",
      value: inventoryStats.outOfStockItems.toString(),
      change: inventoryStats.outOfStockItems > 0 ? "Reabastecer urgente" : "Stock disponible",
      icon: Package,
      color: inventoryStats.outOfStockItems > 0 ? "text-red-600" : "text-green-600",
      bgColor: inventoryStats.outOfStockItems > 0 ? "bg-red-100" : "bg-green-100",
    },
  ]

  const financialStats = [
    {
      title: "Cuentas Pagadas",
      value: "$1,850",
      count: "18 pedidos",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Cuentas por Cobrar",
      value: "$320",
      count: "3 pedidos",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Comisiones Meseros",
      value: "$185",
      count: "5% del total",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Ingresos Netos",
      value: "$1,665",
      count: "Después de comisiones",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const recentOrders = [
    {
      id: "MYA-001",
      items: "Shawarma de Pollo x2",
      total: "$24",
      status: "preparing",
      time: "5 min",
      waiter: "Carlos M.",
      paid: true,
    },
    {
      id: "MYA-002",
      items: "Falafel x1, Hummus x1",
      total: "$15",
      status: "ready",
      time: "0 min",
      waiter: "Ana L.",
      paid: true,
    },
    {
      id: "MYA-003",
      items: "Shawarma de Carne x1",
      total: "$14",
      status: "preparing",
      time: "12 min",
      waiter: "Luis R.",
      paid: false,
    },
    {
      id: "MYA-004",
      items: "Shawarma de Pollo x3",
      total: "$36",
      status: "completed",
      time: "Entregado",
      waiter: "María S.",
      paid: true,
    },
  ]

  const waiterAccounts = [
    { name: "Carlos Martínez", orders: 8, sales: "$192", commission: "$9.60", efficiency: "95%" },
    { name: "Ana López", orders: 6, sales: "$144", commission: "$7.20", efficiency: "92%" },
    { name: "Luis Rodríguez", orders: 5, sales: "$120", commission: "$6.00", efficiency: "88%" },
    { name: "María Sánchez", orders: 7, sales: "$168", commission: "$8.40", efficiency: "97%" },
    { name: "Pedro García", orders: 4, sales: "$96", commission: "$4.80", efficiency: "85%" },
  ]

  const topProducts = [
    { name: "Shawarma de Pollo", sales: 45, revenue: "$540", margin: "65%" },
    { name: "Shawarma de Carne", sales: 32, revenue: "$448", margin: "62%" },
    { name: "Falafel", sales: 28, revenue: "$280", margin: "70%" },
    { name: "Hummus", sales: 15, revenue: "$225", margin: "75%" },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Resumen completo de tu restaurante</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link href="/consortium/orders">
              <Eye className="w-4 h-4 mr-2" />
              Ver Pedidos
            </Link>
          </Button>
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/consortium/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
            <Link href="/consortium/inventory">
              <Package className="w-4 h-4 mr-2" />
              Inventario
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{stat.change}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor} flex-shrink-0`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Financial Stats - Responsive */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <DollarSign className="w-5 h-5" />
            Estado Financiero
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {financialStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.title} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 truncate">{stat.count}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Inventario */}
      <InventorySummaryCard />

      {/* Tabs - Responsive */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="orders" className="text-xs sm:text-sm py-2">
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="waiters" className="text-xs sm:text-sm py-2">
            Meseros
          </TabsTrigger>
          <TabsTrigger value="products" className="text-xs sm:text-sm py-2">
            Top Productos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <ShoppingCart className="w-5 h-5" />
                Pedidos Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium text-sm sm:text-base">{order.id}</span>
                        <Badge
                          variant={
                            order.status === "ready"
                              ? "default"
                              : order.status === "completed"
                                ? "secondary"
                                : "outline"
                          }
                          className={`text-xs ${
                            order.status === "ready"
                              ? "bg-green-500"
                              : order.status === "completed"
                                ? "bg-gray-500"
                                : ""
                          }`}
                        >
                          {order.status === "ready"
                            ? "Listo"
                            : order.status === "completed"
                              ? "Entregado"
                              : "Preparando"}
                        </Badge>
                        <Badge
                          variant={order.paid ? "default" : "destructive"}
                          className={`text-xs ${order.paid ? "bg-green-600" : ""}`}
                        >
                          {order.paid ? "Pagado" : "Por Cobrar"}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{order.items}</p>
                      <p className="text-xs text-gray-500">Mesero: {order.waiter}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-green-600 text-sm sm:text-base">{order.total}</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waiters">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="w-5 h-5" />
                Cuentas de Meseros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {waiterAccounts.map((waiter, index) => (
                  <div key={waiter.name} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold text-blue-600 flex-shrink-0">
                          {waiter.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{waiter.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{waiter.orders} pedidos hoy</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs self-start sm:self-center">
                        Eficiencia: {waiter.efficiency}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Ventas</p>
                        <p className="font-semibold text-green-600">{waiter.sales}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Comisión</p>
                        <p className="font-semibold text-blue-600">{waiter.commission}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Pedidos</p>
                        <p className="font-semibold">{waiter.orders}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <TrendingUp className="w-5 h-5" />
                Productos Más Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold text-orange-600 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base truncate">{product.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{product.sales} vendidos</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-green-600 text-sm sm:text-base">{product.revenue}</p>
                      <p className="text-xs text-gray-500">Margen: {product.margin}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
