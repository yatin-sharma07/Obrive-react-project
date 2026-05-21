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
    // GROUP PARTICIPANTS
    // TEMP MOCK DATA
    // Later realtime
    // ==========================

    const participants =
      {
        hostAndSpeakers:
          [],
        moderators:
          [],
        listeners: [],
      };

    return {
      room,
      myRole,
      participants,
    };
  };

module.exports = {
  getRoomDetailsService,
};