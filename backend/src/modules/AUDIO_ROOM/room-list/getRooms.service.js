const { prisma } = require("../../../../prisma");

const getRoomsService = async () => {
  const rooms =
    await prisma.room_configs.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            userid: true,
            role: true,
          },
        },

        roleAssignments: true,
        joinPermissions: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return rooms;
};

module.exports = {
  getRoomsService,
};