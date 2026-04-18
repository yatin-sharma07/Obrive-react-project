const { Pool } = require('pg');
require('dotenv').config();

console.log('🔧 Starting task table creation...');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

async function createTasksTable() {
    try {
        console.log('📝 Dropping old tasks table...');
        await pool.query(`DROP TABLE IF EXISTS tasks`);
        console.log('✅ Old tasks table dropped');
        
        console.log('📝 Creating new tasks table...');
        await pool.query(`
            CREATE TABLE tasks (
                id SERIAL PRIMARY KEY,
                project_id INT REFERENCES projects(id) ON DELETE CASCADE,
                task_number VARCHAR(20) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                deadline DATE,
                status VARCHAR(20) DEFAULT 'pending',
                assigned_to INT REFERENCES users(id),
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ Tasks table created successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

createTasksTable();