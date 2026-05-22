const { prisma } = require("../../../../prisma");

const joinRoomService = async (payload) => {
  const {
    roomId,
    userId,
    passkey,
  } = payload;

const { getIO,} = require( "../../../socket");


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

    console.log(
  "JOIN USER:",
  user.id,
  user.role
);

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

// ==================================
// ADD PARTICIPANT
// ==================================

const addParticipant =
  async (
    roomRole
  ) => {
    const existingParticipant =
      await prisma.room_participants.findFirst(
        {
          where: {
            roomId:
              Number(roomId),

            userId:
              Number(userId),

            leftAt: null,
          },
        }
      );

    if (
      !existingParticipant
    ) {
      await prisma.room_participants.create(
        {
          data: {
            roomId:
              Number(roomId),

            userId:
              Number(userId),

            roomRole,
          },
        }
      );

      // ==========================
      // SOCKET UPDATE
      // ==========================

      const io =
        getIO();

      io.to(
        `audio-room:${roomId}`
      ).emit(
        "participant_updated"
      );
    }
  };


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
  await addParticipant(
    assignedRole.assignedRoomRole
  );

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

    console.log(
      "ROOM PERMISSIONS:",
      room.joinPermissions
    );

    console.log(
      "USER ROLE:",
      user.role
    );

    if (hasRoleAccess) {
      await addParticipant(
        "listener"
      );

  return {
    allowed: true,
    roomRole:
      "listener",
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
  await addParticipant(
    "listener"
  );

  return {
    allowed: true,
    roomRole:
      "listener",
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