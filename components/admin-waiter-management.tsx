"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Search, X } from "lucide-react"
import { waiterService } from "@/lib/waiter-service"
import type { WaiterAccount } from "@/lib/waiter-types"

export function AdminWaiterManagement() {
  const [waiters, setWaiters] = useState<WaiterAccount[]>([])
  const [pendingWaiters, setPendingWaiters] = useState<WaiterAccount[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Cargar todos los meseros del sistema
    const allWaiters = waiterService.getAllWaiters()
    setWaiters(allWaiters)
    setPendingWaiters(allWaiters.filter((w) => w.status === "pending_authorization"))
  }, [])

  const handleAuthorizeWaiter = async (waiterId: string) => {
    try {
      const success = await waiterService.authorizeWaiter(
        waiterId,
        "super-admin-1", // En producción sería el ID del usuario actual
        "super_admin",
      )

      if (success) {
        // Actualizar listas
        const updatedWaiters = waiterService.getAllWaiters()
        setWaiters(updatedWaiters)
        setPendingWaiters(updatedWaiters.filter((w) => w.status === "pending_authorization"))
        setSuccessMessage("Mesero autorizado exitosamente")

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      setError("Error al autorizar mesero")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleRejectWaiter = async (waiterId: string) => {
    try {
      const success = await waiterService.rejectWaiter(waiterId, "super-admin-1")

      if (success) {
        // Actualizar listas
        const updatedWaiters = waiterService.getAllWaiters()
        setWaiters(updatedWaiters)
        setPendingWaiters(updatedWaiters.filter((w) => w.status === "pending_authorization"))
        setSuccessMessage("Mesero rechazado")

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      setError("Error al rechazar mesero")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleToggleStatus = async (waiterId: string) => {
    try {
      const success = waiterService.toggleWaiterStatus(waiterId)

      if (success) {
        // Actualizar listas
        const updatedWaiters = waiterService.getAllWaiters()
        setWaiters(updatedWaiters)
        setPendingWaiters(updatedWaiters.filter((w) => w.status === "pending_authorization"))
        setSuccessMessage("Estado del mesero actualizado")

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      setError("Error al cambiar estado del mesero")
      setTimeout(() => setError(""), 3000)
    }
  }

  // Filtrar meseros según la búsqueda
  const filteredWaiters = waiters.filter(
    (waiter) =>
      waiter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waiter.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      waiter.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión Central de Meseros</h1>
        <p className="text-muted-foreground">Administre y autorice cuentas de meseros de todos los restaurantes</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 p-3 rounded-md flex items-center gap-2 text-green-700">
          <CheckCircle className="h-4 w-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-3 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar meseros..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pendientes de Autorización
            {pendingWaiters.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {pendingWaiters.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">Todos los Meseros</TabsTrigger>
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
                      <p>Restaurante: {waiter.restaurantId}</p>
                      <p>Creado: {waiter.createdAt.toLocaleDateString()}</p>
                      <p>
                        Creado por:{" "}
                        {waiter.createdByRole === "consortium_admin" ? "Administrador de Restaurante" : "Super Admin"}
                      </p>
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

        <TabsContent value="all" className="space-y-4">
          {filteredWaiters.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No se encontraron meseros</div>
          ) : (
            <div className="grid gap-4">
              {filteredWaiters.map((waiter) => (
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
                      <p>Restaurante: {waiter.restaurantId}</p>
                      <p>Creado: {waiter.createdAt.toLocaleDateString()}</p>
                      {waiter.authorizedAt && (
                        <p>
                          Autorizado: {waiter.authorizedAt.toLocaleDateString()} por{" "}
                          {waiter.authorizedByRole === "consortium_admin" ? "Admin Restaurante" : "Super Admin"}
                        </p>
                      )}
                      <p>Último acceso: {waiter.lastLoginAt?.toLocaleDateString() || "Nunca"}</p>
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
