const { prisma } = require('../../config/db');

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