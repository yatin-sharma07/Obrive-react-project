// backend/seed.js
require('dotenv').config();
const { prisma } = require('./src/config/db');
const bcrypt = require('bcrypt');

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clean up existing data
    console.log('🧹 Cleaning up existing data...');
    await prisma.tasks.deleteMany({});
    await prisma.project_assignments.deleteMany({});
    await prisma.sticky_notes.deleteMany({});
    await prisma.login_logs.deleteMany({});
    await prisma.work_sessions.deleteMany({});
    await prisma.events.deleteMany({});
    await prisma.projects.deleteMany({});
    await prisma.users.deleteMany({});
    console.log('  ✅ Database cleaned\n');
    // ============================================
    // 1. CREATE USERS
    // ============================================
    console.log('👥 Creating users...');
    
    const users = [
      {
        userid: 'EMP001',
        email: 'karn@obrive.com',
        name: 'Karn Singh',
        password: '12345',
        role: 'employee',
        department: 'Engineering',
        job_title: 'Frontend Developer',
        phone_number: '+91-9876543210',
        bio: 'Passionate frontend developer with 3 years experience',
      },
      {
        userid: 'EMP002',
        email: 'yatin@obrive.com',
        name: 'Yatin Sharma',
        password: '12345',
        role: 'employee',
        department: 'Engineering',
        job_title: 'Backend Developer',
        phone_number: '+91-8765432109',
        bio: 'Backend specialist with expertise in Node.js',
      },
      {
        userid: 'EMP003',
        email: 'priya@obrive.com',
        name: 'Priya Verma',
        password: '12345',
        role: 'employee',
        department: 'Design',
        job_title: 'UI/UX Designer',
        phone_number: '+91-7654321098',
        bio: 'Creative designer focused on user experience',
      },
      {
        userid: 'EMP004',
        email: 'rahul@obrive.com',
        name: 'Rahul Patel',
        password: '12345',
        role: 'employee',
        department: 'Engineering',
        job_title: 'Full Stack Developer',
        phone_number: '+91-6543210987',
        bio: 'Full stack developer with DevOps experience',
      },
      {
        userid: 'EMP005',
        email: 'admin@obrive.com',
        name: 'Admin User',
        password: '12345',
        role: 'hr',
        department: 'Administration',
        job_title: 'HR Manager',
        phone_number: '+91-5432109876',
        bio: 'Managing human resources and operations',
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await prisma.users.create({
        data: {
          ...userData,
          password: hashedPassword,
          status: 'online',
          date_of_birth: new Date('1995-05-15'),
          join_date: new Date('2023-01-15'),
          updated_at: new Date(),
        },
      });
      createdUsers.push(user);
      console.log(`  ✅ Created user: ${user.name} (${user.email})`);
    }

    // ============================================
    // 2. CREATE PROJECTS
    // ============================================
    console.log('\n📁 Creating projects...');

    const projects = [
      {
        project_id: 'PROJ-001',
        name: 'Website Redesign',
        description: 'Complete overhaul of the company website with modern design',
        priority: 'high',
      },
      {
        project_id: 'PROJ-002',
        name: 'Mobile App Development',
        description: 'Native iOS and Android app for customer engagement',
        priority: 'high',
      },
      {
        project_id: 'PROJ-003',
        name: 'Admin Dashboard',
        description: 'Internal admin panel for project management',
        priority: 'medium',
      },
    ];

    const createdProjects = [];
    for (const projectData of projects) {
      const project = await prisma.projects.create({
        data: projectData,
      });
      createdProjects.push(project);
      console.log(`  ✅ Created project: ${project.name}`);
    }

    // ============================================
    // 3. CREATE PROJECT ASSIGNMENTS
    // ============================================
    console.log('\n👨‍💼 Assigning users to projects...');

    const assignments = [
      { project_id: createdProjects[0].id, employee_id: createdUsers[0].id }, // Karn - Website Redesign
      { project_id: createdProjects[0].id, employee_id: createdUsers[2].id }, // Priya - Website Redesign
      { project_id: createdProjects[1].id, employee_id: createdUsers[1].id }, // Yatin - Mobile App
      { project_id: createdProjects[1].id, employee_id: createdUsers[3].id }, // Rahul - Mobile App
      { project_id: createdProjects[2].id, employee_id: createdUsers[0].id }, // Karn - Admin Dashboard
      { project_id: createdProjects[2].id, employee_id: createdUsers[1].id }, // Yatin - Admin Dashboard
      { project_id: createdProjects[0].id, employee_id: createdUsers[1].id }, // Yatin - Website Redesign (Additional)
    ];

    for (const assignment of assignments) {
      await prisma.project_assignments.create({
        data: assignment,
      });
    }
    console.log(`  ✅ Assigned ${assignments.length} users to projects`);

    // ============================================
    // 4. CREATE TASKS
    // ============================================
    console.log('\n📋 Creating tasks...');

    const tasks = [
      // Website Redesign Tasks
      {
        project_id: createdProjects[0].id,
        task_number: 'TASK-1',
        title: 'Setup Design System',
        description: 'Create comprehensive design system with colors, typography, and components',
        deadline: new Date('2026-05-15'),
        status: 'in-progress',
        assigned_to: createdUsers[2].id, // Priya
        created_by: createdUsers[0].id, // Karn
      },
      {
        project_id: createdProjects[0].id,
        task_number: 'TASK-2',
        title: 'Frontend Setup',
        description: 'Initialize Next.js project with required dependencies',
        deadline: new Date('2026-05-10'),
        status: 'completed',
        assigned_to: createdUsers[0].id, // Karn
        created_by: createdUsers[0].id, // Karn
      },
      {
        project_id: createdProjects[0].id,
        task_number: 'TASK-3',
        title: 'Homepage Design',
        description: 'Design and implement homepage with animations',
        deadline: new Date('2026-05-20'),
        status: 'pending',
        assigned_to: createdUsers[2].id, // Priya
        created_by: createdUsers[0].id, // Karn
      },
      {
        project_id: createdProjects[0].id,
        task_number: 'TASK-4',
        title: 'API Integration for Website',
        description: 'Connect website frontend to backend APIs',
        deadline: new Date('2026-05-25'),
        status: 'in-progress',
        assigned_to: createdUsers[1].id, // Yatin
        created_by: createdUsers[0].id, // Karn
      },
      // Mobile App Tasks
      {
        project_id: createdProjects[1].id,
        task_number: 'TASK-1',
        title: 'API Integration',
        description: 'Connect app to backend API endpoints',
        deadline: new Date('2026-05-25'),
        status: 'in-progress',
        assigned_to: createdUsers[1].id, // Yatin
        created_by: createdUsers[1].id, // Yatin
      },
      {
        project_id: createdProjects[1].id,
        task_number: 'TASK-2',
        title: 'Authentication Module',
        description: 'Implement secure authentication with JWT',
        deadline: new Date('2026-05-18'),
        status: 'pending',
        assigned_to: createdUsers[3].id, // Rahul
        created_by: createdUsers[1].id, // Yatin
      },
      {
        project_id: createdProjects[1].id,
        task_number: 'TASK-3',
        title: 'Push Notifications',
        description: 'Setup push notifications using Firebase',
        deadline: new Date('2026-06-01'),
        status: 'pending',
        assigned_to: createdUsers[1].id, // Yatin
        created_by: createdUsers[1].id, // Yatin
      },
      {
        project_id: createdProjects[1].id,
        task_number: 'TASK-4',
        title: 'Testing and QA',
        description: 'Complete testing suite and QA on all features',
        deadline: new Date('2026-06-10'),
        status: 'pending',
        assigned_to: createdUsers[3].id, // Rahul
        created_by: createdUsers[1].id, // Yatin
      },
      // Admin Dashboard Tasks
      {
        project_id: createdProjects[2].id,
        task_number: 'TASK-1',
        title: 'Database Schema',
        description: 'Design and create database schema',
        deadline: new Date('2026-05-12'),
        status: 'completed',
        assigned_to: createdUsers[1].id, // Yatin
        created_by: createdUsers[0].id, // Karn
      },
      {
        project_id: createdProjects[2].id,
        task_number: 'TASK-2',
        title: 'Dashboard Components',
        description: 'Build reusable dashboard components',
        deadline: new Date('2026-05-22'),
        status: 'in-progress',
        assigned_to: createdUsers[0].id, // Karn
        created_by: createdUsers[0].id, // Karn
      },
      {
        project_id: createdProjects[2].id,
        task_number: 'TASK-3',
        title: 'User Analytics',
        description: 'Implement user analytics and reporting',
        deadline: new Date('2026-05-30'),
        status: 'pending',
        assigned_to: createdUsers[1].id, // Yatin
        created_by: createdUsers[0].id, // Karn
      },
      {
        project_id: createdProjects[2].id,
        task_number: 'TASK-4',
        title: 'Performance Optimization',
        description: 'Optimize dashboard performance and load times',
        deadline: new Date('2026-06-05'),
        status: 'pending',
        assigned_to: createdUsers[1].id, // Yatin
        created_by: createdUsers[0].id, // Karn
      },
    ];

    for (const taskData of tasks) {
      await prisma.tasks.create({
        data: taskData,
      });
    }
    console.log(`  ✅ Created ${tasks.length} tasks`);

    // ============================================
    // 5. CREATE STICKY NOTES
    // ============================================
    console.log('\n📝 Creating sticky notes...');

    const stickyNotes = [
      {
        user_id: createdUsers[0].id,
        content: 'Remember to review pull requests for the team',
        color: 'yellow',
        note_date: new Date(),
        position: 1,
      },
      {
        user_id: createdUsers[0].id,
        content: 'Meeting with design team at 3 PM',
        color: 'pink',
        note_date: new Date(),
        position: 2,
      },
      {
        user_id: createdUsers[1].id,
        content: 'Complete API endpoints by Friday',
        color: 'blue',
        note_date: new Date(),
        position: 1,
      },
      {
        user_id: createdUsers[2].id,
        content: 'Finalize color palette for website',
        color: 'green',
        note_date: new Date(),
        position: 1,
      },
      {
        user_id: createdUsers[3].id,
        content: 'Test authentication on staging',
        color: 'orange',
        note_date: new Date(),
        position: 1,
      },
    ];

    for (const noteData of stickyNotes) {
      await prisma.sticky_notes.create({
        data: noteData,
      });
    }
    console.log(`  ✅ Created ${stickyNotes.length} sticky notes`);

    // ============================================
    // 6. CREATE EVENTS
    // ============================================
    console.log('\n📅 Creating events...');

    const events = [
      {
        title: 'Team Meeting',
        description: 'Weekly team sync-up',
        event_date: new Date('2026-04-28'),
        event_time: new Date('2026-04-28T10:00:00'),
        end_date: new Date('2026-04-28'),
        end_time: new Date('2026-04-28T11:00:00'),
        location: 'Conference Room A',
        event_type: 'meeting',
        created_by: createdUsers[4].id, // Admin
        category: 'work',
        priority: 'high',
        is_recurring: true,
        repeat_type: 'weekly',
        repeat_days: 'Monday',
      },
      {
        title: 'Project Standup',
        description: 'Daily standup for active projects',
        event_date: new Date('2026-04-26'),
        event_time: new Date('2026-04-26T09:30:00'),
        end_date: new Date('2026-04-26'),
        end_time: new Date('2026-04-26T09:45:00'),
        location: 'Zoom',
        event_type: 'standup',
        created_by: createdUsers[0].id, // Karn
        category: 'work',
        priority: 'high',
        is_recurring: true,
        repeat_type: 'daily',
      },
      {
        title: 'Design Review',
        description: 'Website design review and feedback',
        event_date: new Date('2026-04-27'),
        event_time: new Date('2026-04-27T14:00:00'),
        end_date: new Date('2026-04-27'),
        end_time: new Date('2026-04-27T15:30:00'),
        location: 'Design Studio',
        event_type: 'review',
        created_by: createdUsers[2].id, // Priya
        category: 'work',
        priority: 'medium',
      },
      {
        title: 'Code Review Session',
        description: 'Backend code review with team',
        event_date: new Date('2026-04-29'),
        event_time: new Date('2026-04-29T16:00:00'),
        end_date: new Date('2026-04-29'),
        end_time: new Date('2026-04-29T17:00:00'),
        location: 'Zoom',
        event_type: 'review',
        created_by: createdUsers[1].id, // Yatin
        category: 'work',
        priority: 'high',
      },
    ];

    for (const eventData of events) {
      await prisma.events.create({
        data: eventData,
      });
    }
    console.log(`  ✅ Created ${events.length} events`);

    // ============================================
    // 7. CREATE LOGIN LOGS
    // ============================================
    console.log('\n🔐 Creating login logs...');

    const loginLogs = [
      {
        userId: createdUsers[0].id,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        loginTime: new Date(new Date().setHours(-2)),
        sessionDuration: 7200,
      },
      {
        userId: createdUsers[1].id,
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
        loginTime: new Date(new Date().setHours(-1)),
        sessionDuration: 3600,
      },
      {
        userId: createdUsers[2].id,
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
        loginTime: new Date(),
        sessionDuration: null,
      },
    ];

    for (const logData of loginLogs) {
      await prisma.login_logs.create({
        data: logData,
      });
    }
    console.log(`  ✅ Created ${loginLogs.length} login logs`);

    // ============================================
    // 8. CREATE WORK SESSIONS
    // ============================================
    console.log('\n⏱️  Creating work sessions...');

    const workSessions = [
      {
        userId: createdUsers[0].id,
        sessionStart: new Date(new Date().setHours(-3)),
        lastHeartbeat: new Date(new Date().setMinutes(-5)),
        totalActiveDuration: 9000,
        status: 'active',
      },
      {
        userId: createdUsers[1].id,
        sessionStart: new Date(new Date().setHours(-2)),
        lastHeartbeat: new Date(new Date().setMinutes(-10)),
        totalActiveDuration: 6000,
        status: 'active',
      },
      {
        userId: createdUsers[2].id,
        sessionStart: new Date(new Date().getTime() - 86400000),
        sessionEnd: new Date(new Date().getTime() - 32400000),
        totalActiveDuration: 28800,
        status: 'ended',
      },
    ];

    for (const sessionData of workSessions) {
      await prisma.work_sessions.create({
        data: sessionData,
      });
    }
    console.log(`  ✅ Created ${workSessions.length} work sessions`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n' + '='.repeat(50));
    console.log('✅ Database seeding completed successfully!');
    console.log('='.repeat(50));
    console.log('\n📊 Summary:');
    console.log(`  - Users: ${createdUsers.length}`);
    console.log(`  - Projects: ${createdProjects.length}`);
    console.log(`  - Project Assignments: ${assignments.length}`);
    console.log(`  - Tasks: ${tasks.length}`);
    console.log(`  - Sticky Notes: ${stickyNotes.length}`);
    console.log(`  - Events: ${events.length}`);
    console.log(`  - Login Logs: ${loginLogs.length}`);
    console.log(`  - Work Sessions: ${workSessions.length}`);
    console.log('\n🔐 Test Credentials:');
    console.log('  Email: karn@obrive.com');
    console.log('  Password: 12345');
    console.log('  Role: Employee');
    console.log('\n  Email: yatin@obrive.com');
    console.log('  Password: 12345');
    console.log('  Role: Employee\n');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('🚨 Critical error:', e);
    process.exit(1);
  });
