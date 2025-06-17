import { AdminHeader } from "@/components/admin-header"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminWaiterManagement } from "@/components/admin-waiter-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="waiters">Gestión de Meseros</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="waiters">
            <AdminWaiterManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
