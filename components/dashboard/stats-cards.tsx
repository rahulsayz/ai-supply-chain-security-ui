'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { 
  AlertTriangle, 
  Shield, 
  Building2, 
  CheckCircle 
} from 'lucide-react'

interface StatsCardsProps {
  activeThreats: number
  avgRiskScore: number
  vendorsMonitored: number
  resolvedToday: number
}

export function StatsCards({
  activeThreats,
  avgRiskScore,
  vendorsMonitored,
  resolvedToday
}: StatsCardsProps) {
  const cards = [
    {
      title: 'Active Threats',
      value: activeThreats,
      description: 'Real-time threat count',
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-gradient-to-br from-red-500/20 to-red-400/10',
      borderColor: 'border-red-500/20',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'AI Risk Score',
      value: `${(avgRiskScore * 100).toFixed(0)}%`,
      description: 'Average risk assessment',
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-green-400/10',
      borderColor: 'border-green-500/20',
      trend: '+5%',
      trendUp: false
    },
    {
      title: 'Vendors Monitored',
      value: vendorsMonitored,
      description: 'Supply chain coverage',
      icon: Building2,
      color: 'text-blue-500',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-400/10',
      borderColor: 'border-blue-500/20',
      trend: '+2',
      trendUp: true
    },
    {
      title: 'Resolved Today',
      value: resolvedToday,
      description: 'Threats neutralized',
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-gradient-to-br from-emerald-500/20 to-emerald-400/10',
      borderColor: 'border-emerald-500/20',
      trend: '+3',
      trendUp: true
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="stats-card enterprise-card group">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div className="flex items-start gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${card.bgColor} ${card.borderColor} border shadow-lg shrink-0`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-none">
                  {card.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                {card.trendUp ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                {card.trend}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-3xl font-bold tracking-tight leading-none">{card.value}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                <span>from yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}