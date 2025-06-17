"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Plus, Clock, CheckCircle } from "lucide-react"

export function WaiterInterface() {
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [orders] = useState([
    { id: "MYA-001", table: "Mesa 5", status: "preparing", time: "5 min", items: "Shawarma x2, Falafel x1" },
    { id: "MYA-002", table: "Mesa 12", status: "ready", time: "0 min", items: "Hummus, Tabbouleh" },
    { id: "MYA-003", table: "Mesa 8", status: "preparing", time: "12 min", items: "Kebab x3" },
  ])

  const handleTableSelect = (tableNumber: string) => {
    setSelectedTable(tableNumber)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Mesero</h1>
        <p className="text-gray-600">Gestiona pedidos y mesas de manera eficiente</p>
      </div>

      <Tabs defaultValue="new-order" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-order">Nuevo Pedido</TabsTrigger>
          <TabsTrigger value="orders">Pedidos Activos</TabsTrigger>
        </TabsList>

        <TabsContent value="new-order" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Crear Nuevo Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="table">Número de Mesa</Label>
                <Input
                  id="table"
                  type="text"
                  placeholder="Ej: Mesa 5"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                />
              </div>

              {selectedTable && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 font-medium">Mesa seleccionada: {selectedTable}</p>
                  <p className="text-green-600 text-sm mt-1">Ahora puedes proceder a seleccionar los platos del menú</p>
                </div>
              )}

              <Button className="w-full" disabled={!selectedTable} onClick={() => (window.location.href = "/")}>
                <Users className="w-4 h-4 mr-2" />
                Ir al Menú para {selectedTable}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{order.id}</span>
                        <Badge variant="outline">{order.table}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{order.items}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{order.time}</span>
                        </div>
                        <Badge
                          variant={order.status === "ready" ? "default" : "secondary"}
                          className={order.status === "ready" ? "bg-green-500" : ""}
                        >
                          {order.status === "ready" ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Listo
                            </>
                          ) : (
                            "Preparando"
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
