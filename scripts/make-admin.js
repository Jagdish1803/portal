const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function makeAdmin() {
  try {
    console.log('Updating Zoot1086 to ADMIN role...\n')

    const employee = await prisma.employee.update({
      where: { employeeCode: 'Zoot1086' },
      data: { role: 'ADMIN' }
    })

    console.log('✅ Success!')
    console.log('Employee:', employee.name)
    console.log('Code:', employee.employeeCode)
    console.log('Role:', employee.role)
    console.log('\nYou are now an ADMIN!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

makeAdmin()
