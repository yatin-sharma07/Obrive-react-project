// backend/scripts/populate-historical-leaves.js
require('dotenv').config();
const { prisma } = require('../src/config/db');

async function populateHistoricalLeaves() {
  console.log('📅 Populating historical leave data...\n');

  try {
    const employees = await prisma.users.findMany({
      where: { role: 'employee' },
      select: { id: true, name: true },
    });

    if (employees.length === 0) {
      console.log('⚠️  No employees found');
      process.exit(1);
    }

    // Generate historical leave data for past and current months
    const leaveTypes = ['vacation', 'sick'];
    const statuses = ['approved', 'pending'];
    const reasons = [
      'Annual vacation planning',
      'Personal medical appointment',
      'Family vacation',
      'Rest and recovery',
      'Doctor consultation',
      'Emergency leave',
      'Planned vacation',
      'Sick leave',
      'Medical checkup',
      'Personal time off',
    ];

    let created = 0;
    let skipped = 0;

    // Generate leaves for multiple months (past 3 months + current month)
    const months = [-3, -2, -1, 0];

    for (const monthOffset of months) {
      const date = new Date();
      date.setMonth(date.getMonth() + monthOffset);
      const year = date.getFullYear();
      const month = date.getMonth();

      // Get days in this month
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Create 2-3 leaves per employee per month
      for (const employee of employees) {
        const leavesPerMonth = Math.floor(Math.random() * 2) + 2; // 2-3 leaves per month

        for (let i = 0; i < leavesPerMonth; i++) {
          const day = Math.floor(Math.random() * daysInMonth) + 1;
          const leaveDate = new Date(year, month, day);

          const leaveType = Math.random() > 0.7 ? 'sick' : 'vacation';
          const reason = reasons[Math.floor(Math.random() * reasons.length)];
          const status = Math.random() > 0.1 ? 'approved' : 'pending';

          try {
            await prisma.leave_requests.create({
              data: {
                user_id: employee.id,
                leave_date: leaveDate,
                leave_type: leaveType,
                reason: reason,
                status: status,
              },
            });
            created++;
          } catch (err) {
            if (err.code === 'P2002') {
              skipped++; // Duplicate unique constraint
            } else {
              console.error(`Error: ${err.message}`);
            }
          }
        }
      }
    }

    console.log(`✅ Created ${created} leave requests`);
    console.log(`⏭️  Skipped ${skipped} duplicates (same user, same date)\n`);

    // Show final statistics
    const total = await prisma.leave_requests.count();
    const byType = await prisma.leave_requests.groupBy({
      by: ['leave_type'],
      _count: true,
    });

    const byStatus = await prisma.leave_requests.groupBy({
      by: ['status'],
      _count: true,
    });

    console.log('📊 Final Statistics:');
    console.log(`  Total leave requests: ${total}`);
    console.log('\n  By Type:');
    byType.forEach((t) => {
      console.log(`    - ${t.leave_type}: ${t._count}`);
    });
    console.log('\n  By Status:');
    byStatus.forEach((s) => {
      console.log(`    - ${s.status}: ${s._count}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

populateHistoricalLeaves();
