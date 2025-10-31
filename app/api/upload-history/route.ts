import { NextRequest, NextResponse } from 'next/server'
import { supabase, UploadHistory } from '@/lib/supabase'

// Convert camelCase to snake_case for database
function toSnakeCase(obj: any) {
  const snakeCaseObj: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    snakeCaseObj[snakeKey] = value
  }
  return snakeCaseObj
}

// Convert snake_case to camelCase for frontend
function toCamelCase(obj: any) {
  const camelCaseObj: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    camelCaseObj[camelKey] = value
  }
  return camelCaseObj
}

// Simple file-based fallback for upload history
const UPLOAD_HISTORY_FILE = path.join(process.cwd(), 'data', 'upload-history.json')
import { promises as fs } from 'fs'
import path from 'path'

async function ensureDataDirectory() {
  const dataDir = path.dirname(UPLOAD_HISTORY_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

async function readUploadHistoryFromFile() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(UPLOAD_HISTORY_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

async function writeUploadHistoryToFile(history: any[]) {
  await ensureDataDirectory()
  await fs.writeFile(UPLOAD_HISTORY_FILE, JSON.stringify(history, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const uploadEntry = await request.json()

    console.log('Received upload entry:', uploadEntry)

    // For now, use file storage only
    console.log('Using file storage for upload history')
    const existingHistory = await readUploadHistoryFromFile()
    const updatedHistory = [...existingHistory, uploadEntry]
    await writeUploadHistoryToFile(updatedHistory)

    console.log('Successfully saved upload history to file')

    return NextResponse.json({
      success: true,
      message: 'Upload history saved successfully',
      data: uploadEntry
    })

  } catch (error) {
    console.error('Error saving upload history:', error)
    return NextResponse.json(
      { error: 'Failed to save upload history' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // For now, use file storage only
    console.log('Using file storage for upload history')
    const history = await readUploadHistoryFromFile()
    
    // Sort by uploadedAt descending (most recent first)
    const sortedHistory = history.sort((a: any, b: any) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )

    console.log('Fetched upload history from file:', history?.length || 0)

    return NextResponse.json({
      success: true,
      history: sortedHistory || []
    })

  } catch (error) {
    console.error('Error fetching upload history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upload history' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      )
    }

    // For now, use file storage only
    console.log('Using file storage for upload history delete')
    const existingHistory = await readUploadHistoryFromFile()
    const filteredHistory = existingHistory.filter((entry: any) => entry.id !== id)

    if (existingHistory.length === filteredHistory.length) {
      return NextResponse.json(
        { error: 'Upload history not found' },
        { status: 404 }
      )
    }

    await writeUploadHistoryToFile(filteredHistory)
    console.log('Successfully deleted upload history from file:', id)

    return NextResponse.json({
      success: true,
      message: 'Upload history deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting upload history:', error)
    return NextResponse.json(
      { error: 'Failed to delete upload history' },
      { status: 500 }
    )
  }
}