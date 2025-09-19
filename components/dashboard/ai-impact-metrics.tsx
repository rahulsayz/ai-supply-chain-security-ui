'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target, 
  Brain, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api, AIImpactMetrics, ImpactMetricsResponse } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

interface Stats {
  activeThreats: number
  avgRiskScore: number
  vendorsMonitored: number
  resolvedToday: number
}

interface AIImpactMetricsProps {
  stats: Stats
  currentMode: 'static' | 'live'
}

export function AIImpactMetrics({ stats, currentMode }: AIImpactMetricsProps) {
  // Fetch AI impact metrics from API
  const { 
    data: impactMetricsResponse, 
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: ['ai-impact-metrics'],
    queryFn: () => api.getAIImpactMetrics(),
    refetchInterval: currentMode === 'live' ? 30000 : 60000, // More frequent in live mode
    retry: 2,
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)

  // Get metrics from API response with fallbacks
  const aiMetrics = impactMetricsResponse?.data || {
    preventedLosses: 0,
    speedAdvantage: 0,
    accuracyBoost: 0,
    processingVolume: 0,
    riskReduction: 0,
    predictionSuccess: 0,
    timeToDetection: 0,
    analystWorkloadReduction: 0,
    costPerInvestigation: 0,
    traditionalCostComparison: 0,
    lastUpdated: new Date().toISOString()
  }

  // Traditional metrics should come from API, not calculated with hardcoded multipliers
  const traditionalMetrics = impactMetricsResponse?.data?.traditionalMetrics || {
    preventedLosses: 0,
    speedAdvantage: 0,
    accuracyBoost: 0,
    processingVolume: 0,
    riskReduction: 0,
    predictionSuccess: 0
  }

  // Auto-refresh in live mode
  useEffect(() => {
    if (currentMode === 'live') {
      const interval = setInterval(() => {
        refetchMetrics()
      }, 30000) // Refresh every 30 seconds in live mode
      return () => clearInterval(interval)
    }
  }, [currentMode, refetchMetrics])

  const refreshMetrics = async () => {
    setIsUpdating(true)
    setUpdateProgress(0)
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUpdateProgress(i)
    }
    
    await refetchMetrics()
    setIsUpdating(false)
    setUpdateProgress(100)
  }

  const calculateImprovement = (ai: number, traditional: number) => {
    if (traditional === 0) return ai > 0 ? 100 : 0
    return ((ai - traditional) / traditional) * 100
  }

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) {
      return <ArrowUpRight className="h-4 w-4 text-green-600" />
    } else {
      return <ArrowDownRight className="h-4 w-4 text-red-600" />
    }
  }

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return "text-green-600"
    if (improvement < 0) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <Card className="border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/20 dark:to-cyan-950/20 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-indigo-800 dark:text-indigo-200">
                AI Impact Metrics
              </CardTitle>
              <CardDescription className="text-indigo-700 dark:text-indigo-300">
                Quantified business value vs traditional SOC tools
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentMode === 'live' && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">Live Updates</span>
              </div>
            )}
            <Badge variant="outline" className="text-indigo-700 border-indigo-300">
              Updated {isUpdating ? 'Now' : impactMetricsResponse?.metadata ? new Date(impactMetricsResponse.metadata.timestamp).toLocaleTimeString() : '3 min ago'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Top Row - Major Metrics */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* AI-Prevented Losses */}
          <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-green-700 dark:text-green-300">AI-PREVENTED LOSSES</div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                    ${aiMetrics.preventedLosses}M
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This quarter</span>
                  <span className="text-sm font-semibold text-green-600">
                    +{calculateImprovement(aiMetrics.preventedLosses, traditionalMetrics.preventedLosses).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>vs traditional</span>
                  <span className="text-green-600">↗️ +{calculateImprovement(aiMetrics.preventedLosses, traditionalMetrics.preventedLosses).toFixed(0)}% improvement</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Speed Advantage */}
          <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300">AI SPEED ADVANTAGE</div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {aiMetrics.speedAdvantage} min
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg detection</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {Math.round(aiMetrics.speedAdvantage / traditionalMetrics.speedAdvantage * 100)}x faster
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>vs traditional</span>
                  <span className="text-blue-600">↗️ 97x faster</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Accuracy Boost */}
          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300">AI ACCURACY BOOST</div>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {aiMetrics.accuracyBoost}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">vs traditional</span>
                  <span className="text-sm font-semibold text-purple-600">
                    +{calculateImprovement(aiMetrics.accuracyBoost, traditionalMetrics.accuracyBoost).toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Traditional: {traditionalMetrics.accuracyBoost}%</span>
                  <span className="text-purple-600">↗️ +{calculateImprovement(aiMetrics.accuracyBoost, traditionalMetrics.accuracyBoost).toFixed(0)}% improvement</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Secondary Metrics */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* AI Processing Volume */}
          <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-700 dark:text-orange-300">AI PROCESSING VOLUME</div>
                  <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                    {aiMetrics.processingVolume}M
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">Documents analyzed</div>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Activity className="h-4 w-4" />
                  <span>Updated 3 min ago</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>vs traditional: {traditionalMetrics.processingVolume}M</span>
                  <span className="text-orange-600">↗️ +{calculateImprovement(aiMetrics.processingVolume, traditionalMetrics.processingVolume).toFixed(0)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Risk Reduction */}
          <Card className="border-2 border-teal-300 bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/20 dark:to-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30">
                  <Shield className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-teal-700 dark:text-teal-300">VENDOR RISK REDUCTION</div>
                  <div className="text-2xl font-bold text-teal-800 dark:text-teal-200">
                    {aiMetrics.riskReduction}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">Average risk decrease</div>
                <div className="flex items-center gap-2 text-sm text-teal-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>Across {stats.vendorsMonitored} vendors</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>vs traditional: {traditionalMetrics.riskReduction}%</span>
                  <span className="text-teal-600">↗️ +{calculateImprovement(aiMetrics.riskReduction, traditionalMetrics.riskReduction).toFixed(0)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Success */}
          <Card className="border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/30">
                  <Zap className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-pink-700 dark:text-pink-300">PREDICTION SUCCESS</div>
                  <div className="text-2xl font-bold text-pink-800 dark:text-pink-200">
                    {aiMetrics.predictionSuccess}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-600">Accuracy rate</div>
                <div className="flex items-center gap-2 text-sm text-pink-600">
                  <BarChart3 className="h-4 w-4" />
                  <span>30-day predictions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>vs traditional: {traditionalMetrics.predictionSuccess}%</span>
                  <span className="text-pink-600">↗️ +{aiMetrics.predictionSuccess}% (new capability)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI vs Traditional Comparison Chart */}
        <div className="bg-gradient-to-r from-indigo-100 to-cyan-100 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-indigo-200/50">
          <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI vs Traditional SOC Tools Performance
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries({
              'Threat Detection': { ai: aiMetrics.accuracyBoost, traditional: traditionalMetrics.accuracyBoost },
              'Processing Speed': { ai: 100, traditional: (traditionalMetrics.speedAdvantage / aiMetrics.speedAdvantage) * 100 },
              'Risk Reduction': { ai: aiMetrics.riskReduction, traditional: traditionalMetrics.riskReduction },
              'Cost Efficiency': { ai: 100, traditional: 25 },
              'Prediction Capability': { ai: aiMetrics.predictionSuccess, traditional: 0 },
              'False Positive Reduction': { ai: 67, traditional: 20 }
            }).map(([metric, values]) => (
              <div key={metric} className="bg-white/60 dark:bg-white/10 rounded-lg p-3 border border-indigo-200/50">
                <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">{metric}</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-600">AI</span>
                    <span className="font-semibold">{values.ai.toFixed(1)}%</span>
                  </div>
                  <Progress value={values.ai} className="h-2 bg-gray-200" />
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Traditional</span>
                    <span className="font-semibold">{values.traditional.toFixed(1)}%</span>
                  </div>
                  <Progress value={values.traditional} className="h-2 bg-gray-200" />
                  
                  <div className="text-xs text-center pt-1">
                    <span className={`font-semibold ${getImprovementColor(values.ai - values.traditional)}`}>
                      {getImprovementIcon(values.ai - values.traditional)}
                      {values.traditional > 0 ? `${((values.ai - values.traditional) / values.traditional * 100).toFixed(0)}%` : 'New Capability'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button 
            onClick={refreshMetrics}
            disabled={isUpdating}
            className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white px-8 py-3"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Refresh Metrics
              </>
            )}
          </Button>
          <Button variant="outline" className="px-8 py-3 text-indigo-700 border-indigo-300">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Trends
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
