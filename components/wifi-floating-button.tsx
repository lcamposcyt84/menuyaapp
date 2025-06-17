"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wifi, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

export function WiFiFloatingButton() {
  const [showWifiDialog, setShowWifiDialog] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const handleWifiConnect = () => {
    setShowWifiDialog(false)
    // In production, this would trigger WiFi connection
    alert("Conectándose a WiFi del Club Social Árabe...")
  }

  if (!isVisible) return null

  return (
    <>
      {/* Much Smaller Floating WiFi Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          {/* Smaller close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white shadow-md rounded-full border z-10"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-2 h-2" />
          </Button>

          {/* Much Smaller WiFi Button */}
          <Button
            onClick={() => setShowWifiDialog(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg rounded-full p-2 h-auto w-12 animate-pulse hover:animate-none transition-all duration-300 hover:scale-110"
          >
            <div className="flex flex-col items-center">
              <Wifi className="w-4 h-4" />
            </div>
          </Button>
        </div>
      </div>

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
                      <p className="text-white/90 text-xs">Club Social Árabe</p>
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
