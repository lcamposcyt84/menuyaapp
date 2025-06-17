"use client"

import React, { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Star, Flame, ShoppingCart, AlertCircle, Search, ChevronDown, Filter, Sparkles } from "lucide-react"
import { getRestaurantById, getAvailableMenuItems } from "@/lib/data"
import { useCartStore } from "@/store/cart-store"
import { toast } from "sonner"
import type { Product } from "@/types/product" // Import Product type
import { subscribeToProducts } from "@/lib/subscription" // Import subscribeToProducts function

interface EnhancedMenuGridProps {
  restaurantId: string
}

export function EnhancedMenuGrid({ restaurantId }: EnhancedMenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sortOrder, setSortOrder] = useState<"popular" | "price-asc" | "price-desc" | "name">("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [menuItems, setMenuItems] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const addToCart = useCartStore((state) => state.addToCart)

  const restaurant = useMemo(() => {
    try {
      return getRestaurantById(restaurantId)
    } catch (err) {
      setError("Error al cargar el restaurante")
      return null
    }
  }, [restaurantId])

  const items = useMemo(() => {
    if (!restaurant) return []
    try {
      return getAvailableMenuItems(restaurantId)
    } catch (err) {
      setError("Error al cargar el menú")
      return []
    }
  }, [restaurant, restaurantId])

  // Extract all unique categories from menu items
  const categories = useMemo(() => {
    const allCategories = new Set<string>(["Todos"])

    // Add some common food categories if they exist in the items
    const commonCategories = ["Entradas", "Platos Principales", "Postres", "Bebidas"]
    commonCategories.forEach((cat) => {
      if (
        items.some(
          (item) =>
            item.description.toLowerCase().includes(cat.toLowerCase()) ||
            item.name.toLowerCase().includes(cat.toLowerCase()),
        )
      ) {
        allCategories.add(cat)
      }
    })

    return Array.from(allCategories)
  }, [items])

  // Filter and sort items based on all criteria
  const filteredItems = useMemo(() => {
    let items = menuItems

    // Category filter
    if (selectedCategory !== "Todos") {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          item.description.toLowerCase().includes(selectedCategory.toLowerCase()),
      )
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        (item) => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query),
      )
    }

    // Sort
    switch (sortOrder) {
      case "popular":
        return items.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
      case "price-asc":
        return items.sort((a, b) => a.price - b.price)
      case "price-desc":
        return items.sort((a, b) => b.price - a.price)
      case "name":
        return items.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return items
    }
  }, [menuItems, selectedCategory, searchQuery, sortOrder])

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("Todos")
    setSearchQuery("")
    setSortOrder("popular")
    setShowFilters(false)
  }

  useEffect(() => {
    // Initial fetch
    setMenuItems(getAvailableMenuItems(restaurantId))

    // Subscribe to future product changes (e.g., admin adds a new product)
    const unsubscribe = subscribeToProducts(() => {
      console.log("Product list updated, refetching menu...")
      setMenuItems(getAvailableMenuItems(restaurantId))
    })

    // Cleanup subscription on component unmount
    return () => unsubscribe()
  }, [restaurantId])

  const handleAddToCart = (product: Product) => {
    addToCart(product, restaurantId)
    toast.success(`${product.name} added to cart!`)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar el menú</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Restaurante no encontrado</h3>
        <p className="text-gray-600 mb-4">El restaurante que buscas no existe o no está disponible</p>
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Restaurant Info Banner Skeleton */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500/30 to-red-500/30 animate-pulse h-48"></div>

        {/* Search Skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>

        {/* Menu Items Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Restaurant Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl">
              {restaurant.emoji}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <p className="text-white/90">{restaurant.description}</p>
              {restaurant.openHours && <p className="text-white/80 text-sm mt-1">Horario: {restaurant.openHours}</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{restaurant.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating} (120+ reseñas)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>{menuItems.length} platos disponibles</span>
            </div>
            {!restaurant.isOpen && (
              <Badge variant="destructive" className="bg-red-600">
                Cerrado
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar platos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className="rounded-full text-xs h-7"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-700">Ordenar por</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={sortOrder === "popular" ? "default" : "outline"}
                    size="sm"
                    className="rounded-full text-xs h-7"
                    onClick={() => setSortOrder("popular")}
                  >
                    Populares
                  </Button>
                  <Button
                    variant={sortOrder === "price-asc" ? "default" : "outline"}
                    size="sm"
                    className="rounded-full text-xs h-7"
                    onClick={() => setSortOrder("price-asc")}
                  >
                    Precio ↑
                  </Button>
                  <Button
                    variant={sortOrder === "price-desc" ? "default" : "outline"}
                    size="sm"
                    className="rounded-full text-xs h-7"
                    onClick={() => setSortOrder("price-desc")}
                  >
                    Precio ↓
                  </Button>
                </div>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  Restablecer filtros
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Menu Items Display */}
      {filteredItems.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <MenuItemCard
                key={item.id}
                item={item}
                restaurant={restaurant}
                restaurantId={restaurantId}
                index={index}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay platos disponibles</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? `No se encontraron resultados para "${searchQuery}"`
              : selectedCategory !== "Todos"
                ? "No hay platos en esta categoría"
                : "Este restaurante no tiene platos disponibles en este momento"}
          </p>
          <Button onClick={resetFilters}>Ver todos los platos</Button>
        </motion.div>
      )}
    </div>
  )
}

// Menu Item Card Component
const MenuItemCard = React.memo(function MenuItemCard({ item, restaurant, restaurantId, index, handleAddToCart }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100">
            <Image
              src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(item.name)}`}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {item.isPopular && (
                <Badge className="bg-red-500 text-white shadow-lg">
                  <Flame className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                <span className="text-xl font-bold text-green-600">${item.price}</span>
              </div>
            </div>
          </div>

          <Link href={`/product/${restaurantId}/${item.id}`} className="block">
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-3">
                {item.preparationTime && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.preparationTime} min
                  </div>
                )}
                {item.sides && item.sides.length > 0 && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {item.sides.length} opciones
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all"
                  disabled={!restaurant.isOpen}
                  onClick={() => (restaurant.isOpen ? handleAddToCart(item) : null)}
                >
                  {!restaurant.isOpen ? "Restaurante cerrado" : "Ordenar ahora"}
                </Button>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
})
