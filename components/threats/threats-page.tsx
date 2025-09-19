'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { getCurrentMode } from '@/lib/api-config'
import { ThreatListSkeleton } from '@/components/ui/loading-skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertTriangle, Search, Filter, Eye, CheckCircle } from 'lucide-react'
import { Threat, getSeverityColor } from '@/lib/data'
import { formatDistanceToNow } from 'date-fns'
import { ThreatDetailModal } from './threat-detail-modal'

export function ThreatsPage() {
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
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

  // Fetch threats with filters
  const { data: threatsData, isLoading, error, refetch } = useQuery({
    queryKey: ['threats', { status: statusFilter, severity: severityFilter, search: searchTerm, mode: currentMode }],
    queryFn: () => {
      return api.getThreats({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        severity: severityFilter !== 'all' ? severityFilter : undefined,
        search: searchTerm || undefined,
      }) as Promise<{ success: boolean; data: Threat[]; metadata: any }>
    },
    refetchInterval: 15000, // Refresh every 15 seconds
    enabled: true, // Always enabled
  })

  // Force refetch when mode changes
  useEffect(() => {
    if (currentMode === 'live') {
      refetch()
    }
  }, [currentMode, refetch])

  const threats = threatsData?.data || []

  const filteredThreats = threats.filter(threat => {
    const matchesSearch = threat.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.threatType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || threat.status === statusFilter
    
    const matchesSeverity = severityFilter === 'all' || 
      (severityFilter === 'critical' && threat.severity >= 9) ||
      (severityFilter === 'high' && threat.severity >= 7 && threat.severity < 9) ||
      (severityFilter === 'medium' && threat.severity >= 5 && threat.severity < 7) ||
      (severityFilter === 'low' && threat.severity < 5)

    return matchesSearch && matchesStatus && matchesSeverity
  })

  const getSeverityBadge = (severity: number) => {
    if (severity >= 9) return <Badge variant="destructive">Critical</Badge>
    if (severity >= 7) return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>
    if (severity >= 5) return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>
    return <Badge variant="secondary">Low</Badge>
  }

  const getStatusBadge = (status: Threat['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive">Active</Badge>
      case 'investigating':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Investigating</Badge>
      case 'resolved':
        return <Badge variant="secondary">Resolved</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-400/10 border border-red-500/20 shadow-lg">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <span>Threat Intelligence Center</span>
          </h1>
          <p className="text-muted-foreground">
            AI-powered threat detection and incident response management
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-400/10 border border-orange-500/20 shadow-lg">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle>Active Threats</CardTitle>
              <CardDescription>
                Real-time threat detection and analysis powered by AI
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
                placeholder="Search threats, vendors, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Threats Table */}
          {isLoading ? (
            <ThreatListSkeleton />
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load threats. Please try again.
            </div>
          ) : (
            <>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Threat ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>AI Risk Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Detection Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredThreats.map((threat) => (
                      <TableRow key={threat.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{threat.id}</TableCell>
                        <TableCell className="font-medium">{threat.vendorName}</TableCell>
                        <TableCell>{threat.threatType}</TableCell>
                        <TableCell>{getSeverityBadge(threat.severity)}</TableCell>
                        <TableCell>
                          <span className={getSeverityColor(threat.severity)}>
                            {(threat.aiRiskScore * 100).toFixed(0)}%
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(threat.status)}</TableCell>
                        <TableCell className="text-sm">
                          <span suppressHydrationWarning>
                            {formatDistanceToNow(new Date(threat.detectionTime), { addSuffix: true })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedThreat(threat)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {threat.status !== 'resolved' && (
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredThreats.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No threats found matching your criteria.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedThreat && (
        <ThreatDetailModal
          threat={selectedThreat}
          open={!!selectedThreat}
          onClose={() => setSelectedThreat(null)}
        />
      )}
    </div>
  )
}