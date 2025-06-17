"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCartStore } from "@/store/cart-store"
import { useCustomerAuth } from "@/hooks/use-customer-auth"
import { CustomerAuthModal } from "./customer-auth-modal"
import { ShoppingCart, User, Heart, Settings, LogOut, MapPin, Clock, Star, Award } from "lucide-react"
import { toast } from "sonner"

export function EnhancedHeader() {
  const router = useRouter()
  const { items, getTotalItems } = useCartStore()
  const { customer, logout } = useCustomerAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login")

  const totalItems = getTotalItems()

  const handleAuthClick = (tab: "login" | "register") => {
    setAuthModalTab(tab)
    setAuthModalOpen(true)
  }

  const handleLogout = () => {
    logout()
    toast.success("Sesión cerrada correctamente")
    router.push("/")
  }

  const handleCartClick = () => {
    if (totalItems > 0) {
      router.push("/checkout")
    } else {
      toast.info("Tu carrito está vacío")
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Bronce":
        return <Award className="w-4 h-4 text-yellow-600" />
      case "Plata":
        return <Star className="w-4 h-4 text-gray-400" />
      case "Oro":
        return <Star className="w-4 h-4 text-yellow-400" />
      case "Platino":
        return <Star className="w-4 h-4 text-cyan-400" />
      default:
        return <Award className="w-4 h-4 text-gray-400" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Bronce":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Plata":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Oro":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Platino":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl">Menuya</span>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Restaurantes
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            >
              Acerca de
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            >
              Contacto
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Rewards Display for logged in users */}
            {customer && (
              <div className="hidden sm:flex items-center space-x-2 mr-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getLevelColor(
                    customer.rewards.level,
                  )}`}
                >
                  {getLevelIcon(customer.rewards.level)}
                  <span>{customer.rewards.points.toLocaleString()} pts</span>
                </div>
              </div>
            )}

            {/* Cart Button */}
            <Button variant="ghost" size="icon" className="relative" onClick={handleCartClick}>
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Carrito de compras</span>
            </Button>

            {/* User Menu */}
            {customer ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{customer.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="hidden sm:inline-block font-medium">{customer.name.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getLevelColor(
                            customer.rewards.level,
                          )}`}
                        >
                          {getLevelIcon(customer.rewards.level)}
                          <span>{customer.rewards.points.toLocaleString()} puntos</span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Mis Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/favorites")}>
                    <Heart className="mr-2 h-4 w-4" />
                    Favoritos
                  </DropdownMenuItem>
                  {customer.address && (
                    <DropdownMenuItem onClick={() => router.push("/addresses")}>
                      <MapPin className="mr-2 h-4 w-4" />
                      Direcciones
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleAuthClick("login")}>
                  Iniciar Sesión
                </Button>
                <Button size="sm" onClick={() => handleAuthClick("register")}>
                  Registrarse
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <CustomerAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} defaultTab={authModalTab} />
    </>
  )
}
