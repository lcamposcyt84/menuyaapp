import { WaiterHeader } from "@/components/waiter-header"
import { WaiterMenuExplorer } from "@/components/waiter-menu-explorer"

export default function WaiterMenuPage() {
  return (
    <div className="min-h-screen bg-background">
      <WaiterHeader />
      <main className="container py-6">
        <WaiterMenuExplorer />
      </main>
    </div>
  )
}
