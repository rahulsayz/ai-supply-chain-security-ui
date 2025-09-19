'use client'

import dynamic from 'next/dynamic'

// Dynamically import the ApiTestPage to prevent SSR issues with React Query
const ApiTestPage = dynamic(() => import('@/components/api-test-page').then(mod => ({ default: mod.ApiTestPage })), {
  ssr: false,
  loading: () => <div>Loading API test page...</div>
})

export default function ApiTestPageWrapper() {
  return <ApiTestPage />
}