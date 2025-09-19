'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { getCurrentMode } from '@/lib/api-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2, Search, AlertTriangle, Calendar, Shield } from 'lucide-react'
import { Vendor, getRiskColor, getRiskBgColor } from '@/lib/data'

export function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
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

  // Fetch vendors with filters
  const { data: vendorsData, isLoading, error, refetch } = useQuery({
    queryKey: ['vendors', { risk: riskFilter, search: searchTerm, mode: currentMode }],
    queryFn: () => {
      return api.getVendors({
        risk: riskFilter !== 'all' ? riskFilter : undefined,
        search: searchTerm || undefined,
      }) as Promise<{ vendors: Vendor[] }>
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: true, // Always enabled
  })

  // Force refetch when mode changes
  useEffect(() => {
    if (currentMode === 'live') {
      refetch()
    }
  }, [currentMode, refetch])

  const vendors = vendorsData?.vendors || []


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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-500/20 shadow-lg">
              <Building2 className="h-6 w-6 text-blue-500" />
            </div>
            <span>Supply Chain Risk Assessment</span>
          </h1>
          <p className="text-muted-foreground">
            AI-powered vendor risk analysis and supply chain security monitoring
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-400/10 border border-orange-500/20 shadow-lg">
              <Shield className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle>Vendor Risk Assessment</CardTitle>
              <CardDescription>
                Comprehensive risk analysis of all monitored vendors
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vendor Grid */}
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-2 bg-muted rounded mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load vendors. Please try again.
            </div>
          ) : (
          <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${getRiskBgColor(vendor.riskScore * 100)} border-l-4 ${
                  vendor.riskScore * 100 >= 80 ? 'border-l-red-500' :
                  vendor.riskScore * 100 >= 60 ? 'border-l-orange-500' :
                  vendor.riskScore * 100 >= 40 ? 'border-l-green-500' : 'border-l-green-500'
                }`}
                onClick={() => setSelectedVendor(selectedVendor?.id === vendor.id ? null : vendor)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    {getRiskTierBadge(vendor.riskLevel)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Risk Score</span>
                    </div>
                    <span className={getRiskColor(vendor.riskScore * 100)}>
                      {(vendor.riskScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={vendor.riskScore * 100} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Active Threats</div>
                      <div className="font-medium flex items-center gap-1">
                        {vendor.threatCount > 0 && (
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        )}
                        {vendor.threatCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Last Assessment</div>
                      <div className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(vendor.lastAssessment).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {selectedVendor?.id === vendor.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-2">Critical Assets</div>
                        <div className="flex flex-wrap gap-1">
                          {vendor.criticalAssets.map((asset: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {asset}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Compliance Status</div>
                        <div className="flex flex-wrap gap-1">
                          {vendor.complianceStatus.map((status: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {status}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Export Report
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {vendors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No vendors found matching your criteria.
            </div>
          )}
          </>
        )}
        </CardContent>
      </Card>
    </div>
  )
}