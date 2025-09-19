'use client'

import dynamic from 'next/dynamic'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// Dynamically import the EnhancedDashboardOverview to prevent SSR issues with React Query
const EnhancedDashboardOverview = dynamic(() => import('@/components/dashboard/enhanced-dashboard-overview').then(mod => ({ default: mod.EnhancedDashboardOverview })), {
  ssr: false,
  loading: () => <div>Loading dashboard...</div>
})

export default function Home() {
  return (
    <DashboardLayout>
      <EnhancedDashboardOverview />
    </DashboardLayout>
  )
}