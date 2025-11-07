const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getCurrentClerkUser() {
  try {
    console.log('Finding your current Clerk session...\n')

    // List all employees with their Clerk links
    const allEmployees = await prisma.employee.findMany({
      where: {
        clerkUserId: { not: null }
      },
      select: {
        employeeCode: true,
        name: true,
        clerkUserId: true
      }
    })

    console.log('Currently linked employees:')
    if (allEmployees.length === 0) {
      console.log('  None')
    } else {
      allEmployees.forEach(emp => {
        console.log(`  - ${emp.employeeCode} (${emp.name}) | Clerk: ${emp.clerkUserId}`)
      })
    }

    console.log('\n📋 To fix your account, I need to know your Clerk User ID.')
    console.log('You can find it by:')
    console.log('1. Opening browser DevTools (F12)')
    console.log('2. Going to Console tab')
    console.log('3. Run this code to get your Clerk User ID')
    console.log('\nOr, simply refresh the page and the auto-linking should work!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

getCurrentClerkUser()
