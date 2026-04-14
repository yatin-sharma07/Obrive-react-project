// backend/temp.js
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

async function add() {
    try {
        await pool.query(`
            INSERT INTO users (userid, email, name, role, password, status) VALUES 
            ('EMP001', 'john@obrive.com', 'John Doe', 'employee', 'employee123', 'offline'),
            ('EMP002', 'jane@obrive.com', 'Jane Smith', 'employee', 'employee123', 'offline'),
            ('EMP003', 'bob@obrive.com', 'Bob Wilson', 'employee', 'employee123', 'offline'),
            ('EMP004', 'sarah@obrive.com', 'Sarah Johnson', 'employee', 'employee123', 'offline'),
            ('EMP005', 'mike@obrive.com', 'Mike Brown', 'employee', 'employee123', 'offline')
            ON CONFLICT (email) DO NOTHING
        `);

        console.log('✅ Employees added successfully!');
        
        // Verify employees were added
        const res = await pool.query(`
            SELECT userid, email, name, role, status 
            FROM users 
            WHERE role = 'employee'
        `);
        
        console.log('\n📋 Employees in database:');
        console.table(res.rows);
        console.log(`\n✅ Total employees: ${res.rows.length}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

add();