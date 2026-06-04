const { prisma } = require("../../../../../prisma");
const { createLiveKitToken } = require("../token/create-token");

const assertRoomAccess = async (roomId, userId) => {
  const room = await prisma.room_configs.findUnique({
    where: {
      id: Number(roomId),
    },
    include: {
      joinPermissions: true,
      roleAssignments: true,
    },
  });

  if (!room) {
    const error = new Error("Room not found");
    error.status = 404;
    throw error;
  }

  const now = new Date();
  const startTime = room.startTime ? new Date(room.startTime) : null;
  const isFutureScheduledRoom =
    room.roomStatus === "scheduled" && (!startTime || startTime > now);

  if (room.roomStatus !== "live" && isFutureScheduledRoom) {
    const error = new Error("Room is not available yet");
    error.status = 403;
    throw error;
  }

  if (room.roomStatus !== "live" && room.roomStatus !== "scheduled") {
    const error = new Error("Room is not available");
    error.status = 403;
    throw error;
  }

  const user = await prisma.users.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (Number(room.createdBy) === Number(userId)) {
    return {
      room,
      user,
      roomRole: "host",
    };
  }

  if (user.role?.toLowerCase() === "admin") {
    return {
      room,
      user,
      roomRole: "moderator",
    };
  }

  if (user.role?.toLowerCase() === "supervisor") {
    return {
      room,
      user,
      roomRole: "moderator",
    };
  }

  const participant = await prisma.room_participants.findFirst({
    where: {
      roomId: Number(roomId),
      userId: Number(userId),
      leftAt: null,
    },
  });

  if (participant) {
    return {
      room,
      user,
      roomRole: participant.roomRole,
    };
  }

  const assignedRole = room.roleAssignments.find(
    (assignment) =>
      (assignment.assignmentType === "specific-user" &&
        Number(assignment.userId) === Number(userId)) ||
      (assignment.assignmentType === "crm-role" &&
        assignment.crmRole?.toLowerCase() === user.role?.toLowerCase())
  );

  if (assignedRole) {
    return {
      room,
      user,
      roomRole: assignedRole.assignedRoomRole,
    };
  }

  const hasRoleAccess = room.joinPermissions.find(
    (permission) =>
      permission.permissionType === "crm-role" &&
      permission.crmRole?.toLowerCase() === user.role?.toLowerCase()
  );

  if (hasRoleAccess) {
    return {
      room,
      user,
      roomRole: "listener",
    };
  }

  if (
    room.allowGuestUsers &&
    room.joinPermissions.some(
      (permission) => permission.permissionType === "guest"
    )
  ) {
    return {
      room,
      user,
      roomRole: "listener",
    };
  }

  const error = new Error("You are not allowed to join this room");
  error.status = 403;
  throw error;
};

const createLiveKitTokenForRoom = async ({ roomId, userId }) => {
  const { room, user, roomRole } = await assertRoomAccess(roomId, userId);

  const token = await createLiveKitToken({
    roomName: room.id.toString(),
    participantId: user.id.toString(),
    participantName: user.name || `user-${user.id}`,
    role: roomRole,
  });

  return {
    token,
    roomRole,
    roomId: room.id,
  };
};

module.exports = {
  assertRoomAccess,
  createLiveKitTokenForRoom,
};
