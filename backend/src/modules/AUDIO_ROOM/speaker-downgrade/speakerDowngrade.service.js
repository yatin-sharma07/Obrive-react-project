const { prisma } =
  require("../../../../prisma");

const downgradeToListenerService =
  async (payload) => {
    const {
      roomId,
      userId,
    } = payload;

    // ==========================
    // VALIDATE PARTICIPANT
    // ==========================

    const participant =
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

    if (!participant) {
      throw new Error(
        "Participant not found in room"
      );
    }

    // ==========================
    // VERIFY NOT HOST
    // ==========================

    if (
      participant.roomRole === "host" ||
      participant.roomRole === "admin"
    ) {
      throw new Error(
        "Cannot downgrade host or admin"
      );
    }

    // ==========================
    // UPDATE ROLE TO LISTENER
    // ==========================

    const updated =
      await prisma.room_participants.update(
        {
          where: {
            id: participant.id,
          },

          data: {
            roomRole: "listener",
            isMuted: true,
          },
        }
      );

    return {
      success: true,
      data: updated,
      message:
        "Speaker downgraded to listener",
    };
  };

module.exports = {
  downgradeToListenerService,
};
