import { PrismaClient } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

async function setupCurrentUser() {
  console.log('Setting up users...')
  
  // Get all Clerk users
  const client = await clerkClient()
  const users = await client.users.getUserList({ limit: 100 })

  for (const user of users.data) {
    if (!user.username) {
      console.log(`⏭️  Skipping ${user.emailAddresses[0]?.emailAddress} - no username`)
      continue
    }

    const employeeCode = user.username.toLowerCase()
    
    // Find employee in database
    const employee = await prisma.employee.findUnique({
      where: { employeeCode },
      select: {
        employeeCode: true,
        role: true,
        isActive: true,
        name: true,
      }
    })

    if (!employee) {
      console.log(`❌ Employee code '${employeeCode}' not found in database`)
      continue
    }

    // Update database link
    await prisma.employee.update({
      where: { employeeCode },
      data: { clerkUserId: user.id }
    })

    // Update Clerk metadata
    await client.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: employee.role,
        employeeCode: employee.employeeCode,
        isActive: employee.isActive,
      }
    })

    console.log(`✅ Setup ${employeeCode} (${employee.name}) as ${employee.role}`)
  }

  console.log('Done!')
}

setupCurrentUser()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
