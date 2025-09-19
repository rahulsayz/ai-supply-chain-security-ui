'use client'

import { useState, useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'
import { useModeChange } from '@/hooks/use-mode-change'

interface QueryProviderProps {
  children: React.ReactNode
}

function QueryProviderContent({ children }: QueryProviderProps) {
  // Initialize mode change handling only after QueryClient is available
  useModeChange()

  return (
    <>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  )
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render anything until we're on the client
  if (!isClient) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <QueryProviderContent>
        {children}
      </QueryProviderContent>
    </QueryClientProvider>
  )
}