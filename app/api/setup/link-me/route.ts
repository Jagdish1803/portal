import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

/**
 * Quick setup endpoint - call once to link your account
 * GET /api/setup/link-me
 */
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Find any employee without a clerkUserId
    const unlinkedEmployees = await prisma.employee.findMany({
      where: {
        clerkUserId: null,
        isActive: true
      },
      select: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        role: true
      }
    })

    // Also check if this user is already linked
    const alreadyLinked = await prisma.employee.findFirst({
      where: { clerkUserId: userId }
    })

    if (alreadyLinked) {
      return NextResponse.json({
        success: true,
        message: 'Already linked',
        employee: alreadyLinked
      })
    }

    return NextResponse.json({
      unlinkedEmployees,
      userId,
      message: 'Call POST with employeeId to link'
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/setup/link-me
 * Body: { employeeId: number }
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { employeeId } = await request.json()
    
    const employee = await prisma.employee.update({
      where: { id: parseInt(employeeId) },
      data: { clerkUserId: userId }
    })

    return NextResponse.json({
      success: true,
      message: 'Linked successfully',
      employee
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
