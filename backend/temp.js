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
     SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
    `);

    console.log('✅ Employees added successfully!');

    const res = await pool.query(`
      SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
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