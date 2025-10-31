"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Tag, Clock } from "lucide-react"
import { useState } from "react"

// Mock data
const tagHistory = [
  {
    id: 1,
    date: "2024-03-25",
    tags: [
      { name: "Development", count: 8, minutes: 320 },
      { name: "Code Review", count: 3, minutes: 90 },
      { name: "Meeting", count: 2, minutes: 60 }
    ],
    totalCount: 13,
    totalMinutes: 470,
    status: "APPROVED"
  },
  {
    id: 2,
    date: "2024-03-24",
    tags: [
      { name: "Bug Fixing", count: 5, minutes: 240 },
      { name: "Testing", count: 4, minutes: 120 },
      { name: "Documentation", count: 2, minutes: 60 }
    ],
    totalCount: 11,
    totalMinutes: 420,
    status: "APPROVED"
  },
  {
    id: 3,
    date: "2024-03-23",
    tags: [
      { name: "Development", count: 6, minutes: 280 },
      { name: "Research", count: 3, minutes: 150 },
      { name: "Meeting", count: 1, minutes: 30 }
    ],
    totalCount: 10,
    totalMinutes: 460,
    status: "PENDING"
  },
  {
    id: 4,
    date: "2024-03-22",
    tags: [
      { name: "Development", count: 7, minutes: 300 },
      { name: "Code Review", count: 4, minutes: 120 },
      { name: "Deployment", count: 1, minutes: 60 }
    ],
    totalCount: 12,
    totalMinutes: 480,
    status: "APPROVED"
  },
  {
    id: 5,
    date: "2024-03-21",
    tags: [
      { name: "Bug Fixing", count: 9, minutes: 360 },
      { name: "Testing", count: 5, minutes: 100 }
    ],
    totalCount: 14,
    totalMinutes: 460,
    status: "APPROVED"
  }
]

export default function TagHistoryPage() {
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

  const filteredHistory = tagHistory.filter(entry =>
    entry.date.includes(searchTerm) ||
    entry.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    entry.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    totalDays: tagHistory.length,
    avgTagsPerDay: (tagHistory.reduce((sum, e) => sum + e.totalCount, 0) / tagHistory.length).toFixed(1),
    avgHoursPerDay: (tagHistory.reduce((sum, e) => sum + e.totalMinutes, 0) / tagHistory.length / 60).toFixed(1),
    pendingApprovals: tagHistory.filter(e => e.status === "PENDING").length
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Work History</h2>
        <p className="text-muted-foreground">
          View your work log history and statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDays}</div>
            <p className="text-xs text-muted-foreground">Logs submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Tags/Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTagsPerDay}</div>
            <p className="text-xs text-muted-foreground">Tasks logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Hours/Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgHoursPerDay}h</div>
            <p className="text-xs text-muted-foreground">Work logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Tag History */}
      <Card>
        <CardHeader>
          <CardTitle>Work Log History</CardTitle>
          <CardDescription>All your submitted work tags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search by date, tag name, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="space-y-4">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{entry.date}</h4>
                        <p className="text-sm text-muted-foreground">
                          {entry.totalCount} tasks • {(entry.totalMinutes / 60).toFixed(1)} hours
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(entry.status)} variant="outline">
                      {entry.status}
                    </Badge>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {entry.tags.map((tag, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{tag.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {tag.count} tasks • {tag.minutes} min
                          </p>
                        </div>
                      </div>
                    ))}
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
