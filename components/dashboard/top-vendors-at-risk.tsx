'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'
import { Vendor, getRiskColor } from '@/lib/data'

interface TopVendorsAtRiskProps {
  vendors: Vendor[]
  isLoading?: boolean
}

export function TopVendorsAtRisk({ vendors, isLoading = false }: TopVendorsAtRiskProps) {
  const sortedVendors = vendors.sort((a, b) => b.riskScore - a.riskScore).slice(0, 6)

  const getRiskTierBadge = (tier: Vendor['riskLevel']) => {
    switch (tier) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>
      default:
        return <Badge variant="secondary">Low</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-400/10 border border-purple-500/20 shadow-lg">
            <Building2 className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <CardTitle>Critical Vendor Risk Matrix</CardTitle>
            <CardDescription>
              AI-identified vendors requiring immediate SOC attention
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg border animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-5 bg-muted rounded w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded w-full" />
                  <div className="flex justify-between">
                    <div className="h-3 bg-muted rounded w-16" />
                    <div className="h-3 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedVendors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No high-risk vendors found
          </div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedVendors.map((vendor) => (
            <div key={vendor.id} className="p-4 rounded-lg border bg-card/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{vendor.name}</h4>
                {getRiskTierBadge(vendor.riskLevel)}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Score</span>
                  <span className={getRiskColor(vendor.riskScore * 100)}>
                    {(vendor.riskScore * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={vendor.riskScore * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{vendor.threatCount} active threats</span>
                  <span>Updated {vendor.lastAssessment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  )
}