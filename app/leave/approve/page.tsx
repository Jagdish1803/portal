'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Clock, AlertCircle, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface LeaveRequest {
  id: number
  employeeId: number
  employeeName: string
  employeeCode: string
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  status: string
  requestedAt: string
  isUrgent: boolean
  totalDays: number
}

const mockPendingLeaves: LeaveRequest[] = [
  {
    id: 1,
    employeeId: 3,
    employeeName: 'Mike Johnson',
    employeeCode: 'EMP003',
    leaveType: 'SICK_LEAVE',
    startDate: '2024-10-20',
    endDate: '2024-10-22',
    reason: 'Medical treatment required',
    status: 'PENDING',
    requestedAt: '2024-10-14T09:00:00Z',
    isUrgent: true,
    totalDays: 3
  },
  {
    id: 2,
    employeeId: 4,
    employeeName: 'Sarah Wilson',
    employeeCode: 'EMP004',
    leaveType: 'CASUAL_LEAVE',
    startDate: '2024-10-25',
    endDate: '2024-10-27',
    reason: 'Family event',
    status: 'PENDING',
    requestedAt: '2024-10-13T14:30:00Z',
    isUrgent: false,
    totalDays: 3
  }
]

export default function ApproveLeave() {
  const queryClient = useQueryClient()
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)
  const [reviewAction, setReviewAction] = useState<'approve' | 'deny' | null>(null)
  const [adminComments, setAdminComments] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: pendingLeaves, isLoading } = useQuery({
    queryKey: ['pending-leaves'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockPendingLeaves
    }
  })

  const reviewMutation = useMutation({
    mutationFn: async ({ id, action, comments }: { id: number, action: 'approve' | 'deny', comments: string }) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true }
    },
    onSuccess: (_, variables) => {
      toast.success(`Leave request ${variables.action === 'approve' ? 'approved' : 'denied'} successfully!`)
      setIsDialogOpen(false)
      setSelectedLeave(null)
      setAdminComments('')
      queryClient.invalidateQueries({ queryKey: ['pending-leaves'] })
    },
    onError: () => {
      toast.error('Failed to process leave request')
    }
  })

  const handleReviewClick = (leave: LeaveRequest, action: 'approve' | 'deny') => {
    setSelectedLeave(leave)
    setReviewAction(action)
    setIsDialogOpen(true)
  }

  const handleReviewSubmit = () => {
    if (!selectedLeave || !reviewAction) return

    if (reviewAction === 'deny' && !adminComments.trim()) {
      toast.error('Please provide a reason for denial')
      return
    }

    reviewMutation.mutate({
      id: selectedLeave.id,
      action: reviewAction,
      comments: adminComments
    })
  }

  const leaveTypeColors: Record<string, string> = {
    'FULL_LEAVE': 'bg-purple-100 text-purple-800',
    'WORK_FROM_HOME': 'bg-blue-100 text-blue-800',
    'SICK_LEAVE': 'bg-red-100 text-red-800',
    'CASUAL_LEAVE': 'bg-green-100 text-green-800',
    'EMERGENCY_LEAVE': 'bg-orange-100 text-orange-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Approve Leave Requests</h2>
          <p className="text-muted-foreground">
            Review and approve pending leave requests from employees
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingLeaves?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pendingLeaves?.filter(l => l.isUrgent).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days Requested</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {pendingLeaves?.reduce((sum, l) => sum + l.totalDays, 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
          <CardDescription>
            Leave requests awaiting your review and approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingLeaves?.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">{leave.employeeName}</TableCell>
                  <TableCell>{leave.employeeCode}</TableCell>
                  <TableCell>
                    <Badge className={leaveTypeColors[leave.leaveType] || ''}>
                      {leave.leaveType.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{leave.totalDays}</TableCell>
                  <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                  <TableCell>{new Date(leave.requestedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {leave.isUrgent && (
                      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                        <AlertCircle className="h-3 w-3" />
                        Urgent
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleReviewClick(leave, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReviewClick(leave, 'deny')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Deny'} Leave Request
            </DialogTitle>
            <DialogDescription>
              Review details and {reviewAction === 'approve' ? 'approve' : 'provide reason for denying'} this leave request
            </DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Employee</Label>
                  <p className="font-medium">{selectedLeave.employeeName}</p>
                </div>
                <div>
                  <Label>Leave Type</Label>
                  <Badge className={leaveTypeColors[selectedLeave.leaveType] || ''}>
                    {selectedLeave.leaveType.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <p>{new Date(selectedLeave.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p>{new Date(selectedLeave.endDate).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <Label>Reason</Label>
                  <p className="text-muted-foreground">{selectedLeave.reason}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments">
                  {reviewAction === 'approve' ? 'Comments (Optional)' : 'Reason for Denial (Required)'}
                </Label>
                <Textarea
                  id="comments"
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  placeholder={reviewAction === 'approve' ? 'Add any comments...' : 'Explain why this leave is being denied...'}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={reviewMutation.isPending}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {reviewMutation.isPending ? 'Processing...' : (reviewAction === 'approve' ? 'Approve' : 'Deny')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
