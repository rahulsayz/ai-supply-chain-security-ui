export interface Threat {
  id: string
  vendorName: string
  threatType: string
  severity: number // 1-10
  aiRiskScore: number // 0-1 (decimal)
  status: 'active' | 'investigating' | 'resolved'
  detectionTime: string
  description: string
  affectedSystems: string[]
  remediationSteps: string[]
  similarThreats: string[]
  timeline: Array<{
    timestamp: string
    event: string
    description: string
    actor: string
  }>
}

export interface Vendor {
  id: string
  name: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  riskScore: number // 0-1 (decimal)
  threatCount: number
  lastAssessment: string
  complianceStatus: string[]
  criticalAssets: string[]
}

export interface AnalyticsData {
  date: string
  threats: number
  riskScore: number
}

export const mockThreats: Threat[] = [
  {
    id: 'THR-2024-001',
    vendorName: 'TechCorp Solutions',
    threatType: 'Network Infiltration Attack',
    severity: 8,
    aiRiskScore: 0.785,
    status: 'active',
    detectionTime: '2024-01-15T10:30:00Z',
    description: '🚨 BIGQUERY AI ALERT: Advanced ML algorithms detected suspicious network infiltration patterns in TechCorp\'s infrastructure. Multiple failed authentication attempts followed by successful login from anomalous IP ranges. Confidence: 94.7%',
    affectedSystems: ['web-servers', 'database-servers', 'load-balancers'],
    remediationSteps: [
      'Isolate affected systems',
      'Update authentication protocols',
      'Implement additional network segmentation'
    ],
    similarThreats: ['THR-2024-003', 'THR-2023-156'],
    timeline: [
      {
        timestamp: '2024-01-15T10:30:00Z',
        event: 'threat-detected',
        description: 'AI system flagged unusual network patterns',
        actor: 'AI-Monitor'
      }
    ]
  },
  {
    id: 'THR-2024-002',
    vendorName: 'DataSystems Inc',
    threatType: 'Critical Data Breach',
    severity: 9,
    aiRiskScore: 0.892,
    status: 'investigating',
    detectionTime: '2024-01-15T14:22:00Z',
    description: '🔴 CRITICAL BIGQUERY ALERT: Unauthorized access detected to critical data repositories. Advanced ML models indicate active data exfiltration in progress. AI Confidence: 89.2% • Immediate SOC response required.',
    affectedSystems: ['database-cluster', 'backup-systems', 'analytics-platform'],
    remediationSteps: [
      'Block unauthorized access',
      'Secure data repositories',
      'Implement data loss prevention'
    ],
    similarThreats: ['THR-2024-001'],
    timeline: [
      {
        timestamp: '2024-01-15T14:22:00Z',
        event: 'threat-detected',
        description: 'Unauthorized access detected',
        actor: 'AI-Monitor'
      }
    ]
  },
  {
    id: 'THR-2024-003',
    vendorName: 'CloudVendor Pro',
    threatType: 'Supply Chain Attack',
    severity: 10,
    aiRiskScore: 0.957,
    status: 'active',
    detectionTime: '2024-01-15T16:45:00Z',
    description: '🚨 MAXIMUM ALERT: Critical supply chain compromise detected by BigQuery ML threat intelligence. Malicious code injection confirmed in software distribution pipeline affecting downstream customers. SOC escalation required.',
    affectedSystems: ['build-servers', 'package-repository', 'distribution-pipeline'],
    remediationSteps: [
      'Isolate build infrastructure',
      'Scan all packages for malware',
      'Implement code signing verification'
    ],
    similarThreats: ['THR-2024-001', 'THR-2023-089'],
    timeline: [
      {
        timestamp: '2024-01-15T16:45:00Z',
        event: 'threat-detected',
        description: 'Malware signature detected in build pipeline',
        actor: 'AI-Monitor'
      }
    ]
  },
  {
    id: 'THR-2024-004',
    vendorName: 'SecureCloud Ltd',
    threatType: 'API Exploitation Attempt',
    severity: 7,
    aiRiskScore: 0.723,
    status: 'resolved',
    detectionTime: '2024-01-15T08:15:00Z',
    description: '✅ RESOLVED: Attempted data breach through compromised API endpoints detected by BigQuery AI monitoring. Attack successfully mitigated by automated SOC response systems.',
    affectedSystems: ['api-gateway', 'authentication-service', 'user-portal'],
    remediationSteps: [
      'Patch API vulnerabilities',
      'Implement rate limiting',
      'Add additional authentication layers'
    ],
    similarThreats: [],
    timeline: [
      {
        timestamp: '2024-01-15T08:15:00Z',
        event: 'threat-detected',
        description: 'API exploitation attempt detected',
        actor: 'AI-Monitor'
      },
      {
        timestamp: '2024-01-15T08:30:00Z',
        event: 'resolved',
        description: 'Threat successfully mitigated',
        actor: 'SOC-Team'
      }
    ]
  },
  {
    id: 'THR-2024-005',
    vendorName: 'DevTools Corp',
    threatType: 'Advanced Persistent Threat',
    severity: 6,
    aiRiskScore: 0.658,
    status: 'investigating',
    detectionTime: '2024-01-15T12:00:00Z',
    description: '🔍 SOC INVESTIGATING: Advanced persistent threat detected in development environment by BigQuery ML algorithms. Potential source code compromise under active analysis.',
    affectedSystems: ['development-environment', 'code-repository', 'build-systems'],
    remediationSteps: [
      'Isolate development environment',
      'Scan for additional malware',
      'Review code access logs'
    ],
    similarThreats: [],
    timeline: [
      {
        timestamp: '2024-01-15T12:00:00Z',
        event: 'threat-detected',
        description: 'Advanced persistent threat detected',
        actor: 'AI-Monitor'
      }
    ]
  }
]

export const mockVendors: Vendor[] = [
  {
    id: 'VEN-001',
    name: 'TechCorp Solutions',
    riskLevel: 'high',
    riskScore: 0.78, // Convert to decimal
    threatCount: 2,
    lastAssessment: '2024-01-15T10:00:00Z',
    complianceStatus: ['SOC2', 'ISO27001', 'PCI-DSS'],
    criticalAssets: ['Authentication Service', 'Data Pipeline', 'API Gateway']
  },
  {
    id: 'VEN-002',
    name: 'DataSystems Inc',
    riskLevel: 'critical',
    riskScore: 0.89, // Convert to decimal
    threatCount: 1,
    lastAssessment: '2024-01-14T09:00:00Z',
    complianceStatus: ['ISO27001', 'GDPR'],
    criticalAssets: ['Database Cluster', 'Backup Systems', 'Analytics Platform']
  },
  {
    id: 'VEN-003',
    name: 'CloudVendor Pro',
    riskLevel: 'critical',
    riskScore: 0.95, // Convert to decimal
    threatCount: 1,
    lastAssessment: '2024-01-15T08:00:00Z',
    complianceStatus: ['SOC2', 'ISO27001', 'FedRAMP'],
    criticalAssets: ['Cloud Infrastructure', 'CDN', 'Load Balancers']
  },
  {
    id: 'VEN-004',
    name: 'SecureCloud Ltd',
    riskLevel: 'low',
    riskScore: 0.25, // Convert to decimal
    threatCount: 0,
    lastAssessment: '2024-01-15T07:00:00Z',
    complianceStatus: ['SOC2', 'ISO27001'],
    criticalAssets: ['Encryption Service', 'Key Management']
  },
  {
    id: 'VEN-005',
    name: 'DevTools Corp',
    riskLevel: 'medium',
    riskScore: 0.65, // Convert to decimal
    threatCount: 1,
    lastAssessment: '2024-01-13T06:00:00Z',
    complianceStatus: ['ISO27001'],
    criticalAssets: ['CI/CD Pipeline', 'Code Repository', 'Build Systems']
  },
  {
    id: 'VEN-006',
    name: 'NetworkSec Pro',
    riskLevel: 'medium',
    riskScore: 0.42, // Convert to decimal
    threatCount: 0,
    lastAssessment: '2024-01-12T05:00:00Z',
    complianceStatus: ['ISO27001'],
    criticalAssets: ['Firewall Management', 'VPN Services']
  }
]

export const mockAnalyticsData: AnalyticsData[] = [
  { date: '2024-01-09', threats: 12, riskScore: 65 },
  { date: '2024-01-10', threats: 18, riskScore: 72 },
  { date: '2024-01-11', threats: 15, riskScore: 68 },
  { date: '2024-01-12', threats: 22, riskScore: 78 },
  { date: '2024-01-13', threats: 28, riskScore: 85 },
  { date: '2024-01-14', threats: 24, riskScore: 82 },
  { date: '2024-01-15', threats: 31, riskScore: 89 },
]

export const getRiskColor = (score: number): string => {
  if (score >= 80) return 'text-red-500 dark:text-red-400'
  if (score >= 60) return 'text-orange-500 dark:text-orange-400'
  if (score >= 40) return 'text-yellow-500 dark:text-yellow-400'
  return 'text-green-500 dark:text-green-400'
}

export const getRiskBgColor = (score: number): string => {
  if (score >= 80) return 'bg-red-100 dark:bg-red-900/20'
  if (score >= 60) return 'bg-orange-100 dark:bg-orange-900/20'
  if (score >= 40) return 'bg-yellow-100 dark:bg-yellow-900/20'
  return 'bg-green-100 dark:bg-green-900/20'
}

export const getSeverityColor = (severity: number): string => {
  if (severity >= 9) return 'text-red-600 dark:text-red-400'
  if (severity >= 7) return 'text-orange-600 dark:text-orange-400'
  if (severity >= 5) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}