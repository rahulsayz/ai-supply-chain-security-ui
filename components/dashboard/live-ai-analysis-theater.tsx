'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Eye,
  Play,
  Pause
} from 'lucide-react'
import { api, AIProcessingStep, AIInsight, ProcessingStepsResponse, AIInsightsResponse } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

// Using AIProcessingStep and AIInsight types from api-client.ts

interface LiveAIAnalysisTheaterProps {
  currentMode: 'static' | 'live'
  wsConnected: boolean
}

export function LiveAIAnalysisTheater({ currentMode, wsConnected }: LiveAIAnalysisTheaterProps) {
  const [isLive, setIsLive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string>('ANALYSIS_1705123456789_abc123def')

  // Fetch processing steps from API
  const { 
    data: processingStepsResponse, 
    isLoading: stepsLoading,
    error: stepsError,
    refetch: refetchSteps
  } = useQuery({
    queryKey: ['ai-processing-steps', currentAnalysisId],
    queryFn: () => api.getProcessingSteps(currentAnalysisId),
    refetchInterval: isLive && !isPaused ? 3000 : false, // Refresh every 3 seconds when live
    retry: 2,
    enabled: !!currentAnalysisId
  })

  // Fetch AI insights from API
  const { 
    data: insightsResponse, 
    isLoading: insightsLoading,
    error: insightsError,
    refetch: refetchInsights
  } = useQuery({
    queryKey: ['ai-insights', currentAnalysisId],
    queryFn: () => api.getAIInsights(currentAnalysisId),
    refetchInterval: isLive && !isPaused ? 3000 : false, // Refresh every 3 seconds when live
    retry: 2,
    enabled: !!currentAnalysisId
  })

  // Get data from API responses with fallbacks
  const processingSteps = processingStepsResponse?.data || []
  const aiInsights = insightsResponse?.data || []
  
  // Calculate total cost from processing steps
  const totalCost = processingSteps.reduce((sum, step) => sum + step.cost, 0)

  // Auto-refresh data when live mode is active
  useEffect(() => {
    if (isLive && !isPaused) {
      const interval = setInterval(() => {
        refetchSteps()
        refetchInsights()
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isLive, isPaused, refetchSteps, refetchInsights])

  // Start a new analysis when component mounts or analysis is requested
  const startNewAnalysis = async () => {
    try {
      // Generate new analysis ID
      const newAnalysisId = `ANALYSIS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setCurrentAnalysisId(newAnalysisId)
      
      // Start comprehensive analysis
      const analysisRequest = {
        analysisType: 'comprehensive' as const,
        includeHistorical: true,
        includePredictions: true,
        timeframe: 30
      }
      
      await api.postComprehensiveAnalysis(analysisRequest)
      
      // Refetch data with new analysis ID
      refetchSteps()
      refetchInsights()
    } catch (error) {
      console.error('Failed to start new analysis:', error)
    }
  }

  const toggleLiveMode = () => {
    setIsLive(!isLive)
    if (!isLive) {
      // Start live mode and begin new analysis
      startNewAnalysis()
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'processing':
        return 'bg-blue-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-800 dark:text-blue-200">
                Live AI Analysis Theater
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                BigQuery AI processing status & real-time insights
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleLiveMode}
              variant={isLive ? "default" : "outline"}
              size="sm"
              className={isLive ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isLive ? (
                <>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
                  Live
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Live
                </>
              )}
            </Button>
            
            {isLive && (
              <Button
                onClick={togglePause}
                variant="outline"
                size="sm"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* BigQuery AI Processing Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              🔄 BIGQUERY AI PROCESSING STATUS
            </h3>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              ${totalCost.toFixed(4)}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {processingSteps.map((step, index) => (
              <div key={index} className="bg-white/60 dark:bg-white/10 rounded-lg p-4 border border-blue-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStepStatusIcon(step.status)}
                    <div>
                      <div className="font-mono text-sm font-semibold text-blue-800 dark:text-blue-200">
                        {step.name}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                      ${(step.cost || 0).toFixed(4)}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      {step.eta}
                    </div>
                  </div>
                </div>
                
                                  <div className="flex items-center gap-3">
                    <Progress 
                      value={step.progress || 0} 
                      className="flex-1 h-2" 
                      style={{
                        '--progress-background': step.status === 'completed' ? '#10b981' : '#3b82f6'
                      } as any}
                    />
                    <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                      {(step.progress || 0)}%
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest AI Insights */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
              💡 LATEST AI INSIGHTS (Auto-generated)
            </h3>
          </div>
          
          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="bg-white/60 dark:bg-white/10 rounded-lg p-3 border border-purple-200/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        insight.type === 'threat' ? 'border-red-300 text-red-700' :
                        insight.type === 'anomaly' ? 'border-orange-300 text-orange-700' :
                        insight.type === 'pattern' ? 'border-blue-300 text-blue-700' :
                        'border-green-300 text-green-700'
                      }`}
                    >
                      {insight.type.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                      {insight.impact}
                    </Badge>
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    {insight.timestamp}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {insight.message}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-purple-600" />
                    <span className="text-purple-700 dark:text-purple-300">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                  <div className="text-purple-600 dark:text-purple-400">
                    via {insight.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Processing Metrics */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {processingStepsResponse?.metadata?.processingTime || 1247}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Records Processed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Processing Speed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">${totalCost.toFixed(4)}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Total Cost</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="text-purple-700 border-purple-300">
            <Brain className="h-4 w-4 mr-2" />
            AI Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
