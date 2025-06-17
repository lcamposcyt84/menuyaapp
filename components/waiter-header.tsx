"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, User, Star, Award } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { waiterService } from "@/lib/waiter-service"
import type { WaiterAccount } from "@/lib/waiter-types"

export function WaiterHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [waiter, setWaiter] = useState<WaiterAccount | null>(null)

  // En una implementación real, obtendríamos estos datos del contexto de autenticación
  const waiterName = "Carlos Mesero"
  const restaurantName = "Al Andalus"

  useEffect(() => {
    // Simular obtener datos del mesero logueado
    const mockWaiter = waiterService.getAllWaiters().find((w) => w.username === "carlos_mesero")
    if (mockWaiter) {
      setWaiter(mockWaiter)
    }
  }, [])

  const handleLogout = () => {
    // En una implementación real, limpiaríamos la sesión
    router.push("/waiter/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/waiter/dashboard" },
    { name: "Explorar Menú", href: "/waiter/menu" },
  ]

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/waiter/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Menuya Mesero</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/waiter/dashboard" className="flex items-center" onClick={() => setOpen(false)}>
              <span className="font-bold">Menuya Mesero</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`transition-colors hover:text-foreground/80 ${
                      pathname === item.href ? "text-foreground" : "text-foreground/60"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <span className="text-sm text-muted-foreground md:hidden">Menuya Mesero</span>
          </div>

          {/* Rewards Display for waiter */}
          {waiter?.rewards && (
            <div className="hidden sm:flex items-center space-x-2 mr-2">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getLevelColor(
                  waiter.rewards.level,
                )}`}
              >
                {getLevelIcon(waiter.rewards.level)}
                <span>{waiter.rewards.points.toLocaleString()} pts</span>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Cerrar Sesión</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{waiterName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{restaurantName}</p>
                  {waiter?.rewards && (
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getLevelColor(
                          waiter.rewards.level,
                        )}`}
                      >
                        {getLevelIcon(waiter.rewards.level)}
                        <span>{waiter.rewards.points.toLocaleString()} puntos</span>
                      </div>
                    </div>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
