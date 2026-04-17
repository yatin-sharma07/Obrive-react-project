
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

async function checkHR() {
    try {
        const result = await pool.query(`
            SELECT id, userid, email, name, role, password, status 
            FROM users 
            WHERE role = 'hr'
        `);
        
        console.log('📋 HR Users in database:');
        console.table(result.rows);
        
        if (result.rows.length === 0) {
            console.log('\n⚠️ No HR users found! Adding one...');
            await addHR();
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

async function addHR() {
    const hashedPassword = await bcrypt.hash('12345', 10);
    
    await pool.query(`
        INSERT INTO users (userid, email, name, role, password, status, created_at, updated_at) 
        VALUES ('HR001', 'hr@obrive.com', 'HR Manager', 'hr', $1, 'online', NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET 
            password = $1,
            status = 'online',
            updated_at = NOW()
    `, [hashedPassword]);
    
    console.log('✅ HR user added: hr@obrive.com / 12345');
}

checkHR();