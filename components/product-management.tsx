"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  // Sample products data - in production this would come from API
  const products = [
    {
      id: "shawarma-pollo",
      name: "Shawarma de Pollo",
      description: "Jugoso pollo marinado con especias árabes",
      price: 12,
      category: "Plato Principal",
      status: "active",
      sales: 45,
      customizable: true,
    },
    {
      id: "shawarma-carne",
      name: "Shawarma de Carne",
      description: "Tierna carne de res con especias tradicionales",
      price: 14,
      category: "Plato Principal",
      status: "active",
      sales: 32,
      customizable: true,
    },
    {
      id: "falafel",
      name: "Falafel",
      description: "Croquetas de garbanzos y especias",
      price: 10,
      category: "Vegetariano",
      status: "active",
      sales: 28,
      customizable: true,
    },
    {
      id: "hummus",
      name: "Hummus",
      description: "Crema de garbanzos con tahini",
      price: 8,
      category: "Acompañante",
      status: "inactive",
      sales: 15,
      customizable: false,
    },
  ]

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600">Administra tu menú y productos</p>
        </div>
        <Button asChild>
          <Link href="/consortium/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{filteredProducts.length} productos</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">${product.price}</span>
                <Badge variant={product.status === "active" ? "default" : "secondary"}>
                  {product.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Categoría:</span>
                <Badge variant="outline">{product.category}</Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ventas del mes:</span>
                <span className="font-medium">{product.sales}</span>
              </div>

              {product.customizable && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Personalizable
                  </Badge>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
                <Button variant={product.status === "active" ? "secondary" : "default"} size="sm" className="flex-1">
                  {product.status === "active" ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Aún no tienes productos agregados"}
            </p>
            <Button asChild>
              <Link href="/consortium/products/new">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Producto
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
