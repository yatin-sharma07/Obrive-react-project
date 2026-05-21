const { prisma } = require("../../../../prisma");

const endRoomService = async (
  payload,
  userId
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
  // VERIFY USER IS HOST
  // ==========================

  if (room.createdBy !== userId) {
    throw new Error(
      "Only the host can end the room"
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
            "ended",

          endTime:
            new Date(),
        },
      }
    );

  return updatedRoom;
};

module.exports = {
  endRoomService,
};