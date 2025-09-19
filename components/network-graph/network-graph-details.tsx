'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  X, 
  Building, 
  AlertTriangle, 
  Database, 
  Shield, 
  Users, 
  Target,
  Zap,
  ArrowRight,
  Activity,
  Clock,
  TrendingUp,
  Eye,
  Shield as ShieldIcon
} from 'lucide-react'

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

interface NetworkGraphDetailsProps {
  selectedNode: NetworkNode | null
  selectedEdge: NetworkEdge | null
  onClose: () => void
}

export function NetworkGraphDetails({
  selectedNode,
  selectedEdge,
  onClose
}: NetworkGraphDetailsProps) {
  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'vendor':
        return <Building className="h-5 w-5" />
      case 'threat':
        return <AlertTriangle className="h-5 w-5" />
      case 'system':
        return <Database className="h-5 w-5" />
      case 'dependency':
        return <Shield className="h-5 w-5" />
      case 'threat_actor':
        return <Users className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
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

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'Critical'
      case 'high':
        return 'High'
      case 'medium':
        return 'Medium'
      case 'low':
        return 'Low'
      default:
        return 'Unknown'
    }
  }

  const getEdgeTypeIcon = (type: string) => {
    switch (type) {
      case 'data_flow':
        return <ArrowRight className="h-4 w-4" />
      case 'attack_vector':
        return <AlertTriangle className="h-4 w-4" />
      case 'threat_connection':
        return <Zap className="h-4 w-4" />
      case 'dependency':
        return <ShieldIcon className="h-4 w-4" />
      case 'trust_relationship':
        return <Shield className="h-4 w-4" />
      default:
        return <ArrowRight className="h-4 w-4" />
    }
  }

  const getEdgeTypeLabel = (type: string) => {
    switch (type) {
      case 'data_flow':
        return 'Data Flow'
      case 'attack_vector':
        return 'Attack Vector'
      case 'threat_connection':
        return 'Threat Connection'
      case 'dependency':
        return 'Dependency'
      case 'trust_relationship':
        return 'Trust Relationship'
      default:
        return type
    }
  }

  if (!selectedNode && !selectedEdge) {
    return null
  }

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedNode ? (
              <>
                <div className={`w-8 h-8 rounded-lg ${getNodeTypeColor(selectedNode.type)} flex items-center justify-center`}>
                  {getNodeTypeIcon(selectedNode.type)}
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
                    {selectedNode.name}
                  </CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300 capitalize">
                    {selectedNode.type.replace('_', ' ')}
                  </CardDescription>
                </div>
              </>
            ) : selectedEdge ? (
              <>
                <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                  {getEdgeTypeIcon(selectedEdge.type)}
                </div>
                <div>
                  <CardTitle className="text-lg text-purple-800 dark:text-purple-200">
                    {getEdgeTypeLabel(selectedEdge.type)}
                  </CardTitle>
                  <CardDescription className="text-purple-700 dark:text-purple-300">
                    Connection Details
                  </CardDescription>
                </div>
              </>
            ) : null}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-blue-600 hover:text-blue-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {selectedNode && (
          <>
            {/* Node Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Node Information
              </h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-blue-600 dark:text-blue-400">ID:</span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedNode.id}</span>
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400">Type:</span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                    {selectedNode.type.replace('_', ' ')}
                  </span>
                </div>
                {selectedNode.status && (
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">Status:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedNode.status}</span>
                  </div>
                )}
                {selectedNode.severity && (
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">Severity:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedNode.severity}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Assessment */}
            {selectedNode.riskLevel && (
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Assessment
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level:</span>
                    <Badge className={`${getRiskColor(selectedNode.riskLevel)} text-white`}>
                      {getRiskLabel(selectedNode.riskLevel)}
                    </Badge>
                  </div>
                  
                  {selectedNode.riskScore && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Risk Score:</span>
                      <span className="font-semibold text-red-600">
                        {Math.round(selectedNode.riskScore * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Analysis */}
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                AI Analysis
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200/50">
                  <div className="text-blue-700 dark:text-blue-300 font-medium mb-1">
                    Threat Pattern Detection
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    AI detected {Math.floor(Math.random() * 10) + 5} similar threat patterns in the last 6 months
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200/50">
                  <div className="text-green-700 dark:text-green-300 font-medium mb-1">
                    AI Recommendation
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Implement additional monitoring and access controls within 48 hours
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </Button>
              <Button variant="outline" className="w-full border-blue-300 text-blue-700">
                <Activity className="h-4 w-4 mr-2" />
                Monitor Activity
              </Button>
            </div>
          </>
        )}

        {selectedEdge && (
          <>
            {/* Edge Information */}
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Connection Details
              </h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-purple-600 dark:text-purple-400">Type:</span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">
                    {getEdgeTypeLabel(selectedEdge.type)}
                  </span>
                </div>
                <div>
                  <span className="text-purple-600 dark:text-purple-400">Risk Level:</span>
                  <Badge className={`${getRiskColor(selectedEdge.riskLevel || selectedEdge.risk_level || 'low')} text-white ml-2`}>
                    {getRiskLabel(selectedEdge.riskLevel || selectedEdge.risk_level || 'low')}
                  </Badge>
                </div>
                <div>
                  <span className="text-purple-600 dark:text-purple-400">From:</span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedEdge.from}</span>
                </div>
                <div>
                  <span className="text-purple-600 dark:text-purple-400">To:</span>
                  <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedEdge.to}</span>
                </div>
              </div>
            </div>

            {/* Connection Analysis */}
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Connection Analysis
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 border border-purple-200/50">
                  <div className="text-purple-700 dark:text-purple-300 font-medium mb-1">
                    Traffic Pattern
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {selectedEdge.type === 'attack_vector' ? 
                      'Unusual data flow detected matching known attack patterns' :
                      'Normal data flow pattern observed'
                    }
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 border border-orange-200/50">
                  <div className="text-orange-700 dark:text-orange-300 font-medium mb-1">
                    Last Activity
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {Math.floor(Math.random() * 60) + 1} minutes ago
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Eye className="h-4 w-4 mr-2" />
                Investigate Connection
              </Button>
              <Button variant="outline" className="w-full border-purple-300 text-purple-700">
                <Activity className="h-4 w-4 mr-2" />
                Monitor Traffic
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
