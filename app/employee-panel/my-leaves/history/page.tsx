"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, FileText } from "lucide-react"
import { useState } from "react"

// Mock data
const leaveHistory = [
  {
    id: 1,
    type: "CASUAL_LEAVE",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    duration: "3 days",
    reason: "Family function",
    status: "APPROVED",
    appliedOn: "2024-03-10",
    approvedBy: "John Manager"
  },
  {
    id: 2,
    type: "WORK_FROM_HOME",
    startDate: "2024-03-20",
    endDate: "2024-03-20",
    duration: "1 day",
    reason: "Home renovation work",
    status: "APPROVED",
    appliedOn: "2024-03-18",
    approvedBy: "John Manager"
  },
  {
    id: 3,
    type: "SICK_LEAVE",
    startDate: "2024-03-25",
    endDate: "2024-03-26",
    duration: "2 days",
    reason: "Fever and cold",
    status: "PENDING",
    appliedOn: "2024-03-24",
    approvedBy: "-"
  },
  {
    id: 4,
    type: "CASUAL_LEAVE",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    duration: "3 days",
    reason: "Personal work",
    status: "APPROVED",
    appliedOn: "2024-02-05",
    approvedBy: "John Manager"
  },
  {
    id: 5,
    type: "WORK_FROM_HOME",
    startDate: "2024-02-20",
    endDate: "2024-02-20",
    duration: "1 day",
    reason: "Internet issue at office",
    status: "REJECTED",
    appliedOn: "2024-02-19",
    approvedBy: "John Manager"
  }
]

export default function LeaveHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200"
      case "REJECTED":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ')
  }

  const filteredLeaves = leaveHistory.filter(leave =>
    leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: leaveHistory.length,
    approved: leaveHistory.filter(l => l.status === "APPROVED").length,
    pending: leaveHistory.filter(l => l.status === "PENDING").length,
    rejected: leaveHistory.filter(l => l.status === "REJECTED").length
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Leave History</h2>
        <p className="text-muted-foreground">
          View all your leave requests and their status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Leave History Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leave Requests</CardTitle>
          <CardDescription>Complete history of your leave applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search by type, reason, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="space-y-4">
              {filteredLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{getTypeLabel(leave.type)}</h4>
                        <p className="text-sm text-muted-foreground">{leave.duration}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(leave.status)} variant="outline">
                      {leave.status}
                    </Badge>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Period:</span>
                      <span>{leave.startDate} to {leave.endDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Applied:</span>
                      <span>{leave.appliedOn}</span>
                    </div>

                    <div className="flex items-center gap-2 md:col-span-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Reason:</span>
                      <span>{leave.reason}</span>
                    </div>

                    {leave.approvedBy !== "-" && (
                      <div className="flex items-center gap-2 md:col-span-2">
                        <span className="text-muted-foreground">Approved by:</span>
                        <span>{leave.approvedBy}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
