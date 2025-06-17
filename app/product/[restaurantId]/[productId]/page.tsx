import { notFound } from "next/navigation"
import { ProductCustomizer } from "@/components/product-customizer"
import { WiFiFloatingButton } from "@/components/wifi-floating-button"
import { Header } from "@/components/header"
import { restaurants } from "@/lib/data"

interface ProductPageProps {
  params: {
    restaurantId: string
    productId: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const restaurant = restaurants.find((r) => r.id === params.restaurantId)
  const product = restaurant?.menu.find((p) => p.id === params.productId)

  if (!restaurant || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <ProductCustomizer restaurant={restaurant} product={product} />
      </main>

      {/* Floating WiFi Button */}
      <WiFiFloatingButton />
    </div>
  )
}
