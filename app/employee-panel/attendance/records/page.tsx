"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Clock, Search, UserCheck, UserX, Calendar, TrendingUp, Edit, ChevronDown, ChevronUp } from "lucide-react"
import React, { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns"

interface EditHistoryItem {
  fieldChanged: string
  oldValue: string
  newValue: string
  changeReason?: string
  editedAt: string
  editedBy: string
  editedByRole: string
}

interface AttendanceRecord {
  id: string
  date: string
  status: string
  checkInTime: string | null
  checkOutTime: string | null
  breakInTime: string | null
  breakOutTime: string | null
  totalHours: number
  overtime: number
  hasBeenEdited: boolean
  editedAt: string | null
  editReason: string | null
  editHistory?: EditHistoryItem[]
}

export default function MyAttendanceRecordsPage() {
  const [searchDate, setSearchDate] = useState("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentCycle, setCurrentCycle] = useState("")
  const [cycleFilter, setCycleFilter] = useState("current")
  const [availableCycles, setAvailableCycles] = useState<Array<{value: string, label: string, startDate: Date, endDate: Date}>>([])
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null)

  useEffect(() => {
    // Generate available salary cycles
    const today = new Date()
    const cycles = []
    
    // All cycles option
    cycles.push({
      value: 'all',
      label: 'All Cycles',
      startDate: new Date(2000, 0, 1),
      endDate: new Date(2099, 11, 31)
    })
    
    // Current cycle
    const currentCycleStart = today.getDate() >= 6 ? today.getMonth() : today.getMonth() - 1
    const currentCycleYear = currentCycleStart < 0 ? today.getFullYear() - 1 : today.getFullYear()
    const adjustedCurrentMonth = currentCycleStart < 0 ? 11 : currentCycleStart
    
    const currentStart = new Date(currentCycleYear, adjustedCurrentMonth, 6)
    const currentEnd = new Date(currentCycleYear, adjustedCurrentMonth + 1, 5)
    
    cycles.push({
      value: 'current',
      label: `Current Cycle (${format(currentStart, 'd MMM')} - ${format(currentEnd, 'd MMM yyyy')})`,
      startDate: currentStart,
      endDate: currentEnd
    })
    
    setCurrentCycle(`${format(currentStart, 'd MMM')} - ${format(currentEnd, 'd MMM yyyy')}`)
    
    // Previous cycle
    const prevStart = new Date(currentCycleYear, adjustedCurrentMonth - 1, 6)
    const prevEnd = new Date(currentCycleYear, adjustedCurrentMonth, 5)
    
    cycles.push({
      value: 'previous',
      label: `Previous Cycle (${format(prevStart, 'd MMM')} - ${format(prevEnd, 'd MMM yyyy')})`,
      startDate: prevStart,
      endDate: prevEnd
    })
    
    setAvailableCycles(cycles)
  }, [])

  useEffect(() => {
    fetchAttendanceRecords()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [attendanceRecords, statusFilter, dateFilter, searchDate, cycleFilter])

  async function fetchAttendanceRecords() {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/employee/attendance')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch (${response.status})`)
      }

      const data = await response.json()
      setAttendanceRecords(data.records || [])
      setError(null)
    } catch (err: any) {
      console.error('Error fetching attendance:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function applyFilters() {
    let filtered = [...attendanceRecords]

    // Cycle filter
    if (cycleFilter !== "all") {
      const selectedCycle = availableCycles.find(c => c.value === cycleFilter)
      if (selectedCycle) {
        const startStr = format(selectedCycle.startDate, 'yyyy-MM-dd')
        const endStr = format(selectedCycle.endDate, 'yyyy-MM-dd')
        filtered = filtered.filter(record => record.date >= startStr && record.date <= endStr)
      }
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter)
    }

    // Date filter
    const today = new Date()
    if (dateFilter === "today") {
      const todayStr = format(today, 'yyyy-MM-dd')
      filtered = filtered.filter(record => record.date === todayStr)
    } else if (dateFilter === "week") {
      const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      const weekEnd = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      filtered = filtered.filter(record => record.date >= weekStart && record.date <= weekEnd)
    } else if (dateFilter === "month") {
      const monthStart = format(startOfMonth(today), 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd')
      filtered = filtered.filter(record => record.date >= monthStart && record.date <= monthEnd)
    }

    // Search filter
    if (searchDate.trim()) {
      filtered = filtered.filter(record => record.date.includes(searchDate))
    }

    setFilteredRecords(filtered)
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return '-'
      const hours = date.getUTCHours().toString().padStart(2, '0')
      const minutes = date.getUTCMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    } catch (error) {
      return '-'
    }
  }

  const formatHours = (hours: number) => {
    return hours.toFixed(2)
  }

  // Helper function to format decimal hours to HH:MM
  const formatHoursToTime = (decimalHours: number): string => {
    if (!decimalHours || decimalHours === 0) return '00:00'
    const hours = Math.floor(decimalHours)
    const minutes = Math.round((decimalHours % 1) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  // Helper function to format edit history values based on field type
  const formatEditValue = (fieldName: string, value: string): string => {
    if (!value || value === 'N/A') return 'N/A'
    
    // Fields that should be displayed as HH:MM
    const timeFields = ['totalHours', 'overtime']
    if (timeFields.includes(fieldName)) {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        return formatHoursToTime(numValue)
      }
    }
    
    // Fields that are already time values (ISO strings)
    const timestampFields = ['checkInTime', 'checkOutTime', 'breakInTime', 'breakOutTime']
    if (timestampFields.includes(fieldName)) {
      return formatTime(value)
    }
    
    // For other fields, return as-is
    return value
  }

  const calculateWorkMinutes = (hours: number) => {
    return Math.round(hours * 60)
  }

  const calculateBreakTime = (breakIn: string | null, breakOut: string | null) => {
    if (!breakIn || !breakOut) return '-'
    
    try {
      const breakInDate = new Date(breakIn)
      const breakOutDate = new Date(breakOut)
      
      if (isNaN(breakInDate.getTime()) || isNaN(breakOutDate.getTime())) return '-'
      
      const diffMs = breakOutDate.getTime() - breakInDate.getTime()
      const diffMins = Math.round(diffMs / 60000)
      
      if (diffMins <= 0) return '-'
      
      if (diffMins < 60) {
        return `${diffMins}m`
      } else {
        const hours = Math.floor(diffMins / 60)
        const mins = diffMins % 60
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
      }
    } catch (error) {
      return '-'
    }
  }

  // Calculate stats from filtered data including hours adjustments
  const stats = filteredRecords.reduce((acc, record) => {
    acc.totalRecords++
    if (record.status === 'PRESENT' || record.status === 'WFH_APPROVED') acc.present++
    if (record.status === 'ABSENT') acc.absent++
    
    // Calculate current total hours
    if (record.totalHours > 0) {
      acc.currentTotalHours += record.totalHours
      acc.daysWithHours++
    }
    
    // If record has been edited, find original hours from edit history
    if (record.hasBeenEdited && record.editHistory) {
      const totalHoursEdit = record.editHistory.find(edit => edit.fieldChanged === 'totalHours')
      if (totalHoursEdit) {
        const originalHours = parseFloat(totalHoursEdit.oldValue) || 0
        acc.originalTotalHours += originalHours
      } else {
        // If no edit to totalHours, use current value for original too
        acc.originalTotalHours += record.totalHours
      }
    } else {
      // Not edited, so original equals current
      acc.originalTotalHours += record.totalHours
    }
    
    return acc
  }, { 
    totalRecords: 0, 
    present: 0, 
    absent: 0, 
    currentTotalHours: 0, 
    originalTotalHours: 0,
    daysWithHours: 0 
  })

  const hoursAdjusted = stats.currentTotalHours - stats.originalTotalHours
  const avgWorkHours = stats.daysWithHours > 0 ? stats.currentTotalHours / stats.daysWithHours : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT": return "bg-green-100 text-green-800"
      case "WFH_APPROVED": return "bg-blue-100 text-blue-800"
      case "LEAVE_APPROVED": return "bg-yellow-100 text-yellow-800"
      case "ABSENT": return "bg-red-100 text-red-800"
      case "LATE": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance Records</h2>
          <p className="text-muted-foreground">
            View your attendance history and edit details
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '-' : formatHoursToTime(stats.currentTotalHours)}</div>
            <p className="text-xs text-muted-foreground">
              Current total in filter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Edited Hours</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{loading ? '-' : formatHoursToTime(stats.originalTotalHours)}</div>
            <p className="text-xs text-muted-foreground">
              Before any edits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Adjusted</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${hoursAdjusted >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {loading ? '-' : `${hoursAdjusted >= 0 ? '+' : ''}${formatHoursToTime(Math.abs(hoursAdjusted))}`}
            </div>
            <p className="text-xs text-muted-foreground">
              Total adjustment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Work Hours</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{loading ? '-' : formatHoursToTime(avgWorkHours)}</div>
            <p className="text-xs text-muted-foreground">
              Per day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border">
        <Select value={cycleFilter} onValueChange={setCycleFilter}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select Cycle" />
          </SelectTrigger>
          <SelectContent>
            {availableCycles.map((cycle) => (
              <SelectItem key={cycle.value} value={cycle.value}>
                {cycle.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant={dateFilter === "all" ? "default" : "outline"}
            onClick={() => setDateFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={dateFilter === "today" ? "default" : "outline"}
            onClick={() => setDateFilter("today")}
            size="sm"
          >
            Today
          </Button>
          <Button
            variant={dateFilter === "week" ? "default" : "outline"}
            onClick={() => setDateFilter("week")}
            size="sm"
          >
            This Week
          </Button>
          <Button
            variant={dateFilter === "month" ? "default" : "outline"}
            onClick={() => setDateFilter("month")}
            size="sm"
          >
            This Month
          </Button>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PRESENT">Present</SelectItem>
            <SelectItem value="ABSENT">Absent</SelectItem>
            <SelectItem value="WFH_APPROVED">WFH</SelectItem>
            <SelectItem value="LEAVE_APPROVED">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Your recent attendance records</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by date..."
                  className="pl-8 w-[200px]"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading attendance records...</div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Attendance</div>
              <div className="text-muted-foreground mb-4 text-center max-w-md">{error}</div>
              {error.includes('Not authenticated') && (
                <>
                  <div className="text-sm text-muted-foreground mb-4 text-center">
                    Your account needs to be linked to an employee record.
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/setup/link-account'} 
                    className="mb-2"
                  >
                    Link Account Now
                  </Button>
                </>
              )}
              <Button onClick={() => fetchAttendanceRecords()} variant="outline">
                Retry
              </Button>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">No attendance records found</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="text-left font-medium w-[40px]"></TableHead>
                  <TableHead className="text-left font-medium">Date</TableHead>
                  <TableHead className="text-left font-medium">Day</TableHead>
                  <TableHead className="text-left font-medium">Status</TableHead>
                  <TableHead className="text-center font-medium">Check In</TableHead>
                  <TableHead className="text-center font-medium">Break In</TableHead>
                  <TableHead className="text-center font-medium">Break Out</TableHead>
                  <TableHead className="text-center font-medium">Check Out</TableHead>
                  <TableHead className="text-center font-medium">Hours</TableHead>
                  <TableHead className="text-center font-medium">Break Time</TableHead>
                  <TableHead className="text-center font-medium">Overtime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <React.Fragment key={record.id}>
                    <TableRow 
                      className={`hover:bg-gray-50/50 transition-colors ${record.hasBeenEdited ? 'cursor-pointer' : ''}`}
                      onClick={() => record.hasBeenEdited && setExpandedRecordId(expandedRecordId === record.id ? null : record.id)}
                    >
                      <TableCell className="text-center">
                        {record.hasBeenEdited && (
                          expandedRecordId === record.id ? 
                            <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {record.date}
                          {record.hasBeenEdited && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                              Edited
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{format(new Date(record.date), 'EEEE')}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm">{formatTime(record.checkInTime)}</TableCell>
                      <TableCell className="text-center font-mono text-sm">{formatTime(record.breakInTime)}</TableCell>
                      <TableCell className="text-center font-mono text-sm">{formatTime(record.breakOutTime)}</TableCell>
                      <TableCell className="text-center font-mono text-sm">{formatTime(record.checkOutTime)}</TableCell>
                      <TableCell className="text-center font-mono text-sm font-medium">{formatHoursToTime(record.totalHours)}</TableCell>
                      <TableCell className="text-center font-mono text-sm text-gray-600">{calculateBreakTime(record.breakInTime, record.breakOutTime)}</TableCell>
                      <TableCell className="text-center font-mono text-sm font-medium text-blue-600">{record.overtime > 0 ? formatHoursToTime(record.overtime) : '00:00'}</TableCell>
                    </TableRow>
                    
                    {/* Expandable Change History Row */}
                    {record.hasBeenEdited && expandedRecordId === record.id && record.editHistory && (
                      <TableRow key={`${record.id}-details`} className="bg-orange-50/30">
                        <TableCell colSpan={11} className="py-4">
                          <div className="space-y-3 px-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm text-gray-900">Edit History</h4>
                              <div className="text-xs text-gray-500">
                                Edited {record.editedAt ? format(new Date(record.editedAt), 'MMM d, yyyy \'at\' h:mm a') : 'N/A'}
                              </div>
                            </div>
                            
                            {record.editReason && (
                              <div className="bg-white rounded-md p-3 border border-orange-200">
                                <div className="text-xs font-medium text-gray-700 mb-1">Reason for Edit:</div>
                                <div className="text-sm text-gray-600">{record.editReason}</div>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {record.editHistory.map((edit, idx) => (
                                <div key={idx} className="bg-white rounded-md p-3 border border-gray-200">
                                  <div className="text-xs font-medium text-gray-700 mb-2 capitalize">
                                    {edit.fieldChanged.replace(/([A-Z])/g, ' $1').trim()}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-red-600 line-through font-mono">
                                      {formatEditValue(edit.fieldChanged, edit.oldValue)}
                                    </span>
                                    <span className="text-gray-400">→</span>
                                    <span className="text-green-600 font-medium font-mono">
                                      {formatEditValue(edit.fieldChanged, edit.newValue)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
