const { prisma } =
  require("../../../../prisma");

const getPendingHandRequestsService =
  async (roomId) => {
    return prisma.room_hand_raises.findMany(
      {
        where: {
          roomId:
            Number(roomId),

          status:
            "pending",
        },

        orderBy: {
          requestedAt:
            "asc",
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              userid: true,
            },
          },
        },
      }
    );
  };

module.exports = {
  getPendingHandRequestsService,
};
