const { prisma } = require("../../../../prisma");

const startRoomService = async (
  payload
) => {
  const { roomId } = payload;

  // ==========================
  // FIND ROOM
  // ==========================

  const room =
    await prisma.room_configs.findUnique(
      {
        where: {
          id: Number(roomId),
        },
      }
    );

  if (!room) {
    throw new Error(
      "Room not found"
    );
  }

  // ==========================
  // UPDATE STATUS
  // ==========================

  const updatedRoom =
    await prisma.room_configs.update(
      {
        where: {
          id: Number(roomId),
        },

        data: {
          roomStatus:
            "live",
        },
      }
    );

  return updatedRoom;
};

module.exports = {
  startRoomService,
};