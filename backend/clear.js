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

async function clear() {
 try {
    // ✅ Add isActive column if not exists
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;
    `);

    console.log("✅ isActive column ensured");

    // ✅ Delete old users
    await pool.query("DELETE FROM users;");
    console.log("✅ Users deleted successfully");

   const cols = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);

    console.log("📊 Columns:", cols.rows);

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await pool.end();
  }

}

clear();