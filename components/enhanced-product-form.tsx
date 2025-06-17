"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Save, ArrowLeft, Upload, X, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface SideOption {
  name: string
  extraCost: number
}

interface SideGroup {
  category: string
  required: boolean
  options: SideOption[]
}

export function EnhancedProductForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "15",
    isActive: true,
    isPopular: false,
  })

  const [sideGroups, setSideGroups] = useState<SideGroup[]>([])
  const [newSideGroup, setNewSideGroup] = useState({
    category: "",
    required: false,
    options: [{ name: "", extraCost: 0 }],
  })

  const categories = ["Plato Principal", "Acompañante", "Bebida", "Postre", "Vegetariano", "Vegano", "Sin Gluten"]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten archivos de imagen")
        return
      }

      setIsUploading(true)
      // Simulate upload process
      setTimeout(() => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      }, 1500)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  const addSideOption = () => {
    setNewSideGroup((prev) => ({
      ...prev,
      options: [...prev.options, { name: "", extraCost: 0 }],
    }))
  }

  const removeSideOption = (index: number) => {
    setNewSideGroup((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  const updateSideOption = (index: number, field: string, value: any) => {
    setNewSideGroup((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => (i === index ? { ...option, [field]: value } : option)),
    }))
  }

  const addSideGroup = () => {
    if (newSideGroup.category && newSideGroup.options.some((opt) => opt.name)) {
      setSideGroups((prev) => [...prev, { ...newSideGroup }])
      setNewSideGroup({
        category: "",
        required: false,
        options: [{ name: "", extraCost: 0 }],
      })
    }
  }

  const removeSideGroup = (index: number) => {
    setSideGroups((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    if (!imagePreview) {
      alert("La imagen del producto es obligatoria")
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In production, this would make an API call to save the product
    console.log("Product data:", { ...formData, sideGroups, image: imagePreview })

    setIsLoading(false)
    router.push("/consortium/menu")
  }

  const isFormValid = formData.name && formData.description && formData.price && formData.category && imagePreview

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" size="icon" asChild>
          <Link href="/consortium/menu">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Agregar Nuevo Producto</h2>
          <p className="text-sm text-gray-600">Completa toda la información y agrega una imagen obligatoria</p>
        </div>
      </div>

      {/* Image Upload - Required */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Imagen del Producto
            <Badge variant="destructive" className="text-xs">
              Obligatorio
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 relative">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-xl font-medium">Subir imagen del producto</p>
                    <p className="text-gray-500">Arrastra una imagen aquí o haz clic para seleccionar</p>
                    <p className="text-sm text-gray-400">
                      Formatos: JPG, PNG, WebP • Máximo 5MB • Recomendado: 800x600px
                    </p>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />

              {isUploading && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg">Subiendo imagen...</span>
                  </div>
                </div>
              )}
            </div>

            {!imagePreview && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Imagen obligatoria:</strong> Los productos sin imagen no aparecerán en el menú público y no
                  podrán ser ordenados por los clientes.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Shawarma de Pollo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe tu producto de manera atractiva para los clientes..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparationTime">Tiempo de Preparación (min) *</Label>
              <Input
                id="preparationTime"
                type="number"
                min="1"
                max="120"
                value={formData.preparationTime}
                onChange={(e) => handleInputChange("preparationTime", e.target.value)}
                placeholder="15"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Producto Activo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked) => handleInputChange("isPopular", checked)}
                />
                <Label htmlFor="isPopular">Marcar como Popular</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customization Options */}
      <Card>
        <CardHeader>
          <CardTitle>Opciones de Personalización</CardTitle>
          <p className="text-sm text-gray-600">Agrega contornos, ingredientes opcionales y otras personalizaciones</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Side Groups */}
          {sideGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{group.category}</Badge>
                  {group.required && <Badge variant="secondary">Requerido</Badge>}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSideGroup(groupIndex)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {group.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2 text-sm">
                    <span className="flex-1">{option.name}</span>
                    {option.extraCost > 0 && (
                      <Badge variant="outline" className="text-xs">
                        +${option.extraCost}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* New Side Group Form */}
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <h4 className="font-medium mb-4">Agregar Grupo de Opciones</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del Grupo</Label>
                  <Input
                    value={newSideGroup.category}
                    onChange={(e) => setNewSideGroup((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="Ej: Contorno, Salsa, Ingredientes Extra"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newSideGroup.required}
                    onCheckedChange={(checked) => setNewSideGroup((prev) => ({ ...prev, required: checked }))}
                  />
                  <Label>Selección Requerida</Label>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Opciones</Label>
                {newSideGroup.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option.name}
                      onChange={(e) => updateSideOption(index, "name", e.target.value)}
                      placeholder="Nombre de la opción"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={option.extraCost}
                      onChange={(e) => updateSideOption(index, "extraCost", Number.parseFloat(e.target.value) || 0)}
                      placeholder="Costo extra"
                      className="w-24"
                    />
                    {newSideGroup.options.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSideOption(index)}
                        className="text-red-600"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addSideOption}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Opción
                </Button>
              </div>

              <Button type="button" onClick={addSideGroup} disabled={!newSideGroup.category}>
                Agregar Grupo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/consortium/menu">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={isLoading || !isFormValid}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Guardar Producto
            </div>
          )}
        </Button>
      </div>

      {!isFormValid && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Completa todos los campos obligatorios y agrega una imagen para poder guardar el producto.
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}
