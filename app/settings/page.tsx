'use client'

import dynamic from 'next/dynamic'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// Dynamically import the SettingsPage to prevent SSR issues with React Query
const SettingsPage = dynamic(() => import('@/components/settings/settings-page').then(mod => ({ default: mod.SettingsPage })), {
  ssr: false,
  loading: () => <div>Loading settings...</div>
})

export default function Settings() {
  return (
    <DashboardLayout>
      <SettingsPage />
    </DashboardLayout>
  )
}