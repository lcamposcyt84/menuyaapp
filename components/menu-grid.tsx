import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { restaurants } from "@/lib/data"

interface MenuGridProps {
  restaurantId: string
}

export function MenuGrid({ restaurantId }: MenuGridProps) {
  const restaurant = restaurants.find((r) => r.id === restaurantId)

  if (!restaurant) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {restaurant.menu.map((item) => (
        <Link key={item.id} href={`/product/${restaurantId}/${item.id}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardContent className="p-0">
              <div className="aspect-video relative bg-gradient-to-br from-orange-100 to-red-100 rounded-t-lg">
                <Image
                  src={`/abstract-geometric-shapes.png?height=200&width=300&query=${encodeURIComponent(item.name)}`}
                  alt={item.name}
                  fill
                  className="object-cover rounded-t-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(item.name)}`
                  }}
                />
                {item.isPopular && <Badge className="absolute top-3 left-3 bg-red-500">Popular</Badge>}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">${item.price}</span>
                  {item.sides && item.sides.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Personalizable
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
