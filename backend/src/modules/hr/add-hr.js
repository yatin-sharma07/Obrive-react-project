
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

async function addHR() {
    try {
        const hashedPassword = await bcrypt.hash('hr123', 10);
        
        await pool.query(`
            INSERT INTO users (userid, email, name, role, password, status, created_at, updated_at) 
            VALUES 
            ('HR001', 'hr@obrive.com', 'HR Manager', 'hr', $1, 'online', NOW(), NOW()),
            ('HR002', 'hr2@obrive.com', 'Recruitment Specialist', 'hr', $1, 'online', NOW(), NOW())
            ON CONFLICT (email) DO UPDATE SET 
                password = $1,
                status = 'online',
                updated_at = NOW()
        `, [hashedPassword]);
        
        console.log('✅ HR users added successfully!');
        console.log('   hr@obrive.com / hr123');
        
        const result = await pool.query(`SELECT email, name, role FROM users WHERE role = 'hr'`);
        console.table(result.rows);
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

addHR();