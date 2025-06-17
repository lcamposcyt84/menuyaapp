"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, LogOut, Bell } from "lucide-react"
import { authService } from "@/lib/auth-service"
import type { AuthSession } from "@/lib/auth-types"

export function AdminHeader() {
  const router = useRouter()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const sessionData = localStorage.getItem("auth_session")
    if (sessionData) {
      const parsedSession = JSON.parse(sessionData)
      setSession(parsedSession)

      // Check if session is valid
      if (new Date(parsedSession.expiresAt) < new Date()) {
        handleLogout()
        return
      }
    } else {
      router.push("/admin/login")
    }

    // Get pending requests count
    setPendingCount(authService.getPendingRegistrations().length)
  }, [router])

  const handleLogout = () => {
    if (session) {
      authService.logout(session.user.id)
    }
    localStorage.removeItem("auth_session")
    router.push("/admin/login")
  }

  if (!session) return null

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Menuya Admin</h1>
            <p className="text-sm text-gray-600">Panel de Administración</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {pendingCount > 0 && (
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              <Badge variant="destructive">{pendingCount}</Badge>
              <span className="text-sm text-gray-600">solicitudes pendientes</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
              <p className="text-xs text-gray-600">Super Administrador</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
