"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowRight, CheckCircle, Clock, CreditCard, FileText, Menu, Search, Utensils } from "lucide-react"

export function WaiterDashboard() {
  const [tableNumber, setTableNumber] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSelectTable = (e: React.FormEvent) => {
    e.preventDefault()

    if (!tableNumber.trim()) {
      setError("Por favor ingrese un número de mesa")
      return
    }

    // En una implementación real, verificaríamos si la mesa existe y está disponible
    setSuccess(`Mesa ${tableNumber} seleccionada correctamente`)

    // Limpiar mensajes después de 2 segundos y redirigir
    setTimeout(() => {
      setSuccess("")
      setError("")
      // Redirigir al mesero a la página de toma de pedidos con el número de mesa
      router.push(`/waiter/order?table=${tableNumber}`)
    }, 1000)
  }

  // Datos de ejemplo para las órdenes activas
  const activeOrders = [
    {
      id: "ORD-001",
      table: "Mesa 3",
      items: [
        { name: "Shawarma de Pollo", restaurant: "Al Andalus", status: "ready" },
        { name: "Coca-Cola", restaurant: "Al Andalus", status: "ready" },
      ],
      time: "5 min",
      status: "ready",
      totalAmount: 15.0,
      isPaid: false,
    },
    {
      id: "ORD-002",
      table: "Mesa 8",
      items: [
        { name: "Pizza Margarita", restaurant: "Pizza Jardín", status: "preparing" },
        { name: "Pasta Carbonara", restaurant: "Maacaruna", status: "pending" },
      ],
      time: "15 min",
      status: "preparing",
      totalAmount: 33.0,
      isPaid: false,
    },
    {
      id: "ORD-003",
      table: "Mesa 12",
      items: [
        { name: "Shawarma Mixto", restaurant: "Al Andalus", status: "ready" },
        { name: "Jugo Natural", restaurant: "Zona Bodegón", status: "ready" },
      ],
      time: "0 min",
      status: "ready",
      totalAmount: 18.5,
      isPaid: false,
    },
  ]

  // Datos de ejemplo para las órdenes pendientes de cobro
  const pendingPayments = [
    {
      id: "ORD-004",
      table: "Mesa 5",
      items: 3,
      totalAmount: 27.5,
      time: "45 min",
      status: "served",
    },
    {
      id: "ORD-005",
      table: "Mesa 9",
      items: 5,
      totalAmount: 42.0,
      time: "30 min",
      status: "served",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Mesero</h1>
        <p className="text-muted-foreground">Gestione pedidos y mesas de manera eficiente</p>
      </div>

      <Tabs defaultValue="new-order" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="new-order">Nuevo Pedido</TabsTrigger>
          <TabsTrigger value="active-orders">Órdenes Activas</TabsTrigger>
          <TabsTrigger value="pending-payments">Pendientes de Cobro</TabsTrigger>
          <TabsTrigger value="tables">Mesas</TabsTrigger>
        </TabsList>

        <TabsContent value="new-order" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Crear Nuevo Pedido
              </CardTitle>
              <CardDescription>Seleccione una mesa para comenzar a tomar un pedido</CardDescription>
            </CardHeader>
            <form onSubmit={handleSelectTable}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="table">Número de Mesa</Label>
                  <Input
                    id="table"
                    placeholder="Ej: 5"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 p-3 rounded-md flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 p-3 rounded-md flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>{success}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Seleccionar Mesa y Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mesas Recientes</CardTitle>
              <CardDescription>Acceda rápidamente a las mesas que ha atendido recientemente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["3", "8", "12", "15"].map((table) => (
                  <Button key={table} variant="outline" onClick={() => setTableNumber(table)}>
                    Mesa {table}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Menu className="h-5 w-5" />
                Acceso Rápido al Menú
              </CardTitle>
              <CardDescription>Explore el menú completo sin seleccionar una mesa</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Puede explorar el menú completo de todos los restaurantes para familiarizarse con los productos
                disponibles.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/waiter/menu")}>
                <Search className="mr-2 h-4 w-4" />
                Explorar Menú Completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="active-orders" className="space-y-4">
          {activeOrders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No hay órdenes activas en este momento</div>
          ) : (
            <div className="grid gap-4">
              {activeOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{order.table}</CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          order.status === "ready"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {order.status === "ready" ? "Listo para servir" : "En preparación"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Orden #{order.id} • {order.items.length} productos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div>
                            <span>{item.name}</span>
                            <span className="text-muted-foreground ml-2">({item.restaurant})</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              item.status === "ready"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : item.status === "preparing"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {item.status === "ready"
                              ? "Listo"
                              : item.status === "preparing"
                                ? "Preparando"
                                : "Pendiente"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>Tiempo estimado: {order.time}</span>
                      </div>
                      <div className="font-medium">Total: ${order.totalAmount.toFixed(2)}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/waiter/order/${order.id}`)}>
                      Ver Detalles
                    </Button>
                    <div className="flex gap-2">
                      {order.status === "ready" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Marcar como Servido
                        </Button>
                      )}
                      <Button size="sm" onClick={() => router.push(`/waiter/payment/${order.id}`)}>
                        <CreditCard className="mr-1 h-4 w-4" />
                        Cobrar
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending-payments" className="space-y-4">
          {pendingPayments.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No hay pagos pendientes en este momento</div>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800 text-sm">
                <p className="font-medium">Pedidos pendientes de cobro</p>
                <p className="mt-1">
                  Estos pedidos ya han sido servidos pero aún no se ha procesado el pago. Puede cobrarlos cuando el
                  cliente esté listo.
                </p>
              </div>

              <div className="grid gap-4">
                {pendingPayments.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{order.table}</CardTitle>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Pendiente de Cobro
                        </Badge>
                      </div>
                      <CardDescription>
                        Orden #{order.id} • {order.items} productos • Servido hace {order.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileText className="mr-1 h-4 w-4" />
                          <span>Ver detalle completo</span>
                        </div>
                        <div className="font-medium text-lg">Total: ${order.totalAmount.toFixed(2)}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => router.push(`/waiter/payment/${order.id}`)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Procesar Pago
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mesa 3</CardTitle>
                <CardDescription>Ocupada • 2 personas • 25 min</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Shawarma de Pollo</span>
                    <span>$12.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Coca-Cola</span>
                    <span>$3.00</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>$15.00</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button className="flex-1" variant="outline" onClick={() => router.push(`/waiter/order?table=3`)}>
                  Agregar Productos
                </Button>
                <Button className="flex-1" onClick={() => router.push(`/waiter/payment/ORD-001`)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Cobrar
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mesa 8</CardTitle>
                <CardDescription>Ocupada • 4 personas • 15 min</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pizza Margarita</span>
                    <span>$15.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pasta Carbonara</span>
                    <span>$14.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Agua Mineral (x2)</span>
                    <span>$4.00</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>$33.00</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button className="flex-1" variant="outline" onClick={() => router.push(`/waiter/order?table=8`)}>
                  Agregar Productos
                </Button>
                <Button className="flex-1" onClick={() => router.push(`/waiter/payment/ORD-002`)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Cobrar
                </Button>
              </CardFooter>
            </Card>

            {/* Mesas libres */}
            {[1, 2, 4, 6, 7, 9, 10, 11].map((table) => (
              <Card key={table} className="bg-gray-50/50">
                <CardHeader>
                  <CardTitle>Mesa {table}</CardTitle>
                  <CardDescription>Libre • Disponible</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-6 text-muted-foreground">
                  Mesa disponible para nuevos clientes
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={() => setTableNumber(table.toString())}>
                    Seleccionar Mesa
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
