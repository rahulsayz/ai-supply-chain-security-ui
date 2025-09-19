import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Database, 
  Server, 
  Wifi, 
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { API_CONFIG } from '@/lib/api-config'

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down'
  timestamp: string
  dataFiles: { loaded: number; total: number }
  bigquery: { connected: boolean }
  memory: { used: number; total: number; percentage: number }
}

interface BigQueryHealth {
  connected: boolean
  lastQuery: string
  region: string
}

export function SystemHealthMonitor() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Health check query
  const { data: healthData, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ['system-health'],
    queryFn: api.getHealth,
    refetchInterval: 30000, // Check every 30 seconds
    retry: 2,
  }) as { data: SystemHealth | undefined, isLoading: boolean, refetch: any }

  // BigQuery health query
  const { data: bigQueryHealth, isLoading: bigQueryLoading } = useQuery({
    queryKey: ['bigquery-health'],
    queryFn: api.getHealthBigQuery,
    refetchInterval: 60000, // Check every minute
    enabled: API_CONFIG.mode === 'live',
  }) as { data: BigQueryHealth | undefined, isLoading: boolean }

  // BigQuery status query
  const { data: bigQueryStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['bigquery-status'],
    queryFn: api.getBigQueryStatus,
    refetchInterval: 30000,
    enabled: API_CONFIG.mode === 'live',
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetchHealth()
    setIsRefreshing(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500 hover:bg-green-600">Healthy</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Degraded</Badge>
      case 'down':
        return <Badge variant="destructive">Down</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getConnectionIcon = (connected: boolean) => {
    return connected ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-500" />
    )
  }

  if (API_CONFIG.mode === 'static') {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-5 w-5" />
            System Health Monitor
          </CardTitle>
          <CardDescription>
            Switch to Live Mode to monitor real system health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            System monitoring available in Live Mode only
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <CardTitle>System Health Monitor</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Real-time system status and performance monitoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall System Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="font-medium">System Status</span>
          </div>
          {healthLoading ? (
            <Badge variant="secondary">Checking...</Badge>
          ) : (
            getStatusBadge(healthData?.status || 'unknown')
          )}
        </div>

        {/* Data Files Status */}
        {healthData?.dataFiles && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="font-medium">Data Files</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {healthData.dataFiles.loaded}/{healthData.dataFiles.total} loaded
              </span>
            </div>
            <Progress 
              value={(healthData.dataFiles.loaded / healthData.dataFiles.total) * 100} 
              className="h-2" 
            />
          </div>
        )}

        {/* Memory Usage */}
        {healthData?.memory && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Memory Usage</span>
              <span className="text-sm text-muted-foreground">
                {healthData.memory.percentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={healthData.memory.percentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {(healthData.memory.used / 1024 / 1024).toFixed(1)}MB / {(healthData.memory.total / 1024 / 1024).toFixed(1)}MB
            </div>
          </div>
        )}

        {/* BigQuery Connection Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {bigQueryLoading ? (
                <Wifi className="h-4 w-4 animate-pulse" />
              ) : (
                getConnectionIcon(bigQueryHealth?.connected || false)
              )}
              <span className="font-medium">BigQuery AI</span>
            </div>
            <Badge variant={bigQueryHealth?.connected ? 'default' : 'secondary'}>
              {bigQueryLoading ? 'Checking...' : bigQueryHealth?.connected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>

          {bigQueryHealth?.connected && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Region: {bigQueryHealth.region}</div>
              {bigQueryHealth.lastQuery && (
                <div>Last Query: {new Date(bigQueryHealth.lastQuery).toLocaleTimeString()}</div>
              )}
            </div>
          )}
        </div>

        {/* BigQuery AI Status */}
        {bigQueryStatus && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">AI System Status</span>
              <Badge variant={bigQueryStatus.data?.status === 'available' ? 'default' : 'destructive'}>
                {bigQueryStatus.data?.status || 'unknown'}
              </Badge>
            </div>
            
            {bigQueryStatus.data?.budget_status && (
              <div className="text-xs text-muted-foreground">
                Budget Status: {bigQueryStatus.data.budget_status}
              </div>
            )}

            {bigQueryStatus.data?.cost_summary && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Daily Spend</span>
                  <span>${bigQueryStatus.data.cost_summary.today.cost_usd.toFixed(4)}</span>
                </div>
                <Progress 
                  value={bigQueryStatus.data.cost_summary.today.usage_percent} 
                  className="h-2" 
                />
                <div className="text-xs text-muted-foreground">
                  Budget: ${bigQueryStatus.data.cost_summary.today.budget_limit_usd.toFixed(2)} • 
                  Remaining: ${bigQueryStatus.data.cost_summary.today.remaining_usd.toFixed(4)}
                </div>
              </div>
            )}

            {bigQueryStatus.data?.config && (
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Daily Budget Limit: ${bigQueryStatus.data.config.daily_budget_limit}</div>
                <div>Max Query Cost: ${bigQueryStatus.data.config.max_query_cost}</div>
                <div>Max Processing: {bigQueryStatus.data.config.max_processing_mb}MB</div>
              </div>
            )}
          </div>
        )}

        {/* Last Updated */}
        {healthData?.timestamp && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Last updated: {new Date(healthData.timestamp).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}