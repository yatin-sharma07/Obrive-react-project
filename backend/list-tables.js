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
(async () => {
    try {
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        console.log('📋 Tables in database:');
        result.rows.forEach(row => console.log('  -', row.table_name));
    } catch (err) {
        console.error('Error fetching tables', err);
    } finally {
        await pool.end();
    }
})();
