const { prisma } = require('../../../prisma');

class ProfileService {
  async getProfileById(id) {
    const profile = await prisma.users.findUnique({
      where: { id: Number(id) },
    });

    if (!profile) {
      const err = new Error('Profile not found');
      err.status = 404;
      throw err;
    }

    return profile;
  }

  async updateProfileById(id, data) {
    const userId = Number(id);
    const existing = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      const err = new Error('Profile not found');
      err.status = 404; 
      throw err;
    }

    return prisma.users.update({
      where: { id: userId },
      data: {
        name: data.fullName ?? existing.name,
        email: data.email ?? existing.email,
        department: data.department ?? existing.department,
        job_title: data.jobTitle ?? existing.job_title,
        phone_number: data.phoneNumber ?? existing.phone_number,
        join_date: data.joinDate ? new Date(data.joinDate) : existing.join_date,
        biography: data.biography ?? existing.biography,
      },
    });
  }
}

module.exports = new ProfileService();
