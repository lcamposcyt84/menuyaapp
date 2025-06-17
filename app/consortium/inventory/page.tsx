import { InventoryManagement } from "@/components/inventory-management"
import { ConsortiumHeader } from "@/components/consortium-header"

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ConsortiumHeader />
      <main className="container mx-auto px-4 py-6">
        <InventoryManagement />
      </main>
    </div>
  )
}
