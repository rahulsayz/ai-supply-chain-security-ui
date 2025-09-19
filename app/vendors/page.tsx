'use client'

import dynamic from 'next/dynamic'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// Dynamically import the VendorsPage to prevent SSR issues with React Query
const VendorsPage = dynamic(() => import('@/components/vendors/vendors-page').then(mod => ({ default: mod.VendorsPage })), {
  ssr: false,
  loading: () => <div>Loading vendors...</div>
})

export default function Vendors() {
  return (
    <DashboardLayout>
      <VendorsPage />
    </DashboardLayout>
  )
}