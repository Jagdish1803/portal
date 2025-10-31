'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { LifeBuoy, Send, HelpCircle, FileText, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

const faqs = [
  {
    question: 'How do I mark my daily attendance?',
    answer: 'Navigate to Attendance > Daily Attendance from the sidebar. Click the "Check In" button when you start your workday and "Check Out" when you finish. Make sure to mark your lunch breaks as well.'
  },
  {
    question: 'How can I apply for leave?',
    answer: 'Go to Leave Management > Apply for Leave. Fill in the required details including leave type, start date, end date, and reason. Submit the request and wait for admin approval.'
  },
  {
    question: 'Where can I view my assigned assets?',
    answer: 'Navigate to your Employee Profile page or Asset Management > My Assets to view all assets currently assigned to you, including their serial numbers and assignment dates.'
  },
  {
    question: 'How do I update my personal information?',
    answer: 'Go to Employees > Employee Profile and click the "Edit Profile" button. You can update your contact information, address, and other personal details. Some fields may require admin approval.'
  },
  {
    question: 'What should I do if I forgot my password?',
    answer: 'Click on the "Forgot Password" link on the login page. Enter your email address, and you will receive instructions to reset your password.'
  },
  {
    question: 'How can I view my productivity reports?',
    answer: 'Navigate to Reports & Analytics > Productivity Reports. You can filter by date range and view detailed metrics about your work hours, tasks completed, and productivity rates.'
  }
]

export default function SupportPage() {
  const [supportTicket, setSupportTicket] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'NORMAL'
  })

  const submitTicketMutation = useMutation({
    mutationFn: async (data: typeof supportTicket) => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      return { success: true, ticketId: `TICKET-${Date.now()}` }
    },
    onSuccess: (data) => {
      toast.success(`Support ticket submitted successfully! Ticket ID: ${data.ticketId}`)
      setSupportTicket({
        category: '',
        subject: '',
        description: '',
        priority: 'NORMAL'
      })
    },
    onError: () => {
      toast.error('Failed to submit support ticket')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!supportTicket.category || !supportTicket.subject || !supportTicket.description) {
      toast.error('Please fill in all required fields')
      return
    }
    submitTicketMutation.mutate(supportTicket)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Issues</h2>
        <p className="text-muted-foreground">
          Get help with using the Employee Portal
        </p>
      </div>

      {/* Issue Tag */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LifeBuoy className="h-5 w-5" />
            Issue Tag
          </CardTitle>
          <CardDescription>
            Need help? Submit an issue and our team will get back to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={supportTicket.category}
                  onValueChange={(value) => setSupportTicket({...supportTicket, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="attendance">Attendance Related</SelectItem>
                    <SelectItem value="leave">Leave Management</SelectItem>
                    <SelectItem value="assets">Asset Management</SelectItem>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={supportTicket.priority}
                  onValueChange={(value) => setSupportTicket({...supportTicket, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={supportTicket.subject}
                onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
                placeholder="Brief description of your issue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={supportTicket.description}
                onChange={(e) => setSupportTicket({...supportTicket, description: e.target.value})}
                placeholder="Please provide detailed information about your issue..."
                rows={6}
              />
            </div>
            <Button type="submit" disabled={submitTicketMutation.isPending}>
              {submitTicketMutation.isPending ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Issue
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find answers to common questions about using the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
