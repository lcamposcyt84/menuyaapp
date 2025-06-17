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
import { Store, Lock, Mail, ArrowLeft, UserPlus } from "lucide-react"
import { authService } from "@/lib/auth-service"

export function ConsortiumLoginForm() {
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

      if (session && session.user.role === "consortium_admin") {
        localStorage.setItem("auth_session", JSON.stringify(session))
        router.push("/consortium/dashboard")
      } else {
        setError("Credenciales incorrectas o cuenta no autorizada")
      }
    } catch (error) {
      setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const demoCredentials = [
    {
      restaurant: "Al Andalus",
      email: "admin@shawarma.com",
      password: "admin123",
      description: "Shawarmas y comida árabe",
    },
    {
      restaurant: "Muna",
      email: "admin@muna.com",
      password: "muna123",
      description: "Pinchos árabes y tabbouleh",
    },
    {
      restaurant: "Pizza Jardín",
      email: "admin@pizzajardin.com",
      password: "pizza123",
      description: "Pizzas italianas y mariscos",
    },
    {
      restaurant: "Maacaruna",
      email: "admin@maacaruna.com",
      password: "pasta123",
      description: "Pastas italianas auténticas",
    },
    {
      restaurant: "Zona Bodegón",
      email: "admin@zonabodegon.com",
      password: "bebidas123",
      description: "Bebidas y snacks",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Return Button */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <p className="text-sm text-gray-600">¿Eres administrador general?</p>
            <Link href="/admin/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Acceso de Administrador
            </Link>
          </div>
        </div>

        <Card className="border-blue-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="flex items-center gap-2 justify-center">
              <span className="text-2xl font-bold text-blue-900">Acceso Concesionarios</span>
            </CardTitle>
            <p className="text-blue-700">Panel de gestión de restaurantes</p>
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
                    placeholder="admin@turestaurante.com"
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

              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  "Acceder al Panel"
                )}
              </Button>

              <div className="text-center">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/consortium/register">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrar Nuevo Restaurante
                  </Link>
                </Button>
              </div>

              {/* Demo Credentials */}
              <div className="text-center text-sm text-gray-600 mt-4 p-4 bg-blue-50 rounded-lg space-y-3">
                <p className="font-medium text-blue-800">Credenciales de Prueba:</p>
                <div className="space-y-2 text-xs">
                  {demoCredentials.map((cred, index) => (
                    <div key={index} className="border-b border-blue-200 pb-2 last:border-b-0">
                      <p className="font-medium text-blue-900">{cred.restaurant}</p>
                      <p className="text-blue-700">{cred.description}</p>
                      <p>📧 {cred.email}</p>
                      <p>🔑 {cred.password}</p>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
