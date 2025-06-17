"use client"

import { useSearchParams } from "next/navigation"
import { CheckCircle, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order") || "MYA-001"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">¡Pedido Confirmado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Número de pedido:</p>
            <p className="text-2xl font-bold text-gray-900">{orderNumber}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Tiempo estimado</p>
                <p className="text-sm text-blue-700">15-20 minutos</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Recoger en</p>
                <p className="text-sm text-orange-700">Mostrador del restaurante</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">Hacer otro pedido</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/order-status?order=${orderNumber}`}>Ver estado del pedido</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
