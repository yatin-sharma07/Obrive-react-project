// backend/src/modules/client/client.profile.service.js
const { prisma } = require('../../config/db');

class ClientProfileService {
  
  // Get client profile
  async getProfile(clientId) {
    const result = await prisma.$queryRaw`
      SELECT id, userid, name, email, date_of_birth, status, created_at
      FROM users 
      WHERE userid = ${clientId} AND role = 'client'
      LIMIT 1
    `;
    
    if (!result[0]) {
      throw new Error('Client not found');
    }
    
    return {
      id: result[0].id,
      clientId: result[0].userid,
      name: result[0].name,
      email: result[0].email,
      dateOfBirth: result[0].date_of_birth,
      status: result[0].status,
      memberSince: result[0].created_at
    };
  }
  
  // Update client profile
  async updateProfile(clientId, updateData) {
    const { name, dateOfBirth } = updateData;
    
    // Only execute update if there's something to update
    const hasName = name !== undefined && name !== null;
    const hasDOB = dateOfBirth !== undefined && dateOfBirth !== null;
    
    if (hasName && hasDOB) {
      // Update both name and DOB
      await prisma.$executeRaw`
        UPDATE users 
        SET name = ${name},
            date_of_birth = ${new Date(dateOfBirth)},
            updated_at = NOW()
        WHERE userid = ${clientId} AND role = 'client'
      `;
    } else if (hasName) {
      // Update only name
      await prisma.$executeRaw`
        UPDATE users 
        SET name = ${name},
            updated_at = NOW()
        WHERE userid = ${clientId} AND role = 'client'
      `;
    } else if (hasDOB) {
      // Update only DOB
      await prisma.$executeRaw`
        UPDATE users 
        SET date_of_birth = ${new Date(dateOfBirth)},
            updated_at = NOW()
        WHERE userid = ${clientId} AND role = 'client'
      `;
    }
    
    return this.getProfile(clientId);
  }
}

module.exports = new ClientProfileService();