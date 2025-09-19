'use client'

'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { getCurrentMode, switchMode } from '@/lib/api-config'
import { Zap, Database, AlertCircle, ChevronDown } from 'lucide-react'

export function ModeIndicator() {
  const [currentMode, setCurrentMode] = useState<'static' | 'live'>('static')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setCurrentMode(getCurrentMode())
  }, [])

  const handleModeSwitch = (newMode: 'static' | 'live') => {
    switchMode(newMode)
    setCurrentMode(newMode)
    
    if (newMode === 'live') {
      toast.success('Live Mode Activated', {
        description: 'Real-time BigQuery AI processing enabled',
      })
    } else {
      toast.info('Demo Mode Activated', {
        description: 'Using static demonstration data',
      })
    }
    
    // Refresh the page to apply mode changes
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  if (!isClient) {
    return (
      <Badge variant="secondary">
        Loading...
      </Badge>
    )
  }

  const isLive = currentMode === 'live'
  const isLiveMode = currentMode === 'live'
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <div className="flex items-center gap-2">
              {isLiveMode ? (
                <>
                  <Zap className="h-3 w-3 text-green-500" />
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    Live AI
                  </Badge>
                </>
              ) : (
                <>
                  <Database className="h-3 w-3 text-blue-500" />
                  <Badge variant="secondary">
                    Demo Mode
                  </Badge>
                </>
              )}
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <div className="font-medium">
              {isLiveMode ? 'Live BigQuery AI Mode' : 'Static Demo Mode'}
            </div>
            <div className="text-sm text-muted-foreground">
              {isLiveMode ? (
                <>
                  • Real BigQuery AI processing<br/>
                  • Actual cost tracking<br/>
                  • Live threat analysis
                </>
              ) : (
                <>
                  • Static demonstration data<br/>
                  • No BigQuery costs<br/>
                  • Simulated AI responses
                </>
              )}
            </div>
            {!isLiveMode && (
              <div className="flex items-center gap-1 text-xs text-orange-500">
                <AlertCircle className="h-3 w-3" />
                Switch to Live Mode for real AI
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 px-2">
          <div className="flex items-center gap-2">
            <Badge variant={isLive ? "default" : "secondary"}>
              {isLive ? "Live Mode" : "Demo Mode"}
            </Badge>
            <ChevronDown className="h-3 w-3" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => handleModeSwitch('live')}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="font-medium">Live Mode</span>
            <span className="text-xs text-muted-foreground">
              Real-time BigQuery AI processing
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleModeSwitch('static')}
          className="flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          <div className="flex flex-col">
            <span className="font-medium">Demo Mode</span>
            <span className="text-xs text-muted-foreground">
              Static demonstration data
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </TooltipProvider>
  )
}