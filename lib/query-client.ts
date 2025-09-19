'use client'

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - static value
      gcTime: 5 * 60 * 1000, // 5 minutes - static value
      retry: (failureCount, error: any) => {
        // Use dynamic mode checking - will be handled in individual queries
        if (error?.code === 'ECONNREFUSED') return failureCount < 2
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => 
        Math.min(1000 * Math.pow(2, attemptIndex), 30000), // static value
    },
    mutations: {
      retry: 1,
    },
  },
})