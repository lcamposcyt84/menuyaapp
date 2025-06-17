import { OrderManagement } from "@/components/order-management"
import { ConsortiumHeader } from "@/components/consortium-header"

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ConsortiumHeader />
      <main className="container mx-auto px-4 py-6">
        <OrderManagement />
      </main>
    </div>
  )
}
