import { PrismaClient } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

async function updateLinkedEmails() {
  try {
    console.log('Starting email update for linked accounts...\n')

    // Find all employees with Clerk accounts but company.com email
    const employees = await prisma.employee.findMany({
      where: {
        clerkUserId: { not: null },
        email: { contains: '@company.com' }
      },
      select: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        clerkUserId: true
      }
    })

    console.log(`Found ${employees.length} employees with company emails and linked Clerk accounts\n`)

    const client = await clerkClient()
    let updatedCount = 0
    let failedCount = 0

    for (const employee of employees) {
      try {
        console.log(`Processing ${employee.employeeCode} (${employee.name})...`)
        console.log(`  Current email: ${employee.email}`)
        console.log(`  Clerk user ID: ${employee.clerkUserId}`)

        // Get the Clerk user
        const clerkUser = await client.users.getUser(employee.clerkUserId!)
        const clerkEmail = clerkUser.emailAddresses?.[0]?.emailAddress

        if (clerkEmail) {
          console.log(`  Clerk email: ${clerkEmail}`)
          
          // Update the employee's email
          await prisma.employee.update({
            where: { id: employee.id },
            data: { email: clerkEmail }
          })

          console.log(`  ✅ Updated to: ${clerkEmail}\n`)
          updatedCount++
        } else {
          console.log(`  ⚠️  No email found in Clerk account\n`)
          failedCount++
        }
      } catch (error: any) {
        console.error(`  ❌ Error: ${error.message}\n`)
        failedCount++
      }
    }

    console.log('='.repeat(50))
    console.log('Summary:')
    console.log(`  Total processed: ${employees.length}`)
    console.log(`  Successfully updated: ${updatedCount}`)
    console.log(`  Failed: ${failedCount}`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateLinkedEmails()
