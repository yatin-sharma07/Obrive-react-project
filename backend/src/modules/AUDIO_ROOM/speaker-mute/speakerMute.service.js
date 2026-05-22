const { prisma } =
  require("../../../../prisma");

const muteUnmuteService =
  async (payload) => {
    const {
      roomId,
      userId,
      isMuted,
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
    // UPDATE MUTE STATUS
    // ==========================

    const updated =
      await prisma.room_participants.update(
        {
          where: {
            id: participant.id,
          },

          data: {
            isMuted: Boolean(isMuted),
          },
        }
      );

    return {
      success: true,
      data: updated,
      message: isMuted
        ? "Speaker muted"
        : "Speaker unmuted",
    };
  };

module.exports = {
  muteUnmuteService,
};
