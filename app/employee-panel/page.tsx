"use client"

import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarCheck, FileText, Tags, AlertCircle, Clock, TrendingUp } from "lucide-react"

export default function EmployeeDashboardPage() {
  return (
    <RoleGuard allowedRoles={['EMPLOYEE', 'ADMIN', 'TEAMLEADER']} fallbackPath="/dashboard">
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's your overview
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Attendance</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22/24</div>
            <p className="text-xs text-muted-foreground">
              91.7% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Logged</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">148</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              1 pending, 0 resolved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Your last 5 attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2025-10-24", status: "Present", hours: "8.5h" },
                { date: "2025-10-23", status: "Present", hours: "8.2h" },
                { date: "2025-10-22", status: "WFH", hours: "8.0h" },
                { date: "2025-10-21", status: "Present", hours: "8.7h" },
                { date: "2025-10-20", status: "Present", hours: "8.3h" },
              ].map((record, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{record.date}</p>
                    <p className="text-xs text-muted-foreground">{record.status}</p>
                  </div>
                  <div className="text-sm font-medium">{record.hours}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Tags</CardTitle>
            <CardDescription>Assigned work categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Development", count: 45, time: "360 min" },
                { name: "Code Review", count: 28, time: "280 min" },
                { name: "Meetings", count: 18, time: "540 min" },
                { name: "Testing", count: 32, time: "256 min" },
                { name: "Documentation", count: 25, time: "200 min" },
              ].map((tag, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{tag.name}</p>
                    <p className="text-xs text-muted-foreground">{tag.count} logs this month</p>
                  </div>
                  <div className="text-sm font-medium">{tag.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors">
              <FileText className="h-8 w-8" />
              <span className="text-sm font-medium">Submit Logs</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors">
              <Clock className="h-8 w-8" />
              <span className="text-sm font-medium">Apply Leave</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors">
              <AlertCircle className="h-8 w-8" />
              <span className="text-sm font-medium">Raise Issue</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-lg border p-4 hover:bg-accent transition-colors">
              <TrendingUp className="h-8 w-8" />
              <span className="text-sm font-medium">View Analytics</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
    </RoleGuard>
  )
}
