const { prisma } = require("../../../../prisma");

const joinRoomService = async (payload) => {
  const {
    roomId,
    userId,
    passkey,
  } = payload;

  // ==================================
  // FIND ROOM
  // ==================================

  const room =
    await prisma.room_configs.findUnique({
      where: {
        id: Number(roomId),
      },

      include: {
        joinPermissions: true,
        roleAssignments: true,
        invites: true,
      },
    });

  if (!room) {
    throw new Error("Room not found");
  }

  // ==================================
  // CHECK ROOM STATUS
  // ==================================

  if (
    room.roomStatus !== "live" &&
    room.roomStatus !== "scheduled"
  ) {
    throw new Error(
      "Room is not available"
    );
  }

  // ==================================
  // GET USER
  // ==================================

  const user =
    await prisma.users.findUnique({
      where: {
        id: Number(userId),
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  // ==================================
  // CHECK SPECIFIC ROLE ASSIGNMENT
  // ==================================

  const assignedRole =
    room.roleAssignments.find(
      (role) =>
        role.assignmentType ===
          "specific-user" &&
        role.userId ===
          Number(userId)
    );

  if (assignedRole) {
    return {
      allowed: true,
      roomRole:
        assignedRole.assignedRoomRole,
      room,
    };
  }

  // ==================================
  // CHECK CRM ROLE ACCESS
  // ==================================

  const hasRoleAccess =
    room.joinPermissions.find(
      (permission) =>
        permission.permissionType ===
          "crm-role" &&
        permission.crmRole?.toLowerCase() ===
          user.role?.toLowerCase()
    );

  if (hasRoleAccess) {
    return {
      allowed: true,
      roomRole: "listener",
      room,
    };
  }

  // ==================================
  // CHECK GUEST ACCESS
  // ==================================

  const guestAllowed =
    room.joinPermissions.find(
      (permission) =>
        permission.permissionType ===
        "guest"
    );

  if (
    guestAllowed &&
    room.allowGuestUsers
  ) {
    return {
      allowed: true,
      roomRole: "listener",
      room,
    };
  }

  // ==================================
  // ACCESS DENIED
  // ==================================

  throw new Error(
    "You are not allowed to join this room"
  );
};

module.exports = {
  joinRoomService,
};