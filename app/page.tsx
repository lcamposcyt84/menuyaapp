"use client"

import { Suspense, useState } from "react"
import { EnhancedHeader } from "@/components/enhanced-header"
import { EnhancedRestaurantGrid } from "@/components/enhanced-restaurant-grid"
import { PromotionsSection } from "@/components/promotions-section"
import { RestaurantGridSkeleton } from "@/components/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCustomerAuth } from "@/hooks/use-customer-auth"
import { getAvailableRestaurants } from "@/lib/data"
import { Search } from "lucide-react"
import { toast } from "sonner"
import { WiFiBannerSection } from "@/components/wifi-banner-section"
import { WiFiFloatingButton } from "@/components/wifi-floating-button"

export default function HomePage() {
  const { customer } = useCustomerAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [restaurants, setRestaurants] = useState(getAvailableRestaurants())

  const categories = ["Todos", "Árabe", "Italiana", "Pizza", "Pasta", "Mariscos", "Bebidas", "Halal", "Vegetariano"]

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      !selectedCategory || selectedCategory === "Todos" || restaurant.categories.includes(selectedCategory)

    return matchesSearch && matchesCategory
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query && filteredRestaurants.length === 0) {
      toast.info(`No se encontraron restaurantes para "${query}"`)
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <EnhancedHeader />

        <main className="container mx-auto px-4 py-8">
          {/* Promociones Section - Ubicación prominente */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl p-4 max-w-5xl mx-auto">
              <PromotionsSection />
            </div>
          </section>

          {/* Hero Section */}
          <section className="text-center py-12 mb-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Menuya
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Descubre los mejores sabores del Club Social Árabe
              </p>

              {customer && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                  <p className="text-lg">
                    ¡Bienvenido de vuelta, <span className="font-semibold">{customer.name.split(" ")[0]}</span>! 👋
                  </p>
                  {customer.preferences.favoriteRestaurants.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Tienes {customer.preferences.favoriteRestaurants.length} restaurante(s) favorito(s)
                    </p>
                  )}
                </div>
              )}

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar restaurantes, comidas..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category || (category === "Todos" && !selectedCategory)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category === "Todos" ? null : category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* WiFi Banner Section */}
          <section className="mb-12">
            <WiFiBannerSection />
          </section>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-6">
              <p className="text-muted-foreground">
                {filteredRestaurants.length > 0
                  ? `Mostrando ${filteredRestaurants.length} resultado(s) para "${searchQuery}"`
                  : `No se encontraron resultados para "${searchQuery}"`}
              </p>
            </div>
          )}

          {/* Restaurants Grid */}
          <section>
            <Suspense fallback={<RestaurantGridSkeleton />}>
              <EnhancedRestaurantGrid
                restaurants={filteredRestaurants}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            </Suspense>
          </section>

          {/* Empty State */}
          {filteredRestaurants.length === 0 && (searchQuery || selectedCategory) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No se encontraron restaurantes</h3>
              <p className="text-muted-foreground mb-4">Intenta con otros términos de búsqueda o categorías</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </main>

        {/* Floating WiFi Button */}
        <WiFiFloatingButton />
      </div>
    </ErrorBoundary>
  )
}
