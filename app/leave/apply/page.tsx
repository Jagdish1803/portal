'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, ArrowLeft, Clock, FileText, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const LEAVE_TYPES = [
  { 
    value: 'FULL_LEAVE', 
    label: 'Full Leave', 
    description: 'Complete day off from work',
    color: 'bg-red-100 text-red-800',
    maxDays: 21,
    requiresDocument: false 
  },
  { 
    value: 'WFH', 
    label: 'Work From Home', 
    description: 'Work remotely from home',
    color: 'bg-blue-100 text-blue-800',
    maxDays: 10,
    requiresDocument: false 
  },
  { 
    value: 'SICK_LEAVE', 
    label: 'Sick Leave', 
    description: 'Medical leave due to illness',
    color: 'bg-orange-100 text-orange-800',
    maxDays: 15,
    requiresDocument: true 
  },
  { 
    value: 'CASUAL_LEAVE', 
    label: 'Casual Leave', 
    description: 'Personal time off for casual purposes',
    color: 'bg-green-100 text-green-800',
    maxDays: 12,
    requiresDocument: false 
  },
  { 
    value: 'EMERGENCY_LEAVE', 
    label: 'Emergency Leave', 
    description: 'Urgent personal emergency',
    color: 'bg-purple-100 text-purple-800',
    maxDays: 5,
    requiresDocument: true 
  },
];

export default function ApplyLeavePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    reason: '',
    alternateContact: '',
    workHandover: '',
    urgency: 'LOW',
    document: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedLeaveType = LEAVE_TYPES.find(type => type.value === formData.type);

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const diffTime = Math.abs(formData.endDate.getTime() - formData.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Leave type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    if (selectedLeaveType) {
      const days = calculateDays();
      if (days > selectedLeaveType.maxDays) {
        newErrors.endDate = `Maximum ${selectedLeaveType.maxDays} days allowed for ${selectedLeaveType.label}`;
      }

      if (selectedLeaveType.requiresDocument && !formData.document) {
        newErrors.document = 'Supporting document is required for this leave type';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically send the data to your API
      console.log('Leave application submitted:', formData);
      
      // Simulate API call
      setTimeout(() => {
        alert('Leave application submitted successfully!');
        router.push('/leave');
      }, 1000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, document: file });
  };

  const days = calculateDays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Apply for Leave</h1>
          <p className="text-muted-foreground">
            Submit your leave request for approval
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Leave Application Form
              </CardTitle>
              <CardDescription>
                Fill out the details for your leave request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Leave Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Leave Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAVE_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={type.color}>{type.label}</Badge>
                            <span className="text-sm text-muted-foreground">
                              - {type.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                  
                  {selectedLeaveType && (
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <p><strong>Max Days:</strong> {selectedLeaveType.maxDays}</p>
                      <p><strong>Document Required:</strong> {selectedLeaveType.requiresDocument ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                </div>

                {/* Date Range */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !formData.startDate && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData({ ...formData, startDate: date || undefined })}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !formData.endDate && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => setFormData({ ...formData, endDate: date || undefined })}
                          initialFocus
                          disabled={(date) => date < (formData.startDate || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                  </div>
                </div>

                {/* Duration Display */}
                {formData.startDate && formData.endDate && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        Duration: {days} day{days > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a detailed reason for your leave request..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={4}
                  />
                  {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
                </div>

                {/* Additional Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="alternateContact">Alternate Contact</Label>
                    <Input
                      id="alternateContact"
                      placeholder="Phone or email for emergencies"
                      value={formData.alternateContact}
                      onChange={(e) => setFormData({ ...formData, alternateContact: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select 
                      value={formData.urgency} 
                      onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Work Handover */}
                <div className="space-y-2">
                  <Label htmlFor="workHandover">Work Handover Instructions</Label>
                  <Textarea
                    id="workHandover"
                    placeholder="Describe how your work will be handled during your absence..."
                    value={formData.workHandover}
                    onChange={(e) => setFormData({ ...formData, workHandover: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Document Upload */}
                {selectedLeaveType?.requiresDocument && (
                  <div className="space-y-2">
                    <Label htmlFor="document">Supporting Document *</Label>
                    <Input
                      id="document"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Upload medical certificate, documentation, etc. (PDF, DOC, or image files)
                    </p>
                    {errors.document && <p className="text-sm text-red-500">{errors.document}</p>}
                  </div>
                )}

                <Separator />

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Submit Application
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Leave Balance & Guidelines */}
        <div className="space-y-6">
          {/* Leave Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Leave Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Annual Leave</span>
                  <span className="font-medium">15/21</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sick Leave</span>
                  <span className="font-medium">8/15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Casual Leave</span>
                  <span className="font-medium">5/12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">WFH Days</span>
                  <span className="font-medium">6/10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Leave Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Submit applications at least 24 hours in advance</li>
                <li>• Sick leave requires medical documentation for 3+ days</li>
                <li>• Emergency leave requires immediate notification</li>
                <li>• WFH requires prior approval from team lead</li>
                <li>• Annual leave requires 1 week advance notice</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}