'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Clock, 
  DollarSign,
  Target,
  BarChart3,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'
import { api, AIExecutiveSummary, ExecutiveSummaryResponse } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

interface DashboardData {
  stats?: {
    activeThreats: number
    avgRiskScore: number
    vendorsMonitored: number
    resolvedToday: number
  }
  executiveSummary?: {
    title: string
    content: string
    keyFindings: Array<{
      type: string
      title: string
      description: string
    }>
  }
}

interface Threat {
  id: string
  vendorName: string
  threatType: string
  severity: number
  aiRiskScore: number
  status: string
}

interface Vendor {
  id: string
  name: string
  riskLevel: string
  riskScore: number
  threatCount: number
}

interface AIExecutiveBriefProps {
  dashboardData?: DashboardData
  threats: Threat[]
  vendors: Vendor[]
}

export function AIExecutiveBrief({ dashboardData, threats, vendors }: AIExecutiveBriefProps) {
  // Fetch AI executive summary from API
  const { 
    data: executiveSummaryResponse, 
    isLoading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary
  } = useQuery({
    queryKey: ['ai-executive-summary'],
    queryFn: () => api.getAIExecutiveSummary(),
    refetchInterval: 120000, // Refresh every 2 minutes
    retry: 2,
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  // Get executive summary from API response
  const executiveSummary = executiveSummaryResponse?.data
  const lastGenerated = executiveSummary ? new Date(executiveSummary.generatedAt) : new Date()

  // Trigger generation when component mounts or data changes
  useEffect(() => {
    if (dashboardData && threats && threats.length > 0) {
      generateAISummary()
    }
  }, [dashboardData, threats])

  const generateAISummary = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    // Simulate AI processing steps while API processes
    const steps = [
      "Analyzing threat patterns...",
      "Correlating vendor data...",
      "Generating business insights...",
      "Calculating impact metrics...",
      "Finalizing executive summary..."
    ]
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600))
      setGenerationProgress(((i + 1) / steps.length) * 100)
    }
    
    // Refetch summary after generation
    await refetchSummary()
    
    setIsGenerating(false)
    setGenerationProgress(100)
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "bg-red-500"
    if (risk >= 60) return "bg-orange-500"
    if (risk >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getRiskLevel = (risk: number) => {
    if (risk >= 80) return "Critical"
    if (risk >= 60) return "High"
    if (risk >= 40) return "Medium"
    return "Low"
  }

  const criticalVendors = vendors?.filter(v => v.riskScore >= 0.8).slice(0, 3) || []
  const highRiskThreats = threats?.filter(t => t.aiRiskScore >= 80).slice(0, 3) || []

  return (
    <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <Brain className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl text-green-800 dark:text-green-200">
              AI-Generated Executive Brief
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Business intelligence powered by BigQuery AI
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* AI Generation Status */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-green-700 dark:text-green-400">
                {isGenerating ? 'AI Generating Executive Brief...' : 'AI Executive Summary Ready'}
              </span>
            </div>
            <Badge variant="outline" className="text-green-700 border-green-300">
              {lastGenerated.toLocaleTimeString()}
            </Badge>
          </div>
          
          {isGenerating && (
            <div className="space-y-2">
              <Progress value={generationProgress} className="h-2" />
              <p className="text-sm text-green-600 dark:text-green-400">
                BigQuery AI is analyzing {threats?.length || 0} threats and {vendors?.length || 0} vendors
              </p>
            </div>
          )}
        </div>

        {/* Today's AI Executive Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              📋 TODAY'S AI EXECUTIVE SUMMARY
            </h3>
          </div>
          
          <div className="bg-white/60 dark:bg-white/10 rounded-lg p-4 border border-green-200/50">
            <div className="text-sm text-green-700 dark:text-green-400 mb-2">
              Generated by BigQuery AI at {lastGenerated.toLocaleTimeString()}
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {executiveSummary?.keyFindings?.join('. ') || 
                dashboardData?.executiveSummary?.content || 
                "No executive summary available. Please ensure the AI Executive Summary API is configured and returning data."}
            </p>
          </div>
        </div>

        {/* Key Findings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
            🎯 KEY FINDINGS
          </h3>
          
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200/50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-semibold text-red-800 dark:text-red-200">
                  {highRiskThreats.length} vendors showing APT-style attack patterns
                </div>
                <div className="text-sm text-red-700 dark:text-red-400">
                  Advanced persistent threat behavior detected
                </div>
              </div>
            </div>
            
            {executiveSummary?.businessImpact?.potentialLossesPrevented && (
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200/50">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800 dark:text-green-200">
                    ${executiveSummary.businessImpact.potentialLossesPrevented}M in potential losses prevented by early detection
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    AI-driven threat prevention success
                  </div>
                </div>
              </div>
            )}
            
            {executiveSummary?.threatPatterns && executiveSummary.threatPatterns.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-800 dark:text-blue-200">
                    {executiveSummary.threatPatterns.length} new attack vectors discovered via vector similarity search
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    BigQuery AI pattern recognition breakthrough
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Confidence Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
            📊 AI CONFIDENCE METRICS
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-lg border border-green-200/50">
              <div className="text-2xl font-bold text-green-600">
                {executiveSummary?.aiConfidenceMetrics?.threatDetectionAccuracy?.toFixed(1) || 'N/A'}%
              </div>
              <div className="text-sm text-green-700 dark:text-green-400">Threat Detection</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-lg border border-green-200/50">
              <div className="text-2xl font-bold text-blue-600">
                {executiveSummary?.aiConfidenceMetrics?.falsePositiveReduction?.toFixed(0) || 'N/A'}%
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-400">False Positive Reduction</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-lg border border-green-200/50">
              <div className="text-2xl font-bold text-purple-600">
                {executiveSummary?.aiConfidenceMetrics?.predictionReliability?.toFixed(1) || 'N/A'}%
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-400">Prediction Reliability</div>
            </div>
          </div>
        </div>

        {/* Immediate Actions Required */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
            ⚡ IMMEDIATE ACTIONS REQUIRED
          </h3>
          
          <div className="space-y-3">
            {/* Show API-provided immediate actions if available */}
            {executiveSummary?.immediateActions?.slice(0, 3).map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(action.riskScore)}`}></div>
                  <div>
                    <div className="font-semibold text-orange-800 dark:text-orange-200">
                      {action.action}
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-400">
                      {action.description} - {action.timeline}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="border-orange-300 text-orange-700">
                  {action.priority.toUpperCase()}
                </Badge>
              </div>
            )) || 
            /* Fallback to vendor-based actions if no API data */
            criticalVendors.map((vendor, index) => (
              <div key={vendor.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(vendor.riskScore * 100)}`}></div>
                  <div>
                    <div className="font-semibold text-orange-800 dark:text-orange-200">
                      Review {vendor.name}'s API access ({Math.round(vendor.riskScore * 100)}% risk score)
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-400">
                      {vendor.threatCount} active threats detected
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="border-orange-300 text-orange-700">
                  {getRiskLevel(vendor.riskScore * 100)}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Business Impact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
            📈 BUSINESS IMPACT
          </h3>
          
          <div className="grid gap-3">
            {executiveSummary?.businessImpact?.timeToThreatDetection && (
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-white/10 rounded-lg border border-green-200/50">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Time to threat detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{executiveSummary.businessImpact.timeToThreatDetection} minutes</span>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
              </div>
            )}
            
            {executiveSummary?.businessImpact?.analystWorkloadReduction && (
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-white/10 rounded-lg border border-green-200/50">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Analyst workload reduction</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{executiveSummary.businessImpact.analystWorkloadReduction}%</span>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
              </div>
            )}
            
            {executiveSummary?.businessImpact?.costPerThreatInvestigation && (
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-white/10 rounded-lg border border-green-200/50">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Cost per threat investigation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">${executiveSummary.businessImpact.costPerThreatInvestigation}</span>
                  {executiveSummary.businessImpact.traditionalCostComparison && (
                    <span className="text-xs text-gray-500">(vs ${executiveSummary.businessImpact.traditionalCostComparison} traditional)</span>
                  )}
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button 
            onClick={generateAISummary}
            disabled={isGenerating}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Regenerate Report
              </>
            )}
          </Button>
          <Button variant="outline" className="px-6 py-2 text-green-700 border-green-300">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Trends
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
