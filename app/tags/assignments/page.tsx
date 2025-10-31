'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, UserPlus, Trash2, Tag as TagIcon } from 'lucide-react';
import { toast } from 'sonner';

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
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const assignmentsRes = await fetch('/api/assignments');
      const assignmentsData = await assignmentsRes.json();
      setAssignments(assignmentsData.assignments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
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
        
        <Button onClick={() => router.push('/tags/assignments/create')}>
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{assignments.length}</div>
          <p className="text-xs text-muted-foreground">Active tag assignments</p>
        </CardContent>
      </Card>

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