"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Search, CheckCircle, AlertCircle, Package, XCircle, Utensils } from "lucide-react"
import { restaurants } from "@/lib/data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// Interfaces para el sistema de órdenes
export interface OrderItem {
  id: string
  productId: string
  productName: string
  restaurantName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  customizations?: Array<{
    category: string
    name: string
    extraCost?: number
  }>
  notes?: string
}

export interface CustomerOrder {
  id: string
  customerInfo: string
  tableNumber?: number
  items: OrderItem[]
  total: number
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  createdAt: string
  restaurantId: string
  paymentMethod?: string
}

// Datos de demostración para órdenes
const mockOrders: CustomerOrder[] = [
  {
    id: "MYA-001",
    customerInfo: "María González",
    tableNumber: 5,
    items: [
      {
        id: "item-1",
        productId: "shawarma-pollo-andalus",
        productName: "Shawarma de Pollo Al Andalus",
        restaurantName: "Al Andalus",
        quantity: 2,
        unitPrice: 12,
        totalPrice: 24,
        customizations: [
          { category: "Contorno", name: "Papas fritas" },
          { category: "Salsa", name: "Tahini" },
        ],
      },
      {
        id: "item-2",
        productId: "knafe-andalus",
        productName: "Knafe Al Andalus",
        restaurantName: "Al Andalus",
        quantity: 1,
        unitPrice: 8,
        totalPrice: 8,
      },
    ],
    total: 32,
    status: "preparing",
    createdAt: new Date().toISOString(),
    restaurantId: "al-andalus",
    paymentMethod: "Pago Móvil",
  },
  {
    id: "MYA-002",
    customerInfo: "Carlos Rodríguez",
    tableNumber: 12,
    items: [
      {
        id: "item-3",
        productId: "pinchos-pollo-muna",
        productName: "Pinchos de Pollo Muna",
        restaurantName: "Muna",
        quantity: 1,
        unitPrice: 13,
        totalPrice: 13,
        customizations: [
          { category: "Contorno", name: "Arroz árabe" },
          { category: "Salsa", name: "Salsa de ajo" },
        ],
      },
    ],
    total: 13,
    status: "ready",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    restaurantId: "muna",
    paymentMethod: "Pago Móvil",
  },
  {
    id: "MYA-003",
    customerInfo: "Ana Martínez",
    tableNumber: 8,
    items: [
      {
        id: "item-4",
        productId: "margherita-jardin",
        productName: "Pizza Margherita",
        restaurantName: "Pizza Jardín",
        quantity: 1,
        unitPrice: 16,
        totalPrice: 20,
        customizations: [{ category: "Tamaño", name: 'Mediana (12")', extraCost: 4 }],
      },
    ],
    total: 20,
    status: "pending",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    restaurantId: "pizza-jardin",
    paymentMethod: "Pago Móvil",
  },
]

// Mock current consortium ID - replace with actual auth logic
const MOCK_CONSORTIUM_ID = "al-andalus" // Example: Al Andalus

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<CustomerOrder | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // This would come from auth context in a real app
  const consortiumRestaurantId = MOCK_CONSORTIUM_ID

  useEffect(() => {
    // Filter orders by restaurant ID
    const filteredOrders = mockOrders.filter((order) => order.restaurantId === consortiumRestaurantId)
    setOrders(filteredOrders)
  }, [consortiumRestaurantId])

  const getStatusInfo = (status: CustomerOrder["status"]) => {
    switch (status) {
      case "pending":
        return { label: "Pendiente", color: "bg-orange-500", icon: Utensils, variant: "secondary" as const }
      case "preparing":
        return { label: "Preparando", color: "bg-yellow-500", icon: Clock, variant: "secondary" as const }
      case "ready":
        return { label: "Listo", color: "bg-green-500", icon: CheckCircle, variant: "default" as const }
      case "completed":
        return { label: "Entregado", color: "bg-blue-500", icon: Package, variant: "default" as const }
      case "cancelled":
        return { label: "Cancelado", color: "bg-red-600", icon: XCircle, variant: "destructive" as const }
      default:
        return { label: "Desconocido", color: "bg-gray-300", icon: AlertCircle, variant: "outline" as const }
    }
  }

  const TABS_CONFIG = [
    { value: "all", label: "Todos" },
    { value: "pending", label: "Pendientes" },
    { value: "preparing", label: "Preparando" },
    { value: "ready", label: "Listos" },
    { value: "completed", label: "Entregados" },
    { value: "cancelled", label: "Cancelados" },
  ]

  const filteredOrdersByTab = useMemo(() => {
    const tabFiltered = TABS_CONFIG.reduce(
      (acc, tab) => {
        const statusOrders = tab.value === "all" ? orders : orders.filter((o) => o.status === tab.value)
        acc[tab.value] = statusOrders.filter(
          (order) =>
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some((item) => item.productName.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        return acc
      },
      {} as Record<string, CustomerOrder[]>,
    )
    return tabFiltered
  }, [orders, searchTerm])

  const handleUpdateOrderStatus = (orderId: string, newStatus: CustomerOrder["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
  }

  const openOrderDetailsModal = (order: CustomerOrder) => {
    setSelectedOrderDetails(order)
    setIsDetailsModalOpen(true)
  }

  const OrderCard = ({ order }: { order: CustomerOrder }) => {
    const statusInfo = getStatusInfo(order.status)
    const StatusIcon = statusInfo.icon

    return (
      <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
        <CardHeader className="pb-3 cursor-pointer" onClick={() => openOrderDetailsModal(order)}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-gray-800">{order.id}</span>
              <span className="text-sm text-gray-600">
                {order.customerInfo} {order.tableNumber ? `(Mesa ${order.tableNumber})` : ""}
              </span>
            </div>
            <Badge variant={statusInfo.variant} className={`${statusInfo.color} text-white text-xs px-2 py-1`}>
              <StatusIcon className="w-3 h-3 mr-1.5" />
              {statusInfo.label}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {new Date(order.createdAt).toLocaleString("es-VE", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-lg font-bold text-green-600">${order.total.toFixed(2)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 flex-grow cursor-pointer" onClick={() => openOrderDetailsModal(order)}>
          <ScrollArea className="h-24 pr-2">
            {order.items.map((item: OrderItem, index: number) => (
              <div key={item.id || index} className="text-sm py-1 border-b border-gray-100 last:border-b-0">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    {item.productName} x{item.quantity}
                  </span>
                  <span className="text-gray-600">${item.totalPrice.toFixed(2)}</span>
                </div>
                {item.customizations && item.customizations.length > 0 && (
                  <p className="text-xs text-gray-500 pl-2">• {item.customizations.map((c) => c.name).join(", ")}</p>
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-3 border-t mt-auto">
          <div className="flex gap-2 w-full">
            {order.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Clock className="w-4 h-4 mr-2" /> Aceptar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                  className="flex-1"
                >
                  Rechazar
                </Button>
              </>
            )}
            {order.status === "preparing" && (
              <Button
                size="sm"
                onClick={() => handleUpdateOrderStatus(order.id, "ready")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Listo
              </Button>
            )}
            {order.status === "ready" && (
              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                  className="flex-1"
                >
                  Volver a Preparar
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Package className="w-4 h-4 mr-2" /> Entregado
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    )
  }

  const currentRestaurant = restaurants.find((r) => r.id === consortiumRestaurantId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Pedidos ({currentRestaurant?.name || "Restaurante"})
          </h1>
          <p className="text-gray-600">Administra y actualiza el estado de los pedidos en tiempo real.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por ID, cliente, mesa o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className={`grid w-full grid-cols-3 sm:grid-cols-${TABS_CONFIG.length}`}>
          {TABS_CONFIG.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="px-2 py-1.5 text-xs sm:text-sm">
              {tab.label} ({filteredOrdersByTab[tab.value]?.length || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS_CONFIG.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(filteredOrdersByTab[tab.value] || []).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {filteredOrdersByTab[tab.value]?.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {searchTerm
                      ? "No se encontraron pedidos con esos criterios"
                      : `No hay pedidos ${tab.label.toLowerCase()}`}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm
                      ? "Intenta con otros términos o revisa otros estados."
                      : `Cuando lleguen pedidos ${tab.label.toLowerCase()}, aparecerán aquí.`}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Order Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido: {selectedOrderDetails?.id}</DialogTitle>
            <DialogDescription>
              Cliente: {selectedOrderDetails?.customerInfo}{" "}
              {selectedOrderDetails?.tableNumber ? `(Mesa ${selectedOrderDetails?.tableNumber})` : ""} <br />
              Fecha: {selectedOrderDetails && new Date(selectedOrderDetails.createdAt).toLocaleString("es-VE")} <br />
              Estado: {selectedOrderDetails && getStatusInfo(selectedOrderDetails.status).label}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh] my-4 pr-3">
            <div className="space-y-3">
              {selectedOrderDetails?.items.map((item) => (
                <div key={item.id} className="p-3 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">
                      {item.productName} x {item.quantity}
                    </p>
                    <p className="text-gray-700">${item.totalPrice.toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-gray-500">Rest: {item.restaurantName}</p>
                  {item.customizations && item.customizations.length > 0 && (
                    <p className="text-xs text-indigo-600 mt-1">
                      Personalización:{" "}
                      {item.customizations
                        .map((c) => `${c.category}: ${c.name}${c.extraCost ? ` (+$${c.extraCost})` : ""}`)
                        .join("; ")}
                    </p>
                  )}
                  {item.notes && <p className="text-xs text-red-600 mt-1">Notas: {item.notes}</p>}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="text-right font-bold text-xl text-green-600 mt-2">
            Total: ${selectedOrderDetails?.total.toFixed(2)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
