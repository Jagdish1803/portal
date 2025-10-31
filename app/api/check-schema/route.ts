import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Checking actual database schema...')
    
    // Try to insert a test record to see what columns are expected
    const testRecord = {
      id: 'test_schema_check',
      employee_id: 999,
      employee_code: 'TEST',
      employee_name: 'Test Employee',
      date: '2025-01-01',
      status: 'PRESENT',
      check_in_time: '09:00',
      break_in_time: null,
      break_out_time: null,
      check_out_time: '18:00',
      total_hours: 8.0,
      shift_time: '09:00'
    }
    
    // Try to insert and see what happens
    const { data: insertResult, error: insertError } = await supabase
      .from('attendance_records')
      .insert([testRecord])
      .select()
    
    if (insertError) {
      console.log('Insert error (this tells us about schema):', insertError.message)
      
      // Try to query existing data to see current structure
      const { data: existingData, error: queryError } = await supabase
        .from('attendance_records')
        .select('*')
        .limit(1)
      
      return NextResponse.json({
        insertError: insertError.message,
        insertErrorCode: insertError.code,
        existingData: existingData || [],
        queryError: queryError?.message || null,
        testRecord: testRecord,
        suggestion: 'Check if table columns match the expected schema'
      })
    }
    
    // If insert worked, clean up and return success
    await supabase
      .from('attendance_records')
      .delete()
      .eq('id', 'test_schema_check')
    
    return NextResponse.json({
      success: true,
      message: 'Database schema is correct',
      insertedRecord: insertResult
    })
    
  } catch (error) {
    console.error('Schema check failed:', error)
    return NextResponse.json({
      error: 'Failed to check database schema',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}