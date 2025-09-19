'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api-client'
import { API_CONFIG } from '@/lib/api-config'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Server,
  Database,
  Wifi,
  Loader2
} from 'lucide-react'

interface EndpointStatus {
  name: string
  url: string
  status: 'checking' | 'connected' | 'failed'
  responseTime?: number
  error?: string
  data?: any
}

export function APIStatusChecker() {
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>([
    { name: 'Health Check', url: '/api/health', status: 'checking' },
    { name: 'Dashboard Overview', url: '/api/dashboard/overview', status: 'checking' },
    { name: 'Threats Data', url: '/api/threats', status: 'checking' },
    { name: 'Vendors Data', url: '/api/vendors', status: 'checking' },
    { name: 'Analytics Data', url: '/api/analytics', status: 'checking' },
    { name: 'BigQuery Status', url: '/api/bigquery-ai/status', status: 'checking' },
    { name: 'BigQuery Costs', url: '/api/bigquery-ai/costs', status: 'checking' },
  ])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const testEndpoint = async (endpoint: EndpointStatus): Promise<EndpointStatus> => {
    if (API_CONFIG.mode === 'live') {
      const startTime = Date.now()
      
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}${endpoint.url}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })
        const responseTime = Date.now() - startTime
        
        if (response.ok) {
          const data = await response.json()
          return {
            ...endpoint,
            status: 'connected',
            responseTime,
            data,
            error: undefined
          }
        } else {
          return {
            ...endpoint,
            status: 'failed',
            responseTime,
            error: `HTTP ${response.status}: ${response.statusText}`,
            data: null
          }
        }
      } catch (error: any) {
        return {
          ...endpoint,
          status: 'failed',
          responseTime: Date.now() - startTime,
          error: error.message || 'Network error',
          data: null
        }
      }
    } else {
      return {
        ...endpoint,
        status: 'failed',
        error: 'Static mode - API testing disabled',
        data: { mode: 'static', message: 'Switch to Live Mode for API testing' }
      }
    }
  }

  const testAllEndpoints = async () => {
    setIsRefreshing(true)
    
    // Test endpoints sequentially to avoid overwhelming the server
    for (let i = 0; i < endpoints.length; i++) {
      const result = await testEndpoint(endpoints[i])
      setEndpoints(prev => 
        prev.map((ep, index) => index === i ? result : ep)
      )
      // Small delay between requests
      if (i < endpoints.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    setIsRefreshing(false)
    setLastChecked(new Date())
  }

  useEffect(() => {
    testAllEndpoints()
  }, [])

  return (
    <div className="space-y-6">
      {/* Configuration Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Backend Configuration
          </CardTitle>
          <CardDescription>
            Current API configuration and connection details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">API Mode:</span>
                <Badge variant={API_CONFIG.mode === 'live' ? 'default' : 'outline'} className="ml-2">
                  {API_CONFIG.mode}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">EventSource:</span>
                <Badge variant="default" className="ml-2">
                  Enabled
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Backend URL:</span>
                <code className="ml-2 text-xs bg-muted px-1 rounded">{API_CONFIG.baseUrl}</code>
              </div>
              <div>
                <span className="text-muted-foreground">EventSource URL:</span>
                <code className="ml-2 text-xs bg-muted px-1 rounded">{API_CONFIG.baseUrl}/api/bigquery-ai/live-analysis</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endpoint Testing */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                API Endpoint Tests
              </CardTitle>
              <CardDescription>
                Testing connectivity to all backend endpoints
              </CardDescription>
            </div>
            <Button 
              onClick={testAllEndpoints} 
              disabled={isRefreshing}
              variant="outline"
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isRefreshing ? 'Testing...' : 'Refresh All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {API_CONFIG.mode === 'static' && (
            <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Static Mode Active</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                API testing is disabled in static mode. Switch to Live Mode to test backend connectivity.
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    {endpoint.status === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                    {endpoint.status === 'connected' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {endpoint.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                  </div>
                  <div>
                    <div className="font-medium">{endpoint.name}</div>
                    <div className="text-sm text-muted-foreground">{endpoint.url}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      endpoint.status === 'connected' ? 'default' : 
                      endpoint.status === 'failed' ? 'destructive' : 'secondary'
                    }>
                      {endpoint.status === 'checking' ? 'Testing...' : 
                       endpoint.status === 'connected' ? 'Connected' : 'Failed'}
                    </Badge>
                    {endpoint.responseTime && (
                      <span className="text-xs text-muted-foreground">
                        {endpoint.responseTime}ms
                      </span>
                    )}
                  </div>
                  
                  {endpoint.error && (
                    <div className="text-xs text-red-500 mt-1 max-w-xs truncate">
                      {endpoint.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sample Response Data */}
          {endpoints.some(ep => ep.data && ep.status === 'connected') && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Sample Response Data</h4>
              <div className="space-y-3">
                {endpoints
                  .filter(ep => ep.data && ep.status === 'connected')
                  .slice(0, 2) // Show only first 2 successful responses
                  .map((endpoint, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="font-medium text-sm mb-2">{endpoint.name}</div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32">
                        {JSON.stringify(endpoint.data, null, 2)}
                      </pre>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {lastChecked && (
            <div className="text-xs text-muted-foreground text-center mt-4">
              Last checked: {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}