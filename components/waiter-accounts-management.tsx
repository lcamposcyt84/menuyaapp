"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, UserPlus, X } from "lucide-react"
import { waiterService } from "@/lib/waiter-service"
import type { WaiterAccount } from "@/lib/waiter-types"

export function WaiterAccountsManagement() {
  const [waiters, setWaiters] = useState<WaiterAccount[]>([])
  const [pendingWaiters, setPendingWaiters] = useState<WaiterAccount[]>([])
  const [activeWaiters, setActiveWaiters] = useState<WaiterAccount[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newWaiter, setNewWaiter] = useState({
    username: "",
    email: "",
    name: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Simulamos el ID del restaurante actual (en producción vendría de la sesión)
  const currentRestaurantId = "al-andalus"

  useEffect(() => {
    // Cargar meseros del restaurante actual
    const allWaiters = waiterService.getWaitersByRestaurant(currentRestaurantId)
    setWaiters(allWaiters)
    setPendingWaiters(allWaiters.filter((w) => w.status === "pending_authorization"))
    setActiveWaiters(allWaiters.filter((w) => w.status === "active"))
  }, [])

  const handleCreateWaiter = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Validaciones básicas
      if (!newWaiter.username || !newWaiter.email || !newWaiter.name) {
        throw new Error("Por favor complete todos los campos requeridos")
      }

      // Crear nuevo mesero
      const waiterId = await waiterService.createWaiter(
        {
          ...newWaiter,
          restaurantId: currentRestaurantId,
        },
        "admin-al-andalus", // En producción sería el ID del usuario actual
        "consortium_admin",
      )

      // Actualizar listas
      const updatedWaiters = waiterService.getWaitersByRestaurant(currentRestaurantId)
      setWaiters(updatedWaiters)
      setPendingWaiters(updatedWaiters.filter((w) => w.status === "pending_authorization"))
      setActiveWaiters(updatedWaiters.filter((w) => w.status === "active"))

      // Limpiar formulario y cerrar diálogo
      setNewWaiter({ username: "", email: "", name: "", phone: "" })
      setIsDialogOpen(false)
      setSuccessMessage("Mesero creado exitosamente. Pendiente de autorización.")

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      setError(err.message || "Error al crear mesero")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAuthorizeWaiter = async (waiterId: string) => {
    try {
      const success = await waiterService.authorizeWaiter(
        waiterId,
        "admin-al-andalus", // En producción sería el ID del usuario actual
        "consortium_admin",
      )

      if (success) {
        // Actualizar listas
        const updatedWaiters = waiterService.getWaitersByRestaurant(currentRestaurantId)
        setWaiters(updatedWaiters)
        setPendingWaiters(updatedWaiters.filter((w) => w.status === "pending_authorization"))
        setActiveWaiters(updatedWaiters.filter((w) => w.status === "active"))
        setSuccessMessage("Mesero autorizado exitosamente")

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      setError("Error al autorizar mesero")
    }
  }

  const handleToggleStatus = async (waiterId: string) => {
    try {
      const success = waiterService.toggleWaiterStatus(waiterId)

      if (success) {
        // Actualizar listas
        const updatedWaiters = waiterService.getWaitersByRestaurant(currentRestaurantId)
        setWaiters(updatedWaiters)
        setPendingWaiters(updatedWaiters.filter((w) => w.status === "pending_authorization"))
        setActiveWaiters(updatedWaiters.filter((w) => w.status === "active" || w.status === "disabled"))
        setSuccessMessage("Estado del mesero actualizado")

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      setError("Error al cambiar estado del mesero")
    }
  }

  const handleRejectWaiter = async (waiterId: string) => {
    try {
      const success = await waiterService.rejectWaiter(waiterId, "admin-al-andalus")

      if (success) {
        // Actualizar listas
        const updatedWaiters = waiterService.getWaitersByRestaurant(currentRestaurantId)
        setWaiters(updatedWaiters)
        setPendingWaiters(updatedWaiters.filter((w) => w.status === "pending_authorization"))
        setActiveWaiters(updatedWaiters.filter((w) => w.status === "active"))
        setSuccessMessage("Mesero rechazado")

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      setError("Error al rechazar mesero")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Meseros</h1>
          <p className="text-muted-foreground">Administre las cuentas de meseros para su restaurante</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Mesero
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Mesero</DialogTitle>
              <DialogDescription>
                Complete la información para crear una nueva cuenta de mesero. La cuenta quedará pendiente de
                autorización.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWaiter}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={newWaiter.name}
                    onChange={(e) => setNewWaiter({ ...newWaiter, name: e.target.value })}
                    placeholder="Ej: Carlos Rodríguez"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    value={newWaiter.username}
                    onChange={(e) => setNewWaiter({ ...newWaiter, username: e.target.value })}
                    placeholder="Ej: carlos_mesero"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newWaiter.email}
                    onChange={(e) => setNewWaiter({ ...newWaiter, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={newWaiter.phone}
                    onChange={(e) => setNewWaiter({ ...newWaiter, phone: e.target.value })}
                    placeholder="Ej: 0414-555-0001"
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-50 p-3 rounded-md flex items-center gap-2 text-red-700 mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creando..." : "Crear Mesero"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {successMessage && (
        <div className="bg-green-50 p-3 rounded-md flex items-center gap-2 text-green-700">
          <CheckCircle className="h-4 w-4" />
          <span>{successMessage}</span>
        </div>
      )}

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pendientes
            {pendingWaiters.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {pendingWaiters.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingWaiters.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No hay meseros pendientes de autorización</div>
          ) : (
            <div className="grid gap-4">
              {pendingWaiters.map((waiter) => (
                <Card key={waiter.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{waiter.name}</CardTitle>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pendiente
                      </Badge>
                    </div>
                    <CardDescription>
                      Usuario: {waiter.username} | Email: {waiter.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm">
                      <p>Teléfono: {waiter.phone || "No especificado"}</p>
                      <p>Creado: {waiter.createdAt.toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleRejectWaiter(waiter.id)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Rechazar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAuthorizeWaiter(waiter.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Autorizar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeWaiters.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No hay meseros activos</div>
          ) : (
            <div className="grid gap-4">
              {activeWaiters.map((waiter) => (
                <Card key={waiter.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{waiter.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          waiter.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {waiter.status === "active" ? "Activo" : "Desactivado"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Usuario: {waiter.username} | Email: {waiter.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm">
                      <p>Teléfono: {waiter.phone || "No especificado"}</p>
                      <p>Autorizado: {waiter.authorizedAt?.toLocaleDateString() || "N/A"}</p>
                      <p>Último acceso: {waiter.lastLoginAt?.toLocaleDateString() || "Nunca"}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      variant={waiter.status === "active" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleStatus(waiter.id)}
                    >
                      {waiter.status === "active" ? "Desactivar" : "Activar"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {waiters.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No hay meseros registrados</div>
          ) : (
            <div className="grid gap-4">
              {waiters.map((waiter) => (
                <Card key={waiter.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{waiter.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          waiter.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : waiter.status === "pending_authorization"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : waiter.status === "rejected"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {waiter.status === "active"
                          ? "Activo"
                          : waiter.status === "pending_authorization"
                            ? "Pendiente"
                            : waiter.status === "rejected"
                              ? "Rechazado"
                              : "Desactivado"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Usuario: {waiter.username} | Email: {waiter.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm">
                      <p>Teléfono: {waiter.phone || "No especificado"}</p>
                      <p>Creado: {waiter.createdAt.toLocaleDateString()}</p>
                      <p>Estado: {waiter.status}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {waiter.status === "pending_authorization" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleRejectWaiter(waiter.id)}
                        >
                          Rechazar
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAuthorizeWaiter(waiter.id)}
                        >
                          Autorizar
                        </Button>
                      </>
                    )}
                    {(waiter.status === "active" || waiter.status === "disabled") && (
                      <Button
                        variant={waiter.status === "active" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(waiter.id)}
                      >
                        {waiter.status === "active" ? "Desactivar" : "Activar"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
