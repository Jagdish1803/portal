/**
 * Script to link a Clerk user to an employee record
 * Run this with: npx tsx scripts/link-user.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function linkUser() {
  try {
    // Get Clerk User ID from environment or command line
    const clerkUserId = process.argv[2]
    const employeeCode = process.argv[3]

    if (!clerkUserId || !employeeCode) {
      console.log('Usage: npx tsx scripts/link-user.ts <clerkUserId> <employeeCode>')
      console.log('Example: npx tsx scripts/link-user.ts user_2xxx Zoot1086')
      process.exit(1)
    }

    // Find the employee
    const employee = await prisma.employee.findUnique({
      where: { employeeCode }
    })

    if (!employee) {
      console.error(`❌ Employee not found with code: ${employeeCode}`)
      process.exit(1)
    }

    // Check if already linked
    if (employee.clerkUserId) {
      console.log(`⚠️  Employee ${employeeCode} is already linked to Clerk user: ${employee.clerkUserId}`)
      
      if (employee.clerkUserId === clerkUserId) {
        console.log('✅ Already linked to the same user - nothing to do!')
        process.exit(0)
      } else {
        console.log('❌ Cannot link - employee is linked to a different user')
        process.exit(1)
      }
    }

    // Link the user
    await prisma.employee.update({
      where: { employeeCode },
      data: { clerkUserId }
    })

    console.log(`✅ Successfully linked Clerk user ${clerkUserId} to employee ${employeeCode} (${employee.name})`)
    console.log(`   Role: ${employee.role}`)
    console.log(`   Email: ${employee.email}`)

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

linkUser()
