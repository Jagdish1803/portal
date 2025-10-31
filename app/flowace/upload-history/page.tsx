"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, Clock, CheckCircle, XCircle, Search, Download, Eye, Trash2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface UploadHistoryEntry {
  id: string
  filename: string
  fileType: string
  status: string
  totalRecords: number
  processedRecords: number
  errorRecords: number
  uploadedAt: string
  completedAt?: string
  batchId: string
  date?: string
  summary?: any
  errors?: any
}

export default function FlowaceUploadHistoryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [uploadHistory, setUploadHistory] = useState<UploadHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch upload history
  const fetchUploadHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/upload-history')
      const data = await response.json()
      
      if (data.success) {
        // Filter only Flowace uploads
        const flowaceHistory = data.history.filter((entry: UploadHistoryEntry) => 
          entry.fileType === 'flowace_csv'
        )
        setUploadHistory(flowaceHistory)
      }
    } catch (error) {
      console.error('Error fetching upload history:', error)
      toast.error('Failed to load upload history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUploadHistory()
  }, [])

  // Filter history based on search
  const filteredHistory = useMemo(() => {
    return uploadHistory.filter(entry => 
      entry.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.batchId.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [uploadHistory, searchTerm])

  // Calculate stats
  const stats = useMemo(() => {
    const totalUploads = uploadHistory.length
    const successful = uploadHistory.filter(e => e.status === 'COMPLETED').length
    const failed = uploadHistory.filter(e => e.status === 'FAILED').length
    const lastUpload = uploadHistory.length > 0 
      ? new Date(uploadHistory[0].uploadedAt).toLocaleDateString()
      : 'Never'
    
    return { totalUploads, successful, failed, lastUpload }
  }, [uploadHistory])

  const deleteUpload = async (entry: UploadHistoryEntry) => {
    if (!confirm(`Delete upload "${entry.filename}"?`)) return

    try {
      const response = await fetch('/api/upload-history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id })
      })

      if (response.ok) {
        toast.success('Upload history deleted')
        fetchUploadHistory()
      } else {
        toast.error('Failed to delete upload history')
      }
    } catch (error) {
      toast.error('Error deleting upload history')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Flowace Upload History</h2>
          <p className="text-muted-foreground">
            Track all CSV file uploads and processing status
          </p>
        </div>
        <Button className="gap-2" onClick={() => router.push('/flowace')}>
          <Upload className="h-4 w-4" />
          Upload CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uploads</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUploads}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
            <p className="text-xs text-muted-foreground">
              Processed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">
              Processing errors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Upload</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.lastUpload}</div>
            <p className="text-xs text-muted-foreground">
              Most recent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upload History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>Complete history of CSV file uploads</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search uploads..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading upload history...</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No upload history found</p>
              <p className="text-sm mt-2">
                {searchTerm ? 'No results match your search' : 'Upload your first Flowace CSV file to get started'}
              </p>
              <Button className="mt-4 gap-2" onClick={() => router.push('/flowace')}>
                <Upload className="h-4 w-4" />
                Upload CSV File
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {entry.filename}
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.date ? new Date(entry.date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={entry.status === 'COMPLETED' ? 'default' : 'destructive'}
                        className={entry.status === 'COMPLETED' ? 'bg-green-600' : ''}
                      >
                        {entry.status === 'COMPLETED' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {entry.status === 'FAILED' && <XCircle className="h-3 w-3 mr-1" />}
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{entry.processedRecords}/{entry.totalRecords}</div>
                        {entry.errorRecords > 0 && (
                          <div className="text-red-600">{entry.errorRecords} errors</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(entry.uploadedAt).toLocaleDateString()}
                        <div className="text-muted-foreground">
                          {new Date(entry.uploadedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUpload(entry)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
