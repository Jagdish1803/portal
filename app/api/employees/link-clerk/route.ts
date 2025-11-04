import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { currentUser } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// PATCH /api/employees/link-clerk - Link current Clerk user to employee record
export async function PATCH(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { employeeCode } = body

    if (!employeeCode) {
      return NextResponse.json(
        { success: false, error: 'Employee code is required' },
        { status: 400 }
      )
    }

    // Find employee by code
    const employee = await prisma.employee.findUnique({
      where: { employeeCode }
    })

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Update with Clerk user ID
    const updatedEmployee = await prisma.employee.update({
      where: { employeeCode },
      data: { clerkUserId: user.id }
    })

    return NextResponse.json({
      success: true,
      data: updatedEmployee,
      message: 'Successfully linked Clerk account to employee'
    })
  } catch (error: any) {
    console.error('Error linking Clerk user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to link Clerk user',
        message: error.message,
      },
      { status: 500 }
    )
  }
}
