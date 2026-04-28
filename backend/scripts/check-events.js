// backend/check-events.js
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

async function checkEvents() {
    try {
        // Check if table exists
        const tableCheck = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'events'
            )
        `);
        
        if (tableCheck.rows[0].exists) {
            console.log('✅ Events table exists');
            
            // Get column info
            const columns = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'events'
                ORDER BY ordinal_position
            `);
            console.log('\n📋 Columns:');
            columns.rows.forEach(col => {
                console.log(`   - ${col.column_name} (${col.data_type})`);
            });
            
            // Get row count
            const count = await pool.query('SELECT COUNT(*) FROM events');
            console.log(`\n📊 Total events: ${count.rows[0].count}`);
            
        } else {
            console.log('❌ Events table does NOT exist');
            console.log('\n💡 Run: node scripts/create-events-table.js');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkEvents();