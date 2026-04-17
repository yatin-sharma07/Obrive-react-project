require('dotenv').config();
const { prisma } = require('./src/config/db');

async function setup() {
  try {
    // Create projects table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        priority VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Projects table created/verified');

    // Create project_assignments table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS project_assignments (
        id SERIAL PRIMARY KEY,
        project_id INT REFERENCES projects(id) ON DELETE CASCADE,
        employee_id INT REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(project_id, employee_id)
      )
    `);
    console.log('✅ Project assignments table created/verified');

    // Insert sample projects
    await prisma.$executeRawUnsafe(`
      INSERT INTO projects (project_id, name, description, priority, created_at) VALUES
        ('PN0001265', 'Medical App [iOS native]', 'iOS medical application', 'medium', '2022-09-12'),
        ('PN0001221', 'Food Delivery Service', 'Food delivery platform', 'medium', '2022-09-10'),
        ('PN0001290', 'Admin Dashboard', 'Admin panel project', 'low', '2020-05-28')
      ON CONFLICT (project_id) DO NOTHING
    `);
    console.log('✅ Sample projects inserted');

    // Assign all employees to all projects
    const projects = await prisma.$queryRawUnsafe(`SELECT id FROM projects`);
    const employees = await prisma.$queryRawUnsafe(`SELECT id FROM users WHERE role = 'employee' LIMIT 5`);

    for (const project of projects) {
      for (const employee of employees) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO project_assignments (project_id, employee_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          project.id,
          employee.id
        );
      }
    }
    console.log(`✅ Assigned ${employees.length} employees to ${projects.length} projects`);

    console.log('\n🎉 Setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

setup();
