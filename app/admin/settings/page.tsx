'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Settings, Save, Clock, Calendar, Bell, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function SystemSettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Employee Portal',
    companyEmail: 'admin@portal.com',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    currency: 'USD'
  })

  const [attendanceSettings, setAttendanceSettings] = useState({
    defaultCheckInTime: '09:00',
    defaultCheckOutTime: '18:00',
    lateThresholdMinutes: 15,
    halfDayHours: 4,
    fullDayHours: 8,
    autoMarkAbsent: true,
    requireCheckout: true
  })

  const [leaveSettings, setLeaveSettings] = useState({
    annualLeaveQuota: 20,
    sickLeaveQuota: 10,
    casualLeaveQuota: 12,
    autoApproveWFH: false,
    requireApprovalForLeave: true,
    maxLeaveDaysPerRequest: 14
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    lateArrivalAlerts: true,
    leaveApprovalNotifications: true,
    attendanceReminders: true,
    warningNotifications: true
  })

  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Settings saved successfully!')
    },
    onError: () => {
      toast.error('Failed to save settings')
    }
  })

  const handleSaveGeneral = () => {
    saveSettingsMutation.mutate({ type: 'general', data: generalSettings })
  }

  const handleSaveAttendance = () => {
    saveSettingsMutation.mutate({ type: 'attendance', data: attendanceSettings })
  }

  const handleSaveLeave = () => {
    saveSettingsMutation.mutate({ type: 'leave', data: leaveSettings })
  }

  const handleSaveNotifications = () => {
    saveSettingsMutation.mutate({ type: 'notifications', data: notificationSettings })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">
          Configure global system settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Clock className="mr-2 h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="leave">
            <Calendar className="mr-2 h-4 w-4" />
            Leave
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic system configuration and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={generalSettings.companyName}
                    onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Email</Label>
                  <Input
                    type="email"
                    value={generalSettings.companyEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, companyEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Asia/Kolkata">India Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={generalSettings.dateFormat}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, dateFormat: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={generalSettings.currency}
                    onValueChange={(value) => setGeneralSettings({...generalSettings, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSaveGeneral} disabled={saveSettingsMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Settings</CardTitle>
              <CardDescription>
                Configure attendance tracking and rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Check-In Time</Label>
                  <Input
                    type="time"
                    value={attendanceSettings.defaultCheckInTime}
                    onChange={(e) => setAttendanceSettings({...attendanceSettings, defaultCheckInTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Check-Out Time</Label>
                  <Input
                    type="time"
                    value={attendanceSettings.defaultCheckOutTime}
                    onChange={(e) => setAttendanceSettings({...attendanceSettings, defaultCheckOutTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Late Threshold (minutes)</Label>
                  <Input
                    type="number"
                    value={attendanceSettings.lateThresholdMinutes}
                    onChange={(e) => setAttendanceSettings({...attendanceSettings, lateThresholdMinutes: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Half Day Hours</Label>
                  <Input
                    type="number"
                    value={attendanceSettings.halfDayHours}
                    onChange={(e) => setAttendanceSettings({...attendanceSettings, halfDayHours: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Full Day Hours</Label>
                  <Input
                    type="number"
                    value={attendanceSettings.fullDayHours}
                    onChange={(e) => setAttendanceSettings({...attendanceSettings, fullDayHours: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Mark Absent</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically mark employees as absent if no check-in
                    </p>
                  </div>
                  <Switch
                    checked={attendanceSettings.autoMarkAbsent}
                    onCheckedChange={(checked) => setAttendanceSettings({...attendanceSettings, autoMarkAbsent: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Checkout</Label>
                    <p className="text-sm text-muted-foreground">
                      Make checkout mandatory for attendance completion
                    </p>
                  </div>
                  <Switch
                    checked={attendanceSettings.requireCheckout}
                    onCheckedChange={(checked) => setAttendanceSettings({...attendanceSettings, requireCheckout: checked})}
                  />
                </div>
              </div>
              <Button onClick={handleSaveAttendance} disabled={saveSettingsMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                Save Attendance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Settings</CardTitle>
              <CardDescription>
                Configure leave quotas and approval rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Annual Leave Quota (days)</Label>
                  <Input
                    type="number"
                    value={leaveSettings.annualLeaveQuota}
                    onChange={(e) => setLeaveSettings({...leaveSettings, annualLeaveQuota: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sick Leave Quota (days)</Label>
                  <Input
                    type="number"
                    value={leaveSettings.sickLeaveQuota}
                    onChange={(e) => setLeaveSettings({...leaveSettings, sickLeaveQuota: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Casual Leave Quota (days)</Label>
                  <Input
                    type="number"
                    value={leaveSettings.casualLeaveQuota}
                    onChange={(e) => setLeaveSettings({...leaveSettings, casualLeaveQuota: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Days Per Request</Label>
                  <Input
                    type="number"
                    value={leaveSettings.maxLeaveDaysPerRequest}
                    onChange={(e) => setLeaveSettings({...leaveSettings, maxLeaveDaysPerRequest: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Approve WFH</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve work from home requests
                    </p>
                  </div>
                  <Switch
                    checked={leaveSettings.autoApproveWFH}
                    onCheckedChange={(checked) => setLeaveSettings({...leaveSettings, autoApproveWFH: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Require admin approval for all leave requests
                    </p>
                  </div>
                  <Switch
                    checked={leaveSettings.requireApprovalForLeave}
                    onCheckedChange={(checked) => setLeaveSettings({...leaveSettings, requireApprovalForLeave: checked})}
                  />
                </div>
              </div>
              <Button onClick={handleSaveLeave} disabled={saveSettingsMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                Save Leave Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Late Arrival Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify employees when they arrive late
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.lateArrivalAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, lateArrivalAlerts: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Leave Approval Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify about leave request approvals/denials
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.leaveApprovalNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, leaveApprovalNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Attendance Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminders for pending attendance
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.attendanceReminders}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, attendanceReminders: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Warning Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert employees about warnings and penalties
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.warningNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, warningNotifications: checked})}
                  />
                </div>
              </div>
              <Button onClick={handleSaveNotifications} disabled={saveSettingsMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                System security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Security settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
