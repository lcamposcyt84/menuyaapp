import { ConsortiumLoginForm } from "@/components/consortium-login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ChefHat } from "lucide-react"
import Link from "next/link"

export default function ConsortiumLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Menuya - Portal de Acceso</h1>
          <p className="text-gray-600">Seleccione su tipo de acceso</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login de Consorcios */}
          <div className="space-y-4">
            <Card className="border-2 border-blue-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ChefHat className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-900">Administradores</CardTitle>
                <CardDescription>Acceso para administradores de restaurantes</CardDescription>
              </CardHeader>
              <CardContent>
                <ConsortiumLoginForm />

                {/* Credenciales de ejemplo para consorcios */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-sm text-blue-900 mb-2">Credenciales de Prueba:</h4>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div>
                      <strong>Al Andalus:</strong> admin@shawarma.com / admin123
                    </div>
                    <div>
                      <strong>Muna:</strong> admin@muna.com / muna123
                    </div>
                    <div>
                      <strong>Pizza Jardín:</strong> admin@pizzajardin.com / pizza123
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acceso para Meseros */}
          <div className="space-y-4">
            <Card className="border-2 border-green-200">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-900">Meseros</CardTitle>
                <CardDescription>Acceso para personal de servicio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Portal dedicado para la gestión de pedidos y atención de mesas</p>

                  <Link href="/waiter/login">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Users className="mr-2 h-4 w-4" />
                      Acceder como Mesero
                    </Button>
                  </Link>
                </div>

                {/* Credenciales de ejemplo para meseros */}
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-sm text-green-900 mb-2">Credenciales de Prueba:</h4>
                  <div className="space-y-1 text-xs text-green-700">
                    <div>
                      <strong>Carlos (Al Andalus):</strong> carlos_mesero / mesero123
                    </div>
                    <div>
                      <strong>Luis (Pizza Jardín):</strong> luis_mesero / mesero123
                    </div>
                    <div className="text-orange-600">
                      <strong>Ana (Pendiente):</strong> ana_mesera / mesero123
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2 italic">* Ana requiere autorización del administrador</p>
                </div>

                {/* Características del portal de meseros */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">Funcionalidades:</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Gestión de pedidos por mesa</li>
                    <li>• Toma de órdenes múltiples restaurantes</li>
                    <li>• Sistema de pago móvil con QR</li>
                    <li>• Seguimiento en tiempo real</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Acceso de Súper Administrador */}
        <div className="mt-8 text-center">
          <Card className="max-w-md mx-auto border-2 border-purple-200">
            <CardContent className="pt-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">SA</span>
              </div>
              <h3 className="font-semibold text-purple-900 mb-2">Súper Administrador</h3>
              <Link href="/admin/login">
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                  Acceso Administrativo
                </Button>
              </Link>
              <p className="text-xs text-purple-600 mt-2">admin@menuya.com / superadmin123</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
