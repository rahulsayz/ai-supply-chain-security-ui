'use client'

import dynamic from 'next/dynamic'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// Dynamically import the ThreatsPage to prevent SSR issues with React Query
const ThreatsPage = dynamic(() => import('@/components/threats/threats-page').then(mod => ({ default: mod.ThreatsPage })), {
  ssr: false,
  loading: () => <div>Loading threats...</div>
})

export default function Threats() {
  return (
    <DashboardLayout>
      <ThreatsPage />
    </DashboardLayout>
  )
}