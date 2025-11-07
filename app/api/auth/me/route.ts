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

    // If not linked, try aggressive auto-linking
    if (!employee) {
      const user = await currentUser()
      let foundEmployee = null

      // Strategy 1: Try to find by username (employee code) - case insensitive
      if (user?.username) {
        foundEmployee = await prisma.employee.findFirst({
          where: {
            employeeCode: {
              equals: user.username,
              mode: 'insensitive'
            },
            isActive: true
          }
        })

        if (foundEmployee) {
          console.log(`Found employee by username: ${user.username} -> ${foundEmployee.employeeCode}`)
        }
      }

      // Strategy 2: Try by email if username didn't work
      if (!foundEmployee && user?.emailAddresses?.[0]?.emailAddress) {
        const email = user.emailAddresses[0].emailAddress
        foundEmployee = await prisma.employee.findFirst({
          where: { 
            email: {
              equals: email,
              mode: 'insensitive'
            },
            isActive: true
          }
        })

        if (foundEmployee) {
          console.log(`Found employee by email: ${email} -> ${foundEmployee.employeeCode}`)
        }
      }

      // Strategy 3: Try partial match on employee code from email (e.g., zoot1086@company.com -> Zoot1086)
      if (!foundEmployee && user?.emailAddresses?.[0]?.emailAddress) {
        const email = user.emailAddresses[0].emailAddress
        const emailPrefix = email.split('@')[0] // Get part before @
        
        foundEmployee = await prisma.employee.findFirst({
          where: {
            employeeCode: {
              equals: emailPrefix,
              mode: 'insensitive'
            },
            isActive: true
          }
        })

        if (foundEmployee) {
          console.log(`Found employee by email prefix: ${emailPrefix} -> ${foundEmployee.employeeCode}`)
        }
      }

      // If we found an employee, link them (even if they're already linked to someone else)
      if (foundEmployee) {
        // If this employee is already linked to a different Clerk account, unlink it first
        if (foundEmployee.clerkUserId && foundEmployee.clerkUserId !== userId) {
          console.log(`Employee ${foundEmployee.employeeCode} was linked to ${foundEmployee.clerkUserId}, unlinking...`)
        }

        // Link/relink the account
        employee = await prisma.employee.update({
          where: { id: foundEmployee.id },
          data: { 
            clerkUserId: userId,
            lastLogin: new Date()
          }
        })
        
        console.log(`✅ Auto-linked: Clerk user ${userId} -> ${employee.employeeCode}`)
      }
    } else {
      // Update last login for already linked accounts
      await prisma.employee.update({
        where: { id: employee.id },
        data: { lastLogin: new Date() }
      })
    }

    if (!employee) {
      // Get user info for better error message
      const user = await currentUser()
      const username = user?.username || 'unknown'
      const email = user?.emailAddresses?.[0]?.emailAddress || 'unknown'
      
      return NextResponse.json(
        { 
          error: 'Employee record not found. Please contact admin to link your account.',
          details: {
            clerkUsername: username,
            clerkEmail: email,
            message: 'No employee found with matching employee code or email. An admin needs to link your account.'
          }
        },
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
