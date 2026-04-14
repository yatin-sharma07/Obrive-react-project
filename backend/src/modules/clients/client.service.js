// backend/src/modules/client/client.service.js
const { prisma } = require('../../config/db');
const jwt = require('jsonwebtoken');

// ========== LOGIN SERVICE (NEW - ADD THIS) ==========
exports.clientLogin = async (clientId) => {
  // Find client by clientId using raw query
  const result = await prisma.$queryRaw`
    SELECT id, userid, name, email, role, status 
    FROM users 
    WHERE userid = ${clientId} AND role = 'client'
    LIMIT 1
  `;
  
  const client = result[0];
  
  if (!client) {
    const error = new Error('Invalid Client ID');
    error.status = 401;
    throw error;
  }
  
  if (client.status !== 'active' && client.status !== 'offline') {
    const error = new Error('Account disabled. Contact admin.');
    error.status = 401;
    throw error;
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      id: client.id, 
      clientId: client.userid, 
      name: client.name, 
      role: client.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return {
    token,
    user: {
      clientId: client.userid,
      name: client.name,
      email: client.email,
      role: client.role
    }
  };
};

// ========== HIS EXISTING CODE (Keep as is - DON'T CHANGE) ==========
exports.getMyProfile = async (clientId) => {
  const client = await prisma.client.findUnique({
    where:  { id: clientId },
    select: { id: true, clientId: true, companyName: true, contactName: true, email: true, phone: true, industry: true },
  });
  if (!client) throw { status: 404, message: 'Client not found' };
  return client;
};

exports.getMyProjects = async (clientId) => {
  return prisma.project.findMany({
    where:   { clientId },
    include: {
      assignments: {
        include: { employee: { select: { fullName: true, designation: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

exports.getProjectById = async (clientId, projectId) => {
  const project = await prisma.project.findFirst({
    where:   { id: projectId, clientId },
    include: {
      assignments: { include: { employee: true } },
      meetings:    true,
    },
  });
  if (!project) throw { status: 404, message: 'Project not found' };
  return project;
};

exports.requestProject = async (clientId, data) => {
  return prisma.project.create({
    data: {
      title:       data.title,
      description: data.description,
      clientId,
      status:      'PENDING',
    },
  });
};