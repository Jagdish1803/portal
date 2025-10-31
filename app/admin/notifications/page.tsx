'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Bell, Plus, Mail, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

const mockNotifications = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'John Doe',
    type: 'ATTENDANCE_ALERT',
    title: 'Late Arrival',
    message: 'You arrived 15 minutes late today',
    isRead: false,
    priority: 'NORMAL',
    createdAt: '2024-10-14T09:15:00Z'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'Jane Smith',
    type: 'LEAVE_REQUEST_UPDATE',
    title: 'Leave Request Approved',
    message: 'Your leave request for Oct 20-22 has been approved',
    isRead: true,
    priority: 'HIGH',
    createdAt: '2024-10-13T16:30:00Z'
  }
]

const mockEmployees = [
  { id: 1, name: 'John Doe', code: 'EMP001' },
  { id: 2, name: 'Jane Smith', code: 'EMP002' }
]

export default function NotificationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newNotification, setNewNotification] = useState({
    employeeId: '',
    type: 'SYSTEM_NOTIFICATION',
    title: '',
    message: '',
    priority: 'NORMAL'
  })

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockNotifications
    }
  })

  const sendNotificationMutation = useMutation({
    mutationFn: async (data: typeof newNotification) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Notification sent successfully!')
      setIsDialogOpen(false)
      setNewNotification({
        employeeId: '',
        type: 'SYSTEM_NOTIFICATION',
        title: '',
        message: '',
        priority: 'NORMAL'
      })
    },
    onError: () => {
      toast.error('Failed to send notification')
    }
  })

  const handleSend = () => {
    if (!newNotification.employeeId || !newNotification.title || !newNotification.message) {
      toast.error('Please fill in all required fields')
      return
    }
    sendNotificationMutation.mutate(newNotification)
  }

  const typeColors: Record<string, string> = {
    'ATTENDANCE_ALERT': 'bg-yellow-100 text-yellow-800',
    'LEAVE_REQUEST_UPDATE': 'bg-blue-100 text-blue-800',
    'WARNING_ISSUED': 'bg-red-100 text-red-800',
    'PENALTY_ISSUED': 'bg-red-100 text-red-800',
    'SYSTEM_NOTIFICATION': 'bg-gray-100 text-gray-800',
    'REMINDER': 'bg-purple-100 text-purple-800'
  }

  const priorityColors: Record<string, string> = {
    'LOW': 'bg-gray-100 text-gray-800',
    'NORMAL': 'bg-blue-100 text-blue-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'URGENT': 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Manage and send notifications to employees
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send New Notification</DialogTitle>
              <DialogDescription>
                Create and send a notification to an employee
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Employee *</Label>
                <Select
                  value={newNotification.employeeId}
                  onValueChange={(value) => setNewNotification({...newNotification, employeeId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map(emp => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        {emp.name} ({emp.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notification Type</Label>
                <Select
                  value={newNotification.type}
                  onValueChange={(value) => setNewNotification({...newNotification, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SYSTEM_NOTIFICATION">System Notification</SelectItem>
                    <SelectItem value="ATTENDANCE_ALERT">Attendance Alert</SelectItem>
                    <SelectItem value="REMINDER">Reminder</SelectItem>
                    <SelectItem value="WARNING_ISSUED">Warning Issued</SelectItem>
                    <SelectItem value="PENALTY_ISSUED">Penalty Issued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={newNotification.priority}
                  onValueChange={(value) => setNewNotification({...newNotification, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  placeholder="Enter notification title"
                />
              </div>
              <div className="space-y-2">
                <Label>Message *</Label>
                <Textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  placeholder="Enter notification message"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={sendNotificationMutation.isPending}>
                {sendNotificationMutation.isPending ? 'Sending...' : 'Send Notification'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {notifications?.filter(n => !n.isRead).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {notifications?.filter(n => n.priority === 'URGENT').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <Mail className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {notifications?.filter(n => n.isRead).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>
            All notifications sent to employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications?.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.employeeName}</TableCell>
                  <TableCell>
                    <Badge className={typeColors[notification.type] || ''}>
                      {notification.type.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{notification.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                  <TableCell>
                    <Badge className={priorityColors[notification.priority] || ''}>
                      {notification.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={notification.isRead ? 'outline' : 'default'}>
                      {notification.isRead ? 'Read' : 'Unread'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(notification.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
