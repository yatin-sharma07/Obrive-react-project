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

async function createEventsTable() {
    console.log('🔧 Creating events table...\n');
    
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                event_date DATE NOT NULL,
                event_time TIME,
                end_date DATE,
                end_time TIME,
                location VARCHAR(255),
                event_type VARCHAR(50) DEFAULT 'general',
                created_by INT REFERENCES users(id),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log('✅ Events table created');
        
        // Create indexes
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date)
        `);
        console.log('✅ Index on event_date created');
        
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by)
        `);
        console.log('✅ Index on created_by created');
        
        console.log('\n🎉 Events table setup complete!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

createEventsTable();