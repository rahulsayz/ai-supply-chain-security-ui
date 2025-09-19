import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Settings,
  ExternalLink,
  Clock
} from 'lucide-react'
import { API_CONFIG } from '@/lib/api-config'

interface APIError {
  code?: string
  message: string
  retryable?: boolean
  statusCode?: number
  endpoint?: string
}

interface ErrorBoundaryProps {
  error: APIError | Error
  onRetry?: () => void
  onFallback?: () => void
  showDetails?: boolean
}

export function APIErrorBoundary({ 
  error, 
  onRetry, 
  onFallback, 
  showDetails = false 
}: ErrorBoundaryProps) {
  const [showFullError, setShowFullError] = useState(false)

  const getErrorType = (error: APIError | Error) => {
    if ('code' in error) {
      switch (error.code) {
        case 'ECONNREFUSED':
        case 'ERR_NETWORK':
          return 'connection'
        case 'TIMEOUT':
          return 'timeout'
        case 'BUDGET_EXCEEDED':
          return 'budget'
        case 'AI_UNAVAILABLE':
          return 'ai'
        default:
          return 'api'
      }
    }
    return 'unknown'
  }

  const getErrorConfig = (type: string) => {
    switch (type) {
      case 'connection':
        return {
          title: 'Connection Failed',
          description: 'Unable to connect to the backend server',
          icon: WifiOff,
          variant: 'destructive' as const,
          suggestions: [
            'Check if the backend server is running on port 8080',
            'Verify your network connection',
            'Try refreshing the page'
          ]
        }
      case 'timeout':
        return {
          title: 'Request Timeout',
          description: 'The server took too long to respond',
          icon: Clock,
          variant: 'destructive' as const,
          suggestions: [
            'The server may be under heavy load',
            'Try again in a few moments',
            'Check your internet connection'
          ]
        }
      case 'budget':
        return {
          title: 'Budget Limit Reached',
          description: 'BigQuery AI processing budget has been exceeded',
          icon: AlertTriangle,
          variant: 'destructive' as const,
          suggestions: [
            'Daily BigQuery budget limit reached',
            'AI processing has been paused',
            'Budget will reset at midnight UTC'
          ]
        }
      case 'ai':
        return {
          title: 'AI Services Unavailable',
          description: 'BigQuery AI functions are currently offline',
          icon: Settings,
          variant: 'destructive' as const,
          suggestions: [
            'BigQuery AI functions are temporarily unavailable',
            'Falling back to static analysis',
            'Live AI features will resume when service is restored'
          ]
        }
      case 'api':
        return {
          title: 'API Error',
          description: 'An error occurred while processing your request',
          icon: AlertTriangle,
          variant: 'destructive' as const,
          suggestions: [
            'This appears to be a server-side issue',
            'Please try again in a few moments',
            'Contact support if the problem persists'
          ]
        }
      default:
        return {
          title: 'Unexpected Error',
          description: 'An unexpected error occurred',
          icon: AlertTriangle,
          variant: 'destructive' as const,
          suggestions: [
            'Please try refreshing the page',
            'Check the browser console for more details',
            'Contact support if the issue continues'
          ]
        }
    }
  }

  const errorType = getErrorType(error)
  const config = getErrorConfig(errorType)
  const IconComponent = config.icon

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconComponent className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">{config.title}</CardTitle>
        </div>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Message */}
        <Alert variant={config.variant}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Details</AlertTitle>
          <AlertDescription>
            {error.message}
            {'statusCode' in error && error.statusCode && (
              <Badge variant="outline" className="ml-2">
                HTTP {error.statusCode}
              </Badge>
            )}
          </AlertDescription>
        </Alert>

        {/* Suggestions */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Suggested Actions:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {config.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {onRetry && (
            <Button onClick={onRetry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
          
          {onFallback && errorType === 'connection' && (
            <Button onClick={onFallback} variant="outline" size="sm">
              <Wifi className="h-4 w-4 mr-2" />
              Use Static Data
            </Button>
          )}

          {errorType === 'connection' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('http://localhost:8080/api/health', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Test Backend
            </Button>
          )}
        </div>

        {/* Technical Details (Expandable) */}
        {showDetails && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullError(!showFullError)}
              className="p-0 h-auto font-normal text-muted-foreground"
            >
              {showFullError ? 'Hide' : 'Show'} Technical Details
            </Button>
            
            {showFullError && (
              <div className="p-3 bg-muted rounded-md">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Mode Indicator */}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          Current Mode: <Badge variant="outline">{API_CONFIG.mode}</Badge>
          {API_CONFIG.mode === 'static' && (
            <span className="ml-2">Switch to Live Mode for full functionality</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Network status component
export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useState(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  })

  if (isOnline) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>No Internet Connection</AlertTitle>
      <AlertDescription>
        You're currently offline. Some features may not work properly.
      </AlertDescription>
    </Alert>
  )
}

// Fallback component for when APIs are unavailable
export function APIFallbackNotice({ 
  onSwitchToStatic, 
  showSwitch = true 
}: {
  onSwitchToStatic?: () => void
  showSwitch?: boolean
}) {
  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800 dark:text-orange-200">
        Backend Unavailable
      </AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-300">
        The backend server is not responding. 
        {showSwitch && onSwitchToStatic && (
          <>
            {' '}You can continue using the application with static demo data.
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSwitchToStatic}
              className="ml-2"
            >
              Switch to Demo Mode
            </Button>
          </>
        )}
      </AlertDescription>
    </Alert>
  )
}