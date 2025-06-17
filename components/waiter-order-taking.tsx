"use client"

import { useState, useEffect, useMemo } from "react"
import {
  useRouter,
  useSearchParams, // Added useSearchParams
} from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  MinusCircle,
  PlusCircle,
  Save,
  ShoppingCart,
  SearchIcon,
  Trash2,
} from "lucide-react"
import Image from "next/image"
import { restaurants as allRestaurants, getAvailableMenuItems, type MenuItem as LibMenuItem } from "@/lib/data"
import { createOrder, type OrderItemCustomization } from "@/lib/order-service"

interface CartItemLocal {
  id: string // Product ID
  name: string
  price: number
  quantity: number
  image?: string
  restaurantId: string
  restaurantName: string
  customizations?: OrderItemCustomization[]
  notes?: string
  total: number // price * quantity + customization costs
}

export function WaiterOrderTaking() {
  const router = useRouter()
  const searchParamsHook = useSearchParams() // Renamed hook variable
  const tableNumber = searchParamsHook.get("table") || "Sin Mesa"

  const [activeRestaurantTab, setActiveRestaurantTab] = useState(allRestaurants[0]?.id || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItemLocal[]>([])
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [menuItemsByRestaurant, setMenuItemsByRestaurant] = useState<Record<string, LibMenuItem[]>>({})

  useEffect(() => {
    const loadedItems: Record<string, LibMenuItem[]> = {}
    allRestaurants.forEach((r) => {
      loadedItems[r.id] = getAvailableMenuItems(r.id)
    })
    setMenuItemsByRestaurant(loadedItems)
    if (!activeRestaurantTab && allRestaurants.length > 0) {
      setActiveRestaurantTab(allRestaurants[0].id)
    }
  }, [activeRestaurantTab])

  const addToCart = (item: LibMenuItem, restaurantId: string, restaurantName: string) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id && cartItem.restaurantId === restaurantId,
    )

    const newCart = [...cart]
    if (existingItemIndex > -1) {
      newCart[existingItemIndex].quantity += 1
      newCart[existingItemIndex].total = newCart[existingItemIndex].quantity * newCart[existingItemIndex].price // Recalculate total
    } else {
      newCart.push({
        ...item,
        quantity: 1,
        total: item.price, // Initial total
        restaurantId,
        restaurantName,
        customizations: [], // Add customizations later if needed
      })
    }
    setCart(newCart)
  }

  const updateCartItemQuantity = (itemId: string, restaurantId: string, change: number) => {
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex((i) => i.id === itemId && i.restaurantId === restaurantId)
      if (itemIndex === -1) return prevCart

      const updatedCart = [...prevCart]
      const currentItem = updatedCart[itemIndex]
      const newQuantity = currentItem.quantity + change

      if (newQuantity <= 0) {
        updatedCart.splice(itemIndex, 1) // Remove if quantity is 0 or less
      } else {
        updatedCart[itemIndex] = {
          ...currentItem,
          quantity: newQuantity,
          total: newQuantity * currentItem.price, // Recalculate total
        }
      }
      return updatedCart
    })
  }

  const deleteFromCart = (itemId: string, restaurantId: string) => {
    setCart(cart.filter((item) => !(item.id === itemId && item.restaurantId === restaurantId)))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.total, 0)
  }

  const handleSubmitOrder = async (payNow: boolean) => {
    if (cart.length === 0) {
      setError("No hay productos en el carrito")
      return
    }
    setError("")
    setSuccess("")

    const orderItemsForService = cart.map((item) => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.total,
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      customizations: item.customizations || [],
      notes: item.notes,
      status: "pending" as const,
      id: `waiteritem-${item.id}-${Date.now()}`,
    }))

    // For waiter orders, all items might be for different restaurants,
    // but the order itself is associated with the waiter/table, not one restaurant.
    // However, our `createOrder` expects a single `restaurantId`.
    // This needs a decision:
    // 1. Create separate orders per restaurant in the cart.
    // 2. Assign the order to a "central" or the waiter's primary restaurant.
    // For now, let's assume the waiter is associated with one primary restaurant or we pick the first one.
    const primaryRestaurantId = cart.length > 0 ? cart[0].restaurantId : allRestaurants[0]?.id
    if (!primaryRestaurantId) {
      setError("No se pudo determinar el restaurante para el pedido.")
      return
    }

    try {
      const newOrder = createOrder({
        customerInfo: `Atendido por Mesero`,
        tableNumber: tableNumber !== "Sin Mesa" ? tableNumber : undefined,
        items: orderItemsForService,
        total: getTotalAmount(),
        paymentMethod: payNow ? "Pago Inmediato (Mesero)" : "Pago en Mesa (Mesero)",
        restaurantId: primaryRestaurantId, // This might need adjustment based on business logic
        waiterId: "current_waiter_id_placeholder", // Replace with actual waiter ID from auth
      })

      setSuccess(
        payNow
          ? `Pedido ${newOrder.id} enviado. Redirigiendo al pago...`
          : `Pedido ${newOrder.id} guardado. Podrá cobrarlo más tarde.`,
      )
      setCart([])

      setTimeout(() => {
        setSuccess("")
        setError("")
        if (payNow) {
          router.push(`/waiter/payment/${newOrder.id}?table=${tableNumber}`)
        } else {
          router.push("/waiter/dashboard")
        }
      }, 2000)
    } catch (e) {
      console.error("Failed to create order:", e)
      setError("Error al crear el pedido. Intente de nuevo.")
    }
  }

  const currentRestaurantMenuItems = useMemo(() => {
    const items = menuItemsByRestaurant[activeRestaurantTab] || []
    if (!searchQuery) return items
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [menuItemsByRestaurant, activeRestaurantTab, searchQuery])

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.push("/waiter/dashboard")} className="mb-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tomar Pedido - Mesa {tableNumber}</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Seleccione productos de cualquier restaurante para esta mesa
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Badge variant="outline" className="text-base py-1.5 px-3">
            {cart.length} prod.
          </Badge>
          <Badge variant="default" className="text-base py-1.5 px-3">
            ${getTotalAmount().toFixed(2)}
          </Badge>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 p-3 rounded-md flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-300 p-3 rounded-md flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle className="h-4 w-4" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Menú de Restaurantes</CardTitle>
              <div className="mt-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar productos en el restaurante actual..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeRestaurantTab} onValueChange={setActiveRestaurantTab}>
                <TabsList className="w-full justify-start px-4 sm:px-6 pt-2 pb-0 overflow-x-auto flex-nowrap bg-gray-50 rounded-t-md">
                  {allRestaurants.map((restaurant) => (
                    <TabsTrigger
                      key={restaurant.id}
                      value={restaurant.id}
                      className="whitespace-nowrap text-sm px-3 py-2"
                    >
                      {restaurant.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {allRestaurants.map((restaurant) => (
                  <TabsContent key={restaurant.id} value={restaurant.id} className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {currentRestaurantMenuItems.length === 0 && searchQuery && (
                        <p className="sm:col-span-2 xl:col-span-3 text-muted-foreground text-center py-4">
                          No se encontraron productos para "{searchQuery}".
                        </p>
                      )}
                      {currentRestaurantMenuItems.length === 0 && !searchQuery && (
                        <p className="sm:col-span-2 xl:col-span-3 text-muted-foreground text-center py-4">
                          Este restaurante no tiene productos disponibles o no se cargaron.
                        </p>
                      )}
                      {currentRestaurantMenuItems.map((item) => (
                        <Card
                          key={item.id}
                          className={`transition-opacity ${!item.available ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
                        >
                          <CardContent className="p-3 flex items-center gap-3">
                            <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-100">
                              <Image
                                src={
                                  item.image ||
                                  `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(item.name)}`
                                }
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                              {!item.available && (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mt-1 text-xs">
                                  No disponible
                                </Badge>
                              )}
                            </div>
                            {item.available && (
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => addToCart(item, restaurant.id, restaurant.name)}
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <span>Pedido Actual</span>
                <Badge variant="secondary" className="text-sm">
                  Mesa {tableNumber}
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                {cart.length === 0 ? "Agregue productos al pedido" : `${cart.length} tipo(s) de producto en el pedido`}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
              {" "}
              {/* Adjusted max height */}
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">El pedido está vacío</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.restaurantId}`}
                      className="flex items-start justify-between pb-2 border-b last:border-b-0"
                    >
                      <div className="flex-1 mr-2">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.restaurantName}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-muted-foreground hover:bg-gray-200"
                            onClick={() => updateCartItemQuantity(item.id, item.restaurantId, -1)}
                          >
                            <MinusCircle className="h-3.5 w-3.5" />
                          </Button>
                          <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-muted-foreground hover:bg-gray-200"
                            onClick={() => updateCartItemQuantity(item.id, item.restaurantId, 1)}
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">${item.total.toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 mt-0.5"
                          onClick={() => deleteFromCart(item.id, item.restaurantId)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Quitar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {cart.length > 0 && (
              <CardFooter className="flex-col space-y-3 pt-3 border-t">
                <div className="w-full flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button variant="outline" className="w-full" onClick={() => handleSubmitOrder(false)}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </Button>
                  <Button className="w-full" onClick={() => handleSubmitOrder(true)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Cobrar
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
