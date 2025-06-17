import { EnhancedProductForm } from "@/components/enhanced-product-form"
import { ConsortiumHeader } from "@/components/consortium-header"

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ConsortiumHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Agregar Nuevo Producto</h1>
            <p className="text-gray-600">Completa la información del producto para agregarlo a tu menú</p>
          </div>
          <EnhancedProductForm />
        </div>
      </main>
    </div>
  )
}
