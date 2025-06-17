"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, CreditCard, Menu, Building2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface HeaderProps {
  isWaiter?: boolean
}

export function Header({ isWaiter = false }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [credits] = useState(150)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Menuya</span>
          </Link>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {isWaiter ? (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Modo Mesero
              </Badge>
            ) : (
              <>
                {isLoggedIn && (
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{credits} créditos</span>
                  </div>
                )}
                <Link
                  href="/consortium/login"
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <Building2 className="w-4 h-4" />
                  <span className="hidden lg:inline">Consorcios</span>
                </Link>
                <Button
                  variant={isLoggedIn ? "outline" : "default"}
                  size="sm"
                  onClick={() => setIsLoggedIn(!isLoggedIn)}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden lg:inline">{isLoggedIn ? "Mi Cuenta" : "Iniciar Sesión"}</span>
                </Button>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                {isWaiter ? (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 w-fit">
                    Modo Mesero
                  </Badge>
                ) : (
                  <>
                    {isLoggedIn && (
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                        <CreditCard className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{credits} créditos</span>
                      </div>
                    )}
                    <Link
                      href="/consortium/login"
                      className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 flex items-center gap-2"
                    >
                      <Building2 className="w-4 h-4" />
                      Acceso Consorcios
                    </Link>
                    <Button
                      variant={isLoggedIn ? "outline" : "default"}
                      onClick={() => setIsLoggedIn(!isLoggedIn)}
                      className="flex items-center gap-2 justify-start"
                    >
                      <User className="w-4 h-4" />
                      {isLoggedIn ? "Mi Cuenta" : "Iniciar Sesión"}
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
