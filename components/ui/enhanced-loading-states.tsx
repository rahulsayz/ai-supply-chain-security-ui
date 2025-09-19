import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, Wifi, WifiOff } from 'lucide-react'

// Enhanced loading skeleton for dashboard stats
export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Enhanced loading skeleton for threat list
export function ThreatListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
          <Skeleton className="h-4 w-4 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

// Enhanced loading skeleton for vendor grid
export function VendorGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-2 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Enhanced loading skeleton for analytics charts
export function AnalyticsChartSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}

// Loading state for API operations
export function APILoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-muted-foreground">{message}</span>
      </div>
    </div>
  )
}

// Connection status indicator
export function ConnectionStatus({ 
  isConnected, 
  isConnecting = false, 
  label = "Backend" 
}: { 
  isConnected: boolean
  isConnecting?: boolean
  label?: string 
}) {
  return (
    <div className="flex items-center gap-2">
      {isConnecting ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      ) : isConnected ? (
        <Wifi className="h-4 w-4 text-green-500" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-500" />
      )}
      <span className="text-sm">
        {label}: {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  )
}

// Processing status for BigQuery AI operations
export function AIProcessingStatus({ 
  status, 
  progress, 
  cost, 
  processingTime 
}: {
  status: 'idle' | 'processing' | 'completed' | 'failed'
  progress?: number
  cost?: number
  processingTime?: number
}) {
  const getStatusBadge = () => {
    switch (status) {
      case 'processing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Processing</Badge>
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Idle</Badge>
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">AI Processing Status</span>
        {getStatusBadge()}
      </div>

      {status === 'processing' && progress !== undefined && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {progress.toFixed(1)}% complete
          </div>
        </div>
      )}

      {(cost !== undefined || processingTime !== undefined) && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {cost !== undefined && (
            <span>Cost: ${cost.toFixed(4)}</span>
          )}
          {processingTime !== undefined && (
            <span>Time: {processingTime}ms</span>
          )}
        </div>
      )}
    </div>
  )
}

// Error state component
export function ErrorState({ 
  title = "Something went wrong", 
  message, 
  onRetry 
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-red-500 mb-4">
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {message && (
        <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

// Data freshness indicator
export function DataFreshnessIndicator({ 
  lastUpdated, 
  isStale = false 
}: {
  lastUpdated: string | Date
  isStale?: boolean
}) {
  const formatTime = (date: string | Date) => {
    const d = new Date(date)
    return d.toLocaleTimeString()
  }

  return (
    <div className={`text-xs ${isStale ? 'text-orange-500' : 'text-muted-foreground'}`}>
      Last updated: {formatTime(lastUpdated)}
      {isStale && ' (stale)'}
    </div>
  )
}