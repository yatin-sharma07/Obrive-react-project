
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

async function alterEventsTable() {
    console.log('🔧 Adding missing columns to events table...\n');
    
    try {
        await pool.query(`
            ALTER TABLE events 
            ADD COLUMN IF NOT EXISTS category VARCHAR(50),
            ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium',
            ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS repeat_type VARCHAR(20),
            ADD COLUMN IF NOT EXISTS repeat_days VARCHAR(100),
            ADD COLUMN IF NOT EXISTS repeat_end_date DATE
        `);
        console.log('✅ Missing columns added successfully');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

alterEventsTable();