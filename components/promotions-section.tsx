"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Star, Percent, Gift } from "lucide-react"
import Link from "next/link"

export function PromotionsSection() {
  const promotions = [
    {
      id: "promo-1",
      restaurantId: "shawarma-express",
      restaurantName: "Shawarma Express",
      title: "2x1 en Shawarmas",
      description: "Lleva 2 shawarmas de pollo por el precio de 1. Válido hasta agotar existencias.",
      discount: "50%",
      validUntil: "Hoy hasta las 6 PM",
      emoji: "🥙",
      type: "limited",
    },
    {
      id: "promo-2",
      restaurantId: "pizza-corner",
      restaurantName: "Pizza Corner",
      title: "Pizza Familiar + Bebida",
      description: "Pizza familiar de cualquier sabor + bebida de 2L por solo $25",
      discount: "$5 OFF",
      validUntil: "Todo el fin de semana",
      emoji: "🍕",
      type: "combo",
    },
    {
      id: "promo-3",
      restaurantId: "burger-station",
      restaurantName: "Burger Station",
      title: "Happy Hour Burgers",
      description: "20% de descuento en todas las hamburguesas de 3 PM a 5 PM",
      discount: "20%",
      validUntil: "Lunes a Viernes",
      emoji: "🍔",
      type: "happy-hour",
    },
  ]

  const getPromoIcon = (type: string) => {
    switch (type) {
      case "limited":
        return Clock
      case "combo":
        return Gift
      case "happy-hour":
        return Star
      default:
        return Percent
    }
  }

  const getPromoColor = (type: string) => {
    switch (type) {
      case "limited":
        return "bg-red-500"
      case "combo":
        return "bg-blue-500"
      case "happy-hour":
        return "bg-purple-500"
      default:
        return "bg-orange-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">🍽️ Ofertas Especiales</h2>
        <p className="text-sm text-gray-600">Deliciosos platos en promoción</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promotions.map((promo) => {
          const PromoIcon = getPromoIcon(promo.type)
          const promoColor = getPromoColor(promo.type)

          return (
            <Card
              key={promo.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md"
            >
              <CardContent className="p-0">
                <div className="relative h-32">
                  <img
                    src={`/placeholder.svg?height=128&width=300&query=${promo.title.toLowerCase().replace(/\s+/g, "-")}-food-dish`}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-2 right-2 ${promoColor} text-white px-2 py-1 rounded-full text-xs font-bold`}
                  >
                    {promo.discount}
                  </div>
                  <div className="absolute top-2 left-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                    <PromoIcon className="w-3 h-3 text-gray-700" />
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm">{promo.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{promo.restaurantName}</p>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{promo.description}</p>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{promo.validUntil}</span>
                    </div>
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      Oferta
                    </Badge>
                  </div>

                  <Button asChild size="sm" className="w-full text-xs">
                    <Link href={`/restaurant/${promo.restaurantId}`}>Ver Menú</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">Promociones sujetas a disponibilidad</p>
      </div>
    </div>
  )
}
