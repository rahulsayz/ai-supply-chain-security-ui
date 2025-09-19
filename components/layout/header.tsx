'use client'

import { useState } from 'react'
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  Sun, 
  Moon,
  Settings,
  LogOut,
  Shield,
  Activity
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ModeIndicator } from '@/components/ui/mode-indicator'
import { BigQueryStatusWidget } from '@/components/ui/bigquery-status-widget'


interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [notificationCount] = useState(12)

  return (
    <header className="glass-header h-18 border-b sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-muted/80"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Enhanced Search Bar */}
          <div className="relative w-96 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              placeholder="Search threats, vendors..."
              className="glass-input pl-12 pr-24 focus:bg-background focus:border-primary/50 transition-all duration-200 h-12 rounded-xl text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <Badge variant="secondary" className="text-xs font-mono bg-primary/10 text-primary border-primary/20 px-2 py-1">
                Ctrl+K
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* System Status Indicators */}
          <div className="flex items-center gap-2">
            <ModeIndicator />
            <BigQueryStatusWidget />
            
            {/* System Health Indicator */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700 dark:text-green-400">Healthy</span>
            </div>
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-muted/80 h-10 w-10 rounded-xl">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold animate-pulse"
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </Badge>
            )}
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:bg-muted/80 h-10 w-10 rounded-xl"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-muted/80">
                                   <div className="flex items-center justify-center w-full h-full rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-lg">
                     <User className="h-5 w-5 text-primary" />
                   </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-2" align="end">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-sm">Security Administrator</p>
                  <p className="text-xs text-muted-foreground">admin@company.com</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-700 dark:text-green-400">Active Session</span>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-muted/80 cursor-pointer">
                <Settings className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">Settings</span>
                  <span className="text-xs text-muted-foreground">Configure system preferences</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-muted/80 cursor-pointer">
                <Activity className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">Activity Log</span>
                  <span className="text-xs text-muted-foreground">View recent actions</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 p-3 rounded-lg hover:bg-destructive/10 hover:text-destructive cursor-pointer">
                <LogOut className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">Sign Out</span>
                  <span className="text-xs text-muted-foreground">End current session</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}