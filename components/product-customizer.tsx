"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Minus, Plus, ShoppingCart, AlertCircle, Clock, Heart, Share2, ArrowLeft, Star } from "lucide-react"
import type { Restaurant, MenuItem } from "@/lib/data"
import { inventoryService } from "@/lib/inventory-service"

interface ProductCustomizerProps {
  restaurant: Restaurant
  product: MenuItem
}

export function ProductCustomizer({ restaurant, product }: ProductCustomizerProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedSides, setSelectedSides] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inventoryStatus, setInventoryStatus] = useState<any>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("customize")

  useEffect(() => {
    try {
      const status = inventoryService.getProductAvailability(restaurant.id, product.id)
      setInventoryStatus(status)
    } catch (error) {
      console.error("Error getting product availability:", error)
      // Set default availability if service fails
      setInventoryStatus({
        isAvailable: true,
        reason: "available",
        availableQuantity: 10,
        isManuallyEnabled: true,
      })
    }

    // Initialize required sides with first option
    if (product.sides) {
      const initialSides: Record<string, string> = {}
      product.sides.forEach((sideGroup) => {
        if (sideGroup.required && sideGroup.options.length > 0) {
          initialSides[sideGroup.category] = sideGroup.options[0].name
        }
      })
      setSelectedSides(initialSides)
    }
  }, [restaurant.id, product.id, product.sides])

  // Validate required sides
  const missingRequiredSides = useMemo(() => {
    if (!product.sides) return []
    return product.sides
      .filter((sideGroup) => sideGroup.required && !selectedSides[sideGroup.category])
      .map((sideGroup) => sideGroup.category)
  }, [product.sides, selectedSides])

  const canPurchase = useMemo(() => {
    return (
      missingRequiredSides.length === 0 &&
      product.available !== false &&
      restaurant.isOpen !== false &&
      quantity > 0 &&
      inventoryStatus?.isAvailable !== false
    )
  }, [missingRequiredSides, product.available, restaurant.isOpen, quantity, inventoryStatus])

  const handleSideChange = (category: string, value: string) => {
    setSelectedSides((prev) => ({
      ...prev,
      [category]: value,
    }))
    setError(null)
  }

  const calculateTotal = () => {
    try {
      let total = product.price * quantity

      // Add costs for premium sides
      Object.entries(selectedSides).forEach(([category, selectedSide]) => {
        const sideGroup = product.sides?.find((s) => s.category === category)
        const side = sideGroup?.options.find((o) => o.name === selectedSide)
        if (side?.extraCost) {
          total += side.extraCost * quantity
        }
      })

      return Number(total.toFixed(2))
    } catch (err) {
      console.error("Error calculating total:", err)
      return product.price * quantity
    }
  }

  const handlePurchase = async () => {
    if (!canPurchase) {
      setError("Por favor completa todas las opciones requeridas")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const orderData = {
        restaurant: restaurant.name,
        restaurantId: restaurant.id,
        product: product.name,
        productId: product.id,
        quantity,
        selectedSides,
        unitPrice: product.price,
        total: calculateTotal(),
        estimatedTime: product.preparationTime || 15,
      }

      // Validate order data
      if (!orderData.restaurant || !orderData.product || orderData.total <= 0) {
        throw new Error("Datos de pedido inválidos")
      }

      // Try to decrement stock
      const stockDecremented = inventoryService.decrementStock(restaurant.id, product.id, quantity)
      if (!stockDecremented) {
        throw new Error("No hay suficiente stock disponible")
      }

      const encodedData = encodeURIComponent(JSON.stringify(orderData))
      router.push(`/checkout?data=${encodedData}`)
    } catch (err) {
      console.error("Error processing order:", err)
      setError(err instanceof Error ? err.message : "Error al procesar el pedido. Por favor intenta de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `¡Mira este delicioso ${product.name} en ${restaurant.name}!`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error al compartir:", err))
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("¡Enlace copiado al portapapeles!")
    }
  }

  if (!product.available) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no disponible</h2>
            <p className="text-gray-600 mb-6">Este producto no está disponible en este momento</p>
            <Button onClick={() => router.back()}>Volver al menú</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!restaurant.isOpen) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurante cerrado</h2>
            <p className="text-gray-600 mb-2">{restaurant.name} está cerrado en este momento</p>
            {restaurant.openHours && <p className="text-gray-500 mb-6">Horario: {restaurant.openHours}</p>}
            <Button onClick={() => router.back()}>Volver al menú</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-600"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al menú
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500"}`}
              onClick={toggleFavorite}
              aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:text-gray-500"
              onClick={handleShare}
              aria-label="Compartir producto"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-0 shadow-xl">
          <CardContent className="p-0">
            <div className="aspect-video relative bg-gradient-to-br from-orange-100 to-red-100">
              <Image
                src={`/placeholder.svg?height=400&width=800&text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isPopular && <Badge className="bg-red-500">Popular</Badge>}
                <Badge variant="outline" className="bg-white/90">
                  <Clock className="w-3 h-3 mr-1" />
                  {product.preparationTime || 15} min
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                  <div className="text-3xl font-bold text-green-600">${product.price}</div>
                </div>
                <div className="flex items-center gap-2 mt-1 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                  <span className="text-sm text-gray-500">(120+ reseñas)</span>
                </div>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {inventoryStatus && !inventoryStatus.isAvailable && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {inventoryStatus.reason === "out_of_stock" && "Producto agotado temporalmente"}
                    {inventoryStatus.reason === "manually_disabled" && "Producto no disponible en este momento"}
                    {inventoryStatus.reason === "both_disabled" && "Producto agotado y no disponible"}
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="customize">Personalizar</TabsTrigger>
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                </TabsList>

                <TabsContent value="customize" className="pt-4">
                  {missingRequiredSides.length > 0 && (
                    <Alert className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Por favor selecciona: {missingRequiredSides.join(", ")}</AlertDescription>
                    </Alert>
                  )}

                  {product.sides && product.sides.length > 0 && (
                    <div className="space-y-6 mb-6">
                      {product.sides.map((sideGroup) => (
                        <div key={sideGroup.category} className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                            {sideGroup.category}
                            {sideGroup.required && <span className="text-red-500 ml-1">*</span>}
                          </h3>
                          <RadioGroup
                            value={selectedSides[sideGroup.category] || ""}
                            onValueChange={(value) => handleSideChange(sideGroup.category, value)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-2"
                          >
                            {sideGroup.options.map((option) => (
                              <div
                                key={option.name}
                                className={`
                                  border rounded-md p-3 cursor-pointer transition-all
                                  ${
                                    selectedSides[sideGroup.category] === option.name
                                      ? "border-orange-500 bg-orange-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }
                                `}
                                onClick={() => handleSideChange(sideGroup.category, option.name)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <RadioGroupItem value={option.name} id={`${sideGroup.category}-${option.name}`} />
                                    <Label htmlFor={`${sideGroup.category}-${option.name}`} className="cursor-pointer">
                                      {option.name}
                                    </Label>
                                  </div>
                                  {option.extraCost && (
                                    <span className="text-green-600 text-sm font-medium">+${option.extraCost}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="pt-4">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Información del producto</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Tiempo de preparación:</span>
                          <p className="font-medium">{product.preparationTime || 15} minutos</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Categoría:</span>
                          <p className="font-medium">{product.category || "Plato principal"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Disponibilidad:</span>
                          <p
                            className={`font-medium ${inventoryStatus?.isAvailable ? "text-green-600" : "text-red-600"}`}
                          >
                            {inventoryStatus?.isAvailable ? "Disponible" : "No disponible"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <p className="font-medium">{inventoryStatus?.availableQuantity || 0} unidades</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Restaurante</h3>
                      <p className="text-sm text-gray-600 mb-2">{restaurant.name}</p>
                      <p className="text-sm text-gray-500">{restaurant.description}</p>
                      {restaurant.openHours && (
                        <p className="text-sm text-gray-500 mt-1">Horario: {restaurant.openHours}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-lg p-4">
                <span className="font-medium text-gray-700">Cantidad</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || isProcessing}
                    className="h-8 w-8"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-lg font-medium w-6 text-center" aria-live="polite">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10 || isProcessing}
                    className="h-8 w-8"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 p-4 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Total:</span>
                <span className="text-2xl font-bold text-green-600">${calculateTotal()}</span>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all"
                disabled={!canPurchase || isProcessing}
                onClick={handlePurchase}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    {!canPurchase
                      ? missingRequiredSides.length > 0
                        ? "Completa las opciones requeridas"
                        : !inventoryStatus?.isAvailable
                          ? "No disponible"
                          : "Restaurante cerrado"
                      : "Ordenar ahora"}
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
