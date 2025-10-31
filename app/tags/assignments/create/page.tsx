'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, UserPlus, Tag as TagIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchTag, setSearchTag] = useState('');

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

  const selectedEmployeeData = employees.find(e => e.id.toString() === selectedEmployee);
  const selectedTagData = tags.find(t => t.id.toString() === selectedTag);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(searchEmployee.toLowerCase())
  );

  const filteredTags = tags.filter(tag =>
    tag.tagName.toLowerCase().includes(searchTag.toLowerCase())
  );

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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Assignment</h1>
          <p className="text-muted-foreground">
            Assign a tag to an employee for work tracking
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Employee Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                Select Employee
              </CardTitle>
              <CardDescription>
                Choose which employee will work on this tag
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee *</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger id="employee" className="h-12">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search employees..."
                        value={searchEmployee}
                        onChange={(e) => setSearchEmployee(e.target.value)}
                        className="mb-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {filteredEmployees.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No employees found
                      </div>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          <div className="flex items-center gap-3 py-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {emp.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{emp.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {emp.employeeCode} • {emp.role}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedEmployeeData && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                      {selectedEmployeeData.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{selectedEmployeeData.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{selectedEmployeeData.employeeCode}</Badge>
                        <Badge variant="secondary">{selectedEmployeeData.role}</Badge>
                        {selectedEmployeeData.department && (
                          <Badge variant="outline">{selectedEmployeeData.department}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{selectedEmployeeData.email}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tag Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-purple-600" />
                Select Tag
              </CardTitle>
              <CardDescription>
                Choose which tag to assign to this employee
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tag">Tag *</Label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger id="tag" className="h-12">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Search tags..."
                        value={searchTag}
                        onChange={(e) => setSearchTag(e.target.value)}
                        className="mb-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {filteredTags.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No tags found
                      </div>
                    ) : (
                      filteredTags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          <div className="flex items-center justify-between gap-3 py-1 w-full">
                            <div className="flex items-center gap-3">
                              <TagIcon className="h-4 w-4 text-purple-600" />
                              <div>
                                <div className="font-medium">{tag.tagName}</div>
                                {tag.category && (
                                  <div className="text-xs text-muted-foreground">{tag.category}</div>
                                )}
                              </div>
                            </div>
                            <Badge variant="secondary">{tag.timeMinutes} min</Badge>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedTagData && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <TagIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{selectedTagData.tagName}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">⏱️ {selectedTagData.timeMinutes} minutes</Badge>
                        {selectedTagData.category && (
                          <Badge variant="secondary">{selectedTagData.category}</Badge>
                        )}
                      </div>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment Options Card */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment Options</CardTitle>
              <CardDescription>
                Configure additional settings for this assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="mandatory" 
                  checked={isMandatory}
                  onCheckedChange={(checked) => setIsMandatory(checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label 
                    htmlFor="mandatory" 
                    className="text-base font-medium cursor-pointer"
                  >
                    Mark as Mandatory
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Employee must submit work for this tag. Mandatory tags are tracked more strictly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          {selectedEmployeeData && selectedTagData && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Assignment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Employee:</span>
                  <span className="text-sm text-green-700">{selectedEmployeeData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Tag:</span>
                  <span className="text-sm text-green-700">{selectedTagData.tagName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Time Required:</span>
                  <span className="text-sm text-green-700">{selectedTagData.timeMinutes} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Type:</span>
                  <Badge variant={isMandatory ? 'default' : 'secondary'}>
                    {isMandatory ? 'Mandatory' : 'Optional'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
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
              className="min-w-32"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Assign Tag
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
