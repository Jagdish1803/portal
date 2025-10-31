'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, CheckCircle, XCircle, Clock, Calendar as CalendarIcon, Download } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

// Mock data
const mockLeaveRequests = [
  {
    id: 1,
    employee: {
      id: 1,
      name: "John Doe",
      employeeCode: "EMP001",
      department: "Development"
    },
    leaveType: "FULL_LEAVE",
    startDate: "2025-10-20",
    endDate: "2025-10-22",
    reason: "Family vacation",
    status: "PENDING",
    requestedAt: "2025-10-12T10:30:00Z",
    isUrgent: false,
    dayCount: 3
  },
  {
    id: 2,
    employee: {
      id: 2,
      name: "Jane Smith",
      employeeCode: "EMP002",
      department: "Marketing"
    },
    leaveType: "SICK_LEAVE",
    startDate: "2025-10-15",
    endDate: "2025-10-16",
    reason: "Medical emergency",
    status: "APPROVED",
    requestedAt: "2025-10-14T08:00:00Z",
    reviewedAt: "2025-10-14T09:00:00Z",
    isUrgent: true,
    dayCount: 2
  },
  {
    id: 3,
    employee: {
      id: 3,
      name: "Mike Johnson",
      employeeCode: "EMP003",
      department: "Development"
    },
    leaveType: "WORK_FROM_HOME",
    startDate: "2025-10-18",
    endDate: "2025-10-18",
    reason: "Home repair work",
    status: "APPROVED",
    requestedAt: "2025-10-13T14:00:00Z",
    reviewedAt: "2025-10-13T15:00:00Z",
    isUrgent: false,
    dayCount: 1
  },
  {
    id: 4,
    employee: {
      id: 4,
      name: "Sarah Wilson",
      employeeCode: "EMP004",
      department: "HR"
    },
    leaveType: "CASUAL_LEAVE",
    startDate: "2025-10-25",
    endDate: "2025-10-26",
    reason: "Personal work",
    status: "DENIED",
    requestedAt: "2025-10-11T11:00:00Z",
    reviewedAt: "2025-10-12T10:00:00Z",
    adminComments: "Peak season, unable to approve",
    isUrgent: false,
    dayCount: 2
  },
]

export default function LeavePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('all')

  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leave', statusFilter, leaveTypeFilter],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockLeaveRequests
    }
  })

  const filteredRequests = leaveRequests?.filter(request => {
    const matchesSearch = request.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesType = leaveTypeFilter === 'all' || request.leaveType === leaveTypeFilter

    return matchesSearch && matchesStatus && matchesType
  }) || []

  const getStatusBadge = (status: string) => {
    const statusColors = {
      PENDING: 'bg-yellow-500 text-white',
      APPROVED: 'bg-green-500 text-white',
      DENIED: 'bg-red-500 text-white',
      CANCELLED: 'bg-gray-500 text-white',
    }
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || statusColors.PENDING}>
        {status}
      </Badge>
    )
  }

  const getLeaveTypeBadge = (type: string) => {
    const typeColors = {
      FULL_LEAVE: 'bg-purple-500 text-white',
      WORK_FROM_HOME: 'bg-blue-500 text-white',
      SICK_LEAVE: 'bg-orange-500 text-white',
      CASUAL_LEAVE: 'bg-teal-500 text-white',
      EMERGENCY_LEAVE: 'bg-red-500 text-white',
    }
    return (
      <Badge className={typeColors[type as keyof typeof typeColors] || typeColors.FULL_LEAVE}>
        {type.replace(/_/g, ' ')}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
          <p className="text-muted-foreground">
            {filteredRequests.length} leave requests
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/leave/request">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold">{leaveRequests?.length || 0}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {leaveRequests?.filter(r => r.status === 'PENDING').length || 0}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {leaveRequests?.filter(r => r.status === 'APPROVED').length || 0}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Denied</p>
              <p className="text-2xl font-bold text-red-600">
                {leaveRequests?.filter(r => r.status === 'DENIED').length || 0}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="DENIED">Denied</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Leave Type" />
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

      {/* Leave Requests Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">EMPLOYEE</TableHead>
              <TableHead className="font-semibold">DEPARTMENT</TableHead>
              <TableHead className="font-semibold">LEAVE TYPE</TableHead>
              <TableHead className="font-semibold">START DATE</TableHead>
              <TableHead className="font-semibold">END DATE</TableHead>
              <TableHead className="font-semibold">DAYS</TableHead>
              <TableHead className="font-semibold">REASON</TableHead>
              <TableHead className="font-semibold">STATUS</TableHead>
              <TableHead className="font-semibold">REQUESTED ON</TableHead>
              <TableHead className="font-semibold">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No leave requests found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.employee.name}</p>
                      <p className="text-sm text-muted-foreground">{request.employee.employeeCode}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.employee.department}</TableCell>
                  <TableCell>{getLeaveTypeBadge(request.leaveType)}</TableCell>
                  <TableCell>{format(new Date(request.startDate), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{format(new Date(request.endDate), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="font-medium">{request.dayCount} days</TableCell>
                  <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                      {request.isUrgent && (
                        <Badge variant="destructive" className="text-xs">URGENT</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(request.requestedAt), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {request.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="outline" className="text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/leave/${request.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
