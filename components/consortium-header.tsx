"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, LogOut, Menu, Package, ShoppingCart, BarChart3, Users, Megaphone, ImageIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function ConsortiumHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [consortiumData, setConsortiumData] = useState<any>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    const authData = localStorage.getItem("auth_session")
    if (authData) {
      const session = JSON.parse(authData)
      if (session.user.role === "consortium_admin" && session.consortium) {
        setConsortiumData(session.consortium)
      } else {
        router.push("/consortium/login")
      }
    } else {
      router.push("/consortium/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("auth_session")
    setShowLogoutConfirm(true)
    setTimeout(() => {
      router.push("/consortium/login")
    }, 2000)
  }

  const navigation = [
    { name: "Dashboard", href: "/consortium/dashboard", icon: BarChart3 },
    { name: "Menú", href: "/consortium/menu", icon: ImageIcon },
    { name: "Productos", href: "/consortium/products", icon: Package },
    { name: "Pedidos", href: "/consortium/orders", icon: ShoppingCart },
    { name: "Meseros", href: "/consortium/waiters", icon: Users },
    { name: "Promociones", href: "/consortium/promotions", icon: Megaphone },
    { name: "Inventario", href: "/consortium/inventory", icon: Package },
  ]

  if (!consortiumData) return null

  if (showLogoutConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sesión Cerrada</h2>
          <p className="text-gray-600 mb-6">Has cerrado sesión exitosamente</p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/consortium/login">Iniciar Sesión Nuevamente</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Ir al Menú Principal</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/consortium/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Menuya</span>
            </Link>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              <Building2 className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">{consortiumData.name}</span>
              <span className="sm:hidden">Admin</span>
            </Badge>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <nav className="flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2" size="sm">
              <LogOut className="w-4 h-4" />
              <span className="hidden xl:inline">Cerrar Sesión</span>
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <div className="pb-4 border-b">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Building2 className="w-3 h-3 mr-1" />
                    {consortiumData.name}
                  </Badge>
                </div>
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-orange-100 text-orange-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  )
                })}
                <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2 mt-4 w-full">
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
