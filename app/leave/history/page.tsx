'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Download, Search, FileText } from 'lucide-react'

const mockLeaveHistory = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'John Doe',
    leaveType: 'SICK_LEAVE',
    startDate: '2024-10-01',
    endDate: '2024-10-03',
    reason: 'Medical treatment',
    status: 'APPROVED',
    requestedAt: '2024-09-28T10:00:00Z',
    reviewedAt: '2024-09-29T15:00:00Z',
    reviewedBy: 'Admin',
    totalDays: 3
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'Jane Smith',
    leaveType: 'CASUAL_LEAVE',
    startDate: '2024-10-15',
    endDate: '2024-10-16',
    reason: 'Personal work',
    status: 'PENDING',
    requestedAt: '2024-10-13T14:30:00Z',
    reviewedAt: null,
    reviewedBy: null,
    totalDays: 2
  }
]

const statusColors: Record<string, string> = {
  'PENDING': 'bg-yellow-100 text-yellow-800',
  'APPROVED': 'bg-green-100 text-green-800',
  'DENIED': 'bg-red-100 text-red-800',
  'CANCELLED': 'bg-gray-100 text-gray-800'
}

const leaveTypeColors: Record<string, string> = {
  'FULL_LEAVE': 'bg-purple-100 text-purple-800',
  'WORK_FROM_HOME': 'bg-blue-100 text-blue-800',
  'SICK_LEAVE': 'bg-red-100 text-red-800',
  'CASUAL_LEAVE': 'bg-green-100 text-green-800',
  'EMERGENCY_LEAVE': 'bg-orange-100 text-orange-800'
}

export default function LeaveHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const { data: history, isLoading } = useQuery({
    queryKey: ['leave-history'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockLeaveHistory
    }
  })

  const filteredHistory = history?.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter
    const matchesType = typeFilter === 'all' || leave.leaveType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  }) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leave History</h2>
          <p className="text-muted-foreground">
            View all past leave requests and their status
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export History
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Employee</label>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="DENIED">Denied</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Leave Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="FULL_LEAVE">Full Leave</SelectItem>
                  <SelectItem value="WORK_FROM_HOME">Work From Home</SelectItem>
                  <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                  <SelectItem value="CASUAL_LEAVE">Casual Leave</SelectItem>
                  <SelectItem value="EMERGENCY_LEAVE">Emergency Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredHistory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredHistory.filter(l => l.status === 'APPROVED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredHistory.filter(l => l.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denied</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredHistory.filter(l => l.status === 'DENIED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Request History</CardTitle>
          <CardDescription>
            Complete history of all leave requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Reviewed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">{leave.employeeName}</TableCell>
                  <TableCell>
                    <Badge className={leaveTypeColors[leave.leaveType] || ''}>
                      {leave.leaveType.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{leave.totalDays}</TableCell>
                  <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[leave.status] || ''}>
                      {leave.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(leave.requestedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{leave.reviewedBy || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
