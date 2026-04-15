// backend/hash-passwords.js
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

async function hashPasswords() {
    try {
        // Hash the password 'employee123'
        const hashedPassword = await bcrypt.hash('employee123', 10);
        console.log('Hashed password:', hashedPassword);
        
        // Update all employees with hashed password
        const result = await pool.query(`
            UPDATE users 
            SET password = $1 
            WHERE role = 'employee' AND (password = 'employee123' OR password IS NOT NULL)
        `, [hashedPassword]);
        
        console.log(`✅ Updated ${result.rowCount} employee(s) with hashed passwords!`);
        
        // Verify
        const res = await pool.query(`
            SELECT email, role, 
                   CASE WHEN password LIKE '$2b$%' THEN 'Hashed ✓' ELSE 'Plain Text ✗' END as password_type
            FROM users 
            WHERE role = 'employee'
        `);
        
        console.table(res.rows);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

hashPasswords();