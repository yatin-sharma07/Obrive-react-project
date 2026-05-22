const { prisma } =
  require("../../../../prisma");

const getRoomDetailsService =
  async (
    roomId,
    userId
  ) => {
    // ==========================
    // GET ROOM
    // ==========================

    const room =
      await prisma.room_configs.findUnique(
        {
          where: {
            id: Number(
              roomId
            ),
          },

          include: {
            roleAssignments:
              true,

            joinPermissions:
              true,
          },
        }
      );

    if (!room) {
      throw new Error(
        "Room not found"
      );
    }

    // ==========================
    // FIND CURRENT USER ROLE
    // ==========================

    let myRole =
      "listener";

    const specificUserRole =
      room.roleAssignments.find(
        (
          assignment
        ) =>
          assignment.userId ===
          Number(
            userId
          )
      );

    if (
      specificUserRole
    ) {
      myRole =
        specificUserRole.assignedRoomRole;
    }

// ==========================
// GET PARTICIPANTS
// ==========================

const roomParticipants =
  await prisma.room_participants.findMany(
    {
      where: {
        roomId:
          Number(roomId),

        leftAt: null,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            userid: true,
            role: true,
          },
        },
      },
    }
  );

const uniqueRoomParticipants =
  Array.from(
    roomParticipants
      .reduce(
        (
          map,
          participant
        ) => {
          const existingParticipant =
            map.get(
              participant.userId
            );

          if (
            !existingParticipant ||
            participant.joinedAt >
              existingParticipant.joinedAt
          ) {
            map.set(
              participant.userId,
              participant
            );
          }

          return map;
        },
        new Map()
      )
      .values()
  );

const currentParticipant =
  uniqueRoomParticipants.find(
    (
      participant
    ) =>
      participant.userId ===
      Number(userId)
  );

if (
  currentParticipant
) {
  myRole =
    currentParticipant.roomRole;
}

// ==========================
// GROUP PARTICIPANTS
// ==========================

    const participants =
      {
        hostAndSpeakers:
          [],

        moderators:
          [],

        listeners:
          [],
      };

    uniqueRoomParticipants.forEach(
      (
        participant
      ) => {
        const user =
          participant.user;

        const formattedUser =
          {
            id: user.id,

            name:
              user.name,

            userid:
              user.userid,

            role:
              participant.roomRole,

            isMuted:
              participant.isMuted,

            isSpeaking:
              participant.isSpeaking,
          };

        if (
          participant.roomRole ===
            "host" ||
          participant.roomRole ===
            "speaker"
        ) {
          participants.hostAndSpeakers.push(
            formattedUser
          );
        }

        else if (
          participant.roomRole ===
          "moderator"
        ) {
          participants.moderators.push(
            formattedUser
          );
        }

        else {
          participants.listeners.push(
            formattedUser
          );
        }
      }
    );

    return {
      room,
      myRole,
      participants,
    };
  };

module.exports = {
  getRoomDetailsService,
};
