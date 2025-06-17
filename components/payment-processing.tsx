"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, CheckCircle, CreditCard, Receipt, Smartphone, Wallet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function PaymentProcessing({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("mobile")
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaymentComplete, setIsPaymentComplete] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // En una implementación real, obtendríamos estos datos de la API
  const order = {
    id: orderId,
    tableNumber: "5",
    items: [
      { id: "item-1", name: "Shawarma de Pollo", restaurant: "Al Andalus", quantity: 2, price: 12, total: 24 },
      { id: "item-2", name: "Coca-Cola", restaurant: "Zona Bodegón", quantity: 2, price: 3, total: 6 },
    ],
    totalAmount: 30,
    status: "active",
  }

  const handleProcessPayment = (method: "mobile" | "cash" | "card") => {
    setIsProcessing(true)
    setError("")

    // En una implementación real, esto llamaría a la API
    setTimeout(() => {
      setIsProcessing(false)
      setIsPaymentComplete(true)
      setSuccess(
        `Pago procesado correctamente con ${
          method === "mobile" ? "pago móvil" : method === "cash" ? "efectivo" : "tarjeta"
        }`,
      )

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/waiter/dashboard")
      }, 2000)
    }, 1500)
  }

  const handleGenerateQR = () => {
    setShowQRDialog(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.push("/waiter/dashboard")} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Procesar Pago</h1>
        <p className="text-muted-foreground">
          Orden #{orderId} - Mesa {order.tableNumber}
        </p>
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

      {isPaymentComplete ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Pago Completado
            </CardTitle>
            <CardDescription>El pago de la mesa {order.tableNumber} ha sido procesado exitosamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Receipt className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <p className="text-lg font-medium">Total Pagado: ${order.totalAmount.toFixed(2)}</p>
              <p className="text-muted-foreground">Mesa liberada para nuevos clientes</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="w-full max-w-xs" variant="outline" onClick={() => router.push("/waiter/dashboard")}>
              Volver al Dashboard
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de la Orden</CardTitle>
                <CardDescription>Detalles de los productos ordenados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between pb-2 border-b">
                      <div>
                        <p className="font-medium">
                          {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                        </p>
                        <p className="text-sm text-muted-foreground">{item.restaurant}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} c/u</p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>Seleccione el método de pago preferido</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="mobile">Móvil</TabsTrigger>
                    <TabsTrigger value="cash">Efectivo</TabsTrigger>
                    <TabsTrigger value="card">Tarjeta</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mobile" className="pt-4">
                    <div className="text-center space-y-4">
                      <Smartphone className="h-12 w-12 mx-auto text-blue-600" />
                      <div>
                        <h3 className="font-medium">Pago Móvil</h3>
                        <p className="text-sm text-muted-foreground">
                          Genere un código QR para que el cliente escanee y pague desde su teléfono
                        </p>
                      </div>
                      <Button className="w-full" onClick={handleGenerateQR}>
                        Generar Código QR
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="cash" className="pt-4">
                    <div className="text-center space-y-4">
                      <Wallet className="h-12 w-12 mx-auto text-green-600" />
                      <div>
                        <h3 className="font-medium">Efectivo</h3>
                        <p className="text-sm text-muted-foreground">
                          Confirme el pago en efectivo recibido del cliente
                        </p>
                      </div>
                      <Button className="w-full" onClick={() => handleProcessPayment("cash")} disabled={isProcessing}>
                        {isProcessing ? "Procesando..." : "Confirmar Pago en Efectivo"}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="card" className="pt-4">
                    <div className="text-center space-y-4">
                      <CreditCard className="h-12 w-12 mx-auto text-purple-600" />
                      <div>
                        <h3 className="font-medium">Tarjeta de Débito/Crédito</h3>
                        <p className="text-sm text-muted-foreground">
                          Confirme el pago con tarjeta procesado por el punto de venta
                        </p>
                      </div>
                      <Button className="w-full" onClick={() => handleProcessPayment("card")} disabled={isProcessing}>
                        {isProcessing ? "Procesando..." : "Confirmar Pago con Tarjeta"}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <div className="w-full text-center text-sm text-muted-foreground">
                  Total a cobrar: <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pago Móvil</DialogTitle>
            <DialogDescription>
              Muestre este código QR al cliente para que realice el pago desde su teléfono
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="bg-gray-100 p-8 rounded-lg mx-auto max-w-[200px]">
              <div className="text-6xl">📱</div>
              <p className="text-sm text-muted-foreground mt-2">Código QR para ${order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="text-sm text-muted-foreground mt-4">
              <p>Válido hasta: {new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString()}</p>
              <p>ID de transacción: MENUYA-{orderId}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowQRDialog(false)
                handleProcessPayment("mobile")
              }}
              disabled={isProcessing}
            >
              {isProcessing ? "Procesando..." : "Confirmar Pago Recibido"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
