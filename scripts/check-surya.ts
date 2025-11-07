import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSurya() {
  try {
    const surya = await prisma.employee.findUnique({
      where: { employeeCode: 'Zoot1085' },
      select: {
        id: true,
        employeeCode: true,
        name: true,
        fullName: true,
        email: true,
        clerkUserId: true,
        isActive: true
      }
    })

    console.log('Surya (Zoot1085) details:')
    console.log(JSON.stringify(surya, null, 2))

    // Find all employees with Clerk accounts
    const allLinked = await prisma.employee.findMany({
      where: {
        clerkUserId: { not: null }
      },
      select: {
        employeeCode: true,
        name: true,
        email: true,
        clerkUserId: true
      }
    })

    console.log('\nAll linked accounts:')
    console.log(JSON.stringify(allLinked, null, 2))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSurya()
