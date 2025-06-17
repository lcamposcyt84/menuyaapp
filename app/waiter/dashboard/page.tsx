import { WaiterHeader } from "@/components/waiter-header"
import { WaiterDashboard } from "@/components/waiter-dashboard"

export default function WaiterDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <WaiterHeader />
      <main className="container py-6">
        <WaiterDashboard />
      </main>
    </div>
  )
}
