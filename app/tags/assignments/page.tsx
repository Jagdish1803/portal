'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, UserPlus, Trash2, Tag as TagIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Tag {
  id: number;
  tagName: string;
  timeMinutes: number;
  category: string | null;
  isActive: boolean;
}

interface Employee {
  id: number;
  employeeCode: string;
  name: string;
  email: string;
  role: string;
}

interface Assignment {
  id: number;
  employeeId: number;
  tagId: number;
  isMandatory: boolean;
  employee: Employee;
  tag: Tag;
  createdAt: string;
}

export default function TagAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New assignment dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, tagsRes, employeesRes] = await Promise.all([
        fetch('/api/assignments'),
        fetch('/api/tags'),
        fetch('/api/employees')
      ]);

      const assignmentsData = await assignmentsRes.json();
      const tagsData = await tagsRes.json();
      const employeesData = await employeesRes.json();

      setAssignments(assignmentsData.assignments || []);
      setTags(tagsData.tags?.filter((t: Tag) => t.isActive) || []);
      setEmployees(employeesData.employees || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!selectedEmployee || !selectedTag) {
      toast.error('Please select both employee and tag');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: parseInt(selectedEmployee),
          tagId: parseInt(selectedTag),
          isMandatory
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Tag assigned successfully');
        setDialogOpen(false);
        setSelectedEmployee('');
        setSelectedTag('');
        setIsMandatory(false);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to assign tag');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to assign tag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (!confirm('Are you sure you want to remove this assignment?')) return;

    try {
      const response = await fetch(`/api/assignments?id=${assignmentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Assignment removed');
        fetchData();
      } else {
        toast.error('Failed to remove assignment');
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to remove assignment');
    }
  };

  const filteredAssignments = assignments.filter(assignment => 
    assignment.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.tag.tagName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.employee.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tag Assignments</h1>
          <p className="text-muted-foreground">
            Assign tags to employees for their work tracking
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Tag to Employee</DialogTitle>
              <DialogDescription>
                Select an employee and tag to create a new assignment
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.name} ({emp.employeeCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tag</Label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id.toString()}>
                        {tag.tagName} ({tag.timeMinutes} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mandatory" 
                  checked={isMandatory}
                  onCheckedChange={(checked) => setIsMandatory(checked as boolean)}
                />
                <Label htmlFor="mandatory" className="text-sm font-normal cursor-pointer">
                  Mark as mandatory
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAssignment} disabled={submitting}>
                {submitting ? 'Assigning...' : 'Assign Tag'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tags</CardTitle>
            <TagIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tags.length}</div>
            <p className="text-xs text-muted-foreground">Available tags</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Total employees</p>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Assignments</CardTitle>
              <CardDescription>
                Manage which tags are assigned to each employee
              </CardDescription>
            </div>
            <Input
              placeholder="Search by employee or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading assignments...
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <TagIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No assignments found</p>
              <p className="text-sm mt-2">
                {searchTerm ? 'No results match your search' : 'Create your first assignment by clicking the button above'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assignment.employee.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.employee.employeeCode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TagIcon className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{assignment.tag.tagName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {assignment.tag.timeMinutes} min
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={assignment.isMandatory ? 'default' : 'secondary'}>
                        {assignment.isMandatory ? 'Mandatory' : 'Optional'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}