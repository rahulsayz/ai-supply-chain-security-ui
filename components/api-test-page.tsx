'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api-client'
import { getCurrentMode, switchMode } from '@/lib/api-config'

export function ApiTestPage() {
  const [currentMode, setCurrentMode] = useState<'static' | 'live'>('static')
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkMode = () => {
      const mode = getCurrentMode()
      setCurrentMode(mode)
    }
    
    checkMode()
    const interval = setInterval(checkMode, 1000)
    return () => clearInterval(interval)
  }, [])

  const addTestResult = (message: string, data?: any) => {
    setTestResults(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      message,
      data
    }])
  }

  const testModeSwitching = () => {
    addTestResult('🧪 Testing mode switching...')
    
    // Test current mode
    const current = getCurrentMode()
    addTestResult(`Current mode: ${current}`)
    
    // Test localStorage
    const storedMode = localStorage.getItem('api_mode')
    addTestResult(`localStorage api_mode: ${storedMode}`)
    
    // Test switching to live mode
    switchMode('live')
    addTestResult('Switched to live mode')
    
    // Check if it was set
    setTimeout(() => {
      const newMode = getCurrentMode()
      addTestResult(`Mode after switch: ${newMode}`)
      const newStoredMode = localStorage.getItem('api_mode')
      addTestResult(`localStorage after switch: ${newStoredMode}`)
    }, 100)
  }

  const testApiCall = async () => {
    setIsLoading(true)
    addTestResult('🧪 Testing API call...')
    
    try {
      const result = await api.getThreats()
      addTestResult('✅ API call successful', result)
    } catch (error: any) {
      addTestResult('❌ API call failed', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testDirectFetch = async () => {
    setIsLoading(true)
    addTestResult('🧪 Testing direct fetch to backend...')
    
    try {
      const response = await fetch('http://localhost:8080/api/threats')
      const data = await response.json()
      addTestResult('✅ Direct fetch successful', data)
    } catch (error: any) {
      addTestResult('❌ Direct fetch failed', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const testEventSource = () => {
    setIsLoading(true)
    addTestResult('🧪 Testing EventSource connection to live analysis...')
    
    try {
      const eventSource = new EventSource('http://localhost:8080/api/bigquery-ai/live-analysis')
      
      eventSource.onopen = () => {
        addTestResult('✅ EventSource connection opened')
      }
      
      eventSource.onmessage = (event) => {
        addTestResult('📨 EventSource message received', {
          raw: event.data,
          parsed: JSON.parse(event.data)
        })
      }
      
      eventSource.addEventListener('threat-detected', (event) => {
        addTestResult('🚨 Threat detected event received', {
          raw: event.data,
          parsed: JSON.parse(event.data)
        })
      })
      
      eventSource.addEventListener('analysis_complete', (event) => {
        addTestResult('🎉 Analysis complete event received', {
          raw: event.data,
          parsed: JSON.parse(event.data)
        })
        eventSource.close()
        setIsLoading(false)
      })
      
      eventSource.onerror = (error) => {
        addTestResult('❌ EventSource error', error)
        eventSource.close()
        setIsLoading(false)
      }
      
      // Close connection after 10 seconds if no completion event
      setTimeout(() => {
        addTestResult('⏰ EventSource test timeout - closing connection')
        eventSource.close()
        setIsLoading(false)
      }, 10000)
      
    } catch (error: any) {
      addTestResult('❌ EventSource test failed', error.message)
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">API Test Page</h1>
      
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><strong>Current Mode:</strong> {currentMode}</div>
            <div><strong>localStorage api_mode:</strong> {typeof window !== 'undefined' ? localStorage.getItem('api_mode') : 'N/A'}</div>
            <div><strong>getCurrentMode():</strong> {getCurrentMode()}</div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testModeSwitching} disabled={isLoading}>
              🧪 Test Mode Switching
            </Button>
            <Button onClick={testApiCall} disabled={isLoading}>
              🧪 Test API Call
            </Button>
            <Button onClick={testDirectFetch} disabled={isLoading}>
              🧪 Test Direct Fetch
            </Button>
            <Button onClick={testEventSource} disabled={isLoading}>
              🧪 Test EventSource
            </Button>
            <Button onClick={clearResults} variant="outline">
              🗑️ Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-muted-foreground">No test results yet. Run some tests above.</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="p-2 border rounded text-sm">
                  <div className="font-mono text-xs text-muted-foreground">
                    {result.timestamp}
                  </div>
                  <div>{result.message}</div>
                  {result.data && (
                    <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
