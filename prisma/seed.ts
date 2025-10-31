import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create or update admin user zoot1086
  const admin = await prisma.employee.upsert({
    where: { employeeCode: 'zoot1086' },
    update: {
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      employeeCode: 'zoot1086',
      name: 'Admin User',
      email: 'admin@zootdigital.com',
      role: UserRole.ADMIN,
      department: 'Administration',
      designation: 'System Administrator',
      isActive: true,
      fullName: 'Admin User',
    },
  })

  console.log('✅ Admin user created/updated:', admin.employeeCode)

  // Optionally create a few test employees
  const testEmployees = [
    {
      employeeCode: 'zoot1087',
      name: 'Test Employee',
      email: 'employee@zootdigital.com',
      role: UserRole.EMPLOYEE,
      department: 'Development',
      designation: 'Software Developer',
    },
    {
      employeeCode: 'zoot1088',
      name: 'Jane Smith',
      email: 'jane@zootdigital.com',
      role: UserRole.EMPLOYEE,
      department: 'Design',
      designation: 'UI/UX Designer',
    },
  ]

  for (const emp of testEmployees) {
    const employee = await prisma.employee.upsert({
      where: { employeeCode: emp.employeeCode },
      update: {
        role: emp.role,
        isActive: true,
      },
      create: {
        ...emp,
        isActive: true,
        fullName: emp.name,
      },
    })
    console.log('✅ Test employee created/updated:', employee.employeeCode)
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
