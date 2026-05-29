const { prisma } = require("../../../../prisma");
const { getRoomDetailsService,} = require("../room-details/roomDetails.service");
const { getIO,} = require( "../../../socket");
const { createLiveKitToken,} = require("../livekit/token/create-token");

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

  const isRoomCreator =
    Number(room.createdBy) ===
    Number(user.id);

  const isAdminUser =
    user.role?.toLowerCase() ===
    "admin";

  const isSupervisorUser =
    user.role?.toLowerCase() ===
    "supervisor";

  console.log(
    "JOIN USER:",
    user.id,
    user.role
  );

  if (isRoomCreator) {
    await addParticipant(
      "host"
    );

    const livekitToken =
      await createLiveKitToken({
        roomName:
          room.id.toString(),

        participantId:
          user.id.toString(),

        participantName:
          user.name ||
          user.username ||
          `user-${user.id}`,

        role:
          "host",
      });

    return {
      allowed: true,
      roomRole:
        "host",
      room,
      livekitToken,
    };
  }

  if (isAdminUser) {
    await addParticipant(
      "moderator"
    );

    const livekitToken =
      await createLiveKitToken({
        roomName:
          room.id.toString(),

        participantId:
          user.id.toString(),

        participantName:
          user.name ||
          user.username ||
          `user-${user.id}`,

        role:
          "moderator",
      });

    return {
      allowed: true,
      roomRole:
        "moderator",
      room,
      livekitToken,
    };
  }

  if (isSupervisorUser) {
    await addParticipant(
      "moderator"
    );

    const livekitToken =
      await createLiveKitToken({
        roomName:
          room.id.toString(),

        participantId:
          user.id.toString(),

        participantName:
          user.name ||
          user.username ||
          `user-${user.id}`,

        role:
          "moderator",
      });

    return {
      allowed: true,
      roomRole:
        "moderator",
      room,
      livekitToken,
    };
  }

// ==================================
// ADD PARTICIPANT
// ==================================

async function addParticipant(roomRole) {
    await prisma.$transaction(
      async (tx) => {
        const activeParticipants =
          await tx.room_participants.findMany(
            {
              where: {
                roomId:
                  Number(roomId),

                userId:
                  Number(userId),

                leftAt: null,
              },

              orderBy: {
                joinedAt:
                  "asc",
              },
            }
          );

        const [primaryParticipant,
          ...duplicateParticipants] =
          activeParticipants;

        if (
          duplicateParticipants.length
        ) {
          await tx.room_participants.updateMany(
            {
              where: {
                id: {
                  in:
                    duplicateParticipants.map(
                      (
                        participant
                      ) => participant.id
                    ),
                },
              },

              data: {
                leftAt:
                  new Date(),
              },
            }
          );
        }

        if (
          primaryParticipant
        ) {
          return;
        }

        await tx.room_participants.create(
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
      }
    );

    const io =
      getIO();

    const roomDetails =
      await getRoomDetailsService(
        roomId,
        userId
      );

    io.to(
      `audio-room:${roomId}`
    ).emit(
      "participant_updated",
      {
        roomId:
          Number(
            roomId
          ),

        participants:
          roomDetails.participants,
      }
    );
}


  // ==================================
  // CHECK ROLE ASSIGNMENTS
  // ==================================

  const assignedRole =
    room.roleAssignments.find(
      (role) =>
        (
          role.assignmentType ===
            "specific-user" &&
          role.userId ===
            Number(userId)
        ) ||
        (
          role.assignmentType ===
            "crm-role" &&
          role.crmRole?.toLowerCase() ===
            user.role?.toLowerCase()
        )
    );

if (assignedRole) {
  await addParticipant(
    assignedRole.assignedRoomRole
  );

  const livekitToken =
    await createLiveKitToken({
      roomName:
        room.id.toString(),

      participantId:
        user.id.toString(),

      participantName:
        user.name ||
        user.username ||
        `user-${user.id}`,

      role:
        assignedRole.assignedRoomRole,
    });

  return {
    allowed: true,
    roomRole:
      assignedRole.assignedRoomRole,
    room,
    livekitToken,
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

  const livekitToken =
    await createLiveKitToken({
      roomName:
        room.id.toString(),

      participantId:
        user.id.toString(),

      participantName:
        user.name ||
        user.username ||
        `user-${user.id}`,

      role:
        "listener",
    });

  return {
    allowed: true,
    roomRole:
      "listener",
    room,
    livekitToken,
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

  const livekitToken =
    await createLiveKitToken({
      roomName:
        room.id.toString(),

      participantId:
        user.id.toString(),

      participantName:
        user.name ||
        user.username ||
        `user-${user.id}`,

      role:
        "listener",
    });

  return {
    allowed: true,
    roomRole:
      "listener",
    room,
    livekitToken,
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
