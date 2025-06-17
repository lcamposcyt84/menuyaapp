import { ConsortiumDashboard } from "@/components/consortium-dashboard"
import { ConsortiumHeader } from "@/components/consortium-header"

export default function ConsortiumDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ConsortiumHeader />
      <main className="container mx-auto px-4 py-6">
        <ConsortiumDashboard />
      </main>
    </div>
  )
}
