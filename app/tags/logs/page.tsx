'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Download, Search, TrendingUp } from 'lucide-react'

const mockWorkLogs = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'John Doe',
    employeeCode: 'EMP001',
    tagId: 1,
    tagName: 'Development',
    count: 5,
    totalMinutes: 480,
    logDate: '2024-10-14',
    submittedAt: '2024-10-14T18:00:00Z',
    isManual: true,
    source: 'manual'
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: 'Jane Smith',
    employeeCode: 'EMP002',
    tagId: 2,
    tagName: 'Testing',
    count: 8,
    totalMinutes: 360,
    logDate: '2024-10-14',
    submittedAt: '2024-10-14T17:45:00Z',
    isManual: true,
    source: 'manual'
  }
]

export default function WorkLogsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('all')

  const { data: logs, isLoading } = useQuery({
    queryKey: ['work-logs'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockWorkLogs
    }
  })

  const filteredLogs = logs?.filter(log => {
    const matchesSearch = log.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || log.logDate === dateFilter
    const matchesTag = tagFilter === 'all' || String(log.tagId) === tagFilter
    return matchesSearch && matchesDate && matchesTag
  }) || []

  const totalMinutes = filteredLogs.reduce((sum, log) => sum + log.totalMinutes, 0)
  const totalHours = (totalMinutes / 60).toFixed(2)
  const totalEntries = filteredLogs.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Work Logs</h2>
          <p className="text-muted-foreground">
            Track and manage employee work logs by tags
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Logs
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
                  placeholder="Search by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tag</label>
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  <SelectItem value="1">Development</SelectItem>
                  <SelectItem value="2">Testing</SelectItem>
                  <SelectItem value="3">Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalHours}h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalMinutes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Log Entries</CardTitle>
          <CardDescription>
            Detailed work logs submitted by employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Minutes</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Log Date</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.employeeName}</TableCell>
                  <TableCell>{log.employeeCode}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.tagName}</Badge>
                  </TableCell>
                  <TableCell>{log.count}</TableCell>
                  <TableCell>{log.totalMinutes}</TableCell>
                  <TableCell>{(log.totalMinutes / 60).toFixed(2)}h</TableCell>
                  <TableCell>{new Date(log.logDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(log.submittedAt).toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <Badge variant={log.isManual ? 'secondary' : 'default'}>
                      {log.source}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
