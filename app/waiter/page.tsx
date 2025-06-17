import { WaiterInterface } from "@/components/waiter-interface"
import { Header } from "@/components/header"

export default function WaiterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header isWaiter />
      <main className="container mx-auto px-4 py-6">
        <WaiterInterface />
      </main>
    </div>
  )
}
