'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'

const mockImportLogs = [
  {
    id: 1,
    fileName: 'attendance_october_2024.csv',
    fileType: 'ATTENDANCE_CSV',
    status: 'COMPLETED',
    totalRecords: 150,
    processedRecords: 148,
    errorRecords: 2,
    batchId: 'BATCH_001',
    uploadedBy: 1,
    createdAt: '2024-10-14T10:00:00Z',
    completedAt: '2024-10-14T10:05:23Z',
    errors: ['Row 45: Invalid employee code', 'Row 89: Invalid date format']
  },
  {
    id: 2,
    fileName: 'flowace_september_2024.csv',
    fileType: 'FLOWACE_CSV',
    status: 'COMPLETED',
    totalRecords: 120,
    processedRecords: 120,
    errorRecords: 0,
    batchId: 'BATCH_002',
    uploadedBy: 1,
    createdAt: '2024-09-30T15:30:00Z',
    completedAt: '2024-09-30T15:33:45Z',
    errors: []
  },
  {
    id: 3,
    fileName: 'employee_data.csv',
    fileType: 'EMPLOYEE_CSV',
    status: 'FAILED',
    totalRecords: 50,
    processedRecords: 0,
    errorRecords: 50,
    batchId: 'BATCH_003',
    uploadedBy: 1,
    createdAt: '2024-10-13T09:15:00Z',
    completedAt: '2024-10-13T09:15:30Z',
    errors: ['Invalid file format', 'Missing required headers']
  }
]

export default function ImportLogsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const { data: logs, isLoading } = useQuery({
    queryKey: ['import-logs'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockImportLogs
    }
  })

  const filteredLogs = logs?.filter(log => {
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    const matchesType = typeFilter === 'all' || log.fileType === typeFilter
    return matchesStatus && matchesType
  }) || []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'PROCESSING':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'PARTIALLY_COMPLETED':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'COMPLETED': 'bg-green-100 text-green-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'FAILED': 'bg-red-100 text-red-800',
      'PARTIALLY_COMPLETED': 'bg-yellow-100 text-yellow-800'
    }
    return (
      <Badge className={colors[status] || ''}>
        <span className="flex items-center gap-1">
          {getStatusIcon(status)}
          {status.replace(/_/g, ' ')}
        </span>
      </Badge>
    )
  }

  const typeColors: Record<string, string> = {
    'ATTENDANCE_CSV': 'bg-blue-100 text-blue-800',
    'FLOWACE_CSV': 'bg-purple-100 text-purple-800',
    'EMPLOYEE_CSV': 'bg-green-100 text-green-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Import Logs</h2>
        <p className="text-muted-foreground">
          View history and status of all data imports
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="PARTIALLY_COMPLETED">Partially Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">File Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ATTENDANCE_CSV">Attendance CSV</SelectItem>
                  <SelectItem value="FLOWACE_CSV">Flowace CSV</SelectItem>
                  <SelectItem value="EMPLOYEE_CSV">Employee CSV</SelectItem>
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
            <CardTitle className="text-sm font-medium">Total Imports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredLogs.filter(l => l.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredLogs.filter(l => l.status === 'FAILED').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredLogs.reduce((sum, l) => sum + l.totalRecords, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>
            Complete history of all data import operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Records</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Errors</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {log.fileName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={typeColors[log.fileType] || ''}>
                      {log.fileType.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>{log.totalRecords}</TableCell>
                  <TableCell className="text-green-600">{log.processedRecords}</TableCell>
                  <TableCell className={log.errorRecords > 0 ? 'text-red-600' : ''}>
                    {log.errorRecords}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{log.batchId}</code>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.completedAt ? new Date(log.completedAt).toLocaleString() : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Error Details */}
      {filteredLogs.some(l => l.errors.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Import Errors</CardTitle>
            <CardDescription>
              Details of errors encountered during imports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.filter(l => l.errors.length > 0).map((log) => (
                <div key={log.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{log.fileName}</h4>
                    {getStatusBadge(log.status)}
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {log.errors.map((error, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
