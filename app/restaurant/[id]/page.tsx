import { EnhancedMenuGrid } from "@/components/enhanced-menu-grid"
import { Header } from "@/components/header"
import { getRestaurantById } from "@/lib/data"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RestaurantPageProps {
  params: {
    id: string
  }
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = getRestaurantById(params.id)

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="text-6xl mb-4">🍽️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurante no encontrado</h1>
              <p className="text-gray-600 mb-8">
                Lo sentimos, el restaurante que buscas no existe o no está disponible.
              </p>
              <div className="space-y-4">
                <Button asChild>
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al inicio
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <EnhancedMenuGrid restaurantId={params.id} />
      </main>
    </div>
  )
}
