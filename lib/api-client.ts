import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { API_CONFIG, API_ENDPOINTS, getCurrentMode } from './api-config'
import { Vendor } from './data'

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging and debugging
apiClient.interceptors.request.use(
  (config) => {
    if (getCurrentMode() === 'live') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params)
    }
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (getCurrentMode() === 'live') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`, response.data)
    }
    return response
  },
  (error: AxiosError) => {
    if (getCurrentMode() === 'live') {
      console.error('❌ API Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
      })
    }
    return Promise.reject(error)
  }
)

// Generic API call function that handles both live and static modes
async function apiCall<T>(
  endpoint: string,
  staticDataPath?: string,
  options?: { params?: any; data?: any }
): Promise<T> {
  const currentMode = getCurrentMode()
  
  if (currentMode === 'static' && staticDataPath) {
    try {
      // In static mode, fetch from public data files
      const response = await fetch(staticDataPath)
      if (!response.ok) {
        throw new Error(`Failed to fetch static data: ${response.statusText}`)
      }
      const data = await response.json()
      return data as T
    } catch (error) {
      console.error('Failed to fetch static data:', error)
      throw error
    }
  }
  
  // In live mode, make actual API calls
  try {
    let response: AxiosResponse<T>
    
    if (options?.data) {
      // POST request
      response = await apiClient.post(endpoint, options.data)
    } else if (options?.params) {
      // GET request with params
      response = await apiClient.get(endpoint, { params: options.params })
    } else {
      // GET request without params
      response = await apiClient.get(endpoint)
    }
    
    return response.data
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}

// API functions
export const api = {
  // Health & System Status
  getHealth: () =>
    apiCall(API_ENDPOINTS.health, '/data/health.json'),

  getHealthDataFiles: () =>
    apiCall(API_ENDPOINTS.healthDataFiles, '/data/health-data-files.json'),

  getHealthBigQuery: () =>
    apiCall(API_ENDPOINTS.healthBigQuery, '/data/health-bigquery.json'),

  getAdminStatus: () =>
    apiCall(API_ENDPOINTS.adminStatus, '/data/admin-status.json'),

  // Dashboard overview
  getDashboardOverview: () =>
    apiCall(API_ENDPOINTS.dashboard, '/data/dashboard/overview.json'),

  getDashboardSummary: () =>
    apiCall(API_ENDPOINTS.dashboardSummary, '/data/dashboard-summary.json'),

  getDashboardMetrics: () =>
    apiCall(API_ENDPOINTS.dashboardMetrics, '/data/dashboard-metrics.json'),

  // Threats
  getThreats: (params?: { status?: string; severity?: string; search?: string }) =>
    apiCall(API_ENDPOINTS.threats, '/data/threats.json', { params }),

  getThreatDetail: (id: string) =>
    apiCall(
      API_ENDPOINTS.threatDetail(id),
      `/data/threats/${id}.json`
    ),

  getThreatStats: () =>
    apiCall(API_ENDPOINTS.threatStats, '/data/threat-stats.json'),

  searchThreats: (params: { q: string; filters?: any }) =>
    apiCall(API_ENDPOINTS.threatSearch, '/data/threat-search.json', { params }),

  // Vendors
  getVendors: async (params?: { risk?: string; search?: string }) => {
    const response = await apiCall<{ success: boolean; data: Vendor[]; metadata: any }>(
      API_ENDPOINTS.vendors, 
      '/data/vendors.json', 
      { params }
    )
    // Transform response to match component expectations
    return { vendors: response.data || [] }
  },

  getVendorDetail: (id: string) =>
    apiCall(
      API_ENDPOINTS.vendorDetail(id),
      `/data/vendors/${id}.json`
    ),

  getVendorRiskMatrix: () =>
    apiCall(API_ENDPOINTS.vendorRiskMatrix, '/data/vendor-risk-matrix.json'),

  getVendorStats: () =>
    apiCall(API_ENDPOINTS.vendorStats, '/data/vendor-stats.json'),

  // Analytics
  getAnalytics: async (): Promise<AnalyticsResponse> => {
    const currentMode = getCurrentMode()
    
    if (currentMode === 'static') {
      try {
        // In static mode, fetch from public data files and wrap in API response format
        const response = await fetch('/data/analytics.json')
        if (!response.ok) {
          throw new Error(`Failed to fetch static data: ${response.statusText}`)
        }
        const data = await response.json()
        
        // Wrap the static data in the expected API response format
        return {
          success: true,
          data: data,
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'precomputed',
            processingTime: 0
          }
        } as AnalyticsResponse
      } catch (error) {
        console.error('Failed to fetch static analytics data:', error)
        throw error
      }
    }
    
    // In live mode, make actual API call
    return apiCall<AnalyticsResponse>(API_ENDPOINTS.analytics)
  },

  getAnalyticsTrends: (params?: { period?: string }): Promise<AnalyticsResponse> =>
    apiCall(API_ENDPOINTS.analyticsTrends, '/data/analytics-trends.json', { params }),

  getAnalyticsPredictions: () =>
    apiCall(API_ENDPOINTS.analyticsPredictions, '/data/analytics-predictions.json'),

  getAnalyticsDashboard: () =>
    apiCall(API_ENDPOINTS.analyticsDashboard, '/data/analytics-dashboard.json'),

  // BigQuery AI Operations
  getBigQueryStatus: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.bigQueryStatus)
      return response.data
    } catch (error) {
      console.error('Failed to fetch BigQuery status:', error)
      throw error
    }
  },

  getBigQueryCosts: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.bigQueryCosts)
      return response.data
    } catch (error) {
      console.error('Failed to fetch BigQuery costs:', error)
      throw error
    }
  },

  // Network Graph APIs - Using your real backend endpoints
  getNetworkGraph: async (params?: { vendorId?: string; threatId?: string; includeThreats?: boolean; includeDependencies?: boolean }) => {
    // Always use the real backend API for Network Graph
    try {
      // Prepare API parameters based on backend requirements
      const apiParams: any = {}
      
      // Backend requires either vendorId or threatId
      if (params?.vendorId && params.vendorId !== 'default') {
        apiParams.vendorId = params.vendorId
      } else if (params?.threatId) {
        apiParams.threatId = params.threatId
      } else {
        // If neither is provided, use a default vendor ID for demo purposes
        apiParams.vendorId = 'default'
      }
      
      // Add optional parameters if they exist
      if (params?.includeThreats !== undefined) {
        apiParams.includeThreats = params.includeThreats
      }
      if (params?.includeDependencies !== undefined) {
        apiParams.includeDependencies = params.includeDependencies
      }
      
      console.log('🚀 Calling Network Graph API with params:', apiParams)
      const response = await apiClient.post(API_ENDPOINTS.networkGraph, apiParams)
      console.log('✅ Network Graph API response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch network graph from backend:', error)
      throw error
    }
  },

  startLiveNetworkGraph: async (params?: { updateInterval?: number; includeRealTime?: boolean }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.networkGraphLive, params)
      return response.data
    } catch (error) {
      console.error('Failed to start live network graph:', error)
      throw error
    }
  },

  // BigQuery AI Analysis Methods
  analyzeThreat: async (params: { threatId: string; analysisType?: string }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.bigQueryAnalyzeThreat, params)
      return response.data
    } catch (error) {
      console.error('Failed to analyze threat:', error)
      throw error
    }
  },

  analyzeVendor: async (params: { vendorId: string; analysisType?: string }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.bigQueryAnalyzeVendor, params)
      return response.data
    } catch (error) {
      console.error('Failed to analyze vendor:', error)
      throw error
    }
  },

  // AI Dashboard APIs
  getPredictedThreats: (vendorId?: string): Promise<PredictedThreatsResponse> =>
    apiCall(API_ENDPOINTS.aiPredictedThreats, '/data/ai-predicted-threats.json', { params: vendorId ? { vendorId } : undefined }),

  getProcessingSteps: (analysisId: string): Promise<ProcessingStepsResponse> =>
    apiCall(API_ENDPOINTS.aiProcessingSteps(analysisId), `/data/ai-processing-steps-${analysisId}.json`),

  getAIInsights: (analysisId: string): Promise<AIInsightsResponse> =>
    apiCall(API_ENDPOINTS.aiInsights(analysisId), `/data/ai-insights-${analysisId}.json`),

  getAIImpactMetrics: (): Promise<ImpactMetricsResponse> =>
    apiCall(API_ENDPOINTS.aiImpactMetrics, '/data/ai-impact-metrics.json'),

  getAIExecutiveSummary: (): Promise<ExecutiveSummaryResponse> =>
    apiCall(API_ENDPOINTS.aiExecutiveSummary, '/data/ai-executive-summary.json'),

  postComprehensiveAnalysis: (request: AIAnalysisRequest): Promise<any> =>
    apiCall(API_ENDPOINTS.aiComprehensiveAnalysis, '/data/ai-comprehensive-analysis.json', { data: request }),

  getAnalysisResults: (analysisId: string): Promise<any> =>
    apiCall(API_ENDPOINTS.aiAnalysisResults(analysisId), `/data/ai-analysis-results-${analysisId}.json`),

  updateProcessingStep: (analysisId: string, stepId: string, update: ProcessingStepUpdate): Promise<any> =>
    apiCall(API_ENDPOINTS.aiUpdateProcessingStep(analysisId, stepId), undefined, { data: update }),

  addAIInsight: (analysisId: string, insight: NewInsightRequest): Promise<any> =>
    apiCall(API_ENDPOINTS.aiAddInsight(analysisId), undefined, { data: insight }),

  // Generic HTTP methods (for custom requests)
  get: (url: string) => apiClient.get(url),
  post: (url: string, data?: any) => apiClient.post(url, data),
  put: (url: string, data?: any) => apiClient.put(url, data),
  delete: (url: string) => apiClient.delete(url),
}

export default apiClient

// Export types for Live BigQuery AI Analysis
export type LiveAnalysisRequest = {
  vendorId?: string
  threatId?: string
  analysisType?: 'quick' | 'comprehensive'
  queryText?: string
  assetIds?: string[]
}

export type QuickAnalysisRequest = {
  vendorId?: string
  threatId?: string
  queryText?: string
}

export type QuickAnalysisResponse = {
  success: boolean
  data: {
    analysisId: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    result?: any
    error?: string
  }
  metadata: {
    timestamp: string
    processingTime: number
  }
}

export type ComprehensiveAnalysisRequest = {
  vendorId?: string
  threatId?: string
  analysisDepth: 'basic' | 'detailed' | 'exhaustive'
  includeHistoricalData: boolean
  includePredictiveAnalysis: boolean
}

export type ComprehensiveAnalysisResponse = {
  success: boolean
  data: {
    analysisId: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress: number
    estimatedCompletion: string
    result?: any
    error?: string
  }
  metadata: {
    timestamp: string
    requestId: string
  }
}

export type AnalysisStatusResponse = {
  success: boolean
  data: {
    analysisId: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress: number
    estimatedCompletion?: string
    result?: any
    error?: string
    metadata: {
      startTime: string
      lastUpdate: string
      processingSteps: string[]
    }
  }
}

export type BigQueryStatusResponse = {
  success: boolean
  data: {
    status: 'available' | 'unavailable' | 'error'
    isHealthy: boolean
    isConnected: boolean
    availableFunctions: string[]
    lastHealthCheck: string
    version: string
    error?: string
  }
}

export type BigQueryCostsResponse = {
  success: boolean
  data: {
    currentCosts: {
      daily: number
      monthly: number
      total: number
    }
    budget: {
      limit: number
      remaining: number
      utilization: number
    }
    breakdown: {
      analysis: number
      storage: number
      queries: number
    }
  }
}

// AI Dashboard API Types
export type PredictedThreat = {
  id: string
  vendorName: string
  probability: number
  threatType: string
  aiReasoning: string
  recommendedAction: string
  potentialImpact: string
  timeframe: string
  confidence: number
  riskScore: number
  affectedSystems?: string[]
  historicalPatterns?: string[]
  lastUpdated: string
}

export type PredictedThreatsResponse = {
  success: boolean
  data: PredictedThreat[]
  metadata: {
    timestamp: string
    processingTime: number
    requestId: string
  }
}

export type AIProcessingStep = {
  id: string
  name: string
  description: string
  progress: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  cost: number
  eta: string
  startTime: string
  endTime?: string
  metadata?: {
    recordsProcessed?: number
    aiModel?: string
    confidence?: number
  }
}

export type ProcessingStepsResponse = {
  success: boolean
  data: AIProcessingStep[]
  metadata: {
    timestamp: string
    processingTime: number
    requestId: string
  }
}

export type AIInsight = {
  id: string
  type: 'threat' | 'anomaly' | 'pattern' | 'recommendation' | 'discovery'
  message: string
  confidence: number
  timestamp: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  source: string
  relatedThreats?: string[]
  affectedVendors?: string[]
  businessImpact?: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
}

export type AIInsightsResponse = {
  success: boolean
  data: AIInsight[]
  metadata: {
    timestamp: string
    processingTime: number
    requestId: string
  }
}

export type AIImpactMetrics = {
  preventedLosses: number
  speedAdvantage: number
  accuracyBoost: number
  processingVolume: number
  riskReduction: number
  predictionSuccess: number
  timeToDetection: number
  analystWorkloadReduction: number
  costPerInvestigation: number
  traditionalCostComparison: number
  lastUpdated: string
  traditionalMetrics?: {
    preventedLosses: number
    speedAdvantage: number
    accuracyBoost: number
    processingVolume: number
    riskReduction: number
    predictionSuccess: number
  }
}

export type ImpactMetricsResponse = {
  success: boolean
  data: AIImpactMetrics
  metadata: {
    timestamp: string
    processingTime: number
    requestId: string
  }
}

export type AIExecutiveSummary = {
  id: string
  generatedAt: string
  keyFindings: string[]
  aiConfidenceMetrics: {
    threatDetectionAccuracy: number
    falsePositiveReduction: number
    predictionReliability: number
    overallConfidence: number
  }
  immediateActions: Array<{
    priority: 'low' | 'medium' | 'high' | 'critical'
    action: string
    description: string
    timeline: string
    responsible: string
    riskScore: number
  }>
  businessImpact: {
    timeToThreatDetection: number
    analystWorkloadReduction: number
    costPerThreatInvestigation: number
    traditionalCostComparison: number
    potentialLossesPrevented: number
  }
  threatPatterns: Array<{
    pattern: string
    confidence: number
    affectedVendors: number
    severity: 'low' | 'medium' | 'high' | 'critical'
  }>
  recommendations: string[]
  nextUpdate: string
}

export type ExecutiveSummaryResponse = {
  success: boolean
  data: AIExecutiveSummary
  metadata: {
    timestamp: string
    processingTime: number
    requestId: string
  }
}

export type AIAnalysisRequest = {
  vendorId?: string
  analysisType: 'quick' | 'comprehensive' | 'predictive' | 'executive'
  includeHistorical?: boolean
  includePredictions?: boolean
  timeframe?: number
}

export type ProcessingStepUpdate = {
  progress?: number
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  eta?: string
}

export type NewInsightRequest = {
  type: 'threat' | 'anomaly' | 'pattern' | 'recommendation' | 'discovery'
  message: string
  confidence: number
  impact: 'low' | 'medium' | 'high' | 'critical'
  source: string
}

export type AnalyticsResponse = {
  success: boolean
  data: {
    timeSeriesData: Array<{
      date: string
      threats: number
      riskScore: number
    }>
    threatTypes: Array<{
      name: string
      value: number
      color: string
    }>
    attackVectors: Array<{
      vector: string
      count: number
      trend: string
    }>
    predictions: Array<{
      month: string
      predicted: number
      actual: number | null
    }>
  }
  metadata: {
    timestamp: string
    source: 'precomputed' | 'live'
    processingTime: number
  }
}

// Live Analysis Stream Types
export type StreamingEvent = {
  type: 'threat_alert' | 'threat-detected' | 'system-status' | 'analysis_update' | 'risk_change' | 'connection_discovered' | 'status' | 'step_start' | 'step_complete' | 'error' | 'analysis_complete'
  timestamp: string
  data: any
  severity?: 'low' | 'medium' | 'high' | 'critical'
  message: string
  step?: string
  progress?: number
  totalSteps?: number
  currentStep?: number
  cost_usd?: number
  results?: any
}

export class LiveAnalysisStream {
  private messageCallback?: (event: StreamingEvent) => void
  private errorCallback?: (error: string) => void
  private completeCallback?: () => void
  private eventSource: EventSource | null = null
  private abortController: AbortController | null = null
  public isConnected: boolean = false

  constructor(
    onMessage: (event: StreamingEvent) => void,
    onError?: (error: string) => void,
    onComplete?: () => void
  ) {
    this.messageCallback = onMessage
    this.errorCallback = onError
    this.completeCallback = onComplete
  }

  start(analysisRequest?: LiveAnalysisRequest) {
    try {
      console.log('🚀 Starting Live Analysis with real-time event processing')
      console.log('📤 Analysis request parameters:', analysisRequest)
      
      // Use POST request as the backend requires it
      const requestBody = {
        vendorId: analysisRequest?.vendorId || 'default',
        analysisType: analysisRequest?.analysisType || 'comprehensive',
        includeHistorical: true
      }
      
      console.log('📤 POST request body:', requestBody)
      
      // Create abort controller for cleanup
      this.abortController = new AbortController()
      
      // Use fetch to get the complete response
      fetch(`${API_CONFIG.baseUrl}/api/bigquery-ai/live-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(requestBody),
        signal: this.abortController.signal
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        console.log('✅ Live Analysis POST request successful, processing response')
        this.isConnected = true
        
        // Get the complete response text
        return response.text()
      })
      .then(responseText => {
        console.log('📨 Complete response received:', responseText)
        console.log('📨 Response length:', responseText.length)
        
        // Parse all events from the response
        const lines = responseText.split('\n')
        console.log('📨 Total lines found:', lines.length)
        
        const events: any[] = []
        
        // Extract all valid events
        lines.forEach((line, index) => {
          if (line.trim() && line.startsWith('data: ')) {
            try {
              const eventData = line.substring(6) // Remove 'data: ' prefix
              const data = JSON.parse(eventData)
              
              // Skip the 'end' event as it's just a stream terminator
              if (data.type === 'end') {
                console.log('📨 Skipping end event - stream terminator only')
                return
              }
              
              events.push(data)
              console.log(`📨 Extracted event ${events.length}:`, data.type)
            } catch (error) {
              console.error('❌ Failed to parse SSE data:', error, 'Raw line:', line)
            }
          }
        })
        
        console.log(`📨 Total events extracted: ${events.length}`)
        
        // Process events in real-time sequence with appropriate delays
        let currentIndex = 0
        
        const processNextEvent = () => {
          if (currentIndex >= events.length) {
            console.log('✅ All events processed')
            this.isConnected = false
            if (this.completeCallback) {
              this.completeCallback()
            }
            return
          }
          
          const event = events[currentIndex]
          console.log(`📤 Processing event ${currentIndex + 1}/${events.length}:`, event.type)
          
          // Transform to StreamingEvent format
          const streamingEvent: StreamingEvent = {
            type: event.type || 'unknown',
            timestamp: event.timestamp || new Date().toISOString(),
            data: event.data || event,
            severity: event.severity || 'medium',
            message: event.message || `Event: ${event.type}`,
            step: event.step,
            progress: event.progress,
            totalSteps: event.totalSteps,
            currentStep: event.currentStep,
            cost_usd: event.cost_usd,
            results: event.results
          }
          
          console.log('🔄 Transformed to StreamingEvent:', streamingEvent)
          
          if (this.messageCallback) {
            console.log('📤 Sending event to callback:', streamingEvent.type)
            this.messageCallback(streamingEvent)
          }
          
          currentIndex++
          
          // Calculate delay based on event type for realistic timing
          let delay = 100 // Default 100ms
          
          if (event.type === 'step_start') {
            delay = 200 // Step start takes a bit longer
          } else if (event.type === 'step_complete') {
            delay = 150 // Step complete is quick
          } else if (event.type === 'threat-detected') {
            delay = 300 // Threat detection takes time
          } else if (event.type === 'analysis_complete') {
            delay = 500 // Final completion takes longer
          }
          
          // Process next event after delay
          setTimeout(processNextEvent, delay)
        }
        
        // Start processing events
        processNextEvent()
        
      })
      .catch(error => {
        console.error('❌ Failed to start Live Analysis:', error)
        this.isConnected = false
        if (this.errorCallback) {
          this.errorCallback(`Failed to start Live Analysis: ${error.message}`)
        }
      })
      
    } catch (error) {
      console.error('❌ Failed to create Live Analysis connection:', error)
      if (this.errorCallback) {
        this.errorCallback(`Failed to create Live Analysis connection: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  stop() {
    // Close EventSource if it exists
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
    
    // Abort the fetch request if it's running
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
    
    this.isConnected = false
    console.log('🛑 Live Analysis stopped')
  }
}
