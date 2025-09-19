'use client'

import dynamic from 'next/dynamic'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// Dynamically import the EnhancedLiveAnalysisPanel to prevent SSR issues with React Query
const EnhancedLiveAnalysisPanel = dynamic(() => import('@/components/live-analysis/enhanced-live-analysis-panel').then(mod => ({ default: mod.EnhancedLiveAnalysisPanel })), {
  ssr: false,
  loading: () => <div>Loading live analysis...</div>
})

export default function LiveAnalysisPage() {
  return (
    <DashboardLayout>
      <EnhancedLiveAnalysisPanel />
    </DashboardLayout>
  )
}
