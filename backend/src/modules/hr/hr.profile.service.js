// backend/src/modules/hr/hr.profile.service.js
const { prisma } = require('../../config/db');

class HRProfileService {
  
  async getProfile(userId) {
    const result = await prisma.$queryRaw`
      SELECT id, userid, email, name, role, status, biography, phone_number, date_of_birth, created_at
      FROM users 
      WHERE id = ${userId} AND role = 'hr'
      LIMIT 1
    `;
    
    if (!result[0]) {
      throw new Error('HR profile not found');
    }
    
    return {
      id: result[0].id,
      userid: result[0].userid,
      email: result[0].email,
      name: result[0].name,
      role: result[0].role,
      status: result[0].status,
      bio: result[0].biography,
      phone: result[0].phone_number,
      dateOfBirth: result[0].date_of_birth,
      joinedDate: result[0].created_at
    };
  }
  
  async updateProfile(userId, updateData) {
    const { name, bio, phone, dateOfBirth } = updateData;
    
    // Build dynamic update query based on provided fields
    let updateFields = [];
    let values = [];
    let paramCount = 1;
    
    if (name) {
      updateFields.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (bio) {
      updateFields.push(`biography = $${paramCount++}`);
      values.push(bio);
    }
    if (phone) {
      updateFields.push(`phone_number = $${paramCount++}`);
      values.push(phone);
    }
    if (dateOfBirth) {
      updateFields.push(`date_of_birth = $${paramCount++}`);
      values.push(new Date(dateOfBirth));
    }
    
    updateFields.push(`updated_at = NOW()`);
    
    if (updateFields.length === 1) {
      // Only updated_at, no other changes
      return this.getProfile(userId);
    }
    
    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount} AND role = 'hr'
    `;
    values.push(userId);
    
    await prisma.$executeRawUnsafe(updateQuery, ...values);
    
    return this.getProfile(userId);
  }
}

module.exports = new HRProfileService();