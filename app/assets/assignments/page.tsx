'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Package, UserPlus, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

const mockAssignments = [
  {
    id: 1,
    assetId: 1,
    assetName: 'MacBook Pro 16"',
    serialNumber: 'MBP2024001',
    employeeId: 1,
    employeeName: 'John Doe',
    employeeCode: 'EMP001',
    assignedDate: '2024-01-15',
    returnDate: null,
    status: 'ACTIVE',
    assignmentNotes: 'Standard development laptop',
    returnCondition: null
  }
]

const mockAssets = [
  { id: 1, name: 'MacBook Pro 16"', serialNumber: 'MBP2024001', status: 'AVAILABLE' },
  { id: 2, name: 'Dell Monitor 27"', serialNumber: 'MON2024002', status: 'AVAILABLE' }
]

const mockEmployees = [
  { id: 1, name: 'John Doe', code: 'EMP001' },
  { id: 2, name: 'Jane Smith', code: 'EMP002' }
]

export default function AssetAssignmentsPage() {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [newAssignment, setNewAssignment] = useState({
    assetId: '',
    employeeId: '',
    assignmentNotes: ''
  })
  const [returnData, setReturnData] = useState({
    returnCondition: 'GOOD',
    returnNotes: ''
  })

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['asset-assignments'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockAssignments
    }
  })

  const assignMutation = useMutation({
    mutationFn: async (data: typeof newAssignment) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Asset assigned successfully!')
      setIsAssignDialogOpen(false)
      setNewAssignment({ assetId: '', employeeId: '', assignmentNotes: '' })
    },
    onError: () => {
      toast.error('Failed to assign asset')
    }
  })

  const returnMutation = useMutation({
    mutationFn: async (data: typeof returnData) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Asset returned successfully!')
      setIsReturnDialogOpen(false)
      setReturnData({ returnCondition: 'GOOD', returnNotes: '' })
    },
    onError: () => {
      toast.error('Failed to return asset')
    }
  })

  const handleAssign = () => {
    if (!newAssignment.assetId || !newAssignment.employeeId) {
      toast.error('Please fill in all required fields')
      return
    }
    assignMutation.mutate(newAssignment)
  }

  const handleReturn = () => {
    if (!returnData.returnCondition) {
      toast.error('Please select return condition')
      return
    }
    returnMutation.mutate(returnData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Asset Assignments</h2>
          <p className="text-muted-foreground">
            Manage asset assignments to employees
          </p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Assign Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Asset to Employee</DialogTitle>
              <DialogDescription>
                Select an available asset and assign it to an employee
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Asset</Label>
                <Select
                  value={newAssignment.assetId}
                  onValueChange={(value) => setNewAssignment({...newAssignment, assetId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAssets.map(asset => (
                      <SelectItem key={asset.id} value={String(asset.id)}>
                        {asset.name} (S/N: {asset.serialNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Employee</Label>
                <Select
                  value={newAssignment.employeeId}
                  onValueChange={(value) => setNewAssignment({...newAssignment, employeeId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map(emp => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        {emp.name} ({emp.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assignment Notes</Label>
                <Textarea
                  value={newAssignment.assignmentNotes}
                  onChange={(e) => setNewAssignment({...newAssignment, assignmentNotes: e.target.value})}
                  placeholder="Add any notes about this assignment..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssign} disabled={assignMutation.isPending}>
                {assignMutation.isPending ? 'Assigning...' : 'Assign Asset'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {assignments?.filter(a => a.status === 'ACTIVE').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Returned Assets</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assignments?.filter(a => a.status === 'RETURNED').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Assignments</CardTitle>
          <CardDescription>
            Track all asset assignments to employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments?.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.assetName}</TableCell>
                  <TableCell>{assignment.serialNumber}</TableCell>
                  <TableCell>{assignment.employeeName}</TableCell>
                  <TableCell>{assignment.employeeCode}</TableCell>
                  <TableCell>{new Date(assignment.assignedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={assignment.status === 'ACTIVE' ? 'default' : 'outline'}>
                      {assignment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {assignment.status === 'ACTIVE' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAssignment(assignment)
                          setIsReturnDialogOpen(true)
                        }}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Return Asset Dialog */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Asset</DialogTitle>
            <DialogDescription>
              Record the return of this asset
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Return Condition</Label>
              <Select
                value={returnData.returnCondition}
                onValueChange={(value) => setReturnData({...returnData, returnCondition: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXCELLENT">Excellent</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="FAIR">Fair</SelectItem>
                  <SelectItem value="POOR">Poor</SelectItem>
                  <SelectItem value="DAMAGED">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Return Notes</Label>
              <Textarea
                value={returnData.returnNotes}
                onChange={(e) => setReturnData({...returnData, returnNotes: e.target.value})}
                placeholder="Add any notes about the asset condition..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReturn} disabled={returnMutation.isPending}>
              {returnMutation.isPending ? 'Processing...' : 'Return Asset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
