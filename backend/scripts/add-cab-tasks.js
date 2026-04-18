// backend/scripts/add-cab-tasks.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

async function addCabTasks() {
    console.log('📝 Adding subtasks for Cab Service...\n');
    
    try {
        // Get Cab Service project ID
        const project = await pool.query(`SELECT id FROM projects WHERE project_id = 'PN0001300'`);
        
        if (project.rows.length === 0) {
            console.log('❌ Cab Service project not found. Run add-cab-service.js first.');
            return;
        }
        
        const projectId = project.rows[0].id;
        
        // Get employees
        const employees = await pool.query(`SELECT id FROM users WHERE role = 'employee' LIMIT 3`);
        
        // Subtasks for Cab Service
        const subtasks = [
            { task_number: 'TASK-010', title: 'User Authentication', description: 'Implement login/signup for riders and drivers', deadline: '2025-01-15', status: 'pending', assigned_to: employees.rows[0]?.id },
            { task_number: 'TASK-011', title: 'Ride Booking System', description: 'Create ride request and matching algorithm', deadline: '2025-01-20', status: 'pending', assigned_to: employees.rows[1]?.id },
            { task_number: 'TASK-012', title: 'Real-time Tracking', description: 'GPS integration for live ride tracking', deadline: '2025-01-25', status: 'pending', assigned_to: employees.rows[2]?.id },
            { task_number: 'TASK-013', title: 'Payment Gateway', description: 'Integrate payment methods (cards, wallets)', deadline: '2025-02-01', status: 'pending', assigned_to: employees.rows[0]?.id },
            { task_number: 'TASK-014', title: 'Driver Dashboard', description: 'Driver app interface and earnings tracking', deadline: '2025-02-05', status: 'pending', assigned_to: employees.rows[1]?.id },
            { task_number: 'TASK-015', title: 'Rider App UI', description: 'User-friendly mobile app interface', deadline: '2025-02-10', status: 'in_progress', assigned_to: employees.rows[2]?.id },
            { task_number: 'TASK-016', title: 'Admin Panel', description: 'Admin dashboard for managing rides and users', deadline: '2025-02-15', status: 'pending', assigned_to: employees.rows[0]?.id },
            { task_number: 'TASK-017', title: 'Rating & Reviews', description: 'Rate drivers and provide feedback', deadline: '2025-02-20', status: 'pending', assigned_to: employees.rows[1]?.id }
        ];
        
        for (const task of subtasks) {
            await pool.query(`
                INSERT INTO tasks (project_id, task_number, title, description, deadline, status, assigned_to)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [projectId, task.task_number, task.title, task.description, task.deadline, task.status, task.assigned_to]);
        }
        
        console.log(`✅ Added ${subtasks.length} subtasks to Cab Service project`);
        
        // Show summary
        const summary = await pool.query(`
            SELECT p.project_id, p.name, COUNT(t.id) as total_tasks,
                   SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed,
                   SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress
            FROM projects p
            LEFT JOIN tasks t ON t.project_id = p.id
            WHERE p.project_id = 'PN0001300'
            GROUP BY p.id
        `);
        
        console.log('\n📋 Cab Service Summary:');
        console.table(summary.rows);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

addCabTasks();