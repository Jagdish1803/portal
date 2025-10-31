import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/auth/me
 * Returns the current authenticated employee's information
 * Auto-links the account if not already linked
 */
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // First, check if already linked
    let employee = await prisma.employee.findFirst({
      where: { clerkUserId: userId }
    })

    // If not linked, try to auto-link based on Clerk username (employee code)
    if (!employee) {
      const user = await currentUser()
      
      if (user?.username) {
        // Try to find employee by username (case-insensitive)
        employee = await prisma.employee.findFirst({
          where: {
            employeeCode: {
              equals: user.username,
              mode: 'insensitive'
            }
          }
        })

        // If found, link the account
        if (employee && !employee.clerkUserId) {
          employee = await prisma.employee.update({
            where: { id: employee.id },
            data: { clerkUserId: userId }
          })
          console.log(`Auto-linked account: ${user.username} -> ${employee.employeeCode}`)
        }
      }

      // If still not found, try by email
      if (!employee && user?.emailAddresses?.[0]?.emailAddress) {
        const email = user.emailAddresses[0].emailAddress
        employee = await prisma.employee.findFirst({
          where: { email }
        })

        // If found, link the account
        if (employee && !employee.clerkUserId) {
          employee = await prisma.employee.update({
            where: { id: employee.id },
            data: { clerkUserId: userId }
          })
          console.log(`Auto-linked account by email: ${email} -> ${employee.employeeCode}`)
        }
      }
    }

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee record not found. Please contact admin.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      employee: {
        id: employee.id,
        employeeCode: employee.employeeCode,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        designation: employee.designation,
        isActive: employee.isActive,
        fullName: employee.fullName,
        passportPhoto: employee.passportPhoto,
      }
    })

  } catch (error) {
    console.error('Error fetching current employee:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
