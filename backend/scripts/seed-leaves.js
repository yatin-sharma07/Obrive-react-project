// backend/scripts/seed-leaves.js
require('dotenv').config();
const { prisma } = require('../src/config/db');

async function seedLeaves() {
  console.log('🌱 Starting leave requests seed...\n');

  try {
    // First, let's get all employees
    const employees = await prisma.users.findMany({
      where: { role: 'employee' },
      select: { id: true, name: true, email: true },
    });

    if (employees.length === 0) {
      console.log('⚠️  No employees found in database. Please seed users first.');
      process.exit(1);
    }

    console.log(`📋 Found ${employees.length} employees. Starting to generate leave requests...\n`);

    // Generate realistic vacation data
    const leaveTypes = ['vacation', 'sick'];
    const statuses = ['approved', 'pending', 'rejected'];
    const reasons = [
      'Annual vacation',
      'Personal reasons',
      'Medical appointment',
      'Family emergency',
      'Rest and relaxation',
      'Personal business',
      'Doctor visit',
      'Conference attendance',
      'Training program',
      'Travel plans',
    ];

    // Current month bounds
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    let totalCreated = 0;
    const leaveRequests = [];

    // Create 3-5 leave requests per employee for the current month
    for (const employee of employees) {
      const requestCount = Math.floor(Math.random() * 3) + 2; // 2-4 requests per employee

      for (let i = 0; i < requestCount; i++) {
        // Random date in current month
        const randomDay = Math.floor(Math.random() * (monthEnd.getDate() - 1)) + 1;
        const leaveDate = new Date(now.getFullYear(), now.getMonth(), randomDay);

        // Random leave type (mostly vacation, sometimes sick)
        const leaveType = Math.random() > 0.2 ? 'vacation' : 'sick';

        // Random reason
        const reason = reasons[Math.floor(Math.random() * reasons.length)];

        // Higher chance of approved status
        const status = Math.random() > 0.15 ? 'approved' : (Math.random() > 0.5 ? 'pending' : 'rejected');

        leaveRequests.push({
          user_id: employee.id,
          leave_date: leaveDate,
          leave_type: leaveType,
          reason: reason,
          status: status,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in past week
        });
      }
    }

    // Remove duplicates (same user, same date)
    const uniqueLeaves = [];
    const seen = new Set();

    for (const leave of leaveRequests) {
      const key = `${leave.user_id}-${leave.leave_date.toISOString().split('T')[0]}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLeaves.push(leave);
      }
    }

    console.log(`✍️  Creating ${uniqueLeaves.length} leave requests...\n`);

    // Batch insert (Prisma doesn't have native batch insert, so we'll do it one by one)
    for (const leave of uniqueLeaves) {
      try {
        await prisma.leave_requests.create({
          data: {
            user_id: leave.user_id,
            leave_date: leave.leave_date,
            leave_type: leave.leave_type,
            reason: leave.reason,
            status: leave.status,
            created_at: leave.created_at,
          },
        });
        totalCreated++;
      } catch (err) {
        // Ignore unique constraint errors (duplicate leave_date for same user)
        if (err.code !== 'P2002') {
          console.error(`❌ Error creating leave request for user ${leave.user_id}:`, err.message);
        }
      }
    }

    console.log(`\n✅ Successfully created ${totalCreated} leave requests!\n`);

    // Show summary statistics
    console.log('📊 Leave Requests Summary:');
    const stats = await prisma.leave_requests.groupBy({
      by: ['leave_type', 'status'],
      _count: true,
    });

    for (const stat of stats) {
      console.log(`  - ${stat.leave_type} (${stat.status}): ${stat._count} requests`);
    }

    const totalLeaves = await prisma.leave_requests.count();
    console.log(`\n📈 Total leave requests in database: ${totalLeaves}\n`);

  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedLeaves();
