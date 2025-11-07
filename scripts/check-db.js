const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Checking database...\n')

    // Get employee
    const employee = await prisma.employee.findUnique({
      where: { employeeCode: 'Zoot1086' }
    })

    if (!employee) {
      console.log('❌ Employee Zoot1086 not found')
      return
    }

    console.log('✅ Employee:', employee.name, '| ID:', employee.id)

    // Count all attendance records
    const totalRecords = await prisma.attendanceRecord.count()
    console.log('📊 Total attendance records in DB:', totalRecords)

    // Count records for this employee
    const employeeRecords = await prisma.attendanceRecord.count({
      where: { employeeId: employee.id }
    })
    console.log('📊 Records for', employee.employeeCode + ':', employeeRecords)

    if (employeeRecords === 0) {
      console.log('\n⚠️  Creating sample attendance records...')
      
      const today = new Date()
      const records = []

      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)

        const checkIn = new Date(date)
        checkIn.setHours(9, 0, 0, 0)

        const checkOut = new Date(date)
        checkOut.setHours(18, 0, 0, 0)

        records.push({
          employeeId: employee.id,
          date: date,
          status: 'PRESENT',
          checkInTime: checkIn,
          checkOutTime: checkOut,
          totalHours: 9.0,
          overtime: 0.0
        })
      }

      await prisma.attendanceRecord.createMany({ data: records })
      console.log('✅ Created', records.length, 'attendance records\n')
    } else {
      console.log('\n📋 Recent records:')
      const recent = await prisma.attendanceRecord.findMany({
        where: { employeeId: employee.id },
        orderBy: { date: 'desc' },
        take: 5
      })
      recent.forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.date.toISOString().split('T')[0]} - ${r.status} - ${r.totalHours}h`)
      })
    }

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
