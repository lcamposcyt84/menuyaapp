import { ProductManagement } from "@/components/product-management"
import { ConsortiumHeader } from "@/components/consortium-header"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ConsortiumHeader />
      <main className="container mx-auto px-4 py-6">
        <ProductManagement />
      </main>
    </div>
  )
}
