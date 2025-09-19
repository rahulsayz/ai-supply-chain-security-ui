'use client'

import dynamic from 'next/dynamic'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// Dynamically import the AnalyticsPage to prevent SSR issues with React Query
const AnalyticsPage = dynamic(() => import('@/components/analytics/analytics-page').then(mod => ({ default: mod.AnalyticsPage })), {
  ssr: false,
  loading: () => <div>Loading analytics...</div>
})

export default function Analytics() {
  return (
    <DashboardLayout>
      <AnalyticsPage />
    </DashboardLayout>
  )
}