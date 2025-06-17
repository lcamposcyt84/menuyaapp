import { WaiterHeader } from "@/components/waiter-header"
import { PaymentProcessing } from "@/components/payment-processing"

export default function WaiterPaymentPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <WaiterHeader />
      <main className="container py-6">
        <PaymentProcessing orderId={params.orderId} />
      </main>
    </div>
  )
}
