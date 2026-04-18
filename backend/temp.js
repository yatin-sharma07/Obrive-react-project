const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');

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
    const hashed = await bcrypt.hash('employee123', 10);

    await pool.query(`
      INSERT INTO users 
      (userid, email, name, role, password, status, created_at, updated_at) 
      VALUES 
      ('EMP001', 'john@obrive.com', 'John Doe', 'employee', '${hashed}', 'offline', NOW(), NOW()),
      ('EMP002', 'jane@obrive.com', 'Jane Smith', 'employee', '${hashed}', 'offline', NOW(), NOW()),
      ('EMP003', 'bob@obrive.com', 'Bob Wilson', 'employee', '${hashed}', 'offline', NOW(), NOW()),
      ('EMP004', 'sarah@obrive.com', 'Sarah Johnson', 'employee', '${hashed}', 'offline', NOW(), NOW()),
      ('EMP005', 'mike@obrive.com', 'Mike Brown', 'employee', '${hashed}', 'offline', NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `);

    console.log('✅ Employees added successfully!');

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