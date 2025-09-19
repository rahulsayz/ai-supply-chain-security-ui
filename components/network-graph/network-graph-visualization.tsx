'use client'

import React, { useCallback, useMemo, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  EdgeTypes,
  NodeTypes,
  Position,
  MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'
import { 
  Building, 
  AlertTriangle, 
  Database, 
  Shield, 
  Users, 
  Target,
  Network,
  Settings
} from 'lucide-react'

interface NetworkNode {
  id: string
  type: 'vendor' | 'threat' | 'system' | 'dependency' | 'threat_actor'
  name?: string
  label?: string
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
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

interface NetworkGraphVisualizationProps {
  data: NetworkGraphData
  onNodeClick: (node: NetworkNode) => void
  onEdgeClick: (edge: NetworkEdge) => void
  onNodeHover: (node: NetworkNode | null) => void
  onEdgeHover: (edge: NetworkEdge | null) => void
  selectedNode: NetworkNode | null
  selectedEdge: NetworkEdge | null
  viewMode: 'overview' | 'detailed' | 'threats'
}

// Custom Node Component for better styling
function CustomNode({ data, selected }: { data: any; selected: boolean }) {
  // Debug: Log the data received by this node
  console.log('🔍 CustomNode data:', JSON.stringify(data, null, 2))
  
  const getNodeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return ['#dc2626', '#ef4444', '#b91c1c']
      case 'high': return ['#ea580c', '#f97316', '#c2410c']
      case 'medium': return ['#ca8a04', '#eab308', '#a16207']
      case 'low': return ['#16a34a', '#22c55e', '#15803d']
      default: return ['#3b82f6', '#60a5fa', '#2563eb']
    }
  }
  
  // Get risk level from either riskLevel or risk_level property
  const getRiskLevel = (data: any) => {
    return data.riskLevel || data.risk_level || 'low'
  }

  const getNodeIcon = (type: string) => {
    const iconClass = "h-5 w-5 text-white"
    switch (type) {
      case 'vendor': return <Building className={iconClass} />
      case 'threat': return <AlertTriangle className={iconClass} />
      case 'system': return <Database className={iconClass} />
      case 'dependency': return <Shield className={iconClass} />
      case 'threat_actor': return <Users className={iconClass} />
      default: return <Target className={iconClass} />
    }
  }

  const getNodeSize = (riskScore?: number) => {
    if (riskScore && typeof riskScore === 'number' && !isNaN(riskScore)) {
      return Math.max(60, Math.min(100, 60 + (riskScore * 40)))
    }
    return 70
  }

  const size = getNodeSize(data.riskScore)
  const isHighRisk = getRiskLevel(data) === 'critical' || getRiskLevel(data) === 'high'

  return (
    <div className={`relative ${selected ? 'z-50' : ''}`}>
      {/* Main Node */}
      <div
        className={`
          relative rounded-full transition-all duration-300 cursor-pointer
          ${selected ? 'border-purple-500 scale-110 shadow-2xl' : 'border-white/30'}
          ${isHighRisk ? 'animate-pulse' : ''}
        `}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 30%, ${getNodeColor(getRiskLevel(data))[1]}, ${getNodeColor(getRiskLevel(data))[0]}, ${getNodeColor(getRiskLevel(data))[2]})`,
          boxShadow: selected 
            ? '0 25px 50px -12px rgba(168, 85, 247, 0.4), 0 0 0 4px rgba(168, 85, 247, 0.1)'
            : `0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.3)`
        }}
      >
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
            {getNodeIcon(data.type)}
          </div>
        </div>
        
        {/* Risk Score Badge */}
        {data.riskScore && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
            {Math.round(data.riskScore * 100)}%
          </div>
        )}
      </div>
      
      {/* Node Label */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
        <div className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 shadow-xl border border-white/50">
          <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
            {data.label || data.name || data.title || data.displayName || data.id || 'Unknown'}
          </span>
        </div>
      </div>
      
      {/* Risk Level Indicator */}
      {getRiskLevel(data) && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg border-2 border-white/50"
            style={{
              background: `linear-gradient(135deg, ${getNodeColor(getRiskLevel(data))[0]}, ${getNodeColor(getRiskLevel(data))[1]})`
            }}
          >
            {getRiskLevel(data).toUpperCase()}
          </div>
        </div>
      )}
    </div>
  )
}

export function NetworkGraphVisualization({
  data,
  onNodeClick,
  onEdgeClick,
  onNodeHover,
  onEdgeHover,
  selectedNode,
  selectedEdge,
  viewMode
}: NetworkGraphVisualizationProps) {
  console.log('🎯 NetworkGraphVisualization received data:', {
    hasData: !!data,
    nodesCount: data?.nodes?.length || 0,
    edgesCount: data?.edges?.length || 0,
    nodes: data?.nodes?.slice(0, 3), // Show first 3 nodes
    edges: data?.edges?.slice(0, 3)   // Show first 3 edges
  })
  
  // Debug: Check the first node structure
  if (data?.nodes?.length > 0) {
    const firstNode = data.nodes[0] as any
    console.log('🔍 First node structure:', JSON.stringify(firstNode, null, 2))
    console.log('🔍 Available properties:', Object.keys(firstNode))
    console.log('🔍 First node name property:', firstNode.name)
    console.log('🔍 First node label property:', firstNode.label)
    console.log('🔍 First node title property:', firstNode.title)
    console.log('🔍 First node displayName property:', firstNode.displayName)
  }
  
  // Early return if data is not available
  if (!data || !data.nodes || !data.edges || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
    console.log('❌ Early return - data validation failed')
    return (
      <div className="flex items-center justify-center h-[600px] text-gray-500">
        <div className="text-center">
          <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p>No network graph data available</p>
        </div>
      </div>
    )
  }

  // Convert data to React Flow format with intelligent positioning
  const reactFlowNodes: Node[] = useMemo(() => {
    console.log('🔍 Processing nodes for React Flow:', data.nodes)
    
    const centerX = 500
    const centerY = 350
    const containerWidth = 800
    const containerHeight = 600
    
    // Group nodes by type for better clustering
    const nodeGroups = {
      vendor: data.nodes.filter(n => n.type === 'vendor'),
      system: data.nodes.filter(n => n.type === 'system'),
      threat: data.nodes.filter(n => n.type === 'threat'),
      dependency: data.nodes.filter(n => n.type === 'dependency'),
      threat_actor: data.nodes.filter(n => n.type === 'threat_actor')
    }
    
    console.log('📊 Node groups:', {
      vendor: nodeGroups.vendor.length,
      system: nodeGroups.system.length,
      threat: nodeGroups.threat.length,
      dependency: nodeGroups.dependency.length,
      threat_actor: nodeGroups.threat_actor.length
    })
    
    const nodes: Node[] = []
    
    // Position vendor nodes (top section - wider spread)
    nodeGroups.vendor.forEach((node, index) => {
      const totalVendors = Math.max(nodeGroups.vendor.length, 1)
      const angle = (index / totalVendors) * Math.PI - Math.PI/2
      const radius = 280
      const x = centerX + Math.cos(angle) * radius
      const y = centerY - 200 + Math.sin(angle) * (radius * 0.4)
      
      nodes.push({
        id: node.id,
        type: 'custom',
        position: { x, y },
        data: {
          ...node,
          label: node.label || node.name || 'Unknown'
        }
      })
    })
    
    // Position system nodes (center section - medium spread)
    nodeGroups.system.forEach((node, index) => {
      const totalSystems = Math.max(nodeGroups.system.length, 1)
      const angle = (index / totalSystems) * 2 * Math.PI
      const radius = 200
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      
      nodes.push({
        id: node.id,
        type: 'custom',
        position: { x, y },
        data: {
          ...node,
          label: node.label || node.name || 'Unknown'
        }
      })
    })
    
    // Position threat nodes (bottom left section - wider spread)
    nodeGroups.threat.forEach((node, index) => {
      const totalThreats = Math.max(nodeGroups.threat.length, 1)
      const angle = (index / totalThreats) * Math.PI + Math.PI/2
      const radius = 220
      const x = centerX - 320 + Math.cos(angle) * radius
      const y = centerY + 180 + Math.sin(angle) * (radius * 0.5)
      
      nodes.push({
        id: node.id,
        type: 'custom',
        position: { x, y },
        data: {
          ...node,
          label: node.label || node.name || 'Unknown'
        }
      })
    })
    
    // Position dependency nodes (bottom right section - wider spread)
    nodeGroups.dependency.forEach((node, index) => {
      const totalDependencies = Math.max(nodeGroups.dependency.length, 1)
      const angle = (index / totalDependencies) * Math.PI + Math.PI/2
      const radius = 220
      const x = centerX + 320 + Math.cos(angle) * radius
      const y = centerY + 180 + Math.sin(angle) * (radius * 0.5)
      
      nodes.push({
        id: node.id,
        type: 'custom',
        position: { x, y },
        data: {
          ...node,
          label: node.label || node.name || 'Unknown'
        }
      })
    })
    
    // Position threat actor nodes (left section - wider spread)
    nodeGroups.threat_actor.forEach((node, index) => {
      const totalActors = Math.max(nodeGroups.threat_actor.length, 1)
      const angle = (index / totalActors) * Math.PI
      const radius = 180
      const x = centerX - 320 + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * (radius * 0.6)
      
      nodes.push({
        id: node.id,
        type: 'custom',
        position: { x, y },
        data: {
          ...node,
          label: node.label || node.name || 'Unknown'
        }
      })
    })
    
    console.log('✅ React Flow nodes created:', nodes.length)
    
    // Apply collision detection and spacing adjustment
    const adjustedNodes = nodes.map((node, index) => {
      let adjustedX = node.position.x
      let adjustedY = node.position.y
      
      // Check for collisions with previous nodes
      for (let i = 0; i < index; i++) {
        const prevNode = nodes[i]
        const dx = node.position.x - prevNode.position.x
        const dy = node.position.y - prevNode.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const minDistance = 120 // Minimum distance between nodes
        
        if (distance < minDistance && distance > 0) {
          const angle = Math.atan2(dy, dx)
          const pushDistance = minDistance - distance
          adjustedX += Math.cos(angle) * pushDistance * 0.5
          adjustedY += Math.sin(angle) * pushDistance * 0.5
        }
      }
      
      // Ensure nodes stay within container bounds
      adjustedX = Math.max(50, Math.min(containerWidth - 50, adjustedX))
      adjustedY = Math.max(50, Math.min(containerHeight - 50, adjustedY))
      
      return {
        ...node,
        position: { x: adjustedX, y: adjustedY }
      }
    })
    
    console.log('✅ Nodes adjusted for spacing:', adjustedNodes.length)
    return adjustedNodes
  }, [data.nodes])

  // Convert edges to React Flow format
  const reactFlowEdges: Edge[] = useMemo(() => {
    console.log('🔍 Processing edges for React Flow:', data.edges)
    
    const edges = data.edges.map(edge => {
      const getEdgeStyle = (edgeType: string, riskLevel: string) => {
        let strokeDasharray = ''
        let strokeWidth = 2
        
        switch (edgeType) {
          case 'attack_vector':
            strokeDasharray = '10,5'
            strokeWidth = 4
            break
          case 'threat_connection':
            strokeDasharray = '5,5'
            strokeWidth = 3
            break
          case 'dependency':
            strokeDasharray = '3,3'
            strokeWidth = 2
            break
          case 'data_flow':
            strokeDasharray = ''
            strokeWidth = 3
            break
          case 'trust_relationship':
            strokeDasharray = '8,4'
            strokeWidth = 2
            break
          default:
            strokeWidth = 2
        }
        
        let strokeColor = '#6b7280'
        let glowColor = ''
        
        switch (riskLevel) {
          case 'critical': 
            strokeColor = '#dc2626'
            glowColor = '#fecaca'
            break
          case 'high': 
            strokeColor = '#ea580c'
            glowColor = '#fed7aa'
            break
          case 'medium': 
            strokeColor = '#ca8a04'
            glowColor = '#fef3c7'
            break
          case 'low': 
            strokeColor = '#16a34a'
            glowColor = '#bbf7d0'
            break
        }
        
        return {
          strokeDasharray,
          strokeWidth,
          stroke: strokeColor,
          filter: glowColor ? `drop-shadow(0 0 8px ${glowColor})` : undefined
        }
      }
      
      const style = getEdgeStyle(edge.type, edge.riskLevel || edge.risk_level || 'low')
      
      return {
        id: edge.id,
        source: edge.from,
        target: edge.to,
        type: 'smoothstep',
        style,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 24,
          height: 24,
          color: style.stroke
        },
        data: {
          ...edge,
          label: edge.type.replace('_', ' ').toUpperCase()
        }
      }
    })
    
    console.log('✅ React Flow edges created:', edges.length)
    return edges
  }, [data.edges])

  // Filter nodes and edges based on view mode
  const filteredNodes = useMemo(() => {
    let result: Node[]
    
    switch (viewMode) {
      case 'threats':
        result = reactFlowNodes.filter(node => 
          node.data.type === 'threat' || node.data.type === 'threat_actor'
        )
        break
      case 'detailed':
        result = reactFlowNodes
        break
      default:
        result = reactFlowNodes.filter(node => 
          node.data.type === 'vendor' || node.data.type === 'system'
        )
    }
    
    console.log('🔍 Filtered nodes by view mode:', {
      viewMode,
      totalNodes: reactFlowNodes.length,
      filteredNodes: result.length,
      nodeTypes: result.map(n => n.data.type)
    })
    
    return result
  }, [reactFlowNodes, viewMode])

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id))
    
    // For detailed view, show all edges
    if (viewMode === 'detailed') {
      console.log('🔍 Detailed view - showing all edges:', reactFlowEdges.length)
      return reactFlowEdges
    }
    
    // For other views, filter edges to only show connections between visible nodes
    const result = reactFlowEdges.filter(edge => 
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    )
    
    console.log('🔍 Filtered edges:', {
      viewMode,
      totalEdges: reactFlowEdges.length,
      filteredEdges: result.length,
      nodeIds: Array.from(nodeIds)
    })
    
    return result
  }, [reactFlowEdges, filteredNodes, viewMode])

  const [nodes, setNodes, onNodesChange] = useNodesState(filteredNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(filteredEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleNodeClick = useCallback((event: any, node: Node) => {
    const originalNode = data.nodes.find(n => n.id === node.id)
    if (originalNode) {
      onNodeClick(originalNode)
    }
  }, [data.nodes, onNodeClick])

  const handleEdgeClick = useCallback((event: any, edge: Edge) => {
    const originalEdge = data.edges.find(e => e.id === edge.id)
    if (originalEdge) {
      onEdgeClick(originalEdge)
    }
  }, [data.edges, onEdgeClick])

  const onNodeMouseEnter = useCallback((event: any, node: Node) => {
    const originalNode = data.nodes.find(n => n.id === node.id)
    if (originalNode) {
      onNodeHover(originalNode)
    }
  }, [data.nodes, onNodeHover])

  const onNodeMouseLeave = useCallback(() => {
    onNodeHover(null)
  }, [onNodeHover])

  const onEdgeMouseEnter = useCallback((event: any, edge: Edge) => {
    const originalEdge = data.edges.find(e => e.id === edge.id)
    if (originalEdge) {
      onEdgeHover(originalEdge)
    }
  }, [data.edges, onEdgeHover])

  const onEdgeMouseLeave = useCallback(() => {
    onEdgeHover(null)
  }, [onEdgeHover])

  // Update nodes and edges when filtered data changes
  useEffect(() => {
    setNodes(filteredNodes)
    setEdges(filteredEdges)
  }, [filteredNodes, filteredEdges, setNodes, setEdges])

  const nodeTypes: NodeTypes = useMemo(() => ({
    custom: CustomNode
  }), [])

    return (
    <div className="w-full h-[700px] bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 rounded-xl border-2 border-blue-200/50 shadow-2xl overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        className="bg-transparent"
      >
        <Background 
          color="#3b82f6" 
          gap={30} 
          size={1.5}
          className="opacity-20"
        />
        <Controls 
          className="bg-white/90 backdrop-blur-md rounded-xl border-2 border-blue-200/50 shadow-xl"
        />
        
        {/* Graph Info Overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border-2 border-blue-200/50 shadow-xl">
          <div className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Graph Info
          </div>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Nodes: <span className="font-semibold">{filteredNodes.length}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Edges: <span className="font-semibold">{filteredEdges.length}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>View: <span className="font-semibold capitalize">{viewMode}</span></span>
            </div>
          </div>
        </div>
        
        {/* Instructions Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border-2 border-blue-200/50 shadow-xl">
          <div className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Controls
          </div>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Click nodes for details</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Drag to pan • Scroll to zoom</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Use controls for fit view</span>
            </div>
          </div>
        </div>
      </ReactFlow>
    </div>
  )
}
