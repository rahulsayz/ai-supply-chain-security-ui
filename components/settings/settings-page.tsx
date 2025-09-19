'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { BigQueryAISettings } from './bigquery-ai-settings'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database,
  Users,
  Mail,
  Lock
} from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500/20 to-gray-400/10 border border-gray-500/20 shadow-lg">
              <SettingsIcon className="h-6 w-6 text-gray-500" />
            </div>
            <span>SOC Configuration Center</span>
          </h1>
          <p className="text-muted-foreground">
            Configure AI-powered security monitoring and BigQuery integration settings
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* BigQuery AI Settings */}
        <BigQueryAISettings />

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/10 border border-blue-500/20 shadow-lg">
                <Bell className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive security alerts and updates
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Critical Threat Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Immediate notifications for severity 9-10 threats
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Risk Summary</Label>
                <p className="text-sm text-muted-foreground">
                  Daily email digest of security status
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Vendor Risk Changes</Label>
                <p className="text-sm text-muted-foreground">
                  Alerts when vendor risk scores change significantly
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-500/20 shadow-lg">
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <CardTitle>Security Configuration</CardTitle>
                <CardDescription>
                  Adjust threat detection sensitivity and security policies
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="risk-threshold">Risk Score Threshold</Label>
                <Input
                  id="risk-threshold"
                  type="number"
                  defaultValue="75"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum risk score to trigger alerts
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scan-frequency">Scan Frequency (hours)</Label>
                <Input
                  id="scan-frequency"
                  type="number"
                  defaultValue="4"
                  min="1"
                  max="24"
                />
                <p className="text-xs text-muted-foreground">
                  How often to scan vendor infrastructure
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI-Enhanced Detection</Label>
                <p className="text-sm text-muted-foreground">
                  Use machine learning for advanced threat detection
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data & Integration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-400/10 border border-purple-500/20 shadow-lg">
                <Database className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <CardTitle>Data & Integration</CardTitle>
                <CardDescription>
                  Configure data sources and external integrations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bigquery-project">BigQuery Project ID</Label>
              <Input
                id="bigquery-project"
                defaultValue="supply-chain-security-prod"
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-retention">Data Retention (days)</Label>
              <Input
                id="data-retention"
                type="number"
                defaultValue="90"
                min="30"
                max="365"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Export Analytics Data</Label>
                <p className="text-sm text-muted-foreground">
                  Allow data export for external analysis
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-400/10 border border-orange-500/20 shadow-lg">
                <Users className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Manage team access and permissions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    SA
                  </div>
                  <div>
                    <p className="font-medium">Security Admin</p>
                    <p className="text-sm text-muted-foreground">admin@company.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Owner</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">john.doe@company.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Analyst</span>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
              </div>
            </div>
            <Button className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Invite Team Member
            </Button>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-400/10 border border-red-500/20 shadow-lg">
                <Lock className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Download Security Keys
              </Button>
              <Button variant="outline" className="w-full">
                View Login History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}