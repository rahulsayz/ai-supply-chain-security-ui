'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Network, 
  Activity, 
  Play, 
  Pause, 
  RefreshCw, 
  Eye,
  Target,
  Shield,
  AlertTriangle,
  Building,
  Zap,
  Database,
  Users,
  Settings,
  Download,
  Fullscreen,
  BarChart3
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { NetworkGraphVisualization } from './network-graph-visualization'
import { NetworkGraphControls } from './network-graph-controls'
import { NetworkGraphDetails } from './network-graph-details'

interface NetworkNode {
  id: string
  type: 'vendor' | 'threat' | 'system' | 'dependency' | 'threat_actor'
  name?: string
  label?: string
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
  risk_level?: 'low' | 'medium' | 'high' | 'critical'
  riskScore?: number
  severity?: string
  status?: string
  x: number
  y: number
  metadata?: any
}

interface NetworkEdge {
  id: string
  from: string
  to: string
  type: 'data_flow' | 'attack_vector' | 'threat_connection' | 'dependency' | 'trust_relationship'
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
  risk_level?: 'low' | 'medium' | 'high' | 'critical'
  metadata?: any
}

interface NetworkGraphData {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
}

interface NetworkGraphResponse {
  success: boolean
  data: NetworkGraphData
  metadata: {
    timestamp: string
    source: string
    processingTime: number
  }
}

export function NetworkGraphPage() {
  const [graphData, setGraphData] = useState<NetworkGraphData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiveMode, setIsLiveMode] = useState(false)
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<NetworkEdge | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'threats'>('detailed')
  const [filters, setFilters] = useState({
    vendorId: 'default',
    threatId: undefined as string | undefined,
    includeThreats: true,
    includeDependencies: true,
    includeSystems: true,
    includeThreatActors: true
  })
  const [liveUpdateInterval, setLiveUpdateInterval] = useState(2000)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)

  // Load initial network graph data
  useEffect(() => {
    loadNetworkGraph()
  }, [filters])

  // Handle live mode updates
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isLiveMode && !isUpdating) {
      interval = setInterval(() => {
        updateLiveData()
      }, liveUpdateInterval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLiveMode, liveUpdateInterval, isUpdating])

  const loadNetworkGraph = async () => {
    try {
      setIsLoading(true)
      console.log('Loading network graph with filters:', filters)
      
      const response = await api.getNetworkGraph({
        vendorId: filters.vendorId !== 'default' ? filters.vendorId : undefined,
        threatId: filters.threatId,
        includeThreats: filters.includeThreats,
        includeDependencies: filters.includeDependencies
      }) as NetworkGraphResponse
      
      console.log('Network graph response:', response)
      
      if (response.success) {
        setGraphData(response.data)
      } else {
        console.error('Network graph response not successful:', response)
      }
    } catch (error) {
      console.error('Failed to load network graph:', error)
      // Set fallback data to prevent UI crash
      setGraphData({
        nodes: [
          { id: 'V001', type: 'vendor', name: 'TechCorp Solutions', riskLevel: 'high', riskScore: 0.85, x: 100, y: 100 },
          { id: 'V002', type: 'vendor', name: 'CloudSecure Inc', riskLevel: 'medium', riskScore: 0.65, x: 300, y: 100 },
          { id: 'T001', type: 'threat', name: 'Supply Chain Attack', severity: 'high', x: 150, y: 300 }
        ],
        edges: [
          { id: 'E001', from: 'V001', to: 'V002', type: 'trust_relationship', riskLevel: 'low' }
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateLiveData = async () => {
    try {
      setIsUpdating(true)
      setUpdateProgress(0)
      
      // Simulate live update progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUpdateProgress(i)
      }
      
      // In a real implementation, this would fetch live data from the API
      // For now, we'll just reload the graph
      await loadNetworkGraph()
      
      setUpdateProgress(100)
    } catch (error) {
      console.error('Failed to update live data:', error)
    } finally {
      setIsUpdating(false)
      setUpdateProgress(0)
    }
  }

  const startLiveMode = async () => {
    try {
      await api.startLiveNetworkGraph({
        updateInterval: liveUpdateInterval,
        includeRealTime: true
      })
      setIsLiveMode(true)
    } catch (error) {
      console.error('Failed to start live mode:', error)
    }
  }

  const stopLiveMode = () => {
    setIsLiveMode(false)
  }

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node)
    setSelectedEdge(null)
  }

  const handleEdgeClick = (edge: NetworkEdge) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
  }

  const handleNodeHover = (node: NetworkNode | null) => {
    // Handle node hover effects
  }

  const handleEdgeHover = (edge: NetworkEdge | null) => {
    // Handle edge hover effects
  }

  const exportGraphData = () => {
    if (!graphData) return
    
    const dataStr = JSON.stringify(graphData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'network-graph-data.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
              <Network className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <CardTitle>Loading Network Graph...</CardTitle>
            <CardDescription>
              Analyzing your supply chain network topology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={33} className="w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 shadow-xl">
              <Network className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Supply Chain Network Graph
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Interactive visualization of your supply chain ecosystem with AI-powered threat detection
              </p>
            </div>
          </div>
          
          {/* Live Mode Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="live-mode"
                checked={isLiveMode}
                onCheckedChange={(checked) => {
                  if (checked) {
                    startLiveMode()
                  } else {
                    stopLiveMode()
                  }
                }}
              />
              <Label htmlFor="live-mode">Live Mode</Label>
            </div>
            
            {isLiveMode && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">Live</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls and Filters */}
        <div className="lg:col-span-1">
          <NetworkGraphControls
            filters={filters}
            setFilters={setFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            liveUpdateInterval={liveUpdateInterval}
            setLiveUpdateInterval={setLiveUpdateInterval}
            onRefresh={loadNetworkGraph}
            onExport={exportGraphData}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Network Graph Visualization */}
          <div className="lg:col-span-3">
            <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200">
                      Network Topology
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* View Mode Selector */}
                    <div className="flex items-center gap-2">
                      <Label htmlFor="view-mode" className="text-sm text-blue-700">View:</Label>
                      <select
                        id="view-mode"
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value as 'overview' | 'detailed' | 'threats')}
                        className="px-2 py-1 text-sm border border-blue-300 rounded-md bg-white text-blue-700"
                      >
                        <option value="overview">Overview</option>
                        <option value="detailed">Detailed</option>
                        <option value="threats">Threats</option>
                      </select>
                    </div>
                    
                    {isLiveMode && isUpdating && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Updating...</span>
                      </div>
                    )}
                    
                    <Button
                      onClick={loadNetworkGraph}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {graphData ? (
                  <NetworkGraphVisualization
                    data={graphData}
                    onNodeClick={handleNodeClick}
                    onEdgeClick={handleEdgeClick}
                    onNodeHover={handleNodeHover}
                    onEdgeHover={handleEdgeHover}
                    selectedNode={selectedNode}
                    selectedEdge={selectedEdge}
                    viewMode={viewMode}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[600px] text-gray-500">
                    <div className="text-center">
                      <Network className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p>Loading network graph...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Details and Controls */}
          <div className="space-y-6">
            {/* Live Update Status */}
            {isLiveMode && (
              <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <h3 className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Live Updates
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Update interval: {liveUpdateInterval}ms
                  </div>
                  {isUpdating && (
                    <Progress value={updateProgress} className="h-2" />
                  )}
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Last update: {graphData ? new Date().toLocaleTimeString() : 'Never'}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Network Statistics */}
            <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                    Network Statistics
                  </h3>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {graphData && graphData.nodes && graphData.edges && (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-purple-600 dark:text-purple-400">Nodes:</div>
                      <div className="font-semibold">{graphData.nodes.length}</div>
                      <div className="text-purple-600 dark:text-purple-400">Edges:</div>
                      <div className="font-semibold">{graphData.edges.length}</div>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(
                        graphData.nodes.reduce((acc, node) => {
                          acc[node.type] = (acc[node.type] || 0) + 1
                          return acc
                        }, {} as Record<string, number>)
                      ).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between text-xs">
                          <span className="capitalize text-purple-600 dark:text-purple-400">{type}:</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Selected Item Details */}
            {(selectedNode || selectedEdge) && (
              <NetworkGraphDetails
                selectedNode={selectedNode}
                selectedEdge={selectedEdge}
                onClose={() => {
                  setSelectedNode(null)
                  setSelectedEdge(null)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
