"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface TagEntry {
  id: number
  tagName: string
  count: string
  minutes: string
}

export default function SubmitTagsPage() {
  const [date, setDate] = useState("")
  const [tagEntries, setTagEntries] = useState<TagEntry[]>([
    { id: 1, tagName: "", count: "", minutes: "" }
  ])

  const availableTags = [
    "Development",
    "Bug Fixing",
    "Code Review",
    "Testing",
    "Documentation",
    "Meeting",
    "Research",
    "Deployment"
  ]

  const addTagEntry = () => {
    const newId = Math.max(...tagEntries.map(e => e.id), 0) + 1
    setTagEntries([...tagEntries, { id: newId, tagName: "", count: "", minutes: "" }])
  }

  const removeTagEntry = (id: number) => {
    if (tagEntries.length === 1) {
      toast.error("At least one tag entry is required")
      return
    }
    setTagEntries(tagEntries.filter(entry => entry.id !== id))
  }

  const updateTagEntry = (id: number, field: keyof TagEntry, value: string) => {
    setTagEntries(tagEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Tags submitted successfully!")
    // Will integrate API later
  }

  const totalCount = tagEntries.reduce((sum, entry) => sum + (parseInt(entry.count) || 0), 0)
  const totalMinutes = tagEntries.reduce((sum, entry) => sum + (parseInt(entry.minutes) || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Submit Logs</h2>
        <p className="text-muted-foreground">
          Log your daily work activities and time spent
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tagEntries.length}</div>
            <p className="text-xs text-muted-foreground">Activities logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">Tasks completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMinutes} min</div>
            <p className="text-xs text-muted-foreground">{(totalMinutes / 60).toFixed(1)} hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Tag Submission Form */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Work Log</CardTitle>
          <CardDescription>Add tags for your work activities today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Work Activities</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTagEntry}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
              </div>

              {tagEntries.map((entry) => (
                <div key={entry.id} className="flex gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label>Tag Name</Label>
                    <Select
                      value={entry.tagName}
                      onValueChange={(value) => updateTagEntry(entry.id, 'tagName', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-32 space-y-2">
                    <Label>Count</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={entry.count}
                      onChange={(e) => updateTagEntry(entry.id, 'count', e.target.value)}
                      min="0"
                    />
                  </div>

                  <div className="w-32 space-y-2">
                    <Label>Minutes</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={entry.minutes}
                      onChange={(e) => updateTagEntry(entry.id, 'minutes', e.target.value)}
                      min="0"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTagEntry(entry.id)}
                    disabled={tagEntries.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="submit" size="lg">
              <Send className="mr-2 h-4 w-4" />
              Submit Tags
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
