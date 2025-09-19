'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Clock, ExternalLink, Shield, Activity } from 'lucide-react'
import { Threat, getSeverityColor } from '@/lib/data'
import { formatDistanceToNow } from 'date-fns'

interface ThreatFeedProps {
  threats: Threat[]
  isLoading?: boolean
}

export function ThreatFeed({ threats, isLoading = false }: ThreatFeedProps) {
  const getSeverityBadge = (severity: number) => {
    if (severity >= 9) return <Badge variant="destructive" className="font-bold">Critical</Badge>
    if (severity >= 7) return <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold">High</Badge>
    if (severity >= 5) return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold">Medium</Badge>
    return <Badge variant="secondary" className="font-medium">Low</Badge>
  }

  const getThreatClass = (severity: number) => {
    if (severity >= 9) return 'threat-critical'
    if (severity >= 7) return 'threat-high'
    if (severity >= 5) return 'threat-medium'
    return 'threat-low'
  }

  return (
    <Card className="enterprise-card col-span-1">
                <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-400/10 border border-red-500/20 shadow-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
          <div>
            <CardTitle className="text-lg font-semibold">Live Threat Intelligence Feed</CardTitle>
            <CardDescription className="text-sm mt-1">
              AI-powered real-time threat detection across your supply chain ecosystem
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg border border-border/30 animate-pulse">
                <div className="w-3 h-3 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-48" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : threats.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-500/20 shadow-lg mx-auto mb-3">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">No Active Threats</h3>
            <p className="text-muted-foreground">Your supply chain is currently secure</p>
          </div>
        ) : (
          <div className="space-y-3">
            {threats.map((threat) => (
              <div 
                key={threat.id} 
                className={`flex items-start space-x-3 p-3 rounded-lg border border-border/30 hover:border-border/50 transition-all duration-200 group ${getThreatClass(threat.severity)}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-foreground">{threat.vendorName}</span>
                    {getSeverityBadge(threat.severity)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{threat.threatType}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span suppressHydrationWarning>
                        {formatDistanceToNow(new Date(threat.detectionTime), { addSuffix: true })}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 font-medium ${getSeverityColor(threat.severity)}`}>
                      <Activity className="h-3 w-3" />
                      <span>Risk: {(threat.aiRiskScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="shrink-0 hover:bg-muted/80 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}