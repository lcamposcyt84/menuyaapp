"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle, Clock, CreditCard, Receipt, Utensils } from "lucide-react"
import { waiterService } from "@/lib/waiter-service"
import type { TableOrder, MobilePaymentQR } from "@/lib/waiter-types"

export function TableOrderManagement({ tableNumber }: { tableNumber: string }) {
  const [activeTab, setActiveTab] = useState("order")
  const [paymentQR, setPaymentQR] = useState<MobilePaymentQR | null>(null)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [isPaymentComplete, setIsPaymentComplete] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // En una implementación real, obtendríamos estos datos de la API
  const order: TableOrder = {
    id: "order-123",
    tableNumber: tableNumber,
    waiterId: "waiter-001",
    waiterName: "Carlos Rodríguez",
    items: [
      {
        id: "item-1",
        restaurantId: "al-andalus",
        restaurantName: "Al Andalus",
        productId: "shawarma-pollo",
        productName: "Shawarma de Pollo",
        quantity: 2,
        unitPrice: 12,
        totalPrice: 24,
        status: "ready",
        estimatedTime: 0,
      },
      {
        id: "item-2",
        restaurantId: "al-andalus",
        restaurantName: "Al Andalus",
        productId: "coca-cola",
        productName: "Coca-Cola",
        quantity: 2,
        unitPrice: 3,
        totalPrice: 6,
        status: "ready",
        estimatedTime: 0,
      },
    ],
    status: "active",
    totalAmount: 30,
    createdAt: new Date(),
  }

  const handleGeneratePaymentQR = async () => {
    setIsGeneratingQR(true)
    setError("")

    try {
      // En una implementación real, esto llamaría a la API
      const qr = await waiterService.generateMobilePaymentQR(tableNumber, order.totalAmount)
      setPaymentQR(qr)
    } catch (err) {
      setError("Error al generar el código QR de pago")
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const handleCompletePayment = async (method: "mobile_payment" | "cash" | "card") => {
    try {
      // En una implementación real, esto llamaría a la API
      const success = await waiterService.completeTablePayment(tableNumber, method)

      if (success) {
        setIsPaymentComplete(true)
        setSuccess(
          `Pago completado exitosamente con ${
            method === "mobile_payment" ? "pago móvil" : method === "cash" ? "efectivo" : "tarjeta"
          }`,
        )
      }
    } catch (err) {
      setError("Error al procesar el pago")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Listo
          </Badge>
        )
      case "preparing":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Preparando
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Pendiente
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mesa {tableNumber}</h1>
        <p className="text-muted-foreground">Gestione pedidos y pagos para esta mesa</p>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="order">Orden Actual</TabsTrigger>
          <TabsTrigger value="payment">Pago</TabsTrigger>
        </TabsList>

        <TabsContent value="order" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Detalles de la Orden</CardTitle>
                <Badge
                  variant="outline"
                  className={
                    isPaymentComplete
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }
                >
                  {isPaymentComplete ? "Pagado" : "Activo"}
                </Badge>
              </div>
              <CardDescription>
                Orden #{order.id} • Creada: {order.createdAt.toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {item.productName} {item.quantity > 1 && `(x${item.quantity})`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.restaurantName} • ${item.unitPrice.toFixed(2)} c/u
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right font-medium">${item.totalPrice.toFixed(2)}</div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Utensils className="mr-2 h-4 w-4" />
                Agregar Productos
              </Button>
              <Button onClick={() => setActiveTab("payment")} disabled={isPaymentComplete}>
                <CreditCard className="mr-2 h-4 w-4" />
                Procesar Pago
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          {isPaymentComplete ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Pago Completado
                </CardTitle>
                <CardDescription>El pago de la mesa {tableNumber} ha sido procesado exitosamente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Receipt className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <p className="text-lg font-medium">Total Pagado: ${order.totalAmount.toFixed(2)}</p>
                  <p className="text-muted-foreground">Mesa liberada para nuevos clientes</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Imprimir Recibo
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Pago</CardTitle>
                  <CardDescription>Total a pagar por la mesa {tableNumber}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="text-3xl font-bold">${order.totalAmount.toFixed(2)}</div>
                    <p className="text-muted-foreground">Total de la cuenta</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métodos de Pago</CardTitle>
                  <CardDescription>Seleccione el método de pago preferido por el cliente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={handleGeneratePaymentQR} disabled={isGeneratingQR}>
                        {isGeneratingQR ? "Generando..." : "Pago Móvil"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pago Móvil</DialogTitle>
                        <DialogDescription>
                          Muestre este código QR al cliente para que realice el pago desde su teléfono
                        </DialogDescription>
                      </DialogHeader>
                      <div className="text-center py-6">
                        {paymentQR ? (
                          <div className="space-y-4">
                            <div className="bg-gray-100 p-8 rounded-lg">
                              <div className="text-6xl">📱</div>
                              <p className="text-sm text-muted-foreground mt-2">
                                Código QR para ${paymentQR.amount.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>Válido hasta: {paymentQR.expiresAt.toLocaleTimeString()}</p>
                              <p>ID de transacción: {paymentQR.transactionId}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">
                            <Clock className="h-8 w-8 mx-auto mb-2" />
                            <p>Generando código QR...</p>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button onClick={() => handleCompletePayment("mobile_payment")} disabled={!paymentQR}>
                          Confirmar Pago Recibido
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button className="w-full" variant="outline" onClick={() => handleCompletePayment("cash")}>
                    Efectivo
                  </Button>

                  <Button className="w-full" variant="outline" onClick={() => handleCompletePayment("card")}>
                    Tarjeta de Débito/Crédito
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
