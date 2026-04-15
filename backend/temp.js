// backend/temp.js
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

async function add() {
    try {
         const hashedPassword = await bcrypt.hash("employee123", 12);
       await pool.query(`
  INSERT INTO users (userid, email, name, role, password, status, "isActive") VALUES 
  ('EMP001', 'john@obrive.com', 'John Doe', 'employee', '${hashedPassword}', 'offline', true),
  ('EMP002', 'jane@obrive.com', 'Jane Smith', 'employee', '${hashedPassword}', 'offline', true),
  ('EMP003', 'bob@obrive.com', 'Bob Wilson', 'employee', '${hashedPassword}', 'offline', true),
  ('EMP004', 'sarah@obrive.com', 'Sarah Johnson', 'employee', '${hashedPassword}', 'offline', true),
  ('EMP005', 'mike@obrive.com', 'Mike Brown', 'employee', '${hashedPassword}', 'offline', true)
  ON CONFLICT (email) DO NOTHING
`);
await pool.query(`
  INSERT INTO users (userid, email, name, role, password, status, "isActive") VALUES 
  ('WEBSITE_847', 'client@obrive.com', 'Test Client', 'client', '', 'offline', true)
  ON CONFLICT (userid) DO NOTHING
`);

        
        const res = await pool.query(`
            SELECT userid, email, name, role,password, status,"isActive"
            FROM users 
            
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