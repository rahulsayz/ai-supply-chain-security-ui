'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { 
  AlertTriangle, 
  Clock, 
  Shield, 
  Link as LinkIcon,
  CheckCircle,
  X
} from 'lucide-react'
import { Threat, getSeverityColor } from '@/lib/data'
import { formatDistanceToNow } from 'date-fns'

interface ThreatDetailModalProps {
  threat: Threat
  open: boolean
  onClose: () => void
}

export function ThreatDetailModal({ threat, open, onClose }: ThreatDetailModalProps) {
  const getSeverityBadge = (severity: number) => {
    if (severity >= 9) return <Badge variant="destructive">Critical</Badge>
    if (severity >= 7) return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>
    if (severity >= 5) return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>
    return <Badge variant="secondary">Low</Badge>
  }

  const getStatusBadge = (status: Threat['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive">Active</Badge>
      case 'investigating':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Investigating</Badge>
      case 'resolved':
        return <Badge variant="secondary">Resolved</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <div>
                <DialogTitle className="text-xl">{threat.id}</DialogTitle>
                <DialogDescription className="text-base">
                  {threat.threatType} at {threat.vendorName}
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Severity</div>
              {getSeverityBadge(threat.severity)}
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">AI Risk Score</div>
              <div className={`text-lg font-bold ${getSeverityColor(threat.severity)}`}>
                {(threat.aiRiskScore * 100).toFixed(0)}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Status</div>
              {getStatusBadge(threat.status)}
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Detection Time</div>
              <div className="text-sm flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span suppressHydrationWarning>
                  {formatDistanceToNow(new Date(threat.detectionTime), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Threat Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{threat.description}</p>
            </CardContent>
          </Card>

          {/* Affected Systems */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Affected Systems
              </CardTitle>
              <CardDescription>
                Systems and infrastructure impacted by this threat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {threat.affectedSystems.map((system, index) => (
                  <Badge key={index} variant="outline" className="font-mono">
                    {system}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Remediation Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Remediation Steps
              </CardTitle>
              <CardDescription>
                Recommended actions to resolve this threat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {threat.remediationSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Similar Threats */}
          {threat.similarThreats && threat.similarThreats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Similar Threats
                </CardTitle>
                <CardDescription>
                  Related threats found via AI vector similarity search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {threat.similarThreats.map((similarThreatId, index) => (
                    <Badge key={index} variant="secondary" className="font-mono">
                      {similarThreatId}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI-Generated Response Playbook</CardTitle>
              <CardDescription>
                AI-generated response playbook for this threat type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Immediate Isolation</p>
                    <p className="text-sm text-muted-foreground">
                      Isolate affected systems and revoke access credentials for {threat.vendorName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Evidence Collection</p>
                    <p className="text-sm text-muted-foreground">
                      Gather forensic evidence from all systems showing IOC matches
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Vendor Communication</p>
                    <p className="text-sm text-muted-foreground">
                      Notify {threat.vendorName} security team and coordinate response efforts
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          {threat.timeline && threat.timeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Threat Timeline
                </CardTitle>
                <CardDescription>
                  Chronological events and actions taken for this threat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threat.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{event.event}</span>
                          <Badge variant="outline" className="text-xs">
                            {event.actor}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Investigating
            </Button>
            <Button variant="outline">
              Export Report
            </Button>
            <Button variant="outline">
              Escalate to Team
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}