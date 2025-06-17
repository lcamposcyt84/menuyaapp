"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, CheckCircle, Loader2, ShoppingCart, CreditCard, Smartphone } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { createOrder, type OrderItemCustomization } from "@/lib/order-service"
import { restaurants } from "@/lib/data"
import { useCustomerAuth } from "@/hooks/use-customer-auth"
import { toast } from "sonner"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  restaurantId: string
  selectedSides?: { category: string; name: string; extraCost?: number }[]
  notes?: string
}

export function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items: cartItems, clearCart, totalPrice: cartTotalPrice = 0, restaurantId: cartRestaurantId } = useCartStore()
  const { customer, addRewardPoints } = useCustomerAuth()

  const [formData, setFormData] = useState({
    name: "",
    tableNumber: "",
    paymentMethod: "pago-movil",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const currentRestaurant = cartRestaurantId ? restaurants.find((r) => r.id === cartRestaurantId) : null

  useEffect(() => {
    const table = searchParams.get("table")
    if (table) {
      setFormData((prev) => ({ ...prev, tableNumber: table }))
    }
    if (customer) {
      setFormData((prev) => ({ ...prev, name: customer.name }))
    }
  }, [searchParams, customer])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (cartItems.length === 0) {
      setError("Tu carrito está vacío.")
      return
    }
    if (!cartRestaurantId) {
      setError("Error: No se pudo determinar el restaurante.")
      return
    }
    if (!formData.tableNumber && !formData.name) {
      setError("Por favor, ingresa tu nombre o número de mesa.")
      return
    }

    setIsLoading(true)

    const orderItemsForService = cartItems.map((item: CartItem) => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
      restaurantId: item.restaurantId,
      restaurantName: currentRestaurant?.name || "Desconocido",
      customizations:
        (item.selectedSides?.map((s) => ({
          category: s.category,
          name: s.name,
          extraCost: s.extraCost,
        })) as OrderItemCustomization[]) || [],
      notes: item.notes,
      status: "pending" as const,
      id: `item-${item.id}-${Date.now()}`,
    }))

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newOrder = createOrder({
        customerInfo: formData.name || `Mesa ${formData.tableNumber}`,
        tableNumber: formData.tableNumber || undefined,
        items: orderItemsForService,
        total: cartTotalPrice || 0,
        paymentMethod: formData.paymentMethod,
        restaurantId: cartRestaurantId,
        customerId: customer?.id,
      })

      if (customer) {
        const pointsEarned = Math.floor((cartTotalPrice || 0) * 10)
        addRewardPoints(cartTotalPrice || 0)
        toast.success(`¡Has ganado ${pointsEarned} puntos por tu compra!`)
      }

      setSuccess(`¡Pedido #${newOrder.id} realizado con éxito!`)
      clearCart()

      setTimeout(() => {
        router.push(`/success?orderId=${newOrder.id}&restaurant=${cartRestaurantId}`)
      }, 2000)
    } catch (err) {
      console.error("Order creation failed:", err)
      setError("Hubo un problema al procesar tu pedido.")
    } finally {
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0 && !success) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Carrito Vacío</CardTitle>
          <CardDescription>No tienes productos en tu carrito.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">Parece que tu carrito está vacío.</p>
          <Button onClick={() => router.push("/")}>Volver al Menú Principal</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Finalizar Compra</CardTitle>
        <CardDescription>
          {currentRestaurant ? `Estás ordenando de: ${currentRestaurant.name}` : "Confirma los detalles de tu pedido."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {success && (
            <div className="bg-green-50 p-4 rounded-md flex items-center gap-3 text-green-700 border border-green-200">
              <CheckCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 p-4 rounded-md flex items-center gap-3 text-red-700 border border-red-200">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!success && (
            <>
              <div className="border rounded-lg p-4 space-y-3 bg-gray-50/50">
                <h3 className="font-semibold text-gray-800">Resumen del Pedido</h3>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start text-sm py-1 border-b border-gray-200 last:border-0"
                  >
                    <div>
                      <p className="text-gray-700">
                        {item.name} <span className="text-xs text-gray-500">x{item.quantity}</span>
                      </p>
                      {item.selectedSides && item.selectedSides.length > 0 && (
                        <p className="text-xs text-indigo-500 pl-2">
                          + {item.selectedSides.map((s) => s.name).join(", ")}
                        </p>
                      )}
                    </div>
                    <p className="text-gray-600 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center font-bold text-lg pt-2">
                  <p className="text-gray-800">Total:</p>
                  <p className="text-green-600">${(cartTotalPrice || 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Juan Pérez"
                  required
                  disabled={!!customer}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Número de Mesa (Si aplica)</Label>
                <Input
                  id="tableNumber"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleInputChange}
                  placeholder="Ej: 15"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">Método de Pago</Label>
                <RadioGroup
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="pago-movil"
                    className="flex items-center gap-3 border rounded-md p-4 hover:bg-gray-50 cursor-pointer has-[:checked]:bg-orange-50 has-[:checked]:border-orange-400 transition-all"
                  >
                    <RadioGroupItem value="pago-movil" id="pago-movil" />
                    <Smartphone className="h-5 w-5 text-orange-600" />
                    <span>Pago Móvil</span>
                  </Label>
                  <Label
                    htmlFor="tarjeta"
                    className="flex items-center gap-3 border rounded-md p-4 hover:bg-gray-50 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400 transition-all"
                  >
                    <RadioGroupItem value="tarjeta" id="tarjeta" />
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span>Tarjeta (Punto)</span>
                  </Label>
                </RadioGroup>
              </div>
            </>
          )}
        </CardContent>
        {!success && (
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || cartItems.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Realizar Pedido y Pagar"
              )}
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  )
}
