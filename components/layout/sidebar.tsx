'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Shield, 
  Home, 
  AlertTriangle, 
  Building2, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Activity,
  Brain,
  Network
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: Home,
    description: 'Overview & Analytics',
    badge: null
  },
  { 
    name: 'Threats', 
    href: '/threats', 
    icon: AlertTriangle,
    description: 'Security Incidents',
    badge: { text: '12', variant: 'destructive' as const }
  },
  { 
    name: 'Vendors', 
    href: '/vendors', 
    icon: Building2,
    description: 'Supply Chain Partners',
    badge: { text: '3', variant: 'secondary' as const }
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: BarChart3,
    description: 'Reports & Insights',
    badge: null
  },
  { 
    name: 'Live Analysis', 
    href: '/live-analysis', 
    icon: Brain,
    description: 'Real-time Threat Detection',
    badge: null
  },
  { 
    name: 'Network Graph', 
    href: '/network-graph', 
    icon: Network,
    description: 'Supply Chain Topology',
    badge: null
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    description: 'Configuration',
    badge: null
  },
]

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className={cn(
      "fixed left-0 top-0 z-30 h-screen glass-sidebar transition-all duration-300 shadow-xl",
      isOpen ? "w-72" : "w-20"
    )}>
      <div className="flex h-full flex-col">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className={cn(
            "flex items-center gap-3 transition-all duration-300",
            !isOpen && "opacity-0 scale-95"
          )}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">Supply Chain</span>
              <span className="text-sm text-muted-foreground font-medium">Defender</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 rounded-xl hover:bg-muted/80 transition-all duration-200"
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12 rounded-xl transition-all duration-200 group",
                  !isOpen && "px-5 justify-center",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "hover:bg-muted/80 hover:shadow-md"
                )}
                onClick={() => router.push(item.href)}
              >
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-primary-foreground/20" 
                    : "bg-muted/60 group-hover:bg-muted/80"
                )}>
                  <item.icon className={cn(
                    "h-4 w-4 transition-all duration-200",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                </div>
                
                {isOpen && (
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{item.name}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge.variant} 
                          className="text-xs font-bold"
                        >
                          {item.badge.text}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs transition-all duration-200",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </p>
                  </div>
                )}
              </Button>
            )
          })}
        </nav>

        {/* Enhanced Footer */}
        <div className="border-t border-border/30 p-4 space-y-3">
          {/* System Status */}
          <div className={cn(
            "transition-all duration-300",
            !isOpen && "opacity-0 scale-95"
          )}>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/30">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-500/20">
                <Activity className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">System Status</span>
                <span className="text-xs text-muted-foreground">All systems operational</span>
              </div>
            </div>
          </div>
          
          {/* Branding */}
          <div className={cn(
            "text-center transition-all duration-300",
            !isOpen && "opacity-0 scale-95"
          )}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-primary">Powered by BigQuery AI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enterprise SOC Platform
              <br />
              v2.1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}