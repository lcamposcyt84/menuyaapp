"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search } from "lucide-react"
import Image from "next/image"

export function WaiterMenuExplorer() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("al-andalus")
  const [searchQuery, setSearchQuery] = useState("")

  // Datos de ejemplo para los restaurantes
  const restaurants = [
    { id: "al-andalus", name: "Al Andalus", category: "Comida Árabe" },
    { id: "muna", name: "Muna", category: "Pinchos Árabes" },
    { id: "pizza-jardin", name: "Pizza Jardín", category: "Italiana/Mariscos" },
    { id: "maacaruna", name: "Maacaruna", category: "Pastas Italianas" },
    { id: "zona-bodegon", name: "Zona Bodegón", category: "Bebidas/Snacks" },
  ]

  // Datos de ejemplo para los productos
  const menuItems = {
    "al-andalus": [
      {
        id: "shawarma-pollo",
        name: "Shawarma de Pollo",
        price: 12.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Delicioso shawarma de pollo con salsa de ajo y vegetales frescos",
      },
      {
        id: "shawarma-mixto",
        name: "Shawarma Mixto",
        price: 14.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Combinación de carnes de res y pollo con salsa especial",
      },
      {
        id: "falafel",
        name: "Falafel (6 uds)",
        price: 8.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Croquetas de garbanzos con especias árabes",
      },
      {
        id: "hummus",
        name: "Hummus con Pan",
        price: 6.0,
        image: "/placeholder.svg?height=100&width=100",
        available: false,
        description: "Puré de garbanzos con tahini y aceite de oliva",
      },
    ],
    muna: [
      {
        id: "pincho-pollo",
        name: "Pincho de Pollo",
        price: 10.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Pincho de pollo marinado con especias árabes",
      },
      {
        id: "pincho-mixto",
        name: "Pincho Mixto",
        price: 12.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Pincho con carne de res y pollo",
      },
    ],
    "pizza-jardin": [
      {
        id: "pizza-margarita",
        name: "Pizza Margarita",
        price: 15.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Pizza tradicional con salsa de tomate y queso mozzarella",
      },
      {
        id: "pizza-pepperoni",
        name: "Pizza Pepperoni",
        price: 17.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Pizza con pepperoni y queso mozzarella",
      },
      {
        id: "pizza-vegetariana",
        name: "Pizza Vegetariana",
        price: 16.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Pizza con variedad de vegetales frescos",
      },
    ],
    maacaruna: [
      {
        id: "pasta-carbonara",
        name: "Pasta Carbonara",
        price: 14.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Pasta con salsa cremosa, panceta y queso parmesano",
      },
      {
        id: "pasta-bolognesa",
        name: "Pasta Bolognesa",
        price: 13.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Pasta con salsa de carne y tomate",
      },
    ],
    "zona-bodegon": [
      {
        id: "coca-cola",
        name: "Coca-Cola",
        price: 3.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Refresco de cola (350ml)",
      },
      {
        id: "agua-mineral",
        name: "Agua Mineral",
        price: 2.0,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Agua mineral sin gas (500ml)",
      },
      {
        id: "jugo-natural",
        name: "Jugo Natural",
        price: 4.5,
        image: "/placeholder.svg?height=100&width=100",
        available: true,
        description: "Jugo natural de frutas de temporada",
      },
    ],
  }

  // Filtrar productos por búsqueda
  const filteredItems = searchQuery
    ? Object.values(menuItems)
        .flat()
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
    : menuItems[activeTab as keyof typeof menuItems] || []

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.push("/waiter/dashboard")} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Explorar Menú</h1>
        <p className="text-muted-foreground">Conozca todos los productos disponibles en la feria</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Menú Completo</CardTitle>
          <CardDescription>Explore los productos de todos los restaurantes</CardDescription>
          <div className="mt-2">
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {searchQuery ? (
            <div className="p-4">
              <h3 className="font-medium mb-3">Resultados de búsqueda para "{searchQuery}"</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className={!item.available ? "opacity-60" : ""}>
                    <CardContent className="p-3">
                      <div className="w-full h-40 relative rounded-md overflow-hidden mb-3">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 h-10">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                        {!item.available && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            No disponible
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start px-6 pt-2 pb-0 overflow-x-auto flex-nowrap">
                {restaurants.map((restaurant) => (
                  <TabsTrigger key={restaurant.id} value={restaurant.id} className="whitespace-nowrap">
                    {restaurant.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {restaurants.map((restaurant) => (
                <TabsContent key={restaurant.id} value={restaurant.id} className="p-4">
                  <h3 className="font-medium mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{restaurant.category}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {menuItems[restaurant.id as keyof typeof menuItems]?.map((item) => (
                      <Card key={item.id} className={!item.available ? "opacity-60" : ""}>
                        <CardContent className="p-3">
                          <div className="w-full h-40 relative rounded-md overflow-hidden mb-3">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 h-10">{item.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                            {!item.available && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                No disponible
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="outline" onClick={() => router.push("/waiter/dashboard")}>
          Volver al Dashboard
        </Button>
      </div>
    </div>
  )
}
