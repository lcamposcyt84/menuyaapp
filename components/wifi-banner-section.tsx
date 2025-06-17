"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wifi } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function WiFiBannerSection() {
  const [showWifiDialog, setShowWifiDialog] = useState(false)

  const handleWifiConnect = () => {
    setShowWifiDialog(false)
    // In production, this would trigger WiFi connection
    alert("Conectándose a WiFi del Club Social Árabe...")
  }

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <CardContent className="relative p-3 sm:p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">WiFi Gratuito</h2>
                <p className="text-white/90 text-xs">Club Social Árabe - ClubSocialArabe_Free</p>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setShowWifiDialog(true)}
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-sm px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Wifi className="w-4 h-4 mr-1" />
                Conectar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WiFi Dialog */}
      <Dialog open={showWifiDialog} onOpenChange={setShowWifiDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Wifi className="w-5 h-5 text-blue-600" />
              </div>
              WiFi Club Social Árabe
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wifi className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-900">¡Conéctate Gratis!</h3>
              <p className="text-gray-600 mb-4">Disfruta de internet gratuito mientras saboreas tu comida favorita</p>

              <div className="bg-white p-4 rounded-lg border-2 border-blue-200 mb-4">
                <p className="text-sm text-gray-600 mb-1">Nombre de la Red:</p>
                <p className="font-mono font-bold text-lg text-blue-600">ClubSocialArabe_Free</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Red Disponible</span>
                </div>
              </div>
            </div>

            {/* Connect Button */}
            <Button
              onClick={handleWifiConnect}
              className="w-full text-lg py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Wifi className="w-5 h-5 mr-2" />
              Conectar Automáticamente
            </Button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-yellow-800 mb-1">Términos de Uso</p>
                  <p className="text-xs text-yellow-700">
                    Al conectarte aceptas los términos de uso de la red. Conexión gratuita por 2 horas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
