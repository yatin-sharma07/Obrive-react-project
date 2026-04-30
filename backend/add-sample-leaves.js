// Script to add sample leave data for testing
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addSampleLeaves() {
  try {
    console.log('📝 Adding sample leave data...')

    // Get some users first
    const users = await prisma.users.findMany({ take: 5 })

    if (users.length === 0) {
      console.log('❌ No users found in database. Please create users first.')
      process.exit(1)
    }

    console.log(`Found ${users.length} users. Adding leaves...`)

    // Add vacation for first user (September 2026)
    await prisma.leaves.create({
      data: {
        user_id: users[0].id,
        leave_type: 'vacation',
        start_date: new Date('2026-09-05'),
        end_date: new Date('2026-09-10'),
        status: 'approved',
        reason: 'Summer vacation',
      },
    })
    console.log(`✅ Added vacation for ${users[0].name}`)

    // Add pending vacation for second user
    if (users[1]) {
      await prisma.leaves.create({
        data: {
          user_id: users[1].id,
          leave_type: 'vacation',
          start_date: new Date('2026-09-12'),
          end_date: new Date('2026-09-15'),
          status: 'pending',
          reason: 'Pending vacation request',
        },
      })
      console.log(`✅ Added pending vacation for ${users[1].name}`)
    }

    // Add sick leave
    if (users[2]) {
      await prisma.leaves.create({
        data: {
          user_id: users[2].id,
          leave_type: 'sick_leave',
          start_date: new Date('2026-09-08'),
          end_date: new Date('2026-09-09'),
          status: 'approved',
          reason: 'Medical appointment',
        },
      })
      console.log(`✅ Added sick leave for ${users[2].name}`)
    }

    // Add work remotely
    if (users[3]) {
      await prisma.leaves.create({
        data: {
          user_id: users[3].id,
          leave_type: 'work_remotely',
          start_date: new Date('2026-09-16'),
          end_date: new Date('2026-09-18'),
          status: 'approved',
          reason: 'Remote work week',
        },
      })
      console.log(`✅ Added work remotely for ${users[3].name}`)
    }

    // Add more leaves for variety
    if (users[4]) {
      await prisma.leaves.createMany({
        data: [
          {
            user_id: users[4].id,
            leave_type: 'vacation',
            start_date: new Date('2026-09-20'),
            end_date: new Date('2026-09-25'),
            status: 'approved',
            reason: 'Holiday vacation',
          },
          {
            user_id: users[4].id,
            leave_type: 'sick_leave',
            start_date: new Date('2026-09-28'),
            end_date: new Date('2026-09-29'),
            status: 'pending',
            reason: 'Pending sick leave',
          },
        ],
      })
      console.log(`✅ Added multiple leaves for ${users[4].name}`)
    }

    console.log('\n✅ Sample leave data added successfully!')
    console.log('🏖️  You can now see the vacations on the frontend dashboard')
  } catch (error) {
    console.error('❌ Error adding sample leaves:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

addSampleLeaves()
