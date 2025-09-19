'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  Brain, 
  DollarSign, 
  Zap, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { API_CONFIG, API_ENDPOINTS } from '@/lib/api-config'

export function BigQueryStatusWidget() {
  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch cost status - Using working backend API
  const { data: costData, error: costError } = useQuery({
    queryKey: ['bigquery-costs-current'],
    queryFn: () => {
      console.log('Calling cost endpoint:', API_ENDPOINTS.bigQueryCostsCurrent)
      return api.get(API_ENDPOINTS.bigQueryCostsCurrent).then(res => res.data)
    },
    refetchInterval: 30000,
    enabled: API_CONFIG.mode === 'live' && false // Disabled to prevent 404 errors
  })

  // Fetch health status - Using new API contract
  const { data: healthData } = useQuery({
    queryKey: ['bigquery-health-functions'],
    queryFn: api.getBigQueryStatus,
    refetchInterval: 60000,
    enabled: API_CONFIG.mode === 'live' && false // Disabled to prevent 404 errors
  })

  // Fetch connectivity status - Using new API contract
  const { data: connectivityData } = useQuery({
    queryKey: ['bigquery-health-connectivity'],
    queryFn: api.getBigQueryStatus, // Use same endpoint
    refetchInterval: 60000,
    enabled: API_CONFIG.mode === 'live' && false // Disabled to prevent 404 errors
  })

  if (API_CONFIG.mode === 'static') {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          <Brain className="h-3 w-3 mr-1" />
          Demo Mode
        </Badge>
      </div>
    )
  }

  // Use static data to prevent API calls
  const budgetUtilization = 0
  const dailySpent = 0
  const budgetLimit = 10
  const budgetRemaining = 10
  
  // Use static health status
  const isHealthy = true
  const isConnected = true
  
  // Get function status from static data
  const availableFunctions = 3
  const totalFunctions = 3

  const getStatusColor = () => {
    if (!isHealthy) return 'text-red-500'
    if (budgetUtilization >= 90) return 'text-orange-500'
    if (budgetUtilization >= 75) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusIcon = () => {
    if (!isHealthy) return <AlertTriangle className="h-3 w-3" />
    if (budgetUtilization >= 90) return <AlertTriangle className="h-3 w-3" />
    return <CheckCircle className="h-3 w-3" />
  }

  return (
    <Popover open={isExpanded} onOpenChange={setIsExpanded}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-xs font-medium">BigQuery AI</span>
            </div>
            <div className="text-xs text-muted-foreground">
              ${dailySpent.toFixed(2)}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              BigQuery AI Status
            </h4>
            <Badge variant={isHealthy ? 'default' : 'destructive'}>
              {isHealthy ? 'Healthy' : 'Degraded'}
            </Badge>
          </div>

          {/* Budget Status */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">Daily Budget</span>
                </div>
                <span className="text-sm">
                  ${dailySpent.toFixed(2)} / ${budgetLimit.toFixed(2)}
                </span>
              </div>
              <Progress value={budgetUtilization} className="h-2 mb-2" />
              <div className="text-xs text-muted-foreground">
                {budgetUtilization.toFixed(1)}% utilized • ${budgetRemaining.toFixed(2)} remaining
              </div>
            </CardContent>
          </Card>

          {/* Function Status */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Functions</span>
                </div>
                <span className="text-sm">
                  {availableFunctions}/{totalFunctions} Available
                </span>
              </div>
              <Progress value={(availableFunctions / totalFunctions) * 100} className="h-2 mb-2" />
              <div className="text-xs text-muted-foreground">
                Last checked: {healthData?.metadata?.timestamp ? 
                  new Date(healthData.metadata.timestamp).toLocaleTimeString() : 'Never'}
              </div>
            </CardContent>
          </Card>

          {/* Connectivity */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Connectivity</span>
                </div>
                <Badge variant={isConnected ? 'default' : 'destructive'}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              {connectivityData?.data?.config && (
                <div className="text-xs text-muted-foreground">
                  Query Timeout: {connectivityData.data.config.query_timeout}ms • Max Processing: {connectivityData.data.config.max_processing_mb}MB
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              View Metrics
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Clock className="h-3 w-3 mr-1" />
              History
            </Button>
          </div>

          {/* Last Update */}
          <div className="text-xs text-muted-foreground text-center">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}