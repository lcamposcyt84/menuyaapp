import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import PageProgressBar from "@/components/progress-bar"
import { ErrorBoundary } from "@/components/error-boundary"
import { Footer } from "@/components/footer" // Importar el Footer

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Menuya - Pedidos Digitales",
  description: "Plataforma de pedidos y pagos digital para la feria de comidas del Club Social Árabe",
  manifest: "/manifest.json",
  themeColor: "#f97316",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {" "}
        {/* Asegurar que el footer se pegue abajo */}
        <ErrorBoundary>
          <div className="flex-grow">
            {" "}
            {/* Contenido principal crece */}
            <PageProgressBar />
            {children}
          </div>
          <Footer /> {/* Footer añadido aquí */}
          <Toaster
            richColors
            closeButton
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </ErrorBoundary>
      </body>
    </html>
  )
}
