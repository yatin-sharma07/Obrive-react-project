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

(async () => {
    try {
        // Hash the password with bcrypt to match the login verification
        const hashedPassword = await bcrypt.hash('12345', 10);
        
        // Update or insert HR user
        await pool.query(`
            INSERT INTO users (userid, email, name, role, password, status, created_at, updated_at) 
            VALUES ('HR_TEST', 'hr@example.com', 'HR Admin', 'hr', $1, 'online', NOW(), NOW())
            ON CONFLICT (email) DO UPDATE SET 
                password = $1,
                role = 'hr',
                status = 'online',
                updated_at = NOW()
        `, [hashedPassword]);
        
        console.log('✅ HR user setup complete: hr@example.com / 12345');
        
        // Verify
        const result = await pool.query(`
            SELECT email, name, role, status FROM users WHERE email = 'hr@example.com'
        `);
        console.table(result.rows);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();
