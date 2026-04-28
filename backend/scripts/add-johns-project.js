// backend/scripts/add-johns-project.js
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

async function addJohnsProject() {
    try {
        console.log('🔧 Adding project for John...\n');
        
        // Get John's employee ID
        const john = await pool.query(`SELECT id FROM users WHERE email = 'john@obrive.com'`);
        
        if (john.rows.length === 0) {
            console.log('❌ John not found. Make sure john@obrive.com exists.');
            return;
        }
        
        const johnId = john.rows[0].id;
        console.log(`✅ Found John with ID: ${johnId}`);
        
        // Generate new project ID
        const lastProject = await pool.query(`SELECT project_id FROM projects ORDER BY id DESC LIMIT 1`);
        let newProjectId = 'PN0001301';
        
        if (lastProject.rows.length > 0) {
            const lastNum = parseInt(lastProject.rows[0].project_id.replace('PN', ''));
            const nextNum = lastNum + 1;
            newProjectId = `PN${String(nextNum).padStart(7, '0')}`;
        }
        
        console.log(`📝 New Project ID: ${newProjectId}`);
        
        // Insert project
        await pool.query(`
            INSERT INTO projects (project_id, name, description, priority, created_at)
            VALUES ($1, 'John Secret Project', 'This project is only visible to John', 'high', NOW())
        `, [newProjectId]);
        console.log('✅ Project created');
        
        // Get the new project ID
        const project = await pool.query(`SELECT id FROM projects WHERE project_id = $1`, [newProjectId]);
        const projectDbId = project.rows[0].id;
        
        // Assign ONLY John to this project
        await pool.query(`
            INSERT INTO project_assignments (project_id, employee_id)
            VALUES ($1, $2)
        `, [projectDbId, johnId]);
        console.log('✅ Assigned only John to this project');
        
        // Verify
        const result = await pool.query(`
            SELECT p.project_id, p.name, u.email
            FROM projects p
            JOIN project_assignments pa ON pa.project_id = p.id
            JOIN users u ON u.id = pa.employee_id
            WHERE p.project_id = $1
        `, [newProjectId]);
        
        console.log('\n📋 Verification:');
        console.table(result.rows);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

addJohnsProject();