const { prisma } =
  require("../../../../prisma");

const removeParticipantService =
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
    // REMOVE FROM ROOM
    // ==========================

    const updated =
      await prisma.room_participants.update(
        {
          where: {
            id: participant.id,
          },

          data: {
            leftAt: new Date(),
          },
        }
      );

    return {
      success: true,
      data: updated,
      message:
        "User removed from room",
    };
  };

module.exports = {
  removeParticipantService,
};
