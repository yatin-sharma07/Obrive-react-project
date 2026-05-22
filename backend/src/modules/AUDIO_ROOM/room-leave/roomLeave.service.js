const { prisma } =
  require("../../../../prisma");

const { getIO } =
  require("../../../socket");

const {
  getRoomDetailsService,
} = require("../room-details/roomDetails.service");

const leaveRoomService =
  async (payload) => {
    const {
      roomId,
      userId,
    } = payload;

    // ==========================
    // FIND PARTICIPANT
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
        "User is not inside room"
      );
    }

    // ==========================
    // MARK LEFT
    // ==========================

    const updatedParticipant =
      await prisma.room_participants.update(
        {
          where: {
            id:
              participant.id,
          },

          data: {
            leftAt:
              new Date(),
          },
        }
      );

      const io = getIO();

      const roomDetails =
        await getRoomDetailsService(
          roomId,
          userId
        );

        io.to( `audio-room:${roomId}`).emit("participant_updated", {
          roomId:
            Number(
              roomId
            ),

          participants:
            roomDetails.participants,
        });

    return updatedParticipant;
  };

module.exports = {
  leaveRoomService,
};
