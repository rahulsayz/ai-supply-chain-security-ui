'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { api, AnalyticsResponse } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

export function RiskChart() {
  // Fetch analytics trends from API
  const { data: analyticsResponse, isLoading, error } = useQuery<AnalyticsResponse>({
    queryKey: ['analytics-trends'],
    queryFn: () => api.getAnalyticsTrends(),
    refetchInterval: 300000, // Refresh every 5 minutes
    retry: 2,
  })

  // Get analytics data from API response with fallback
  const analyticsData = analyticsResponse?.data?.timeSeriesData || []

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-500/20 shadow-lg">
              <BarChart3 className="h-5 w-5 text-blue-500 animate-pulse" />
            </div>
            <div>
              <CardTitle>AI Risk Analytics Trend</CardTitle>
              <CardDescription>Loading analytics data...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !analyticsData.length) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-500/20 shadow-lg">
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle>AI Risk Analytics Trend</CardTitle>
              <CardDescription>Unable to load analytics data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-muted-foreground">No analytics data available</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-500/20 shadow-lg">
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <CardTitle>AI Risk Analytics Trend</CardTitle>
            <CardDescription>
              7-day BigQuery ML risk assessment progression
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: number, name: string) => [
                `${value}${name === 'riskScore' ? '%' : ''}`,
                name === 'riskScore' ? 'Risk Score' : 'Threats'
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="riskScore" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="threats" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}