const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixMyAccount() {
  try {
    console.log('Fixing your account link...\n')

    const clerkId = 'user_34XkmdxoVGQ0Ja817kIAYJ3D30L'

    // Step 1: Unlink from Karuna (ZOOT1006)
    console.log('1. Unlinking from ZOOT1006 (Karuna)...')
    await prisma.employee.update({
      where: { employeeCode: 'ZOOT1006' },
      data: { clerkUserId: null }
    })
    console.log('   ✅ Unlinked')

    // Step 2: Link to Jagdish (Zoot1086)
    console.log('2. Linking to Zoot1086 (Jagdish)...')
    await prisma.employee.update({
      where: { employeeCode: 'Zoot1086' },
      data: { 
        clerkUserId: clerkId,
        lastLogin: new Date()
      }
    })
    console.log('   ✅ Linked')

    console.log('\n✅ SUCCESS! Your account is now correctly linked to Zoot1086')
    console.log('\n🔄 Please refresh your browser to see the changes!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

fixMyAccount()
