// backend/add-leave-requests.js
require('dotenv').config();
const { prisma } = require('./src/config/db');

async function addLeaveRequests() {
  try {
    console.log('📝 Adding sample leave requests...\n');

    // Get existing users
    const users = await prisma.users.findMany({
      where: {
        role: 'employee'
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    console.log('Found users:', users.map(u => `${u.name} (${u.email})`));

    const leaveRequests = [
      {
        user_id: users[0].id, // Karn Singh
        leave_date: new Date('2026-05-05'),
        leave_type: 'vacation',
        reason: 'Family vacation to Goa',
        status: 'pending'
      },
      {
        user_id: users[1].id, // Yatin Sharma
        leave_date: new Date('2026-05-10'),
        leave_type: 'sick',
        reason: 'Medical appointment',
        status: 'pending'
      },
      {
        user_id: users[2].id, // Priya Verma
        leave_date: new Date('2026-05-15'),
        leave_type: 'vacation',
        reason: 'Personal leave',
        status: 'approved'
      },
      {
        user_id: users[3].id, // Rahul Patel
        leave_date: new Date('2026-05-20'),
        leave_type: 'vacation',
        reason: 'Wedding anniversary',
        status: 'rejected'
      }
    ];

    for (const leaveData of leaveRequests) {
      const leave = await prisma.leave_requests.create({
        data: leaveData,
        include: {
          users: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
      console.log(`  ✅ Created leave request for ${leave.users.name} on ${leave.leave_date.toDateString()} (${leave.status})`);
    }

    console.log('\n✅ Leave requests added successfully!');
    console.log('📊 Total leave requests created:', leaveRequests.length);

  } catch (error) {
    console.error('❌ Error adding leave requests:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addLeaveRequests();