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

async function addColumns() {
    console.log('🔧 Adding columns to users table...\n');
    
    try {
        await pool.query(ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE);
        console.log('✅ date_of_birth column added');
        
        await pool.query(ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT);
        console.log('✅ bio column added');
        
        await pool.query(ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20));
        console.log('✅ phone_number column added');
        
        const result = await pool.query(
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name IN ('date_of_birth', 'bio', 'phone_number')
        );
        
        console.log('\n📋 Added columns:');
        result.rows.forEach(row => {
            console.log(   -  ());
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

addColumns();
