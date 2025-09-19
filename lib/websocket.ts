'use client'

import { useEffect, useRef, useState } from 'react'
import { API_CONFIG } from './api-config'
import { toast } from 'sonner'

export interface WebSocketMessage {
  type: 'threat_alert' | 'vendor_update' | 'system_status' | 'ai_processing_started' | 'ai_processing_progress' | 'ai_processing_complete' | 'ai_processing_failed' | 'cost_threshold_warning' | 'budget_limit_reached' | 'ai_function_status_change'
  data: any
  timestamp: string
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [aiProcessingStatus, setAiProcessingStatus] = useState<any>(null)
  const [costStatus, setCostStatus] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    if (API_CONFIG.mode === 'static' || !API_CONFIG.enableWebSocket) {
      console.log('WebSocket disabled in static mode')
      return
    }

    // Enable WebSocket in live mode by default
    if (!API_CONFIG.enableWebSocket && API_CONFIG.mode === 'live') {
      console.log('WebSocket not explicitly enabled, but attempting connection in live mode')
    }

    try {
      // WebSocket is disabled, use EventSource for SSE instead
      if (!API_CONFIG.enableWebSocket) {
        console.log('🔌 WebSocket disabled, using EventSource for SSE')
        setIsConnected(false)
        return
      }
      
      wsRef.current = new WebSocket(API_CONFIG.baseUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws')

      wsRef.current.onopen = () => {
        console.log('🔌 WebSocket connected')
        setIsConnected(true)
        reconnectAttempts.current = 0
        
        // Subscribe to AI and cost updates
        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: 'subscribe_ai_updates',
            timestamp: new Date().toISOString()
          }))
          
          wsRef.current.send(JSON.stringify({
            type: 'subscribe_cost_updates',
            timestamp: new Date().toISOString()
          }))
        }
        
        toast.success('🔌 Live Connection Established', {
          description: 'Real-time threat monitoring active',
        })
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          
          // Handle different message types
          switch (message.type) {
            case 'threat_alert':
              toast.error('🚨 New Threat Detected', {
                description: `${message.data.threatType} at ${message.data.vendorName}`,
              })
              break
            case 'vendor_update':
              toast.warning('⚠️ Vendor Risk Update', {
                description: `${message.data.vendorName} risk score changed`,
              })
              break
            case 'system_status':
              if (message.data.status === 'degraded') {
                toast.warning('🔧 System Status', {
                  description: 'Performance degradation detected',
                })
              }
              break
            case 'ai_processing_started':
              setAiProcessingStatus({ status: 'processing', jobId: message.data.jobId })
              toast.info('🤖 AI Processing Started', {
                description: `Job ${message.data.jobId} - Estimated cost: $${message.data.estimatedCost}`,
              })
              break
            case 'ai_processing_progress':
              setAiProcessingStatus({ 
                status: 'processing', 
                jobId: message.data.jobId,
                progress: message.data.progress,
                currentStep: message.data.currentStep
              })
              break
            case 'ai_processing_complete':
              setAiProcessingStatus({ status: 'completed', jobId: message.data.jobId })
              toast.success('🤖 AI Processing Complete', {
                description: `Job ${message.data.jobId} - Cost: $${message.data.cost}`,
              })
              break
            case 'ai_processing_failed':
              setAiProcessingStatus({ status: 'failed', jobId: message.data.jobId })
              toast.error('🚨 AI Processing Failed', {
                description: `Job ${message.data.jobId} - ${message.data.error}`,
              })
              break
            case 'cost_threshold_warning':
              setCostStatus(message.data)
              toast.warning('💰 Budget Warning', {
                description: `${message.data.utilizationPercent}% of daily budget used`,
              })
              break
            case 'budget_limit_reached':
              setCostStatus(message.data)
              toast.error('💰 Budget Limit Reached', {
                description: 'AI processing has been paused',
              })
              break
            case 'ai_function_status_change':
              toast.info('🔧 AI Function Status Change', {
                description: `${message.data.functionName}: ${message.data.status}`,
              })
              break
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      wsRef.current.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        setIsConnected(false)
        setAiProcessingStatus(null)
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
          
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        } else {
          toast.error('🔌 Connection Lost', {
            description: 'Unable to establish real-time connection',
          })
        }
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
    }
  }

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString()
      }))
    }
  }
  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    
    setIsConnected(false)
    setAiProcessingStatus(null)
    setCostStatus(null)
  }

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [])

  return {
    isConnected,
    lastMessage,
    aiProcessingStatus,
    costStatus,
    sendMessage,
    connect,
    disconnect,
  }
}