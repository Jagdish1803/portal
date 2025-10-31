"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Plus, Clock, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface Issue {
  id: number
  title: string
  category: string
  priority: string
  status: string
  description: string
  createdAt: string
  resolvedAt?: string
  daysElapsed: number
}

// Mock data
const mockIssues: Issue[] = [
  {
    id: 1,
    title: "Laptop not turning on",
    category: "TECHNICAL",
    priority: "HIGH",
    status: "PENDING",
    description: "My laptop suddenly stopped working this morning",
    createdAt: "2024-03-25",
    daysElapsed: 1
  },
  {
    id: 2,
    title: "Access to project repository needed",
    category: "ACCESS",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    description: "Need access to the new client project repository",
    createdAt: "2024-03-23",
    daysElapsed: 3
  },
  {
    id: 3,
    title: "Office AC not working",
    category: "FACILITY",
    priority: "LOW",
    status: "RESOLVED",
    description: "AC in zone B is not cooling properly",
    createdAt: "2024-03-20",
    resolvedAt: "2024-03-22",
    daysElapsed: 2
  },
  {
    id: 4,
    title: "Salary slip not received",
    category: "HR",
    priority: "MEDIUM",
    status: "RESOLVED",
    description: "Haven't received salary slip for February",
    createdAt: "2024-03-15",
    resolvedAt: "2024-03-16",
    daysElapsed: 1
  }
]

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [newIssue, setNewIssue] = useState({
    title: "",
    category: "",
    priority: "",
    description: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Issue reported successfully!")
    setShowForm(false)
    setNewIssue({ title: "", category: "", priority: "", description: "" })
    // Will integrate API later
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/10 text-red-600 border-red-200"
      case "MEDIUM":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "LOW":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === "PENDING").length,
    inProgress: issues.filter(i => i.status === "IN_PROGRESS").length,
    resolved: issues.filter(i => i.status === "RESOLVED").length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Issues</h2>
          <p className="text-muted-foreground">
            Report and track your workplace issues
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
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
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Reporting Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Report New Issue</CardTitle>
            <CardDescription>Describe your issue and we'll help resolve it</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newIssue.category}
                    onValueChange={(value) => setNewIssue({...newIssue, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TECHNICAL">Technical</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="FACILITY">Facility</SelectItem>
                      <SelectItem value="ACCESS">Access</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newIssue.priority}
                    onValueChange={(value) => setNewIssue({...newIssue, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue..."
                  rows={4}
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Submit Issue</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>All Issues</CardTitle>
          <CardDescription>Track the status of your reported issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base">{issue.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end flex-shrink-0 ml-4">
                      <Badge className={getStatusColor(issue.status)} variant="outline">
                        {issue.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(issue.priority)} variant="outline">
                        {issue.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3 pl-13">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Category:</span>
                      <span>{issue.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Created: {issue.createdAt}</span>
                    </div>
                    {issue.status === "RESOLVED" && issue.resolvedAt && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Resolved: {issue.resolvedAt}</span>
                      </div>
                    )}
                    {issue.status !== "RESOLVED" && (
                      <div className="flex items-center gap-1">
                        <span>{issue.daysElapsed} {issue.daysElapsed === 1 ? 'day' : 'days'} elapsed</span>
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
