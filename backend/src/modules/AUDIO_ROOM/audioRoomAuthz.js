const { prisma } = require("../../../prisma");

const MODERATOR_ROOM_ROLES = ["host", "moderator", "admin"];

const normalizeRole = (role) => String(role || "").toLowerCase();

const getActiveParticipant = async (roomId, userId) =>
  prisma.room_participants.findFirst({
    where: {
      roomId: Number(roomId),
      userId: Number(userId),
      leftAt: null,
    },
  });

const getActorRoomRole = async (roomId, userId) => {
  const room = await prisma.room_configs.findUnique({
    where: {
      id: Number(roomId),
    },
    select: {
      id: true,
      createdBy: true,
    },
  });

  if (!room) {
    const error = new Error("Room not found");
    error.status = 404;
    throw error;
  }

  if (Number(room.createdBy) === Number(userId)) {
    return "host";
  }

  const participant = await getActiveParticipant(roomId, userId);
  return participant?.roomRole || null;
};

const requireRoomRoles =
  (allowedRoles = MODERATOR_ROOM_ROLES) =>
  async (req, res, next) => {
    try {
      const roomId = req.body?.roomId || req.params?.roomId || req.query?.roomId;

      if (!roomId) {
        return res.status(400).json({
          success: false,
          message: "roomId is required",
        });
      }

      const role = await getActorRoomRole(roomId, req.user.id);

      if (!allowedRoles.map(normalizeRole).includes(normalizeRole(role))) {
        return res.status(403).json({
          success: false,
          message: "Only room hosts or moderators can perform this action",
        });
      }

      req.roomRole = role;
      next();
    } catch (error) {
      next(error);
    }
  };

const canModerateRoom = async (roomId, userId) => {
  const role = await getActorRoomRole(roomId, userId);
  return MODERATOR_ROOM_ROLES.includes(normalizeRole(role));
};

module.exports = {
  MODERATOR_ROOM_ROLES,
  canModerateRoom,
  getActiveParticipant,
  getActorRoomRole,
  requireRoomRoles,
};
