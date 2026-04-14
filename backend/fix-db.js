// backend/fix-db.js
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

async function fixDatabase() {
    try {
        console.log('🔧 Adding updated_at column...');
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()
        `);
        console.log('✅ updated_at column added!');
        
        // Also make sure password column exists
        await pool.query(`
            ALTER TABLE users 
            ALTER COLUMN updated_at SET DEFAULT NOW()
        `);
        console.log('✅ Default value set for updated_at');
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

fixDatabase();