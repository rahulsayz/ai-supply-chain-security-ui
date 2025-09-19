'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api-client'
// WebSocket is disabled, using EventSource for SSE instead
// import { useWebSocket } from '@/lib/websocket'
import { DashboardSkeleton } from '@/components/ui/loading-skeleton'
import { StatsCards } from './stats-cards'
import { ThreatFeed } from './threat-feed'
import { RiskChart } from './risk-chart'
import { TopVendorsAtRisk } from './top-vendors-at-risk'
import { toast } from 'sonner'

interface DashboardData {
  stats: {
    activeThreats: number
    avgRiskScore: number
    vendorsMonitored: number
    resolvedToday: number
  }
  executiveSummary: {
    title: string
    content: string
    keyFindings: Array<{
      type: string
      title: string
      description: string
    }>
  }
  recentActivity: Array<{
    timestamp: string
    type: string
    message: string
    severity: string
  }>
}

export function DashboardOverview() {
  // WebSocket is disabled, using EventSource for SSE instead
  // const { lastMessage } = useWebSocket()
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: api.getDashboardOverview,
    refetchInterval: 30000, // Refresh every 30 seconds
  }) as { data: DashboardData | undefined, isLoading: boolean, error: any }

  const { data: threatsData } = useQuery({
    queryKey: ['threats'],
    queryFn: () => api.getThreats(),
    refetchInterval: 15000, // Refresh every 15 seconds
  }) as { data: { threats: any[] } | undefined }

  const { data: vendorsData } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => api.getVendors(),
  }) as { data: { vendors: any[] } | undefined }

  // WebSocket messages are disabled, using EventSource for real-time updates instead
  // if (lastMessage?.type === 'threat_alert') {
  //   // Invalidate queries to refresh data
  //   // queryClient.invalidateQueries(['threats'])
  // }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const stats = dashboardData?.stats || {
    activeThreats: 0,
    avgRiskScore: 0,
    vendorsMonitored: 0,
    resolvedToday: 0
  }

  const threats = threatsData?.threats || []
  const vendors = vendorsData?.vendors || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supply Chain Security Command Center</h1>
          <p className="text-muted-foreground">
            Real-time AI-powered threat detection and response • BigQuery ML Analytics
          </p>
        </div>
      </div>

      <StatsCards 
        activeThreats={stats.activeThreats}
        avgRiskScore={stats.avgRiskScore}
        vendorsMonitored={stats.vendorsMonitored}
        resolvedToday={stats.resolvedToday}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ThreatFeed threats={threats.slice(0, 8)} />
        <RiskChart />
      </div>

      <TopVendorsAtRisk vendors={vendors.filter(v => v.riskScore >= 60)} />
    </div>
  )
}