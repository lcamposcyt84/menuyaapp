"use client"

import { useSearchParams } from "next/navigation"
import { CheckoutForm } from "@/components/checkout-form"
import { Header } from "@/components/header"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const dataParam = searchParams.get("data") // Extract data parameter string

  const [orderData, setOrderData] = useState<any | null>(null) // Keep type any for now as per original
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true) // Set loading to true when dataParam changes or on initial load
    setError(null) // Reset error state

    if (!dataParam) {
      setError("No se encontraron datos del pedido")
      setOrderData(null) // Clear any stale order data
      setIsLoading(false)
      return
    }

    try {
      const parsedData = JSON.parse(decodeURIComponent(dataParam))

      if (!parsedData.restaurant || !parsedData.product || !parsedData.total) {
        setError("Datos del pedido incompletos")
        setOrderData(null) // Clear invalid data
      } else {
        setOrderData(parsedData)
      }
    } catch (err) {
      console.error("Error parsing order data:", err)
      setError("Error al procesar los datos del pedido")
      setOrderData(null) // Clear data on error
    } finally {
      setIsLoading(false)
    }
  }, [dataParam]) // Depend on the extracted dataParam string

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cargando...</h2>
          <p className="text-gray-600">Preparando tu pedido</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <main className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error en el checkout</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/">Volver al inicio</Link>
                </Button>
                <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                  Volver atrás
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Ensure orderData is not null before rendering CheckoutForm
  if (!orderData) {
    // This case should ideally be covered by isLoading or error states,
    // but as a fallback, prevent rendering CheckoutForm with null orderData.
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <main className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Datos no disponibles</h2>
              <p className="text-gray-600 mb-6">No se pudieron cargar los datos del pedido para el checkout.</p>
              <Button asChild className="w-full">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <CheckoutForm orderData={orderData} />
      </main>
    </div>
  )
}
