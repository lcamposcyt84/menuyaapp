"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LogOut } from "lucide-react"

interface LogoutConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userType: "consortium" | "waiter"
}

export function LogoutConfirmationModal({ isOpen, onClose, onConfirm, userType }: LogoutConfirmationModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleConfirm = async () => {
    setIsLoggingOut(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular proceso
    onConfirm()
    setIsLoggingOut(false)
  }

  const userTypeText = userType === "consortium" ? "administrador del consorcio" : "mesero"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="w-5 h-5 text-red-500" />
            Cerrar Sesión
          </DialogTitle>
          <DialogDescription>¿Estás seguro de que quieres cerrar tu sesión como {userTypeText}?</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Perderás acceso a todas las funciones administrativas hasta que vuelvas a iniciar
              sesión.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoggingOut}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoggingOut}
            className="flex items-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Cerrando...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
