"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Megaphone, Clock, Gift, Star, Percent } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function PromotionManagement() {
  const [promotions, setPromotions] = useState([
    {
      id: "promo-1",
      title: "2x1 en Shawarmas",
      description: "Lleva 2 shawarmas de pollo por el precio de 1",
      discount: "50%",
      type: "limited",
      validUntil: "2024-12-31",
      status: "active",
      views: 245,
      clicks: 32,
    },
    {
      id: "promo-2",
      title: "Combo Familiar",
      description: "Pizza familiar + bebida 2L por $25",
      discount: "$5 OFF",
      type: "combo",
      validUntil: "2024-12-25",
      status: "active",
      views: 189,
      clicks: 28,
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPromotion, setNewPromotion] = useState({
    title: "",
    description: "",
    discount: "",
    type: "limited",
    validUntil: "",
  })

  const getPromoIcon = (type: string) => {
    switch (type) {
      case "limited":
        return Clock
      case "combo":
        return Gift
      case "happy-hour":
        return Star
      default:
        return Percent
    }
  }

  const getPromoColor = (type: string) => {
    switch (type) {
      case "limited":
        return "bg-red-100 text-red-700"
      case "combo":
        return "bg-blue-100 text-blue-700"
      case "happy-hour":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-orange-100 text-orange-700"
    }
  }

  const handleCreatePromotion = () => {
    const newPromo = {
      id: `promo-${Date.now()}`,
      ...newPromotion,
      status: "active",
      views: 0,
      clicks: 0,
    }
    setPromotions([...promotions, newPromo])
    setNewPromotion({
      title: "",
      description: "",
      discount: "",
      type: "limited",
      validUntil: "",
    })
    setIsCreateDialogOpen(false)
  }

  const togglePromotionStatus = (id: string) => {
    setPromotions(
      promotions.map((promo) =>
        promo.id === id ? { ...promo, status: promo.status === "active" ? "inactive" : "active" } : promo,
      ),
    )
  }

  const deletePromotion = (id: string) => {
    setPromotions(promotions.filter((promo) => promo.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
          <p className="text-gray-600">Crea y administra las promociones de tu restaurante</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Promoción
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Promoción</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Promoción</Label>
                <Input
                  id="title"
                  value={newPromotion.title}
                  onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                  placeholder="Ej: 2x1 en Shawarmas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                  placeholder="Describe los detalles de la promoción..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Descuento</Label>
                  <Input
                    id="discount"
                    value={newPromotion.discount}
                    onChange={(e) => setNewPromotion({ ...newPromotion, discount: e.target.value })}
                    placeholder="50% o $5 OFF"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={newPromotion.type}
                    onValueChange={(value) => setNewPromotion({ ...newPromotion, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="limited">Tiempo Limitado</SelectItem>
                      <SelectItem value="combo">Combo Especial</SelectItem>
                      <SelectItem value="happy-hour">Happy Hour</SelectItem>
                      <SelectItem value="discount">Descuento General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Válido Hasta</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={newPromotion.validUntil}
                  onChange={(e) => setNewPromotion({ ...newPromotion, validUntil: e.target.value })}
                />
              </div>

              <Button onClick={handleCreatePromotion} className="w-full">
                Crear Promoción
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Megaphone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{promotions.filter((p) => p.status === "active").length}</p>
                <p className="text-sm text-gray-600">Promociones Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{promotions.reduce((sum, p) => sum + p.views, 0)}</p>
                <p className="text-sm text-gray-600">Visualizaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Gift className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{promotions.reduce((sum, p) => sum + p.clicks, 0)}</p>
                <p className="text-sm text-gray-600">Clics Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {promotions.map((promo) => {
          const PromoIcon = getPromoIcon(promo.type)
          const promoColor = getPromoColor(promo.type)

          return (
            <Card key={promo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${promoColor}`}>
                      <PromoIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{promo.title}</CardTitle>
                      <p className="text-sm text-gray-600">{promo.description}</p>
                    </div>
                  </div>
                  <Badge variant={promo.status === "active" ? "default" : "secondary"}>
                    {promo.status === "active" ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{promo.discount}</p>
                    <p className="text-xs text-gray-500">Descuento</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">{promo.views}</p>
                    <p className="text-xs text-gray-500">Vistas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">{promo.clicks}</p>
                    <p className="text-xs text-gray-500">Clics</p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Válido hasta: {new Date(promo.validUntil).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePromotionStatus(promo.id)}
                    className="flex-1"
                  >
                    {promo.status === "active" ? "Desactivar" : "Activar"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deletePromotion(promo.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {promotions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay promociones</h3>
            <p className="text-gray-600 mb-4">Crea tu primera promoción para atraer más clientes</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Promoción
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
