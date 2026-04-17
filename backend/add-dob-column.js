// backend/add-dob-column.js
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

async function addDOBColumn() {
    console.log('🔧 Adding date_of_birth column to users table...\n');
    
    try {
        // Add the column
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS date_of_birth DATE
        `);
        console.log('✅ date_of_birth column added successfully!');
        
        // Verify column was added
        const result = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'date_of_birth'
        `);
        
        if (result.rows.length > 0) {
            console.log('📋 Verified: date_of_birth column exists');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

addDOBColumn();