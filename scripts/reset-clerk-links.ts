import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetClerkLinks() {
  console.log('Resetting all Clerk user links...')
  
  const result = await prisma.employee.updateMany({
    data: {
      clerkUserId: null
    }
  })

  console.log(`✅ Reset ${result.count} employee Clerk links`)
  console.log('All employees can now be linked again!')
}

resetClerkLinks()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
