'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Tag, Clock, Users, Target, Save } from 'lucide-react';

export default function TagAssignmentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for tag assignments
  const mockAssignments = [
    {
      id: 1,
      tagId: 1,
      tagName: 'Frontend Development',
      employeeId: 1,
      employeeName: 'John Doe',
      assignedDate: new Date('2024-01-15'),
      estimatedHours: 40,
      actualHours: 38.5,
      status: 'ACTIVE',
      priority: 'HIGH',
      description: 'React component development and optimization',
    },
    {
      id: 2,
      tagId: 2,
      tagName: 'Code Review',
      employeeId: 2,
      employeeName: 'Jane Smith',
      assignedDate: new Date('2024-01-16'),
      estimatedHours: 10,
      actualHours: 12.0,
      status: 'COMPLETED',
      priority: 'MEDIUM',
      description: 'Review pull requests and provide feedback',
    },
    {
      id: 3,
      tagId: 1,
      tagName: 'Frontend Development',
      employeeId: 3,
      employeeName: 'Mike Johnson',
      assignedDate: new Date('2024-01-18'),
      estimatedHours: 30,
      actualHours: 0,
      status: 'PENDING',
      priority: 'MEDIUM',
      description: 'UI/UX implementation for new features',
    },
  ];

  const filteredAssignments = mockAssignments.filter(assignment => 
    assignment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.tagName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAUSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-orange-100 text-orange-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Tag Assignments</h1>
          <p className="text-muted-foreground">
            Manage work tag assignments and track progress
          </p>
        </div>
        <Button onClick={() => router.push('/tags/assignments/create')}>
          <Target className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockAssignments.filter(a => a.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockAssignments.filter(a => a.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">Finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">94.2%</div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Work Tag Assignments</CardTitle>
          <CardDescription>
            Track and manage employee work assignments by tags
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No assignments found matching your search.
              </div>
            ) : (
              filteredAssignments.map((assignment) => (
                <Card key={assignment.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <Tag className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{assignment.tagName}</h3>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                          <Badge className={getPriorityColor(assignment.priority)}>
                            {assignment.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          Assigned to: <strong>{assignment.employeeName}</strong>
                        </p>
                        
                        <p className="text-sm mb-3">{assignment.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>📅 Assigned: {assignment.assignedDate.toLocaleDateString()}</span>
                          <span>⏱️ Estimated: {assignment.estimatedHours}h</span>
                          <span>✅ Actual: {assignment.actualHours}h</span>
                          <span>📊 Progress: {Math.round((assignment.actualHours / assignment.estimatedHours) * 100)}%</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${Math.min((assignment.actualHours / assignment.estimatedHours) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        onClick={() => router.push(`/tags/assignments/${assignment.id}`)}
                      >
                        View Details
                      </Button>
                      
                      {assignment.status === 'ACTIVE' && (
                        <Button size="sm" variant="outline">
                          <Save className="mr-1 h-4 w-4" />
                          Update Progress
                        </Button>
                      )}
                      
                      {assignment.status === 'PENDING' && (
                        <Button size="sm" variant="outline" className="text-blue-600">
                          Start Work
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}