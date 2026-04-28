// backend/scripts/view-all-projects.js
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

async function viewAllProjects() {
    console.log('\n📊 ALL PROJECTS WITH DETAILS\n');
    console.log('='.repeat(80));
    
    try {
        // Get all projects with task counts and assignee counts
        const projects = await pool.query(`
            SELECT 
                p.id,
                p.project_id,
                p.name,
                p.description,
                p.priority,
                p.created_at,
                COUNT(DISTINCT t.id) as total_tasks,
                SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
                COUNT(DISTINCT pa.employee_id) as assignees_count
            FROM projects p
            LEFT JOIN tasks t ON t.project_id = p.id
            LEFT JOIN project_assignments pa ON pa.project_id = p.id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `);
        
        for (const project of projects.rows) {
            console.log(`\n📁 PROJECT: ${project.project_id} - ${project.name}`);
            console.log(`   Description: ${project.description || 'N/A'}`);
            console.log(`   Priority: ${project.priority}`);
            console.log(`   Created: ${new Date(project.created_at).toLocaleDateString()}`);
            console.log(`   Tasks: ${project.total_tasks || 0} total, ${project.completed_tasks || 0} completed`);
            console.log(`   Assignees: ${project.assignees_count || 0}`);
            
            // Get assignees details
            const assignees = await pool.query(`
                SELECT u.userid, u.name, u.email, u.department, u.job_title
                FROM project_assignments pa
                JOIN users u ON u.id = pa.employee_id
                WHERE pa.project_id = ${project.id}
                ORDER BY u.name
            `);
            
            if (assignees.rows.length > 0) {
                console.log(`\n   👥 ASSIGNEES:`);
                for (const emp of assignees.rows) {
                    console.log(`      - ${emp.name} (${emp.email})`);
                    console.log(`        Department: ${emp.department || 'N/A'}, Role: ${emp.job_title || 'N/A'}`);
                }
            } else {
                console.log(`\n   👥 ASSIGNEES: None assigned`);
            }
            
            // Get tasks for this project
            const tasks = await pool.query(`
                SELECT task_number, title, status, deadline,
                       assigned_to_name
                FROM tasks t
                LEFT JOIN LATERAL (
                    SELECT name as assigned_to_name FROM users WHERE id = t.assigned_to
                ) u ON true
                WHERE t.project_id = ${project.id}
                ORDER BY t.task_number
            `);
            
            if (tasks.rows.length > 0) {
                console.log(`\n   📋 TASKS:`);
                for (const task of tasks.rows) {
                    const statusIcon = task.status === 'completed' ? '✅' : 
                                      task.status === 'in_progress' ? '🔄' : '⏳';
                    console.log(`      ${statusIcon} ${task.task_number}: ${task.title}`);
                    console.log(`         Status: ${task.status}, Deadline: ${task.deadline || 'N/A'}`);
                    console.log(`         Assigned to: ${task.assigned_to_name || 'Unassigned'}`);
                }
            } else {
                console.log(`\n   📋 TASKS: No tasks yet`);
            }
            
            console.log('\n' + '-'.repeat(80));
        }
        
        // Summary
        const summary = await pool.query(`
            SELECT 
                COUNT(DISTINCT p.id) as total_projects,
                COUNT(DISTINCT t.id) as total_tasks,
                COUNT(DISTINCT pa.employee_id) as total_assignments
            FROM projects p
            LEFT JOIN tasks t ON t.project_id = p.id
            LEFT JOIN project_assignments pa ON pa.project_id = p.id
        `);
        
        console.log('\n📈 SUMMARY');
        console.log('='.repeat(80));
        console.log(`   Total Projects: ${summary.rows[0].total_projects}`);
        console.log(`   Total Tasks: ${summary.rows[0].total_tasks}`);
        console.log(`   Total Employee Assignments: ${summary.rows[0].total_assignments}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

viewAllProjects();