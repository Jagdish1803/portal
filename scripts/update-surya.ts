import { PrismaClient } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

async function updateSuryaEmail() {
  try {
    const surya = await prisma.employee.findUnique({
      where: { employeeCode: 'Zoot1085' },
      select: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        clerkUserId: true
      }
    })

    if (!surya || !surya.clerkUserId) {
      console.log('Surya not found or not linked to Clerk')
      return
    }

    console.log('Current Surya details:')
    console.log(`  Name: ${surya.name}`)
    console.log(`  Email: ${surya.email}`)
    console.log(`  Clerk ID: ${surya.clerkUserId}`)

    try {
      const client = await clerkClient()
      const clerkUser = await client.users.getUser(surya.clerkUserId)
      
      const clerkEmail = clerkUser.emailAddresses?.[0]?.emailAddress
      const clerkFullName = clerkUser.fullName || clerkUser.firstName

      console.log('\nClerk account details:')
      console.log(`  Email: ${clerkEmail}`)
      console.log(`  Full Name: ${clerkFullName}`)

      if (clerkEmail) {
        const updated = await prisma.employee.update({
          where: { id: surya.id },
          data: { 
            email: clerkEmail,
            fullName: clerkFullName || surya.name
          }
        })

        console.log('\n✅ Successfully updated:')
        console.log(`  New email: ${updated.email}`)
        console.log(`  New fullName: ${updated.fullName}`)
      } else {
        console.log('\n⚠️  No email found in Clerk account')
      }
    } catch (error: any) {
      console.error(`\n❌ Error fetching Clerk user: ${error.message}`)
    }

  } catch (error) {
    console.error('Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateSuryaEmail()
