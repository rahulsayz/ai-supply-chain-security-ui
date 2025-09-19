'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Brain, 
  DollarSign, 
  Settings as SettingsIcon,
  Zap,
  Globe,
  AlertTriangle,
  CheckCircle,
  TestTube
} from 'lucide-react'
import { api } from '@/lib/api-client'
import { API_CONFIG, API_ENDPOINTS } from '@/lib/api-config'
import { toast } from 'sonner'

export function BigQueryAISettings() {
  const [budgetLimit, setBudgetLimit] = useState('10.00')
  const [alertThreshold, setAlertThreshold] = useState('75')
  const [selectedRegion, setSelectedRegion] = useState('US')
  const [autoStopEnabled, setAutoStopEnabled] = useState(true)

  // Fetch current configuration - Using actual backend endpoint
  const { data: configData, refetch: refetchConfig } = useQuery({
    queryKey: ['bigquery-config'],
    queryFn: () => api.get(API_ENDPOINTS.bigQueryConfig).then(res => res.data),
    enabled: API_CONFIG.mode === 'live'
  })

  // Fetch available regions - Using actual backend endpoint
  const { data: regionsData } = useQuery({
    queryKey: ['bigquery-regions'],
    queryFn: () => api.get(API_ENDPOINTS.bigQueryConfigRegions).then(res => res.data),
    enabled: API_CONFIG.mode === 'live'
  })

  // Fetch current costs - Using new API contract (DISABLED to prevent 404 errors)
  const { data: costData, error: costError } = useQuery({
    queryKey: ['bigquery-costs'],
    queryFn: api.getBigQueryCosts,
    refetchInterval: 30000,
    enabled: false // Disabled to prevent 404 errors
  })

  // Fetch function health - Using new API contract (DISABLED to prevent 404 errors)
  const { data: healthData, error: healthError } = useQuery({
    queryKey: ['bigquery-health'],
    queryFn: api.getBigQueryStatus,
    refetchInterval: 60000,
    enabled: false // Disabled to prevent 404 errors
  })

  // Update budget configuration - Using working backend API
  const updateBudgetMutation = useMutation({
    mutationFn: (data: { dailyLimit: number; alertThresholds: number[] }) =>
      api.put('/api/bigquery-ai/config/budget', data).then(res => res.data),
    onSuccess: () => {
      toast.success('Budget Configuration Updated', {
        description: 'New budget limits are now active'
      })
      refetchConfig()
    },
    onError: (error: any) => {
      toast.error('Configuration Update Failed', {
        description: 'Failed to update budget configuration'
      })
    }
  })

  // Test AI function - Using actual backend endpoint
  const testFunctionMutation = useMutation({
    mutationFn: (functionName: string) =>
      api.post(`${API_ENDPOINTS.bigQueryHealthFunctions}/test/${functionName}`).then(res => res.data),
    onSuccess: (data, functionName) => {
      toast.success(`Function Test: ${functionName}`, {
        description: data.success ? 
          `Test completed in ${data.responseTime}ms` : 
          'Function test failed'
      })
    },
    onError: (error: any) => {
      toast.error('Function Test Failed', {
        description: error.response?.data?.message || 'Unable to test function'
      })
    }
  })

  // Validate configuration - Using actual backend endpoint
  const validateConfigMutation = useMutation({
    mutationFn: (config: any) =>
      api.post(API_ENDPOINTS.bigQueryConfigValidate, config).then(res => res.data),
    onSuccess: (data) => {
      toast.success('Configuration Validation', {
        description: data.valid ? 'Configuration is valid' : data.message
      })
    }
  })

  const handleSaveBudgetConfig = () => {
    const dailyLimit = parseFloat(budgetLimit)
    const threshold = parseFloat(alertThreshold) / 100

    if (isNaN(dailyLimit) || dailyLimit <= 0) {
      toast.error('Invalid Budget', {
        description: 'Daily budget must be a positive number'
      })
      return
    }

    updateBudgetMutation.mutate({
      dailyLimit,
      alertThresholds: [0.5, threshold, 0.9]
    })
  }

  if (API_CONFIG.mode === 'static') {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Brain className="h-5 w-5" />
            BigQuery AI Configuration
          </CardTitle>
          <CardDescription>
            Switch to Live Mode to configure BigQuery AI settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            BigQuery AI configuration is only available in Live Mode
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cost Control Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cost Control & Budget Management
          </CardTitle>
          <CardDescription>
            Configure spending limits and cost monitoring for BigQuery AI operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Budget Status */}
          {costData && (
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Current Daily Usage</span>
                <span className="text-lg font-bold">
                  ${(costData?.data?.cost_summary?.today?.cost_usd || 0).toFixed(4)} / ${(costData?.data?.cost_summary?.today?.budget_limit_usd || 10).toFixed(2)}
                </span>
              </div>
              <Progress value={costData?.data?.cost_summary?.today?.usage_percent || 0} className="h-2 mb-2" />
              <div className="text-sm text-muted-foreground">
                {(costData?.data?.cost_summary?.today?.usage_percent || 0).toFixed(1)}% utilized • ${(costData?.data?.cost_summary?.today?.remaining_usd || 10).toFixed(4)} remaining
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget-limit">Daily Budget Limit ($)</Label>
              <Input
                id="budget-limit"
                type="number"
                step="0.01"
                min="0.01"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                placeholder="10.00"
              />
              <p className="text-xs text-muted-foreground">
                Maximum daily spending on BigQuery AI operations
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alert-threshold">Alert Threshold (%)</Label>
              <Input
                id="alert-threshold"
                type="number"
                min="1"
                max="100"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                placeholder="75"
              />
              <p className="text-xs text-muted-foreground">
                Send alerts when budget utilization reaches this percentage
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Stop at 95% Budget</Label>
              <p className="text-sm text-muted-foreground">
                Automatically pause AI processing when approaching budget limit
              </p>
            </div>
            <Switch 
              checked={autoStopEnabled} 
              onCheckedChange={setAutoStopEnabled}
            />
          </div>

          <Button 
            onClick={handleSaveBudgetConfig}
            disabled={updateBudgetMutation.isPending}
          >
            {updateBudgetMutation.isPending ? 'Saving...' : 'Save Budget Configuration'}
          </Button>
        </CardContent>
      </Card>

      {/* AI Function Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Function Management
          </CardTitle>
          <CardDescription>
            Monitor and configure individual BigQuery AI functions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {healthData && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium">AI System Status</span>
                <Badge variant={healthData?.data?.status === 'available' ? 'default' : 'destructive'}>
                  {healthData?.data?.status || 'Unknown'}
                </Badge>
              </div>

              <div className="grid gap-3">
                {healthData?.data?.config && (
                  <div className="p-3 rounded-lg border">
                    <div className="space-y-2">
                      <div className="font-medium">Configuration</div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Daily Budget Limit: ${healthData.data.config.daily_budget_limit}</div>
                        <div>Max Query Cost: ${healthData.data.config.max_query_cost}</div>
                        <div>Max Processing: {healthData.data.config.max_processing_mb}MB</div>
                        <div>Query Timeout: {healthData.data.config.query_timeout}ms</div>
                      </div>
                    </div>
                  </div>
                )}
                {!healthData?.data?.config && (
                  <div className="text-center py-4 text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 mx-auto mb-2" />
                    Configuration data not available
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Regional Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Configuration
          </CardTitle>
          <CardDescription>
            Configure BigQuery AI processing regions and availability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="region-select">Primary Processing Region</Label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regionsData?.map((region: any) => (
                  <SelectItem key={region.id} value={region.id} disabled={!region.aiSupported}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${region.aiSupported ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {region.name}
                      {!region.aiSupported && <span className="text-xs text-muted-foreground">(AI not supported)</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {regionsData && (
            <div className="grid gap-2">
              <Label>Regional Availability</Label>
              {regionsData.map((region: any) => (
                <div key={region.id} className="flex items-center justify-between p-2 rounded border">
                  <span className="text-sm">{region.name}</span>
                  <div className="flex items-center gap-2">
                    {region.aiSupported ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {region.aiSupported ? 'AI Supported' : 'Limited'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Advanced BigQuery AI system settings and validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {configData && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Project ID:</span>
                  <div className="font-mono">{configData.projectId}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Dataset:</span>
                  <div className="font-mono">{configData.dataset}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <div className="font-mono">{configData.location}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Max Concurrent Jobs:</span>
                  <div className="font-mono">{configData.maxConcurrentJobs}</div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => validateConfigMutation.mutate(configData)}
                  disabled={validateConfigMutation.isPending}
                >
                  {validateConfigMutation.isPending ? 'Validating...' : 'Validate Configuration'}
                </Button>
                <Button variant="outline">
                  Export Configuration
                </Button>
                <Button variant="outline">
                  Reset to Defaults
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}