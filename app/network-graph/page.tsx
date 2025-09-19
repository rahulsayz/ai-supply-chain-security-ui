import { NetworkGraphPage } from '@/components/network-graph/network-graph-page'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function NetworkGraphPageRoute() {
  return (
    <DashboardLayout>
      <NetworkGraphPage />
    </DashboardLayout>
  )
}
