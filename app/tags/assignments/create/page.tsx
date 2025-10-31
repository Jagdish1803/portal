'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

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
  department: string | null;
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tagsRes, employeesRes] = await Promise.all([
        fetch('/api/tags'),
        fetch('/api/employees')
      ]);

      const tagsData = await tagsRes.json();
      const employeesData = await employeesRes.json();

      setTags(tagsData.data?.filter((t: Tag) => t.isActive) || []);
      setEmployees(employeesData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        router.push('/tags/assignments');
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

  const getSelectedEmployees = () => {
    return employees.filter(emp => 
      selectedEmployee.split(',').includes(emp.id.toString())
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Assignment</h1>
          <p className="text-muted-foreground">
            Assign tags to employees for their work tracking
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Main Card */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription>
                Select employee and tag to create a new assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Employee Selection */}
              <div className="space-y-3">
                <Label htmlFor="employee" className="text-base font-semibold">
                  Select Employee
                </Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger id="employee" className="w-full">
                    <SelectValue placeholder="Select employees to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No employees found
                      </div>
                    ) : (
                      employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.name} ({emp.employeeCode})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag Selection */}
              <div className="space-y-3">
                <Label htmlFor="tag" className="text-base font-semibold">
                  Select Tag
                </Label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger id="tag" className="w-full">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No tags found
                      </div>
                    ) : (
                      tags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          {tag.tagName} ({tag.timeMinutes} min)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Mandatory Checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="mandatory" 
                  checked={isMandatory}
                  onCheckedChange={(checked) => setIsMandatory(checked as boolean)}
                />
                <Label 
                  htmlFor="mandatory" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Mark as mandatory
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Selected Employee Display */}
          {selectedEmployee && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Assigned Employee</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {getSelectedEmployees().length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-muted-foreground">No employee selected yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select employee from the dropdown above
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getSelectedEmployees().map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {emp.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-sm text-muted-foreground">{emp.employeeCode}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{emp.role}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || !selectedEmployee || !selectedTag}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Assign Tag'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
