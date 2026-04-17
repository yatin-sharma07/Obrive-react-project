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

async function checkHRUsers() {
    try {
        const result = await pool.query(`
            SELECT id, userid, email, name, role, status 
            FROM users 
            WHERE role = 'hr'
            ORDER BY created_at DESC
        `);
        
        if (result.rows.length === 0) {
            console.log('❌ No HR users found in database');
        } else {
            console.log('✅ HR Users found:');
            console.table(result.rows);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkHRUsers();
