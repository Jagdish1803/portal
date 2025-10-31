import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Checking Supabase connection and database setup...')
    
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('attendance_records')
      .select('*')
      .limit(1)

    if (healthError) {
      console.error('Database error:', healthError)
      
      if (healthError.message?.includes('relation "attendance_records" does not exist') || 
          healthError.code === 'PGRST116' || 
          healthError.code === '42P01') {
        return NextResponse.json({
          connected: true,
          tablesExist: false,
          error: 'Database tables not found',
          solution: 'Please run the database setup script in Supabase SQL Editor',
          setupSql: `
-- Copy and paste this SQL in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS attendance_records (
  id TEXT PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  employee_code TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'WFH_APPROVED')) NOT NULL,
  check_in_time TIME,
  break_in_time TIME,
  break_out_time TIME,
  check_out_time TIME,
  total_hours DECIMAL(5,2) DEFAULT 0,
  shift_time TIME DEFAULT '10:00',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS upload_history (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  upload_date DATE NOT NULL,
  record_count INTEGER NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL,
  file_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow all operations on attendance_records" ON attendance_records FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on upload_history" ON upload_history FOR ALL USING (true);
          `
        })
      }
      
      return NextResponse.json({
        connected: false,
        error: healthError.message,
        code: healthError.code
      })
    }

    // If we get here, tables exist and connection works
    const { count: recordCount } = await supabase
      .from('attendance_records')
      .select('*', { count: 'exact', head: true })

    const { count: uploadCount } = await supabase
      .from('upload_history')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      connected: true,
      tablesExist: true,
      attendanceRecords: recordCount || 0,
      uploadHistory: uploadCount || 0,
      message: 'Database setup is complete and working!'
    })

  } catch (error) {
    console.error('Setup check failed:', error)
    return NextResponse.json({
      connected: false,
      error: 'Failed to connect to database',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}