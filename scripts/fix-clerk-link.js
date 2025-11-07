const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkAndFixLink() {
  try {
    console.log('Checking Clerk link issue...\n')

    // Find all employees with similar codes
    const employees = await prisma.employee.findMany({
      where: {
        OR: [
          { employeeCode: 'Zoot1086' },
          { employeeCode: 'Zoot1006' }
        ]
      }
    })

    console.log('Found employees:')
    employees.forEach(emp => {
      console.log(`  - ${emp.employeeCode} (${emp.name}) | Clerk ID: ${emp.clerkUserId || 'Not linked'}`)
    })

    // Find which Clerk ID is currently being used
    const zoot1086 = employees.find(e => e.employeeCode === 'Zoot1086')
    const zoot1006 = employees.find(e => e.employeeCode === 'Zoot1006')

    if (zoot1086 && zoot1086.clerkUserId) {
      console.log('\n🔧 Fixing: Moving Clerk ID from Zoot1006 to Zoot1086')
      
      const currentClerkId = zoot1086.clerkUserId

      // Unlink from Zoot1006 if it has the same Clerk ID
      if (zoot1006 && zoot1006.clerkUserId === currentClerkId) {
        await prisma.employee.update({
          where: { employeeCode: 'Zoot1006' },
          data: { clerkUserId: null }
        })
        console.log('✅ Unlinked Zoot1006')
      }

      console.log('✅ Zoot1086 is correctly linked')
    } else if (zoot1006 && zoot1006.clerkUserId && zoot1086) {
      console.log('\n🔧 Fixing: Moving Clerk ID from Zoot1006 to Zoot1086')
      
      // Move the Clerk ID to the correct employee
      const clerkId = zoot1006.clerkUserId
      
      await prisma.employee.update({
        where: { employeeCode: 'Zoot1006' },
        data: { clerkUserId: null }
      })
      
      await prisma.employee.update({
        where: { employeeCode: 'Zoot1086' },
        data: { clerkUserId: clerkId }
      })
      
      console.log('✅ Moved Clerk link from Zoot1006 to Zoot1086')
    }

    console.log('\n✅ Fix complete! Final state:')
    const updatedEmployees = await prisma.employee.findMany({
      where: {
        OR: [
          { employeeCode: 'Zoot1086' },
          { employeeCode: 'Zoot1006' }
        ]
      }
    })
    
    updatedEmployees.forEach(emp => {
      console.log(`  - ${emp.employeeCode} (${emp.name}) | Clerk ID: ${emp.clerkUserId || 'Not linked'}`)
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndFixLink()
