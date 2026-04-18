const { Pool } = require('pg');
require('dotenv').config();

console.log('🌱 Starting task insertion...');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

async function insertTasks() {
    try {
        // Get projects
        const projects = await pool.query('SELECT id, project_id FROM projects');
        console.log(`📋 Found ${projects.rows.length} projects`);
        
        if (projects.rows.length === 0) {
            console.log('❌ No projects found. Run seed-projects.js first.');
            return;
        }
        
        // Get employees
        const employees = await pool.query(`SELECT id FROM users WHERE role = 'employee' LIMIT 3`);
        console.log(`📋 Found ${employees.rows.length} employees`);
        
        let taskCount = 0;
        
        // Project 1: Medical App
        if (projects.rows[0]) {
            const tasks = [
                ['TASK-001', 'Design UI/UX', 'Create wireframes and mockups for the medical app', '2024-12-15', 'in_progress', employees.rows[0]?.id],
                ['TASK-002', 'API Integration', 'Connect to backend APIs for data fetching', '2024-12-20', 'pending', employees.rows[1]?.id],
                ['TASK-003', 'Testing', 'QA testing and bug fixes', '2024-12-25', 'pending', employees.rows[2]?.id]
            ];
            
            for (const task of tasks) {
                await pool.query(`
                    INSERT INTO tasks (project_id, task_number, title, description, deadline, status, assigned_to)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [projects.rows[0].id, task[0], task[1], task[2], task[3], task[4], task[5]]);
                taskCount++;
            }
            console.log(`✅ Added 3 tasks to ${projects.rows[0].project_id}`);
        }
        
        // Project 2: Food Delivery
        if (projects.rows[1]) {
            const tasks = [
                ['TASK-004', 'Database Design', 'Design database schema for food delivery', '2024-11-30', 'completed', employees.rows[0]?.id],
                ['TASK-005', 'Backend API', 'Build REST APIs for order management', '2024-12-10', 'in_progress', employees.rows[1]?.id],
                ['TASK-006', 'Frontend Development', 'Build React components', '2024-12-18', 'pending', employees.rows[2]?.id]
            ];
            
            for (const task of tasks) {
                await pool.query(`
                    INSERT INTO tasks (project_id, task_number, title, description, deadline, status, assigned_to)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [projects.rows[1].id, task[0], task[1], task[2], task[3], task[4], task[5]]);
                taskCount++;
            }
            console.log(`✅ Added 3 tasks to ${projects.rows[1].project_id}`);
        }
        
        // Project 3: Admin Panel
        if (projects.rows[2]) {
            const tasks = [
                ['TASK-007', 'Admin Dashboard', 'Create admin dashboard UI', '2024-12-22', 'pending', employees.rows[0]?.id],
                ['TASK-008', 'User Management', 'Add user CRUD operations', '2024-12-28', 'pending', employees.rows[1]?.id],
                ['TASK-009', 'Analytics', 'Add analytics features', '2025-01-05', 'pending', employees.rows[2]?.id]
            ];
            
            for (const task of tasks) {
                await pool.query(`
                    INSERT INTO tasks (project_id, task_number, title, description, deadline, status, assigned_to)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [projects.rows[2].id, task[0], task[1], task[2], task[3], task[4], task[5]]);
                taskCount++;
            }
            console.log(`✅ Added 3 tasks to ${projects.rows[2].project_id}`);
        }
        
        console.log(`\n🎉 Total ${taskCount} tasks added successfully!`);
        
        // Show summary
        const summary = await pool.query(`
            SELECT p.project_id, COUNT(t.id) as tasks
            FROM projects p
            LEFT JOIN tasks t ON t.project_id = p.id
            GROUP BY p.id
        `);
        console.table(summary.rows);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

insertTasks();