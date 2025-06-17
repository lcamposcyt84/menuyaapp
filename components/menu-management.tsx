"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ImageIcon,
  MoreHorizontal,
  Upload,
  X,
  PackagePlus,
  PackageCheck,
  PackageX,
  StarIcon,
  AlertTriangle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  type MenuItem as LibMenuItem,
  addProductToRestaurant,
  updateProductInRestaurant,
  deleteProductFromRestaurant,
  subscribeToProducts, // For reactivity
  restaurants as allRestaurantsData, // To get all menu items for management
} from "@/lib/data"
import { inventoryService } from "@/lib/inventory-service" // For stock info

// Mock current consortium ID - replace with actual auth logic
const MOCK_CONSORTIUM_ID_MENU = "al-andalus" // Example: Al Andalus

export function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all")
  const [editingProduct, setEditingProduct] = useState<Partial<LibMenuItem> | null>(null) // Partial for new products
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [allManagedProducts, setAllManagedProducts] = useState<LibMenuItem[]>([])

  // This would come from auth context in a real app
  const consortiumRestaurantId = MOCK_CONSORTIUM_ID_MENU
  const currentRestaurant = allRestaurantsData.find((r) => r.id === consortiumRestaurantId)

  useEffect(() => {
    if (currentRestaurant) {
      setAllManagedProducts([...currentRestaurant.menu]) // Manage a copy
    }
    const unsubscribe = subscribeToProducts(() => {
      const updatedRestaurant = allRestaurantsData.find((r) => r.id === consortiumRestaurantId)
      if (updatedRestaurant) {
        setAllManagedProducts([...updatedRestaurant.menu])
      }
    })
    return () => unsubscribe()
  }, [consortiumRestaurantId, currentRestaurant])

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>(["all"])
    allManagedProducts.forEach((p) => {
      if (p.category) uniqueCategories.add(p.category)
    })
    return Array.from(uniqueCategories)
  }, [allManagedProducts])

  const filteredProducts = useMemo(() => {
    return allManagedProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategoryFilter === "all" || product.category === selectedCategoryFilter
      return matchesSearch && matchesCategory
    })
  }, [allManagedProducts, searchTerm, selectedCategoryFilter])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setTimeout(() => {
        // Simulate upload
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
          if (editingProduct) setEditingProduct((prev) => ({ ...prev, image: e.target?.result as string }))
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      }, 1000)
    }
  }

  const openNewProductForm = () => {
    setEditingProduct({ available: true, isPopular: false, price: 0, preparationTime: 10 }) // Defaults for new product
    setImagePreview(null)
    setIsFormOpen(true)
  }

  const openEditProductForm = (product: LibMenuItem) => {
    setEditingProduct({ ...product })
    setImagePreview(product.image || null)
    setIsFormOpen(true)
  }

  const handleSaveProduct = () => {
    if (!editingProduct || !editingProduct.name || !editingProduct.category) {
      // Add validation feedback
      alert("Nombre y categoría son requeridos.")
      return
    }

    const productData = { ...editingProduct, image: imagePreview || editingProduct.image } as LibMenuItem

    if (editingProduct.id) {
      // Existing product
      updateProductInRestaurant(consortiumRestaurantId, productData)
    } else {
      // New product
      addProductToRestaurant(consortiumRestaurantId, productData)
    }
    setIsFormOpen(false)
    setEditingProduct(null)
    setImagePreview(null)
  }

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      deleteProductFromRestaurant(consortiumRestaurantId, productId)
    }
  }

  const toggleProductAvailability = (product: LibMenuItem) => {
    const updatedProduct = { ...product, available: !product.available }
    updateProductInRestaurant(consortiumRestaurantId, updatedProduct)
  }

  const toggleProductPopularity = (product: LibMenuItem) => {
    const updatedProduct = { ...product, isPopular: !product.isPopular }
    updateProductInRestaurant(consortiumRestaurantId, updatedProduct)
  }

  const productsWithoutImagesCount = useMemo(
    () => allManagedProducts.filter((p) => !p.image).length,
    [allManagedProducts],
  )
  const unavailableProductsCount = useMemo(
    () => allManagedProducts.filter((p) => !p.available).length,
    [allManagedProducts],
  )
  const popularProductsCount = useMemo(() => allManagedProducts.filter((p) => p.isPopular).length, [allManagedProducts])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Menú ({currentRestaurant?.name})</h1>
          <p className="text-gray-600">Administra los productos de tu restaurante.</p>
        </div>
        <Button onClick={openNewProductForm}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {productsWithoutImagesCount > 0 && (
        <Alert variant="default" className="bg-yellow-50 border-yellow-300 text-yellow-800">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <AlertTitle>Atención: Productos sin Imagen</AlertTitle>
          <AlertDescription>
            Hay <strong>{productsWithoutImagesCount} producto(s)</strong> sin imagen. Se recomienda agregar imágenes
            para una mejor presentación.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <PackagePlus className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-sm text-gray-500">Total Productos</p>
            <p className="text-2xl font-bold">{allManagedProducts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <PackageCheck className="w-6 h-6 text-green-500 mb-2" />
            <p className="text-sm text-gray-500">Disponibles</p>
            <p className="text-2xl font-bold text-green-600">{allManagedProducts.length - unavailableProductsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <StarIcon className="w-6 h-6 text-yellow-500 mb-2" />
            <p className="text-sm text-gray-500">Populares</p>
            <p className="text-2xl font-bold text-yellow-600">{popularProductsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <PackageX className="w-6 h-6 text-red-500 mb-2" />
            <p className="text-sm text-gray-500">No Disponibles</p>
            <p className="text-2xl font-bold text-red-500">{unavailableProductsCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "Todas las categorías" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const inventoryStatus = inventoryService.getProductAvailability(consortiumRestaurantId, product.id)
          return (
            <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="pb-2">
                <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden mb-3">
                  {product.image ? (
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-10 h-10 mb-1" />
                      <p className="text-xs">Sin imagen</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7 rounded-full bg-black/30 hover:bg-black/50 text-white"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditProductForm(product)}>
                          <Edit className="w-3.5 h-3.5 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleProductPopularity(product)}>
                          <StarIcon
                            className={`w-3.5 h-3.5 mr-2 ${product.isPopular ? "text-yellow-500 fill-yellow-500" : ""}`}
                          />{" "}
                          {product.isPopular ? "Quitar Popular" : "Marcar Popular"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 focus:text-red-700 focus:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardTitle className="text-md leading-tight">{product.name}</CardTitle>
                <p className="text-xs text-gray-500">{product.category}</p>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 line-clamp-2 flex-grow py-1">
                {product.description}
              </CardContent>
              <CardFooter className="pt-2 pb-3 space-y-2 flex-col items-start">
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-semibold text-green-600">${product.price.toFixed(2)}</span>
                  <Badge
                    variant={product.available ? (inventoryStatus.isAvailable ? "default" : "outline") : "destructive"}
                    className="text-xs px-1.5 py-0.5"
                  >
                    {product.available
                      ? inventoryStatus.isAvailable
                        ? "Disponible"
                        : "Agotado (Inv.)"
                      : "Deshabilitado"}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => toggleProductAvailability(product)}
                >
                  {product.available ? "Deshabilitar Manualmente" : "Habilitar Manualmente"}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="col-span-full">
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || selectedCategoryFilter !== "all"
                ? "Intenta ajustar tus filtros o términos de búsqueda."
                : "Aún no has agregado productos a tu menú."}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
            <DialogDescription>
              Completa la información del producto. Los campos con * son requeridos.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-1 -mx-1">
            <div className="space-y-5 py-4 pr-3">
              <div>
                <Label className="font-semibold">Imagen del Producto</Label>
                <div
                  className={`mt-1 border-2 border-dashed rounded-lg p-4 text-center ${imagePreview ? "" : "border-gray-300 hover:border-gray-400"}`}
                >
                  {imagePreview ? (
                    <div className="relative group">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        width={400}
                        height={225}
                        className="rounded-md mx-auto max-h-48 w-auto object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-7 w-7 opacity-50 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setImagePreview(null)
                          if (editingProduct) setEditingProduct((prev) => ({ ...prev, image: undefined }))
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Upload className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-sm">Arrastra o selecciona una imagen</p>
                      <p className="text-xs">JPG, PNG, WebP (máx 2MB)</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  {isUploading && <p className="text-xs text-blue-500 mt-1">Subiendo...</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="product-name">Nombre del Producto *</Label>
                  <Input
                    id="product-name"
                    value={editingProduct?.name || ""}
                    onChange={(e) => setEditingProduct((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="product-price">Precio (USD) *</Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    value={editingProduct?.price || ""}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="product-description">Descripción</Label>
                <Textarea
                  id="product-description"
                  value={editingProduct?.description || ""}
                  onChange={(e) => setEditingProduct((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="product-category">Categoría *</Label>
                  <Input
                    id="product-category"
                    placeholder="Ej: Plato Principal, Bebida"
                    value={editingProduct?.category || ""}
                    onChange={(e) => setEditingProduct((prev) => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="product-prep-time">Tiempo de Preparación (min)</Label>
                  <Input
                    id="product-prep-time"
                    type="number"
                    value={editingProduct?.preparationTime || ""}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({ ...prev, preparationTime: Number.parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="product-available"
                    checked={editingProduct?.available || false}
                    onCheckedChange={(checked) => setEditingProduct((prev) => ({ ...prev, available: checked }))}
                  />
                  <Label htmlFor="product-available">Disponible (Manual)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="product-popular"
                    checked={editingProduct?.isPopular || false}
                    onCheckedChange={(checked) => setEditingProduct((prev) => ({ ...prev, isPopular: checked }))}
                  />
                  <Label htmlFor="product-popular">Marcar como Popular</Label>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-5">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={isUploading || !editingProduct?.name || !editingProduct?.category}
            >
              {isUploading ? "Subiendo..." : editingProduct?.id ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
