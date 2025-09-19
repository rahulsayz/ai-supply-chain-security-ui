import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { addModeChangeListener, removeModeChangeListener } from '@/lib/api-config'

export const useModeChange = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleModeChange = (newMode: 'static' | 'live') => {
      // Invalidate all queries when mode changes
      queryClient.invalidateQueries()
      
      // Clear the entire cache to ensure fresh data
      queryClient.clear()
    }

    // Add listener for mode changes
    addModeChangeListener(handleModeChange)

    // Cleanup
    return () => {
      removeModeChangeListener(handleModeChange)
    }
  }, [queryClient])

  return null
}
