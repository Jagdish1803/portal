'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, Plus, Edit, Trash2, Tag, Download, MoreVertical } from 'lucide-react'
import Link from 'next/link'

interface TagData {
  id: number
  tagName: string
  timeMinutes: number
  category: string | null
  isActive: boolean
  createdAt: string
  _count: {
    assignments: number
    logs: number
  }
}

export default function TagsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: tagsResponse, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await fetch('/api/tags')
      if (!response.ok) {
        throw new Error('Failed to fetch tags')
      }
      return response.json()
    }
  })

  const tags = tagsResponse?.data || []

  const filteredTags = tags.filter((tag: TagData) => {
    const matchesSearch = tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || tag.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? tag.isActive : !tag.isActive)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      Development: 'bg-blue-500 text-white',
      'Quality Assurance': 'bg-purple-500 text-white',
      Communication: 'bg-green-500 text-white',
      Documentation: 'bg-orange-500 text-white',
      Testing: 'bg-pink-500 text-white',
      Deployment: 'bg-red-500 text-white',
    }
    return (
      <Badge className={categoryColors[category as keyof typeof categoryColors] || 'bg-gray-500 text-white'}>
        {category}
      </Badge>
    )
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tags Management</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map(i => (
            <div key={i} className="bg-white p-4 rounded-lg border">
              <div className="h-4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-8 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border p-8 text-center">
          <div className="text-muted-foreground">Loading tags...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tags Management</h2>
          <p className="text-muted-foreground">
            {filteredTags.length} tags
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/tags/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Tag
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tags</p>
              <p className="text-2xl font-bold">{tags?.length || 0}</p>
            </div>
            <Tag className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Tags</p>
              <p className="text-2xl font-bold text-green-600">
                {tags?.filter(t => t.isActive).length || 0}
              </p>
            </div>
            <Tag className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Development">Development</SelectItem>
            <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
            <SelectItem value="Communication">Communication</SelectItem>
            <SelectItem value="Documentation">Documentation</SelectItem>
            <SelectItem value="Testing">Testing</SelectItem>
            <SelectItem value="Deployment">Deployment</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-xs uppercase text-muted-foreground w-[35%]">Tag Name</TableHead>
              <TableHead className="font-semibold text-xs uppercase text-muted-foreground w-[25%]">Time Allocated</TableHead>
              <TableHead className="font-semibold text-xs uppercase text-muted-foreground w-[25%]">Created</TableHead>
              <TableHead className="font-semibold text-xs uppercase text-muted-foreground text-center w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <Tag className="h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground font-medium">No tags found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'Get started by creating your first tag'
                      }
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTags.map((tag: TagData) => (
                <TableRow key={tag.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium w-[35%]">{tag.tagName}</TableCell>
                  <TableCell className="w-[25%]">
                    <div>
                      <p className="font-medium text-blue-600">
                        {formatTime(tag.timeMinutes)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tag.timeMinutes} mins
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground w-[25%]">
                    {new Date(tag.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-center w-[15%]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href={`/tags/${tag.id}/edit`} className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 cursor-pointer focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
