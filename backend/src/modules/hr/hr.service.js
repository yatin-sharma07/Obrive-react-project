// backend/src/modules/hr/hr.service.js
const { prisma } = require('../../config/db');

class HRService {
  
  // Get HR dashboard statistics (FIXED - removed leave_requests)
  async getDashboardStats() {
    // Total employees
    const totalEmployees = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM users WHERE role = 'employee'
    `;
    
    // Active employees
    const activeEmployees = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM users WHERE role = 'employee' AND status = 'online'
    `;
    
    // New hires this month
    const newHires = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM users 
      WHERE role = 'employee' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `;
    
    // Get unique departments count
    const departments = await prisma.$queryRaw`
      SELECT DISTINCT department FROM users WHERE role = 'employee' AND department IS NOT NULL
    `;
    
    return {
      totalEmployees: Number(totalEmployees[0].count),
      activeEmployees: Number(activeEmployees[0].count),
      newHiresThisMonth: Number(newHires[0].count),
      totalDepartments: departments.length
    };
  }
  
  // Get all employees
  async getAllEmployees() {
    return await prisma.$queryRaw`
      SELECT id, userid, email, name, role, status, department, job_title, phone_number, created_at
      FROM users 
      WHERE role = 'employee'
      ORDER BY created_at DESC
    `;
  }
  
  // Get employee by ID
  async getEmployeeById(employeeId) {
    const result = await prisma.$queryRaw`
      SELECT id, userid, email, name, role, status, department, job_title, phone_number, date_of_birth, bio, created_at
      FROM users 
      WHERE id = ${employeeId} AND role = 'employee'
      LIMIT 1
    `;
    
    if (!result[0]) {
      throw new Error('Employee not found');
    }
    return result[0];
  }
  
  // Get HR profile
  async getHRProfile(userId) {
    const result = await prisma.$queryRaw`
      SELECT id, userid, email, name, role, status, created_at
      FROM users 
      WHERE id = ${userId} AND role = 'hr'
      LIMIT 1
    `;
    
    if (!result[0]) {
      throw new Error('HR profile not found');
    }
    return result[0];
  }
  
  // Update HR profile
  async updateHRProfile(userId, data) {
    const { name, bio, dateOfBirth, phone } = data;
    
    await prisma.$executeRaw`
      UPDATE users 
      SET name = COALESCE(${name}, name),
          bio = COALESCE(${bio}, bio),
          date_of_birth = COALESCE(${dateOfBirth ? new Date(dateOfBirth) : null}, date_of_birth),
          phone_number = COALESCE(${phone}, phone_number),
          updated_at = NOW()
      WHERE id = ${userId} AND role = 'hr'
    `;
    
    return this.getHRProfile(userId);
  }
  
  // Update employee
  async updateEmployee(employeeId, data) {
    const { name, department, jobTitle, phone, status } = data;
    
    await prisma.$executeRaw`
      UPDATE users 
      SET name = COALESCE(${name}, name),
          department = COALESCE(${department}, department),
          job_title = COALESCE(${jobTitle}, job_title),
          phone_number = COALESCE(${phone}, phone_number),
          status = COALESCE(${status}, status),
          updated_at = NOW()
      WHERE id = ${employeeId} AND role = 'employee'
    `;
    
    return this.getEmployeeById(employeeId);
  }
  
  // Delete employee
  async deleteEmployee(employeeId) {
    await prisma.$executeRaw`
      DELETE FROM users WHERE id = ${employeeId} AND role = 'employee'
    `;
    return { message: 'Employee deleted successfully' };
  }
  
  // Search employees
  async searchEmployees(searchTerm) {
    return await prisma.$queryRaw`
      SELECT id, userid, email, name, role, status, department, job_title
      FROM users 
      WHERE role = 'employee' 
      AND (name ILIKE ${`%${searchTerm}%`} OR email ILIKE ${`%${searchTerm}%`} OR department ILIKE ${`%${searchTerm}%`})
      LIMIT 20
    `;
  }
}

module.exports = new HRService();