'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { RoleGuard } from '@/components/role-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateActionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('warning');
  const [submitting, setSubmitting] = useState(false);

  // Warning form state
  const [warningForm, setWarningForm] = useState({
    employeeId: '',
    warningType: '',
    warningMessage: '',
    severity: 'LOW',
  });

  // Penalty form state
  const [penaltyForm, setPenaltyForm] = useState({
    employeeId: '',
    penaltyType: '',
    amount: '',
    description: '',
    penaltyDate: new Date().toISOString().split('T')[0],
  });

  // Fetch employees
  const { data: employeesResponse } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      return response.json();
    }
  });

  const employees = employeesResponse?.data || [];

  const handleWarningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!warningForm.employeeId || !warningForm.warningType || !warningForm.warningMessage) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/warnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(warningForm)
      });

      if (response.ok) {
        toast.success('Warning issued successfully');
        router.push('/admin');
      } else {
        toast.error('Failed to issue warning');
      }
    } catch (error) {
      console.error('Error creating warning:', error);
      toast.error('Failed to issue warning');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePenaltySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!penaltyForm.employeeId || !penaltyForm.penaltyType || !penaltyForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/penalties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(penaltyForm)
      });

      if (response.ok) {
        toast.success('Penalty created successfully');
        router.push('/admin');
      } else {
        toast.error('Failed to create penalty');
      }
    } catch (error) {
      console.error('Error creating penalty:', error);
      toast.error('Failed to create penalty');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Action</h1>
            <p className="text-muted-foreground">
              Create a new warning or penalty
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="warning">Warning</TabsTrigger>
            <TabsTrigger value="penalty">Penalty</TabsTrigger>
          </TabsList>

          {/* Warning Form */}
          <TabsContent value="warning">
            <Card>
              <CardHeader>
                <CardTitle>Issue Warning</CardTitle>
                <CardDescription>
                  Create a disciplinary warning for an employee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWarningSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="warning-employee">Employee *</Label>
                    <Select 
                      value={warningForm.employeeId} 
                      onValueChange={(value) => setWarningForm({...warningForm, employeeId: value})}
                    >
                      <SelectTrigger id="warning-employee">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        {employees.map((emp: any) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.name} ({emp.employeeCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warning-type">Warning Type *</Label>
                    <Input
                      id="warning-type"
                      placeholder="e.g., Late Arrival, Absence, Performance"
                      value={warningForm.warningType}
                      onChange={(e) => setWarningForm({...warningForm, warningType: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity *</Label>
                    <Select 
                      value={warningForm.severity} 
                      onValueChange={(value) => setWarningForm({...warningForm, severity: value})}
                    >
                      <SelectTrigger id="severity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warning-message">Warning Message *</Label>
                    <Textarea
                      id="warning-message"
                      placeholder="Describe the warning in detail..."
                      value={warningForm.warningMessage}
                      onChange={(e) => setWarningForm({...warningForm, warningMessage: e.target.value})}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Issuing...
                        </>
                      ) : (
                        'Issue Warning'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Penalty Form */}
          <TabsContent value="penalty">
            <Card>
              <CardHeader>
                <CardTitle>Create Penalty</CardTitle>
                <CardDescription>
                  Apply a financial or disciplinary penalty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePenaltySubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="penalty-employee">Employee *</Label>
                    <Select 
                      value={penaltyForm.employeeId} 
                      onValueChange={(value) => setPenaltyForm({...penaltyForm, employeeId: value})}
                    >
                      <SelectTrigger id="penalty-employee">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        {employees.map((emp: any) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.name} ({emp.employeeCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="penalty-type">Penalty Type *</Label>
                    <Input
                      id="penalty-type"
                      placeholder="e.g., Late Fine, Absence Deduction"
                      value={penaltyForm.penaltyType}
                      onChange={(e) => setPenaltyForm({...penaltyForm, penaltyType: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={penaltyForm.amount}
                      onChange={(e) => setPenaltyForm({...penaltyForm, amount: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="penalty-date">Penalty Date *</Label>
                    <Input
                      id="penalty-date"
                      type="date"
                      value={penaltyForm.penaltyDate}
                      onChange={(e) => setPenaltyForm({...penaltyForm, penaltyDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="penalty-description">Description *</Label>
                    <Textarea
                      id="penalty-description"
                      placeholder="Describe the reason for this penalty..."
                      value={penaltyForm.description}
                      onChange={(e) => setPenaltyForm({...penaltyForm, description: e.target.value})}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Penalty'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  );
}
