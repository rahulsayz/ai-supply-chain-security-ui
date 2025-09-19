// Add mode switching functionality
let currentMode: 'static' | 'live' = (process.env.NEXT_PUBLIC_API_MODE || 'static') as 'static' | 'live'

// Event system for mode changes
const modeChangeListeners: Array<(mode: 'static' | 'live') => void> = []

export const addModeChangeListener = (listener: (mode: 'static' | 'live') => void) => {
  modeChangeListeners.push(listener)
}

export const removeModeChangeListener = (listener: (mode: 'static' | 'live') => void) => {
  const index = modeChangeListeners.indexOf(listener)
  if (index > -1) {
    modeChangeListeners.splice(index, 1)
  }
}

export const switchMode = (newMode: 'static' | 'live') => {
  const oldMode = currentMode
  currentMode = newMode
  
  // Store in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('api_mode', newMode)
  }
  
  // Notify all listeners
  modeChangeListeners.forEach(listener => {
    try {
      listener(newMode)
    } catch (error) {
      // Silently handle listener errors
    }
  })
  

}

export const getCurrentMode = (): 'static' | 'live' => {
  // Check localStorage first for user preference
  if (typeof window !== 'undefined') {
    const storedMode = localStorage.getItem('api_mode')
    if (storedMode === 'static' || storedMode === 'live') {
      return storedMode
    }
  }
  return currentMode
}

export const API_CONFIG = {
  get mode() {
    return getCurrentMode()
  },
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  enableWebSocket: false, // Disabled since we're using EventSource for SSE
  retryAttempts: 3,
  retryDelay: 1000,
  cacheTime: 5 * 60 * 1000, // 5 minutes
  staleTime: 30 * 1000, // 30 seconds
} as const

export const API_ENDPOINTS = {
  // Health & System Status
  health: '/api/health',
  healthDataFiles: '/api/health/data-files',
  healthBigQuery: '/api/health/bigquery',
  adminStatus: '/api/admin/status',
  
  // Dashboard
  dashboard: '/api/dashboard/overview',
  dashboardSummary: '/api/dashboard/summary',
  dashboardMetrics: '/api/dashboard/metrics',
  
  // Threats
  threats: '/api/threats',
  threatDetail: (id: string) => `/api/threats/${id}`,
  threatStats: '/api/threats/summary/stats',
  threatSearch: '/api/threats/search',
  
  // Vendors
  vendors: '/api/vendors',
  vendorDetail: (id: string) => `/api/vendors/${id}`,
  vendorRiskMatrix: '/api/vendors/risk-matrix',
  vendorStats: '/api/vendors/summary/stats',
  
  // Analytics
  analytics: '/api/analytics',
  analyticsTrends: '/api/analytics/trends',
  analyticsPredictions: '/api/analytics/predictions',
  analyticsDashboard: '/api/analytics/dashboard',
  
  // BigQuery AI - Using working backend APIs from Swagger
  bigQueryStatus: '/api/bigquery-ai/status',
  bigQueryAnalyzeThreat: '/api/bigquery-ai/analyze-threat',
  bigQueryAnalyzeVendor: '/api/bigquery-ai/analyze-vendor',
  bigQueryVectorSearch: '/api/bigquery-ai/vector-search',
  bigQueryCosts: '/api/bigquery-ai/costs',
  bigQueryDemo: '/api/bigquery-ai/demo',
  bigQueryExportData: '/api/bigquery-ai/export-data',
  bigQueryResetCosts: '/api/bigquery-ai/reset-costs',
  bigQuerySetup: '/api/bigquery-ai/setup',
  
  // Live BigQuery AI Analysis - Using actual available endpoints
  liveAnalysis: '/api/bigquery-ai/live-analysis', // ✅ This endpoint exists
  quickAnalysis: '/api/bigquery-ai/analyze-threat', // Use existing endpoint
  analysisStatus: (id: string) => `/api/bigquery-ai/analysis-status/${id}`,
  comprehensiveAnalysis: '/api/bigquery-ai/analyze-threat', // Use existing endpoint
  enhancedVectorSearch: '/api/bigquery-ai/vector-search', // This exists
  threatIntelligence: '/api/bigquery-ai/analyze-threat', // Use existing endpoint
  riskAssessment: '/api/bigquery-ai/analyze-threat', // Use existing endpoint
  
  // Cost endpoints - using working backend APIs from Swagger
  bigQueryCostsCurrent: '/api/bigquery-ai/costs',        // ✅ Working endpoint
  bigQueryCostsBreakdown: '/api/bigquery-ai/costs',      // ✅ Working endpoint
  bigQueryCostsHistory: '/api/bigquery-ai/costs',        // ✅ Working endpoint
  bigQueryCostsAlerts: '/api/bigquery-ai/costs',         // ✅ Working endpoint
  
  // Health endpoints - using working backend APIs from Swagger
  bigQueryHealthFunctions: '/api/bigquery-ai/status',    // ✅ Working endpoint
  bigQueryHealthConnectivity: '/api/bigquery-ai/status', // ✅ Working endpoint (use same as functions)
  bigQueryHealthMetrics: '/api/bigquery-ai/status',      // ✅ Working endpoint (use same as functions)
  
  // Configuration endpoints - using working backend APIs
  bigQueryConfig: '/api/bigquery-ai/config',
  bigQueryConfigBudget: '/api/bigquery-ai/config/budget',
  bigQueryConfigRegions: '/api/bigquery-ai/config/regions',
  bigQueryConfigValidate: '/api/bigquery-ai/config/validate',
  bigQueryLiveAnalysis: '/api/bigquery-ai/live-analysis',
  
  // Simulation
  refreshData: '/api/refresh-data',
  simulateThreatAlert: '/api/simulate/threat-alert',
  simulateStart: '/api/simulate/start',
  simulateStop: '/api/simulate/stop',
  
  // Network Graph APIs - New endpoints
  networkGraph: '/api/network-graph',
  networkGraphLive: '/api/network-graph-live',

  // AI Dashboard APIs - New endpoints from dashboard-api.md
  aiPredictedThreats: '/api/ai/predicted-threats',
  aiProcessingSteps: (analysisId: string) => `/api/ai/processing-steps/${analysisId}`,
  aiInsights: (analysisId: string) => `/api/ai/insights/${analysisId}`,
  aiImpactMetrics: '/api/ai/impact-metrics',
  aiExecutiveSummary: '/api/ai/executive-summary',
  aiComprehensiveAnalysis: '/api/ai/comprehensive-analysis',
  aiAnalysisResults: (analysisId: string) => `/api/ai/analysis-results/${analysisId}`,
  aiUpdateProcessingStep: (analysisId: string, stepId: string) => `/api/ai/processing-steps/${analysisId}/${stepId}`,
  aiAddInsight: (analysisId: string) => `/api/ai/insights/${analysisId}`,
} as const

// EventSource configuration for SSE
export const SSE_CONFIG = {
  liveAnalysis: '/api/bigquery-ai/live-analysis', // GET endpoint for EventSource
  reconnectInterval: 1000, // Reconnect after 1 second on failure
  maxReconnectAttempts: 3
} as const

export const STATIC_DATA_PATHS = {
  dashboard: '/data/dashboard/overview.json',
  threats: '/data/threats.json',
  threatDetail: (id: string) => `/data/threats/${id}.json`,
  vendors: '/data/vendors.json',
  analytics: '/data/analytics.json',
} as const