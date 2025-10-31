import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic database connection
    const { data, error } = await supabase
      .from('attendance_records')
      .select('count(*)', { count: 'exact', head: true })
    
    if (error) {
      console.error('Database connection error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      recordCount: data || 0
    })
    
  } catch (error) {
    console.error('Test database error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to database',
      details: error
    }, { status: 500 })
  }
}