import { prisma } from '../lib/prisma'

async function checkAttendance() {
  try {
    // Find the employee Zoot1086
    const employee = await prisma.employee.findUnique({
      where: { employeeCode: 'Zoot1086' }
    })

    if (!employee) {
      console.log('❌ Employee Zoot1086 not found')
      return
    }

    console.log('✅ Found employee:', employee.name, '(ID:', employee.id, ')')

    // Check attendance records
    const records = await prisma.attendanceRecord.findMany({
      where: { employeeId: employee.id },
      orderBy: { date: 'desc' },
      take: 10
    })

    console.log('\n📊 Attendance Records:', records.length)
    
    if (records.length === 0) {
      console.log('\n⚠️  No attendance records found for this employee!')
      console.log('Creating sample attendance records...\n')

      // Create sample records for the past week
      const today = new Date()
      const sampleRecords = []

      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)

        const checkIn = new Date(date)
        checkIn.setHours(9, 0, 0, 0)

        const checkOut = new Date(date)
        checkOut.setHours(18, 0, 0, 0)

        sampleRecords.push({
          employeeId: employee.id,
          date: date,
          status: 'PRESENT' as const,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          totalHours: 9.0,
          overtime: 0.0,
          hasBeenEdited: false
        })
      }

      await prisma.attendanceRecord.createMany({
        data: sampleRecords
      })

      console.log('✅ Created', sampleRecords.length, 'sample attendance records')
    } else {
      console.log('\nRecent records:')
      records.forEach((record, i) => {
        console.log(`${i + 1}. ${record.date.toISOString().split('T')[0]} - ${record.status} - ${record.totalHours}h`)
      })
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAttendance()
