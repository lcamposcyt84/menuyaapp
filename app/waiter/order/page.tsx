import { WaiterHeader } from "@/components/waiter-header"
import { WaiterOrderTaking } from "@/components/waiter-order-taking"

export default function WaiterOrderPage({ searchParams }: { searchParams: { table?: string } }) {
  const tableNumber = searchParams.table || ""

  return (
    <div className="min-h-screen bg-background">
      <WaiterHeader />
      <main className="container py-6">
        <WaiterOrderTaking tableNumber={tableNumber} />
      </main>
    </div>
  )
}
