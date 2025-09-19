'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api-client'
// WebSocket is disabled, using EventSource for SSE instead
// import { useWebSocket } from '@/lib/websocket'
import { DashboardSkeleton } from '@/components/ui/loading-skeleton'
import { AIRiskPredictor } from './ai-risk-predictor'
import { LiveAIAnalysisTheater } from './live-ai-analysis-theater'
import { AIExecutiveBrief } from './ai-executive-brief'

import { AIImpactMetrics } from './ai-impact-metrics'
import { API_CONFIG, getCurrentMode } from '@/lib/api-config'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { Shield, Activity, Brain, Zap, TrendingUp, Target } from 'lucide-react'

interface DashboardData {
  stats: {
    activeThreats: number
    avgRiskScore: number
    vendorsMonitored: number
    resolvedToday: number
  }
}

interface ThreatsApiResponse {
  threats: Array<{
    id: string
    vendorName: string
    threatType: string
    severity: number
    aiRiskScore: number
    status: 'active' | 'investigating' | 'resolved'
    detectionTime: string
    description: string
    affectedSystems: string[]
    remediationSteps: string[]
    similarThreats: string[]
    timeline: Array<{
      timestamp: string
      event: string
      description: string
      actor: string
    }>
  }>
  pagination: {
    total: number
    page: number
    limit: number
  }
}

interface VendorsApiResponse {
  vendors: Array<{
    id: string
    name: string
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    riskScore: number
    threatCount: number
    lastAssessment: string
    complianceStatus: string[]
    criticalAssets: string[]
  }>
  riskDistribution: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

export function EnhancedDashboardOverview() {
  // WebSocket is disabled, using EventSource for SSE instead
  // const { lastMessage, isConnected: wsConnected } = useWebSocket()
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
  
  // Fetch dashboard data with enhanced error handling
  const { 
    data: dashboardData, 
    isLoading: dashboardLoading, 
    error: dashboardError,
    refetch: refetchDashboard,
    dataUpdatedAt
  } = useQuery({
    queryKey: ['dashboard-overview', { mode: currentMode }],
    queryFn: () => {
      return api.getDashboardOverview()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry if we're in static mode and getting network errors
      if (currentMode === 'static') return false
      if (error?.code === 'ECONNREFUSED') return failureCount < 2
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
  }) as { 
    data: DashboardData | undefined
    isLoading: boolean
    error: any
    refetch: any
    dataUpdatedAt: number
  }

  // Fetch threats data
  const { 
    data: threatsData, 
    isLoading: threatsLoading,
    error: threatsError,
    refetch: refetchThreats
  } = useQuery<ThreatsApiResponse>({
    queryKey: ['threats', { mode: currentMode }],
    queryFn: () => {
      return api.getThreats() as Promise<ThreatsApiResponse>
    },
    refetchInterval: 15000, // Refresh every 15 seconds
    retry: 2,
  })

  // Fetch vendors data
  const { 
    data: vendorsData, 
    isLoading: vendorsLoading,
    error: vendorsError,
    refetch: refetchVendors
  } = useQuery<VendorsApiResponse>({
    queryKey: ['vendors', { mode: currentMode }],
    queryFn: () => {
      return api.getVendors() as Promise<VendorsApiResponse>
    },
    refetchInterval: 60000, // Refresh every minute
    retry: 2,
  })

  // Force refetch when mode changes
  useEffect(() => {
    if (currentMode === 'live') {
      refetchDashboard()
      refetchThreats()
      refetchVendors()
    }
  }, [currentMode, refetchDashboard, refetchThreats, refetchVendors])

  // WebSocket messages are disabled, using EventSource for SSE instead
  // if (lastMessage?.type === 'threat_alert') {
  //   // Invalidate and refetch relevant data
  //   refetchDashboard()
  //   refetchThreats()
  //   toast.success('New Threat Detected', {
  //     description: 'Dashboard data refreshed automatically'
  //   })
  // }

  // Handle dashboard loading state - only show skeleton if all data is loading
  if (dashboardLoading && threatsLoading && vendorsLoading) {
    return (
      <DashboardSkeleton />
    )
  }

  // Handle dashboard error state
  if (dashboardError) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={refetchDashboard} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Extract data with fallbacks
  const stats = dashboardData?.stats || {
    activeThreats: 0,
    avgRiskScore: 0,
    vendorsMonitored: 0,
    resolvedToday: 0
  }

  const threats = threatsData?.threats || []
  const vendors = vendorsData?.vendors || []

  return (
    <div className="space-y-8">
      {/* Enhanced AI-Centric Header */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-blue-500/20 border border-primary/30 shadow-xl">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent">
                  AI Supply Chain Risk Predictor
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  Predictive intelligence powered by BigQuery AI • What traditional SOC tools cannot do
                </p>
              </div>
            </div>
          </div>
          
          {/* AI Status Indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-500/30 shadow-lg backdrop-blur-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">AI Active</span>
            </div>
            {currentMode === 'live' && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-400/20 border border-blue-500/30 shadow-lg backdrop-blur-sm">
                <Zap className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">Live Mode</span>
              </div>
            )}
            {/* WebSocket connection status removed - using EventSource for SSE instead */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-400/20 border border-purple-500/30 shadow-lg backdrop-blur-sm">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">EventSource SSE</span>
            </div>
          </div>
        </div>
        
        {/* AI Processing Status */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground bg-gradient-to-r from-white/10 to-blue-500/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Last AI update: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never'}</span>
          </div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
          <span>AI Processing: {currentMode === 'live' ? 'Real-time' : 'Static mode'}</span>
          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
          <span>BigQuery AI: Active</span>
        </div>
      </div>

      {/* AI Risk Predictor - Top Center */}
      <AIRiskPredictor 
        threats={threats}
        vendors={vendors}
        isLoading={threatsLoading || vendorsLoading}
      />

      {/* Main AI Dashboard Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Live AI Analysis Theater - Left Panel */}
        <LiveAIAnalysisTheater 
          currentMode={currentMode}
          wsConnected={false} // WebSocket disabled, using EventSource for SSE instead
        />

        {/* AI-Generated Executive Brief - Right Panel */}
        <AIExecutiveBrief 
          dashboardData={dashboardData}
          threats={threats}
          vendors={vendors}
        />
      </div>



      {/* AI Impact Metrics - Bottom */}
      <AIImpactMetrics 
        stats={stats}
        currentMode={currentMode}
      />
    </div>
  )
}