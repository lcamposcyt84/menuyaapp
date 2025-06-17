"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, ShoppingCart, Clock, X, ChevronRight } from "lucide-react"
import { inventoryService } from "@/lib/inventory-service"

interface QuickViewModalProps {
  item: any
  restaurant: any
  restaurantId: string
  onClose: () => void
}

export function QuickViewModal({ item, restaurant, restaurantId, onClose }: QuickViewModalProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedSides, setSelectedSides] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  const availability = inventoryService.getProductAvailability(restaurantId, item.id)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const handleSideChange = (category: string, value: string) => {
    setSelectedSides((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const calculateTotal = () => {
    try {
      let total = item.price * quantity

      // Add costs for premium sides
      Object.entries(selectedSides).forEach(([category, selectedSide]) => {
        const sideGroup = item.sides?.find((s: any) => s.category === category)
        const side = sideGroup?.options.find((o: any) => o.name === selectedSide)
        if (side?.extraCost) {
          total += side.extraCost * quantity
        }
      })

      return Number(total.toFixed(2))
    } catch (err) {
      console.error("Error calculating total:", err)
      return item.price * quantity
    }
  }

  const handleViewDetails = () => {
    router.push(`/product/${restaurantId}/${item.id}`)
    onClose()
  }

  const handleAddToCart = async () => {
    setIsProcessing(true)

    try {
      // Simulate adding to cart
      await new Promise((resolve) => setTimeout(resolve, 800))

      const orderData = {
        restaurant: restaurant.name,
        restaurantId: restaurantId,
        product: item.name,
        productId: item.id,
        quantity,
        selectedSides,
        unitPrice: item.price,
        total: calculateTotal(),
        estimatedTime: item.preparationTime || 15,
      }

      const encodedData = encodeURIComponent(JSON.stringify(orderData))
      router.push(`/checkout?data=${encodedData}`)
      onClose()
    } catch (err) {
      console.error("Error processing order:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Check if any required sides are missing
  const missingRequiredSides =
    item.sides
      ?.filter((sideGroup: any) => sideGroup.required && !selectedSides[sideGroup.category])
      .map((sideGroup: any) => sideGroup.category) || []

  const canAddToCart = missingRequiredSides.length === 0 && availability.isAvailable && restaurant.isOpen

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-0 flex justify-between items-start">
          <DialogTitle className="text-xl font-bold">{item.name}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6">
          <div className="relative h-48 -mx-6 bg-gradient-to-br from-orange-100 to-red-100">
            <Image
              src="/placeholder.svg?height=200&width=600"
              alt={item.name}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `/placeholder.svg?height=200&width=600&text=${encodeURIComponent(item.name)}`
              }}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {item.isPopular && <Badge className="bg-red-500">Popular</Badge>}
              <Badge variant="outline" className="bg-white/90">
                <Clock className="w-3 h-3 mr-1" />
                {item.preparationTime || 15} min
              </Badge>
            </div>
          </div>

          <div className="py-4">
            <p className="text-gray-600 text-sm">{item.description}</p>
            <div className="text-2xl font-bold text-green-600 mt-2">${item.price}</div>
          </div>

          {/* Required Sides Warning */}
          {missingRequiredSides.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-sm text-amber-800">
              Por favor selecciona: {missingRequiredSides.join(", ")}
            </div>
          )}

          {/* Quick Customization */}
          {item.sides && item.sides.length > 0 && (
            <div className="space-y-4 mb-4">
              {item.sides.map((sideGroup: any) => (
                <div key={sideGroup.category}>
                  <h4 className="text-sm font-medium mb-2">
                    {sideGroup.category}
                    {sideGroup.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  <RadioGroup
                    value={selectedSides[sideGroup.category] || ""}
                    onValueChange={(value) => handleSideChange(sideGroup.category, value)}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {sideGroup.options.map((option: any) => (
                        <div
                          key={option.name}
                          className={`
                            border rounded-md p-2 cursor-pointer transition-all
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
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-700">Cantidad</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isProcessing}
                className="h-8 w-8"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-lg font-medium w-6 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10 || isProcessing}
                className="h-8 w-8"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Total */}
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">Total:</span>
            <span className="text-xl font-bold text-green-600">${calculateTotal()}</span>
          </div>

          {/* Availability Status */}
          {!availability.isAvailable && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-800">
              Este producto no está disponible en este momento.
            </div>
          )}

          {!restaurant.isOpen && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-800">
              El restaurante está cerrado en este momento.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-4 border-t border-gray-100 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleViewDetails}>
            Ver detalles
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            disabled={!canAddToCart || isProcessing}
            onClick={handleAddToCart}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {!canAddToCart
                  ? missingRequiredSides.length > 0
                    ? "Completa opciones"
                    : !availability.isAvailable
                      ? "No disponible"
                      : "Restaurante cerrado"
                  : "Ordenar ahora"}
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
