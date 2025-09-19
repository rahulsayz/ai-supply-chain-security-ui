class CostMonitoringService {
  constructor() {
    this.dailyCosts = new Map()
    this.operationCosts = new Map()
    this.budgetConfig = {
      dailyLimit: parseFloat(process.env.BIGQUERY_DAILY_BUDGET) || 10.00,
      alertThresholds: [0.5, 0.75, 0.9], // 50%, 75%, 90%
      autoStopAt: 0.95 // Stop at 95%
    }
    this.costHistory = []
    this.alerts = []
    
    this.initializeCostTracking()
  }

  initializeCostTracking() {
    const today = this.getTodayKey()
    if (!this.dailyCosts.has(today)) {
      this.dailyCosts.set(today, 0)
    }

    // Initialize operation cost estimates
    this.operationCosts.set('live_analysis', 0.025)
    this.operationCosts.set('threat_processing', 0.015)
    this.operationCosts.set('vendor_analysis', 0.020)
    this.operationCosts.set('comprehensive_analysis', 0.045)

    console.log('💰 Cost Monitoring Service initialized')
    console.log(`📊 Daily budget limit: $${this.budgetConfig.dailyLimit}`)
  }

  getTodayKey() {
    return new Date().toISOString().split('T')[0]
  }

  getDailyCost() {
    const today = this.getTodayKey()
    return this.dailyCosts.get(today) || 0
  }

  getBudgetLimit() {
    return this.budgetConfig.dailyLimit
  }

  getRemainingBudget() {
    return Math.max(0, this.budgetConfig.dailyLimit - this.getDailyCost())
  }

  getBudgetUtilization() {
    return Math.round((this.getDailyCost() / this.budgetConfig.dailyLimit) * 100)
  }

  canProcessRequest(operationType) {
    const estimatedCost = this.estimateOperationCost(operationType)
    const currentCost = this.getDailyCost()
    const projectedCost = currentCost + estimatedCost
    
    return projectedCost <= (this.budgetConfig.dailyLimit * this.budgetConfig.autoStopAt)
  }

  estimateOperationCost(operationType) {
    return this.operationCosts.get(operationType) || 0.010
  }

  recordOperation(operationType, actualCost) {
    const today = this.getTodayKey()
    const currentCost = this.dailyCosts.get(today) || 0
    const newCost = currentCost + actualCost
    
    this.dailyCosts.set(today, newCost)
    
    // Update cost history
    this.costHistory.push({
      timestamp: new Date().toISOString(),
      operationType,
      cost: actualCost,
      dailyTotal: newCost
    })

    // Keep only last 1000 operations
    if (this.costHistory.length > 1000) {
      this.costHistory = this.costHistory.slice(-1000)
    }

    // Check for budget alerts
    this.checkBudgetAlerts(newCost)

    console.log(`💰 Recorded ${operationType}: $${actualCost} (Daily total: $${newCost.toFixed(4)})`)
  }

  checkBudgetAlerts(currentCost) {
    const utilization = currentCost / this.budgetConfig.dailyLimit
    
    this.budgetConfig.alertThresholds.forEach(threshold => {
      if (utilization >= threshold) {
        const alertKey = `budget_${Math.round(threshold * 100)}_${this.getTodayKey()}`
        
        // Only alert once per threshold per day
        if (!this.alerts.find(a => a.key === alertKey)) {
          const alert = {
            key: alertKey,
            type: 'budget_threshold',
            level: threshold >= 0.9 ? 'critical' : threshold >= 0.75 ? 'warning' : 'info',
            message: `Budget ${Math.round(threshold * 100)}% utilized ($${currentCost.toFixed(2)} of $${this.budgetConfig.dailyLimit})`,
            timestamp: new Date().toISOString(),
            utilization: Math.round(utilization * 100)
          }
          
          this.alerts.push(alert)
          console.log(`🚨 Budget Alert: ${alert.message}`)
        }
      }
    })
  }

  getBudgetStatus() {
    const dailyCost = this.getDailyCost()
    const utilization = this.getBudgetUtilization()
    
    return {
      dailySpent: dailyCost,
      budgetLimit: this.budgetConfig.dailyLimit,
      remaining: this.getRemainingBudget(),
      utilizationPercent: utilization,
      status: utilization >= 95 ? 'exceeded' : utilization >= 90 ? 'critical' : utilization >= 75 ? 'warning' : 'normal',
      canProcess: this.canProcessRequest('live_analysis')
    }
  }

  getCostBreakdown() {
    const today = this.getTodayKey()
    const todayOperations = this.costHistory.filter(op => 
      op.timestamp.startsWith(today)
    )

    const breakdown = {}
    todayOperations.forEach(op => {
      if (!breakdown[op.operationType]) {
        breakdown[op.operationType] = {
          count: 0,
          totalCost: 0,
          avgCost: 0
        }
      }
      breakdown[op.operationType].count++
      breakdown[op.operationType].totalCost += op.cost
    })

    // Calculate averages
    Object.keys(breakdown).forEach(type => {
      breakdown[type].avgCost = breakdown[type].totalCost / breakdown[type].count
    })

    return {
      date: today,
      totalSpent: this.getDailyCost(),
      operationBreakdown: breakdown,
      generatedAt: new Date().toISOString()
    }
  }

  getCostHistory(days = 7) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    const recentHistory = this.costHistory.filter(op => 
      new Date(op.timestamp) >= cutoffDate
    )

    // Group by day
    const dailyTotals = {}
    recentHistory.forEach(op => {
      const day = op.timestamp.split('T')[0]
      if (!dailyTotals[day]) {
        dailyTotals[day] = 0
      }
      dailyTotals[day] += op.cost
    })

    return {
      days,
      dailyTotals,
      totalOperations: recentHistory.length,
      totalCost: recentHistory.reduce((sum, op) => sum + op.cost, 0),
      generatedAt: new Date().toISOString()
    }
  }

  getBudgetAlerts() {
    // Return recent alerts (last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const recentAlerts = this.alerts.filter(alert => 
      new Date(alert.timestamp) >= yesterday
    )

    return {
      alerts: recentAlerts,
      currentStatus: this.getBudgetStatus(),
      generatedAt: new Date().toISOString()
    }
  }

  updateBudgetConfig(dailyLimit, alertThresholds) {
    if (dailyLimit && dailyLimit > 0) {
      this.budgetConfig.dailyLimit = dailyLimit
    }
    
    if (alertThresholds && Array.isArray(alertThresholds)) {
      this.budgetConfig.alertThresholds = alertThresholds.sort((a, b) => a - b)
    }

    console.log(`💰 Budget configuration updated: $${this.budgetConfig.dailyLimit} daily limit`)
    
    return this.budgetConfig
  }

  getLastOperationCost() {
    if (this.costHistory.length === 0) return 0
    return this.costHistory[this.costHistory.length - 1].cost
  }

  isHealthy() {
    return true // Cost monitoring is always healthy
  }

  // Simulate realistic cost accumulation for demo
  simulateDailyCosts() {
    const today = this.getTodayKey()
    const currentHour = new Date().getHours()
    
    // Simulate gradual cost accumulation throughout the day
    const baseDaily = Math.random() * 3 + 1 // $1-4 base
    const hourlyFactor = currentHour / 24
    const simulatedCost = baseDaily * hourlyFactor
    
    this.dailyCosts.set(today, simulatedCost)
  }
}

module.exports = { CostMonitoringService }