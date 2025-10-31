'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/components/role-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Bell, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  FileText,
  DollarSign
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock data for warnings
const mockWarnings = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'John Doe',
    type: 'ATTENDANCE',
    severity: 'MEDIUM',
    title: 'Frequent Late Arrivals',
    description: 'Employee has been late 5 times in the past 2 weeks',
    issuedDate: new Date('2024-01-15'),
    issuedBy: 'HR Admin',
    status: 'ACTIVE',
    expiryDate: new Date('2024-07-15'),
    acknowledgmentRequired: true,
    acknowledged: false,
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'Jane Smith',
    type: 'PERFORMANCE',
    severity: 'HIGH',
    title: 'Missed Project Deadlines',
    description: 'Failed to deliver project milestones on time',
    issuedDate: new Date('2024-01-10'),
    issuedBy: 'Team Lead',
    status: 'RESOLVED',
    expiryDate: new Date('2024-06-10'),
    acknowledgmentRequired: true,
    acknowledged: true,
  },
];

// Mock data for penalties
const mockPenalties = [
  {
    id: 1,
    employeeId: 3,
    employeeName: 'Mike Johnson',
    type: 'SALARY_DEDUCTION',
    amount: 200.00,
    reason: 'Unauthorized absence',
    appliedDate: new Date('2024-01-20'),
    appliedBy: 'HR Admin',
    status: 'APPLIED',
    effectiveDate: new Date('2024-02-01'),
    reversible: true,
    documentation: 'Absence policy violation report',
  },
  {
    id: 2,
    employeeId: 4,
    employeeName: 'Sarah Wilson',
    type: 'SUSPENSION',
    duration: 3,
    reason: 'Workplace misconduct',
    appliedDate: new Date('2024-01-18'),
    appliedBy: 'HR Director',
    status: 'SERVED',
    effectiveDate: new Date('2024-01-22'),
    reversible: false,
    documentation: 'Disciplinary hearing minutes',
  },
];

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: 'SYSTEM',
    title: 'System Maintenance Scheduled',
    message: 'The portal will be down for maintenance on Jan 25, 2024 from 2:00 AM to 4:00 AM',
    priority: 'HIGH',
    createdDate: new Date('2024-01-20'),
    scheduledDate: new Date('2024-01-25'),
    targetAudience: 'ALL_EMPLOYEES',
    status: 'ACTIVE',
    expiryDate: new Date('2024-01-26'),
  },
  {
    id: 2,
    type: 'POLICY',
    title: 'Updated Leave Policy',
    message: 'New leave policy effective February 1, 2024. Please review the updated guidelines.',
    priority: 'MEDIUM',
    createdDate: new Date('2024-01-15'),
    scheduledDate: new Date('2024-02-01'),
    targetAudience: 'ALL_EMPLOYEES',
    status: 'SCHEDULED',
    expiryDate: new Date('2024-03-01'),
  },
];

const WARNING_TYPES = [
  { value: 'ATTENDANCE', label: 'Attendance', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'PERFORMANCE', label: 'Performance', color: 'bg-red-100 text-red-800' },
  { value: 'CONDUCT', label: 'Conduct', color: 'bg-purple-100 text-purple-800' },
  { value: 'POLICY', label: 'Policy Violation', color: 'bg-orange-100 text-orange-800' },
];

const PENALTY_TYPES = [
  { value: 'SALARY_DEDUCTION', label: 'Salary Deduction', color: 'bg-red-100 text-red-800' },
  { value: 'SUSPENSION', label: 'Suspension', color: 'bg-orange-100 text-orange-800' },
  { value: 'DEMOTION', label: 'Demotion', color: 'bg-purple-100 text-purple-800' },
  { value: 'TERMINATION', label: 'Termination', color: 'bg-gray-100 text-gray-800' },
];

const NOTIFICATION_PRIORITIES = [
  { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'HIGH', label: 'High', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('warnings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter functions
  const filteredWarnings = mockWarnings.filter(warning => 
    warning.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'ALL' || warning.status === statusFilter)
  );

  const filteredPenalties = mockPenalties.filter(penalty => 
    penalty.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'ALL' || penalty.status === statusFilter)
  );

  const filteredNotifications = mockNotifications.filter(notification => 
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'ALL' || notification.status === statusFilter)
  );

  const getTypeInfo = (types: any[], value: string) => types.find(t => t.value === value);
  const getPriorityInfo = (priority: string) => NOTIFICATION_PRIORITIES.find(p => p.value === priority);

  const stats = {
    activeWarnings: mockWarnings.filter(w => w.status === 'ACTIVE').length,
    activePenalties: mockPenalties.filter(p => p.status === 'APPLIED').length,
    pendingNotifications: mockNotifications.filter(n => n.status === 'SCHEDULED').length,
    totalActions: mockWarnings.length + mockPenalties.length,
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">
            Manage warnings, penalties, and organizational notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button onClick={() => router.push('/admin/create')}>
            <Plus className="mr-2 h-4 w-4" />
            New Action
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.activeWarnings}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Penalties</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.activePenalties}</div>
            <p className="text-xs text-muted-foreground">Currently applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Notifications</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.pendingNotifications}</div>
            <p className="text-xs text-muted-foreground">Scheduled to send</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalActions}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
          <TabsTrigger value="penalties">Penalties</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Common Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees, titles, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="warnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Employee Warnings
              </CardTitle>
              <CardDescription>
                Manage disciplinary warnings and employee conduct issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredWarnings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No warnings found matching your filters.
                </div>
              ) : (
                filteredWarnings.map((warning) => {
                  const typeInfo = getTypeInfo(WARNING_TYPES, warning.type);
                  
                  return (
                    <Card key={warning.id} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{warning.title}</h3>
                              <Badge className={typeInfo?.color}>
                                {typeInfo?.label}
                              </Badge>
                              <Badge className={warning.severity === 'HIGH' ? 'bg-red-100 text-red-800' : 
                                              warning.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-gray-100 text-gray-800'}>
                                {warning.severity}
                              </Badge>
                              <Badge className={warning.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                                              'bg-gray-100 text-gray-800'}>
                                {warning.status}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              Employee: <strong>{warning.employeeName}</strong>
                            </p>
                            
                            <p className="text-sm mb-3">{warning.description}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span>📅 Issued: {warning.issuedDate.toLocaleDateString()}</span>
                              <span>👤 By: {warning.issuedBy}</span>
                              <span>⏰ Expires: {warning.expiryDate.toLocaleDateString()}</span>
                              {warning.acknowledgmentRequired && (
                                <span className={warning.acknowledged ? 'text-green-600' : 'text-red-600'}>
                                  {warning.acknowledged ? '✅ Acknowledged' : '❌ Not Acknowledged'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Warning
                              </DropdownMenuItem>
                              {warning.status === 'ACTIVE' && (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark Resolved
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Warning
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="penalties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Employee Penalties
              </CardTitle>
              <CardDescription>
                Manage disciplinary actions and financial penalties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredPenalties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No penalties found matching your filters.
                </div>
              ) : (
                filteredPenalties.map((penalty) => {
                  const typeInfo = getTypeInfo(PENALTY_TYPES, penalty.type);
                  
                  return (
                    <Card key={penalty.id} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                              <ShieldAlert className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{typeInfo?.label}</h3>
                              <Badge className={typeInfo?.color}>
                                {typeInfo?.label}
                              </Badge>
                              <Badge className={penalty.status === 'APPLIED' ? 'bg-red-100 text-red-800' : 
                                              penalty.status === 'SERVED' ? 'bg-gray-100 text-gray-800' :
                                              'bg-blue-100 text-blue-800'}>
                                {penalty.status}
                              </Badge>
                              {penalty.reversible && (
                                <Badge className="bg-orange-100 text-orange-800">
                                  Reversible
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              Employee: <strong>{penalty.employeeName}</strong>
                            </p>
                            
                            <p className="text-sm mb-3">{penalty.reason}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span>📅 Applied: {penalty.appliedDate.toLocaleDateString()}</span>
                              <span>👤 By: {penalty.appliedBy}</span>
                              <span>⏰ Effective: {penalty.effectiveDate.toLocaleDateString()}</span>
                              {penalty.amount && (
                                <span className="text-red-600 font-medium">
                                  💰 ${penalty.amount.toFixed(2)}
                                </span>
                              )}
                              {penalty.duration && (
                                <span className="text-orange-600 font-medium">
                                  ⏱️ {penalty.duration} days
                                </span>
                              )}
                            </div>
                            
                            {penalty.documentation && (
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                <strong>Documentation:</strong> {penalty.documentation}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Penalty
                              </DropdownMenuItem>
                              {penalty.reversible && penalty.status === 'APPLIED' && (
                                <DropdownMenuItem>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reverse Penalty
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Record
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                System Notifications
              </CardTitle>
              <CardDescription>
                Manage organizational announcements and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No notifications found matching your filters.
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const priorityInfo = getPriorityInfo(notification.priority);
                  
                  return (
                    <Card key={notification.id} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <Bell className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{notification.title}</h3>
                              <Badge className={priorityInfo?.color}>
                                {priorityInfo?.label} Priority
                              </Badge>
                              <Badge className={notification.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                                              notification.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                                              'bg-gray-100 text-gray-800'}>
                                {notification.status}
                              </Badge>
                              <Badge className="bg-purple-100 text-purple-800">
                                {notification.type}
                              </Badge>
                            </div>
                            
                            <p className="text-sm mb-3">{notification.message}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span>📅 Created: {notification.createdDate.toLocaleDateString()}</span>
                              <span>🚀 Scheduled: {notification.scheduledDate.toLocaleDateString()}</span>
                              <span>⏰ Expires: {notification.expiryDate.toLocaleDateString()}</span>
                              <span>👥 Audience: {notification.targetAudience.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Notification
                              </DropdownMenuItem>
                              {notification.status === 'SCHEDULED' && (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Send Now
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Notification
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </RoleGuard>
  );
}