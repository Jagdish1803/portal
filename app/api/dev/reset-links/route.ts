import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * DEVELOPMENT ONLY - Reset all clerk user links
 * Use this to clear all clerkUserId fields when testing
 */
export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 })
  }

  try {
    const result = await prisma.employee.updateMany({
      data: {
        clerkUserId: null
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Reset ${result.count} employee clerk links` 
    })
  } catch (error) {
    console.error('Error resetting:', error)
    return NextResponse.json({ error: 'Failed to reset' }, { status: 500 })
  }
}
