'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { getCurrentMode } from '@/lib/api-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts'

// Import the AnalyticsResponse type from api-client
import { AnalyticsResponse } from '@/lib/api-client'

interface AnalyticsData {
  timeSeriesData: Array<{ date: string; threats: number; riskScore: number }>
  threatTypes: Array<{ name: string; value: number; color: string }>
  attackVectors: Array<{ vector: string; count: number; trend: string }>
  predictions: Array<{ month: string; predicted: number; actual: number | null }>
}

export function AnalyticsPage() {
  const [currentMode, setCurrentMode] = useState<'static' | 'live'>('static')

  // Check current mode and refetch when it changes
  useEffect(() => {
    const checkMode = () => {
      const mode = getCurrentMode()
      if (mode !== currentMode) {
        setCurrentMode(mode)
      }
    }
    
    checkMode()
    const interval = setInterval(checkMode, 1000) // Check every second
    
    return () => clearInterval(interval)
  }, [currentMode])

  // Fetch analytics data with mode-based query key
  const { data: apiResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics', { mode: currentMode }],
    queryFn: api.getAnalytics,
    refetchInterval: 60000, // Refresh every minute
  })

  // Extract the actual analytics data from the API response
  const analyticsData: AnalyticsData | undefined = apiResponse?.data

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Analytics Debug - Mode:', currentMode, 'Loading:', isLoading, 'HasData:', !!analyticsData)
    if (error) console.error('🔍 Analytics Error:', error)
  }

  // Force refetch when mode changes
  useEffect(() => {
    if (currentMode === 'live') {
      refetch()
    }
  }, [currentMode, refetch])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-96 mb-2" />
          <div className="h-4 bg-muted rounded w-64" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-48" />
                <div className="h-4 bg-muted rounded w-64" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load analytics data</p>
          <p className="text-sm text-muted-foreground mt-2">Error: {error?.message || 'Unknown error'}</p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Show message if no data is available
  if (!isLoading && (!apiResponse || !analyticsData)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">No analytics data available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Mode: {currentMode} | Response: {apiResponse ? 'Available' : 'None'}
          </p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  const timeSeriesData = analyticsData?.timeSeriesData || []
  const threatTypeData = analyticsData?.threatTypes || []
  const attackVectorData = analyticsData?.attackVectors || []
  const predictiveData = analyticsData?.predictions || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-400/10 border border-purple-500/20 shadow-lg">
              <BarChart3 className="h-6 w-6 text-purple-500" />
            </div>
            <span>AI Security Analytics Hub</span>
          </h1>
          <p className="text-muted-foreground">
            <strong>AI Analysis - Today's Security Overview:</strong> Threat activity has increased by 15% compared to yesterday,
            BigQuery ML-powered predictive threat intelligence and security insights
          </p>
          <div className="mt-2">
            <Badge variant={currentMode === 'live' ? 'default' : 'secondary'}>
              {currentMode === 'live' ? '🟢 Live Mode' : '📊 Static Mode'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-500/20 shadow-lg">
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>AI-generated daily security briefing</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-4">
              <strong>Today's Security Overview:</strong> Threat activity has increased by 15% compared to yesterday, 
              with a notable spike in supply chain attacks. Our AI systems detected 3 critical vulnerabilities 
              across vendor networks, with CloudVendor Pro showing the highest risk profile at 95.7%.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="text-sm font-medium text-red-800 dark:text-red-200">Critical Findings</div>
                <div className="text-xs text-red-600 dark:text-red-300">2 supply chain compromises detected</div>
              </div>
              <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Recommendations</div>
                <div className="text-xs text-orange-600 dark:text-orange-300">Immediate vendor isolation required</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Trending</div>
                <div className="text-xs text-blue-600 dark:text-blue-300">AI detection accuracy: 94.2%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Threat Detection Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Threat Detection Over Time</CardTitle>
            <CardDescription>7-day threat discovery and risk progression</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Threat Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Threat Types Distribution</CardTitle>
            <CardDescription>Breakdown of threat categories this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={threatTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {threatTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attack Vectors */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-500/20 shadow-lg">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle>Attack Vector Analysis</CardTitle>
              <CardDescription>Most common attack methods and their trends</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attackVectorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="vector" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-400/10 border border-indigo-500/20 shadow-lg">
              <PieChart className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <CardTitle>AI-Powered Predictive Analysis</CardTitle>
              <CardDescription>AI-powered 90-day threat forecast</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictiveData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Actual Threats"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Threats"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">High-Risk Predictions</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <span className="text-sm">TechCorp Solutions</span>
                  <Badge variant="destructive">78% Risk</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <span className="text-sm">DataSystems Inc</span>
                  <Badge className="bg-orange-500">65% Risk</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Recommended Actions</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <span>Increase monitoring for cloud infrastructure vendors</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <span>Schedule quarterly risk assessments</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <span>Implement additional API security controls</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}