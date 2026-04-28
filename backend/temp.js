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

async function getStickyNotes() {
  try {
    const res = await pool.query(`
      UPDATE sticky_notes
      SET note_date=note_date + INTERVAL '1 day'
      WHERE note_date < CURRENT_DATE
      RETURNING *;
    `);

    console.log('\n📝 Sticky Notes:');
    console.table(res.rows);

    console.log(`\n✅ Total notes: ${res.rows.length}`);
  } catch (error) {
    console.error('❌ Error fetching sticky notes:', error.message);
  } finally {
    await pool.end();
  }
}

getStickyNotes();