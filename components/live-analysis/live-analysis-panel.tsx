'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { api } from '../../lib/api-client'
import { API_CONFIG } from '../../lib/api-config'
import { toast } from 'sonner'
import { Zap, DollarSign, Clock, Brain } from 'lucide-react'

interface LiveAnalysisResult {
  analysisId: string
  status: 'processing' | 'completed' | 'failed'
  insights: string[]
  processingTime: number
  cost: number
  confidence: number
}

export function LiveAnalysisPanel() {
  const [result, setResult] = useState<LiveAnalysisResult | null>(null)

  const liveAnalysisMutation = useMutation({
    mutationFn: api.analyzeThreat,
    onSuccess: (data) => {
      setResult(data)
      toast.success('BigQuery Analysis Complete', {
        description: `Analysis completed in ${data.processingTime}ms - Cost: $${data.cost}`,
      })
    },
    onError: (error: any) => {
      toast.error('Analysis Failed', {
        description: error.message || 'BigQuery processing error',
      })
    },
  })

  const triggerAnalysis = () => {
    liveAnalysisMutation.mutate({
      threatId: 'demo-threat',
      analysisType: 'full',
    })
  }

  if (API_CONFIG.mode === 'static') {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 border border-muted/20 shadow-lg">
              <Brain className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-muted-foreground">Live BigQuery Analysis</CardTitle>
              <CardDescription>
                Switch to Live Mode to access real-time BigQuery AI processing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button disabled variant="outline" className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Live Analysis Unavailable
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-500/20 shadow-lg">
            <Brain className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <CardTitle>Live BigQuery AI Analysis</CardTitle>
            <CardDescription>
              Trigger real-time threat analysis using BigQuery ML models
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={triggerAnalysis}
          disabled={liveAnalysisMutation.isPending}
          className="w-full"
        >
          <Zap className="h-4 w-4 mr-2" />
          {liveAnalysisMutation.isPending ? 'Processing...' : 'Run Live Analysis'}
        </Button>

        {liveAnalysisMutation.isPending && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">
                BigQuery ML processing in progress...
              </span>
            </div>
            <Progress value={undefined} className="h-2" />
          </div>
        )}

        {result && (
          <div className="space-y-4 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <Badge variant={result.status === 'completed' ? 'default' : 'destructive'}>
                {result.status}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {result.processingTime}ms
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${result.cost.toFixed(4)}
                </div>
              </div>
            </div>

            {result.insights.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">AI Insights</h4>
                <ul className="space-y-1 text-sm">
                  {result.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <Progress value={result.confidence} className="flex-1 h-2" />
              <span className="text-sm font-medium">{result.confidence}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}