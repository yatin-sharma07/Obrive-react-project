const { prisma } = require("../../../../prisma");

const endRoomService = async (payload, userId, userRole) => {
  const { roomId } = payload;

  const room = await prisma.room_configs.findUnique({
    where: {
      id: Number(roomId),
    },
  });

  if (!room) {
    throw new Error("Room target parameters not found.");
  }

 
  const hasGlobalPrivileges = userRole === "admin" || userRole === "supervisor";
  const isRoomHost = room.createdBy === userId;

  if (!hasGlobalPrivileges && !isRoomHost) {
    throw new Error("Only the active host creator or an administrator can end this session.");
  }

 
  const updatedRoom = await prisma.room_configs.update({
    where: {
      id: Number(roomId),
    },
    data: {
      roomStatus: "ended",
      endTime: new Date(),
    },
  });

  return updatedRoom;
};

module.exports = {
  endRoomService,
};