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

async function addHrCredentials() {
    console.log('🔧 Setting up HR credentials...\n');
    
    try {
        const PLAIN_PASSWORD = '12345';
        // Hash the password with bcrypt (10 salt rounds)
        const hashedPassword = await bcrypt.hash(PLAIN_PASSWORD, 10);
        console.log(`🔑 Password hashed successfully`);

        // HR user data
        const hrUsers = [
            { userid: 'HR001', email: 'hr@obrive.com', name: 'HR Manager' },
            { userid: 'HR002', email: 'hr2@obrive.com', name: 'HR Assistant' },
            { userid: 'HR003', email: 'hr@example.com', name: 'HR1' },
        ];
        
        for (const hr of hrUsers) {
            const existing = await pool.query(
                'SELECT id, userid FROM users WHERE email = $1',
                [hr.email]
            );
            
            if (existing.rows.length > 0) {
                await pool.query(`
                    UPDATE users 
                    SET name = $1, 
                        password = $2,
                        role = 'hr',
                        status = 'online',
                        updated_at = NOW()
                    WHERE email = $3
                `, [hr.name, hashedPassword, hr.email]);
                console.log(`✅ Updated HR: ${hr.email}`);
            } else {
                const useridExists = await pool.query(
                    'SELECT id FROM users WHERE userid = $1',
                    [hr.userid]
                );
                
                let finalUserid = hr.userid;
                if (useridExists.rows.length > 0) {
                    finalUserid = `HR${Date.now()}`;
                    console.log(`⚠️ Userid ${hr.userid} taken, using ${finalUserid}`);
                }
                
                await pool.query(`
                    INSERT INTO users (userid, email, name, role, password, status, created_at, updated_at) 
                    VALUES ($1, $2, $3, 'hr', $4, 'online', NOW(), NOW())
                `, [finalUserid, hr.email, hr.name, hashedPassword]);
                console.log(`✅ Added HR: ${hr.email}`);
            }
        }
        
        // Verify HR users
        const result = await pool.query(`
            SELECT id, userid, email, name, role, status,
                   CASE WHEN password LIKE '$2b$%' THEN 'Hashed ✓' ELSE 'Plain Text ✗' END as password_type
            FROM users 
            WHERE role = 'hr'
        `);
        
        console.log('\n📋 HR Users in database:');
        console.table(result.rows);
        
        console.log('\n🔐 Use these credentials to login:');
        console.log('   Email: hr@example.com');
        console.log('   Password: 12345');
        console.log('\n   Email: hr@obrive.com');
        console.log('   Password: 12345');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

addHrCredentials();