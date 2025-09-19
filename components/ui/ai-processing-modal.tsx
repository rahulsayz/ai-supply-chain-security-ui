'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  DollarSign, 
  Clock, 
  Zap,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  X,
  TrendingUp
} from 'lucide-react'

interface AIProcessingStep {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  startTime?: string
  completedTime?: string
  cost?: number
  result?: any
}

interface AIProcessingModalProps {
  open: boolean
  onClose: () => void
  jobId: string
  initialSteps: AIProcessingStep[]
  onComplete?: (result: any) => void
}

export function AIProcessingModal({ 
  open, 
  onClose, 
  jobId, 
  initialSteps,
  onComplete 
}: AIProcessingModalProps) {
  const [steps, setSteps] = useState<AIProcessingStep[]>(initialSteps)
  const [totalCost, setTotalCost] = useState(0)
  const [processingTime, setProcessingTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    if (!open) return

    const interval = setInterval(() => {
      setProcessingTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [open])

  useEffect(() => {
    // Simulate step progression
    if (!open || isPaused) return

    const timer = setTimeout(() => {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps]
        const processingStep = newSteps.find(step => step.status === 'processing')
        const pendingStep = newSteps.find(step => step.status === 'pending')

        if (processingStep && Math.random() > 0.3) {
          // Complete current step
          processingStep.status = 'completed'
          processingStep.completedTime = new Date().toISOString()
          processingStep.cost = Math.random() * 0.02 + 0.005
          processingStep.result = {
            confidence: Math.random() * 20 + 80,
            insights: Math.floor(Math.random() * 5 + 3)
          }

          setTotalCost(prev => prev + (processingStep.cost || 0))
          setLogs(prev => [...prev, `✅ ${processingStep.name} completed - Cost: $${processingStep.cost?.toFixed(4)}`])

          // Start next step
          if (pendingStep) {
            pendingStep.status = 'processing'
            pendingStep.startTime = new Date().toISOString()
            setLogs(prev => [...prev, `🔄 Starting ${pendingStep.name}...`])
          }
        } else if (!processingStep && pendingStep) {
          // Start first step
          pendingStep.status = 'processing'
          pendingStep.startTime = new Date().toISOString()
          setLogs(prev => [...prev, `🔄 Starting ${pendingStep.name}...`])
        }

        return newSteps
      })
    }, Math.random() * 3000 + 2000)

    return () => clearTimeout(timer)
  }, [steps, open, isPaused])

  const completedSteps = steps.filter(step => step.status === 'completed').length
  const totalSteps = steps.length
  const progress = (completedSteps / totalSteps) * 100

  const isCompleted = completedSteps === totalSteps
  const hasFailed = steps.some(step => step.status === 'failed')

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStepIcon = (status: AIProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Zap className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-blue-500" />
              <div>
                <DialogTitle>BigQuery AI Processing</DialogTitle>
                <DialogDescription>
                  Job ID: {jobId} • Real-time AI analysis in progress
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                disabled={isCompleted || hasFailed}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Processing Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{completedSteps}/{totalSteps}</div>
                  <div className="text-sm text-muted-foreground">Steps Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold flex items-center justify-center gap-1">
                    <Clock className="h-5 w-5" />
                    {formatTime(processingTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold flex items-center justify-center gap-1">
                    <DollarSign className="h-5 w-5" />
                    {totalCost.toFixed(4)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {isPaused ? 'PAUSED' : isCompleted ? 'DONE' : 'ACTIVE'}
                  </div>
                  <div className="text-sm text-muted-foreground">Status</div>
                </div>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-center text-sm text-muted-foreground mt-2">
                {Math.round(progress)}% Complete
              </div>
            </CardContent>
          </Card>

          {/* Processing Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Function Execution</CardTitle>
              <CardDescription>
                Step-by-step BigQuery AI processing pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      {getStepIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{step.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {step.status === 'processing' && 'Processing...'}
                        {step.status === 'completed' && step.completedTime && 
                          `Completed at ${new Date(step.completedTime).toLocaleTimeString()}`}
                        {step.status === 'pending' && 'Waiting...'}
                        {step.status === 'failed' && 'Failed to process'}
                      </div>
                    </div>
                    <div className="text-right">
                      {step.cost && (
                        <div className="text-sm font-medium">${step.cost.toFixed(4)}</div>
                      )}
                      {step.result && (
                        <div className="text-xs text-muted-foreground">
                          {step.result.confidence?.toFixed(1)}% confidence
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Processing Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Processing Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 max-h-48 overflow-y-auto font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-muted-foreground">
                      [{new Date().toLocaleTimeString()}]
                    </span>{' '}
                    {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-muted-foreground">Waiting for processing to begin...</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Preview */}
          {completedSteps > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Preliminary Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">AI Insights Generated</div>
                    <div className="text-2xl font-bold">
                      {steps.reduce((sum, step) => sum + (step.result?.insights || 0), 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Average Confidence</div>
                    <div className="text-2xl font-bold">
                      {steps.filter(s => s.result?.confidence).length > 0 ? 
                        (steps.reduce((sum, step) => sum + (step.result?.confidence || 0), 0) / 
                         steps.filter(s => s.result?.confidence).length).toFixed(1) : '0'}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isCompleted ? (
              <>
                <Button onClick={() => onComplete?.(steps)} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  View Complete Results
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsPaused(!isPaused)}
                  disabled={hasFailed}
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
                <Button variant="destructive" onClick={onClose}>
                  Cancel Processing
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}