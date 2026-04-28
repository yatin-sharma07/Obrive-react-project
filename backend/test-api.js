// backend/test-api.js
require('dotenv').config();
const { prisma } = require('./src/config/db');
const jwt = require('jsonwebtoken');

async function testUserProjects() {
  try {
    // Get Yatin (user ID 2)
    const yatin = await prisma.users.findUnique({
      where: { email: 'yatin@obrive.com' },
    });

    console.log('\n👤 User:', yatin.name, `(ID: ${yatin.id})`);

    // Get projects for Yatin using the same query as the service
    const projects = await prisma.$queryRaw`SELECT 
                p.id, 
                p.name, 
                p.description, 
                p.priority, 
                p.created_at, 
                COALESCE(
                    json_agg(json_build_object('id', u.id, 'name', u.name)) 
                    FILTER (WHERE u.id IS NOT NULL), 
                    '[]'::json
                ) AS team_members
            FROM projects p
            JOIN project_assignments pa ON p.id = pa.project_id
            LEFT JOIN project_assignments pa_inner ON p.id = pa_inner.project_id
            LEFT JOIN users u ON pa_inner.employee_id = u.id
            WHERE pa.employee_id = ${yatin.id}
            GROUP BY p.id, p.name, p.description, p.priority, p.created_at`;

    console.log('\n📁 Projects Assigned to Yatin:', projects.length);

    for (const project of projects) {
      console.log(`\n  ✅ ${project.name}`);
      console.log(`     - Description: ${project.description}`);
      console.log(`     - Priority: ${project.priority}`);
      console.log(`     - Team: ${project.team_members.map((m) => m.name).join(', ')}`);

      // Get tasks for this project where Yatin is creator or assigned
      const tasks = await prisma.$queryRaw`
        SELECT 
          t.id,
          t.project_id,
          t.task_number,
          t.title,
          t.description,
          t.deadline,
          t.status,
          t.assigned_to,
          t.created_by,
          u_assigned.name as assigned_to_name,
          u_created.name as created_by_name
        FROM tasks t
        LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
        LEFT JOIN users u_created ON t.created_by = u_created.id
        WHERE t.project_id = ${project.id}
          AND (
            t.created_by = ${yatin.id}
            OR t.assigned_to = ${yatin.id}
          )
        ORDER BY t.task_number
      `;

      console.log(`     - Tasks: ${tasks.length}`);
      for (const task of tasks) {
        console.log(`        • ${task.task_number}: ${task.title}`);
        console.log(`          Status: ${task.status}, Assigned to: ${task.assigned_to_name || 'Unassigned'}`);
      }
    }

    console.log('\n✅ Test completed successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testUserProjects();
