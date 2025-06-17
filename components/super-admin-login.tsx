"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Mail, ArrowLeft } from "lucide-react"
import { authService } from "@/lib/auth-service"

export function SuperAdminLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const session = await authService.login(formData.email, formData.password)

      if (session && session.user.role === "super_admin") {
        localStorage.setItem("auth_session", JSON.stringify(session))
        router.push("/admin/dashboard")
      } else {
        setError("Credenciales incorrectas o sin permisos de administrador")
      }
    } catch (error) {
      setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Return Button */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <p className="text-sm text-gray-600">¿No eres administrador?</p>
            <Link href="/consortium/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Acceso para Concesionarios
            </Link>
          </div>
        </div>

        <Card className="border-slate-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="flex items-center gap-2 justify-center">
              <span className="text-2xl font-bold text-slate-900">Administración General</span>
            </CardTitle>
            <p className="text-slate-600">Panel de control de Menuya</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@menuya.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  "Acceder al Panel"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="font-medium">Credenciales de prueba:</p>
                <p>Email: admin@menuya.com</p>
                <p>Contraseña: superadmin123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
