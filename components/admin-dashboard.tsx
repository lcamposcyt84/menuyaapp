"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Users, Store, Clock, CheckCircle, XCircle, AlertTriangle, UserCheck, UserX } from "lucide-react"
import { authService } from "@/lib/auth-service"
import type { RegistrationRequest, ConsortiumAccount, AuthSession } from "@/lib/auth-types"

export function AdminDashboard() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [pendingRequests, setPendingRequests] = useState<RegistrationRequest[]>([])
  const [consortiums, setConsortiums] = useState<ConsortiumAccount[]>([])
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get session from localStorage
    const sessionData = localStorage.getItem("auth_session")
    if (sessionData) {
      setSession(JSON.parse(sessionData))
    }

    // Load data
    setPendingRequests(authService.getPendingRegistrations())
    setConsortiums(authService.getAllConsortiums())
  }, [])

  const handleApprove = async (requestId: string) => {
    if (!session) return

    setIsLoading(true)
    const success = await authService.approveRegistration(requestId, session.user.id)

    if (success) {
      setPendingRequests(authService.getPendingRegistrations())
      setConsortiums(authService.getAllConsortiums())
      setSelectedRequest(null)
    }
    setIsLoading(false)
  }

  const handleReject = async (requestId: string) => {
    if (!session || !rejectionReason.trim()) return

    setIsLoading(true)
    const success = await authService.rejectRegistration(requestId, rejectionReason, session.user.id)

    if (success) {
      setPendingRequests(authService.getPendingRegistrations())
      setSelectedRequest(null)
      setRejectionReason("")
    }
    setIsLoading(false)
  }

  const toggleConsortiumStatus = (consortiumId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active"
    authService.updateConsortiumStatus(consortiumId, newStatus as any)
    setConsortiums(authService.getAllConsortiums())
  }

  const stats = {
    totalConsortiums: consortiums.length,
    activeConsortiums: consortiums.filter((c) => c.status === "active").length,
    pendingRequests: pendingRequests.length,
    suspendedConsortiums: consortiums.filter((c) => c.status === "suspended").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona concesionarios y solicitudes de Menuya</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Restaurantes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalConsortiums}</p>
              </div>
              <Store className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeConsortiums}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solicitudes Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspendidos</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspendedConsortiums}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Solicitudes Pendientes ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{request.consortiumName}</h3>
                      <p className="text-gray-600 mb-2">{request.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Administrador:</span> {request.adminName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {request.adminEmail}
                        </div>
                        <div>
                          <span className="font-medium">Teléfono:</span> {request.phone}
                        </div>
                        <div>
                          <span className="font-medium">Dirección:</span> {request.address}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium text-sm">Categorías:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Enviado: {request.submittedAt.toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
                        disabled={isLoading}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejection Modal */}
      {selectedRequest && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Rechazar Solicitud: {selectedRequest.consortiumName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Razón del rechazo:</label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explica por qué se rechaza esta solicitud..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleReject(selectedRequest.id)}
                disabled={!rejectionReason.trim() || isLoading}
                variant="destructive"
              >
                Confirmar Rechazo
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRequest(null)
                  setRejectionReason("")
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Consortiums */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Restaurantes Registrados ({consortiums.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consortiums.map((consortium) => (
              <div key={consortium.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{consortium.name}</h3>
                      <Badge variant={consortium.status === "active" ? "default" : "destructive"}>
                        {consortium.status === "active" ? "Activo" : "Suspendido"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{consortium.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Email:</span> {consortium.email}
                      </div>
                      <div>
                        <span className="font-medium">Teléfono:</span> {consortium.phone}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Dirección:</span> {consortium.address}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {consortium.categories.map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Registrado: {consortium.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleConsortiumStatus(consortium.id, consortium.status)}
                    >
                      {consortium.status === "active" ? (
                        <>
                          <UserX className="w-4 h-4 mr-1" />
                          Suspender
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
