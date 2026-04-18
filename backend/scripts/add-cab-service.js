// backend/scripts/add-cab-service.js
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

async function addCabService() {
    console.log('🚕 Adding Cab Service project...\n');
    
    try {
        // Insert new project
        await pool.query(`
            INSERT INTO projects (project_id, name, description, priority, created_at)
            VALUES ('PN0001300', 'Cab Service', 'Ride hailing and taxi booking platform', 'high', NOW())
            ON CONFLICT (project_id) DO NOTHING
        `);
        console.log('✅ Cab Service project added');
        
        // Get the project ID
        const project = await pool.query(`SELECT id FROM projects WHERE project_id = 'PN0001300'`);
        
        if (project.rows.length > 0) {
            const projectId = project.rows[0].id;
            
            // Get employees to assign
            const employees = await pool.query(`SELECT id FROM users WHERE role = 'employee' LIMIT 3`);
            
            // Assign employees to this project
            for (const emp of employees.rows) {
                await pool.query(`
                    INSERT INTO project_assignments (project_id, employee_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                `, [projectId, emp.id]);
            }
            console.log('✅ Employees assigned to Cab Service project');
        }
        
        // Show all projects
        const allProjects = await pool.query(`SELECT project_id, name, priority, created_at FROM projects ORDER BY created_at DESC`);
        console.log('\n📋 All Projects:');
        console.table(allProjects.rows);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

addCabService();