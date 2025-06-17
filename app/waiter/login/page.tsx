import { WaiterLoginForm } from "@/components/waiter-login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChefHat } from "lucide-react"
import Link from "next/link"

export default function WaiterLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-50">
      <header className="border-b py-4 bg-white/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl">Menuya</span>
          </Link>

          <Link href="/consortium/login">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Portales
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-900 mb-2">Portal de Meseros</h1>
            <p className="text-green-700">Gestión de pedidos y atención de mesas</p>
          </div>

          <WaiterLoginForm />

          {/* Información adicional */}
          <div className="mt-6 space-y-4">
            {/* Credenciales de prueba */}
            <Card className="border-green-200">
              <CardContent className="pt-4">
                <h3 className="font-semibold text-sm text-green-900 mb-3">Cuentas de Prueba Disponibles:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <div>
                      <div className="font-medium text-green-900">Carlos - Al Andalus</div>
                      <div className="text-xs text-green-600">carlos_mesero / mesero123</div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Activo</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <div>
                      <div className="font-medium text-green-900">Luis - Pizza Jardín</div>
                      <div className="text-xs text-green-600">luis_mesero / mesero123</div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Activo</span>
                  </div>

                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <div>
                      <div className="font-medium text-orange-900">Ana - Muna</div>
                      <div className="text-xs text-orange-600">ana_mesera / mesero123</div>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Pendiente</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funcionalidades */}
            <Card className="border-gray-200">
              <CardContent className="pt-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Funcionalidades del Sistema:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Gestión de pedidos por mesa
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Órdenes de múltiples restaurantes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Sistema de pago móvil con QR
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Seguimiento en tiempo real
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Si no puede acceder, contacte al administrador de su restaurante
          </p>
        </div>
      </main>

      <footer className="py-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="container text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Menuya. Sistema de gestión de pedidos.
        </div>
      </footer>
    </div>
  )
}
