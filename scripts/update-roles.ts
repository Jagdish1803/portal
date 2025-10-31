import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAllRolesToEmployee() {
  try {
    console.log('Fetching all employees...');
    
    // Get all employees with their current roles
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        employeeCode: true,
        name: true,
        role: true,
      },
    });

    console.log(`Found ${employees.length} employees`);
    console.log('\nCurrent roles:');
    employees.forEach(emp => {
      console.log(`${emp.employeeCode} - ${emp.name}: ${emp.role}`);
    });

    // Update all employees to have role "EMPLOYEE"
    const result = await prisma.employee.updateMany({
      where: {
        role: {
          not: 'EMPLOYEE'
        }
      },
      data: {
        role: 'EMPLOYEE',
      },
    });

    console.log(`\n✓ Updated ${result.count} employees to role "EMPLOYEE"`);

    // Verify the changes
    const updatedEmployees = await prisma.employee.findMany({
      select: {
        id: true,
        employeeCode: true,
        name: true,
        role: true,
      },
    });

    console.log('\nUpdated roles:');
    updatedEmployees.forEach(emp => {
      console.log(`${emp.employeeCode} - ${emp.name}: ${emp.role}`);
    });

  } catch (error) {
    console.error('Error updating roles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateAllRolesToEmployee()
  .then(() => {
    console.log('\n✓ Successfully updated all employee roles');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to update roles:', error);
    process.exit(1);
  });
