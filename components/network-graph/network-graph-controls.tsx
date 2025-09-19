'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Filter, 
  Eye, 
  Target, 
  Shield, 
  AlertTriangle, 
  Building,
  Database,
  Users,
  Download,
  Settings,
  RefreshCw
} from 'lucide-react'

interface NetworkGraphControlsProps {
  filters: {
    vendorId: string
    threatId?: string
    includeThreats: boolean
    includeDependencies: boolean
    includeSystems: boolean
    includeThreatActors: boolean
  }
  setFilters: (filters: any) => void
  viewMode: 'overview' | 'detailed' | 'threats'
  setViewMode: (mode: 'overview' | 'detailed' | 'threats') => void
  liveUpdateInterval: number
  setLiveUpdateInterval: (interval: number) => void
  onRefresh: () => void
  onExport: () => void
}

export function NetworkGraphControls({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  liveUpdateInterval,
  setLiveUpdateInterval,
  onRefresh,
  onExport
}: NetworkGraphControlsProps) {
  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'vendor':
        return <Building className="h-4 w-4" />
      case 'threat':
        return <AlertTriangle className="h-4 w-4" />
      case 'system':
        return <Database className="h-4 w-4" />
      case 'dependency':
        return <Shield className="h-4 w-4" />
      case 'threat_actor':
        return <Users className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'vendor':
        return 'bg-blue-500'
      case 'threat':
        return 'bg-red-500'
      case 'system':
        return 'bg-green-500'
      case 'dependency':
        return 'bg-purple-500'
      case 'threat_actor':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getNodeTypeLabel = (type: string) => {
    switch (type) {
      case 'vendor':
        return 'Vendors'
      case 'threat':
        return 'Threats'
      case 'system':
        return 'Systems'
      case 'dependency':
        return 'Dependencies'
      case 'threat_actor':
        return 'Threat Actors'
      default:
        return type
    }
  }

  const getViewModeIcon = (mode: string) => {
    switch (mode) {
      case 'overview':
        return <Eye className="h-4 w-4" />
      case 'detailed':
        return <Target className="h-4 w-4" />
      case 'threats':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getViewModeLabel = (mode: string) => {
    switch (mode) {
      case 'overview':
        return 'Overview'
      case 'detailed':
        return 'Detailed'
      case 'threats':
        return 'Threat Focus'
      default:
        return mode
    }
  }

  return (
    <Card className="border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Graph Controls & Filters
          </h3>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Analysis Target Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Analysis Target
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={filters.vendorId !== 'default' ? 'vendor' : 'threat'}
              onValueChange={(value) => {
                if (value === 'vendor') {
                  setFilters({ ...filters, vendorId: 'V001', threatId: undefined })
                } else {
                  setFilters({ ...filters, vendorId: 'default', threatId: 'T001' })
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendor">Vendor Analysis</SelectItem>
                <SelectItem value="threat">Threat Analysis</SelectItem>
              </SelectContent>
            </Select>
            
            {filters.vendorId !== 'default' ? (
              <Select
                value={filters.vendorId}
                onValueChange={(value) => setFilters({ ...filters, vendorId: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="V001">TechCorp Solutions</SelectItem>
                  <SelectItem value="V002">CloudSecure Inc</SelectItem>
                  <SelectItem value="V003">DataFlow Systems</SelectItem>
                  <SelectItem value="V004">SecureNet Pro</SelectItem>
                  <SelectItem value="V005">CyberShield Ltd</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Select
                value={filters.threatId || 'T001'}
                onValueChange={(value) => setFilters({ ...filters, threatId: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T001">Supply Chain Attack</SelectItem>
                  <SelectItem value="T002">Data Breach</SelectItem>
                  <SelectItem value="T003">Ransomware</SelectItem>
                  <SelectItem value="T004">Credential Compromise</SelectItem>
                  <SelectItem value="T005">Insider Threat</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* View Mode Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            View Mode
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {(['overview', 'detailed', 'threats'] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="flex items-center gap-2"
              >
                {getViewModeIcon(mode)}
                {getViewModeLabel(mode)}
              </Button>
            ))}
          </div>
        </div>

        {/* Node Type Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Node Types
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(filters)
              .filter(([key]) => key.startsWith('include'))
              .map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <Switch
                    id={key}
                    checked={value as boolean}
                    onCheckedChange={(checked) => setFilters({ ...filters, [key]: checked })}
                  />
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getNodeTypeColor(key.replace('include', '').toLowerCase())}`}></div>
                    <Label htmlFor={key} className="text-sm text-gray-600 dark:text-gray-400">
                      {getNodeTypeLabel(key.replace('include', '').toLowerCase())}
                    </Label>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Live Update Settings */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Update Interval
          </Label>
          <Select
            value={liveUpdateInterval.toString()}
            onValueChange={(value) => setLiveUpdateInterval(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">1 second</SelectItem>
              <SelectItem value="2000">2 seconds</SelectItem>
              <SelectItem value="5000">5 seconds</SelectItem>
              <SelectItem value="10000">10 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button
            onClick={onExport}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Node Legend
          </Label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['vendor', 'threat', 'system', 'dependency', 'threat_actor'] as const).map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getNodeTypeColor(type)}`}></div>
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {getNodeTypeLabel(type)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Edge Legend */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Edge Types
          </Label>
          <div className="space-y-2 text-xs">
            {([
              { type: 'data_flow', label: 'Data Flow', color: 'bg-blue-500' },
              { type: 'attack_vector', label: 'Attack Vector', color: 'bg-red-500' },
              { type: 'threat_connection', label: 'Threat Connection', color: 'bg-orange-500' },
              { type: 'dependency', label: 'Dependency', color: 'bg-purple-500' },
              { type: 'trust_relationship', label: 'Trust Relationship', color: 'bg-green-500' }
            ]).map((edge) => (
              <div key={edge.type} className="flex items-center gap-2">
                <div className={`w-3 h-2 rounded-full ${edge.color}`}></div>
                <span className="text-gray-600 dark:text-gray-400">
                  {edge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
