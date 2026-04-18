const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Checking tasks...');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

async function checkTasks() {
    try {
        const result = await pool.query(`
            SELECT t.task_number, t.title, t.description, t.deadline, t.status, p.project_id
            FROM tasks t
            JOIN projects p ON p.id = t.project_id
            ORDER BY t.id
        `);
        
        console.log(`\n📋 Found ${result.rows.length} tasks in database:\n`);
        
        if (result.rows.length === 0) {
            console.log('  No tasks found.');
        } else {
            console.table(result.rows);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkTasks();