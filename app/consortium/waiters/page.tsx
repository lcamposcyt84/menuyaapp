import { WaiterAccountsManagement } from "@/components/waiter-accounts-management"
import { ConsortiumHeader } from "@/components/consortium-header"

export default function WaitersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ConsortiumHeader />
      <main className="container mx-auto px-4 py-6">
        <WaiterAccountsManagement />
      </main>
    </div>
  )
}
