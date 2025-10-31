"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function ApplyLeavePage() {
  const [leaveData, setLeaveData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    isUrgent: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Leave request submitted successfully!")
    // Will integrate API later
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Apply Leave</h2>
        <p className="text-muted-foreground">
          Request time off from work
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Leave Balance Cards */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Casual Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/12</div>
            <p className="text-xs text-muted-foreground">4 days remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/7</div>
            <p className="text-xs text-muted-foreground">5 days remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">WFH Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6/10</div>
            <p className="text-xs text-muted-foreground">4 days remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Request Form</CardTitle>
          <CardDescription>Fill in the details for your leave request</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type</Label>
                <Select 
                  value={leaveData.leaveType}
                  onValueChange={(value) => setLeaveData({...leaveData, leaveType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_LEAVE">Full Day Leave</SelectItem>
                    <SelectItem value="WORK_FROM_HOME">Work From Home</SelectItem>
                    <SelectItem value="SICK_LEAVE">Sick Leave</SelectItem>
                    <SelectItem value="CASUAL_LEAVE">Casual Leave</SelectItem>
                    <SelectItem value="EMERGENCY_LEAVE">Emergency Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Is this urgent?</Label>
                <Select 
                  value={leaveData.isUrgent ? "yes" : "no"}
                  onValueChange={(value) => setLeaveData({...leaveData, isUrgent: value === "yes"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={leaveData.startDate}
                  onChange={(e) => setLeaveData({...leaveData, startDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={leaveData.endDate}
                  onChange={(e) => setLeaveData({...leaveData, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                placeholder="Explain the reason for your leave request..."
                rows={4}
                value={leaveData.reason}
                onChange={(e) => setLeaveData({...leaveData, reason: e.target.value})}
              />
            </div>

            <Button type="submit" size="lg">
              <Send className="mr-2 h-4 w-4" />
              Submit Leave Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
