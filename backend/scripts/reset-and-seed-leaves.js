// backend/scripts/reset-and-seed-leaves.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetAndSeed() {
  console.log('🧹 Clearing leave requests...');
  await prisma.leave_requests.deleteMany({});
  console.log('✅ Cleared leave requests.\n');

  const employees = await prisma.users.findMany({
    where: { role: 'employee' }
  });

  if (employees.length === 0) {
    console.log('⚠️ No employees found. Seed users first.');
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const leaveTypes = ['vacation', 'sick'];
  const statuses = ['approved', 'pending'];
  const reasons = ['Personal vacation', 'Not feeling well', 'Family event', 'Rest'];

  console.log(`🌱 Seeding leaves for ${employees.length} employees for ${year}-${month + 1}...`);

  for (const employee of employees) {
    // Add a leave for today for every employee to ensure it's visible
    const pad = (n) => String(n).padStart(2, '0');
    const todayStr = `${year}-${pad(month + 1)}-${pad(now.getDate())}`;
    
    await prisma.leave_requests.create({
      data: {
        user_id: employee.id,
        leave_date: new Date(year, month, now.getDate()),
        leave_type: 'vacation',
        status: 'approved',
        reason: 'Testing today visibility'
      }
    }).catch(() => {}); // Ignore if already exists

    // Add 2-3 more leaves for each employee in the current month
    const count = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < count; i++) {
      let day = Math.floor(Math.random() * 28) + 1;
      if (day === now.getDate()) day = (day % 28) + 1; // avoid duplicate with today
      
      await prisma.leave_requests.create({
        data: {
          user_id: employee.id,
          leave_date: new Date(year, month, day),
          leave_type: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          reason: reasons[Math.floor(Math.random() * reasons.length)]
        }
      }).catch(() => {});
    }
  }

  console.log('✅ Seeding complete!');
  await prisma.$disconnect();
}

resetAndSeed().catch(err => {
  console.error(err);
  process.exit(1);
});
