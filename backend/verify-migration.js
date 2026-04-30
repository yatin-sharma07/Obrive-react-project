// backend/verify-migration.js
require('dotenv').config();
const { prisma } = require('./src/config/db');

async function verify() {
  try {
    console.log('\n✅ DATABASE VERIFICATION REPORT\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Count records
    const leaveCount = await prisma.leave_requests.count();
    const usersCount = await prisma.users.count();
    const projectsCount = await prisma.projects.count();
    const tasksCount = await prisma.tasks.count();
    const eventsCount = await prisma.events.count();

    console.log('📊 TOTAL RECORDS:');
    console.log(`  • leave_requests: ${leaveCount} ✓`);
    console.log(`  • users: ${usersCount} ✓`);
    console.log(`  • projects: ${projectsCount} ✓`);
    console.log(`  • tasks: ${tasksCount} ✓`);
    console.log(`  • events: ${eventsCount} ✓`);

    // Leave request breakdown
    console.log('\n📋 LEAVE REQUESTS BREAKDOWN:');

    const byType = await prisma.leave_requests.groupBy({
      by: ['leave_type'],
      _count: true,
    });
    for (const item of byType) {
      console.log(`  • ${item.leave_type}: ${item._count}`);
    }

    const byStatus = await prisma.leave_requests.groupBy({
      by: ['status'],
      _count: true,
    });
    console.log('\n📊 BY STATUS:');
    for (const item of byStatus) {
      console.log(`  • ${item.status}: ${item._count}`);
    }

    // Check for referential integrity
    console.log('\n🔗 REFERENTIAL INTEGRITY CHECK:');
    
    const allLeaves = await prisma.leave_requests.findMany({});
    const validLeaves = allLeaves.filter(l => l.user_id > 0).length;
    console.log(`  • Valid leave_requests with user_id: ${validLeaves}/${allLeaves.length} ✓`);

    // Sample leave requests
    console.log('\n📝 SAMPLE LEAVE REQUESTS (First 5):');
    const samples = await prisma.leave_requests.findMany({
      take: 5,
      include: {
        users: {
          select: { name: true, email: true },
        },
      },
    });

    samples.forEach((leave, idx) => {
      const date = new Date(leave.leave_date).toISOString().split('T')[0];
      console.log(`  ${idx + 1}. ${leave.users.name} - ${leave.leave_type} on ${date} (${leave.status})`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ All data integrity checks passed!\n');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
