"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Star, Utensils, ArrowRight, AlertCircle } from "lucide-react"
import { getAvailableRestaurants } from "@/lib/data"

export function EnhancedRestaurantGrid() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const restaurants = useMemo(() => {
    try {
      return getAvailableRestaurants()
    } catch (err) {
      setError("Error al cargar los restaurantes")
      return []
    }
  }, [])

  const categories = useMemo(() => {
    const allCategories = ["Todos"]
    restaurants.forEach((restaurant) => {
      restaurant.categories.forEach((category) => {
        if (!allCategories.includes(category)) {
          allCategories.push(category)
        }
      })
    })
    return allCategories
  }, [restaurants])

  const filteredRestaurants = useMemo(() => {
    if (selectedCategory === "Todos") return restaurants
    return restaurants.filter((restaurant) => restaurant.categories.includes(selectedCategory))
  }, [restaurants, selectedCategory])

  const featuredRestaurant = restaurants.find((r) => r.id === "al-andalus") || restaurants[0]

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar restaurantes</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay restaurantes disponibles</h3>
        <p className="text-gray-600">Por favor, intenta más tarde</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Featured Restaurant - Al Andalus */}
      {featuredRestaurant && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl" />
          <Card className="relative overflow-hidden border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full bg-gradient-to-br from-orange-100 to-red-100">
                  <Image
                    src={`/abstract-geometric-shapes.png?height=300&width=400&query=${encodeURIComponent(featuredRestaurant.name + " exterior")}`}
                    alt={featuredRestaurant.name}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(featuredRestaurant.name)}`
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">⭐ Destacado</Badge>
                  </div>
                  {!featuredRestaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        Cerrado
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-4xl">{featuredRestaurant.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{featuredRestaurant.name}</h3>
                      <p className="text-gray-600">{featuredRestaurant.description}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Disfruta de los mejores shawarmas y pizzas árabes de la ciudad con ingredientes frescos y recetas
                    tradicionales.
                  </p>
                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredRestaurant.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{featuredRestaurant.rating} (120+ reseñas)</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-fit bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    disabled={!featuredRestaurant.isOpen}
                  >
                    <Link href={`/restaurant/${featuredRestaurant.id}`}>
                      {featuredRestaurant.isOpen ? "Ver Menú" : "Cerrado"}
                      {featuredRestaurant.isOpen && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === selectedCategory ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setSelectedCategory(category)}
            disabled={isLoading}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.map((restaurant) => (
          <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
            <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer h-full overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100">
                  <Image
                    src={`/abstract-geometric-shapes.png?height=200&width=300&query=${encodeURIComponent(restaurant.name + " plato principal")}`}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(restaurant.name)}`
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-2xl">
                      {restaurant.emoji}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {restaurant.rating}
                    </Badge>
                    {!restaurant.isOpen && (
                      <Badge variant="destructive" className="bg-red-500/90 backdrop-blur-sm">
                        Cerrado
                      </Badge>
                    )}
                  </div>
                  {!restaurant.isOpen && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-semibold">Cerrado</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{restaurant.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Utensils className="w-4 h-4" />
                      <span>{restaurant.menu?.length || 0} platos</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.categories.slice(0, 3).map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs bg-orange-50 text-orange-700 hover:bg-orange-100"
                      >
                        {category}
                      </Badge>
                    ))}
                    {restaurant.categories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{restaurant.categories.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Desde{" "}
                      <span className="font-semibold text-green-600">
                        ${Math.min(...(restaurant.menu?.map((item) => item.price) || [0]))}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 group-hover:shadow-lg transition-all"
                      disabled={!restaurant.isOpen}
                    >
                      {restaurant.isOpen ? "Ver Menú" : "Cerrado"}
                      {restaurant.isOpen && <ArrowRight className="w-3 h-3 ml-1" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredRestaurants.length === 0 && selectedCategory !== "Todos" && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Utensils className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay restaurantes en esta categoría</h3>
          <p className="text-gray-600 mb-4">Intenta con otra categoría</p>
          <Button onClick={() => setSelectedCategory("Todos")}>Ver todos los restaurantes</Button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
          <div className="text-3xl font-bold text-orange-600 mb-1">{restaurants.length}+</div>
          <div className="text-sm text-gray-600">Restaurantes</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {restaurants.reduce((total, r) => total + (r.menu?.length || 0), 0)}+
          </div>
          <div className="text-sm text-gray-600">Platos Disponibles</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div className="text-3xl font-bold text-blue-600 mb-1">15min</div>
          <div className="text-sm text-gray-600">Tiempo Promedio</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {(restaurants.reduce((total, r) => total + r.rating, 0) / restaurants.length).toFixed(1)}⭐
          </div>
          <div className="text-sm text-gray-600">Calificación Promedio</div>
        </div>
      </div>
    </div>
  )
}
