"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Building, Shield, UserCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/40 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-xl">Menuya</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Tu portal para descubrir y ordenar de los mejores restaurantes locales.
            </p>
          </div>

          {/* Main Links */}
          <div>
            <h3 className="font-semibold mb-4">Explorar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-muted-foreground hover:text-primary">
                  Promociones
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  Acerca de Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin Access */}
          <div>
            <h3 className="font-semibold mb-4">Administración</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/consortium/login"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Building className="w-4 h-4" />
                  Acceso Consorcio
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <Shield className="w-4 h-4" />
                  Acceso Super Admin
                </Link>
              </li>
              <li>
                <Link href="/waiter/login" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <UserCheck className="w-4 h-4" />
                  Acceso Mesero
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Menuya. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
