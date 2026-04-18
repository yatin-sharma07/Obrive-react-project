// backend/scripts/check-cab-service.js
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

async function checkCabService() {
    console.log('🔍 Checking Cab Service project...\n');
    
    try {
        // Get Cab Service project
        const project = await pool.query(`
            SELECT project_id, name, description, priority, created_at 
            FROM projects 
            WHERE project_id = 'PN0001300'
        `);
        
        if (project.rows.length === 0) {
            console.log('❌ Cab Service project not found');
            return;
        }
        
        console.log('📋 Cab Service Project:');
        console.table(project.rows);
        
        // Get all tasks for Cab Service
        const tasks = await pool.query(`
            SELECT t.task_number, t.title, t.status, t.deadline, 
                   u.name as assigned_to_name
            FROM tasks t
            JOIN projects p ON p.id = t.project_id
            LEFT JOIN users u ON u.id = t.assigned_to
            WHERE p.project_id = 'PN0001300'
            ORDER BY t.task_number
        `);
        
        console.log('\n📋 Cab Service Subtasks:');
        console.table(tasks.rows);
        
        console.log(`\n✅ Total subtasks: ${tasks.rows.length}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkCabService();