const { prisma } =
  require("../../../../prisma");

const {
  getIO,
} = require(
  "../../../socket"
);

const raiseHandService =
  async (payload) => {
    const {
      roomId,
      userId,
    } = payload;

    // ==========================
    // CHECK ACTIVE PARTICIPANT
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

    if (
      !participant
    ) {
      throw new Error(
        "User is not inside room"
      );
    }

    // ==========================
    // CHECK EXISTING REQUEST
    // ==========================

    const existingRequest =
      await prisma.room_hand_raises.findFirst(
        {
          where: {
            roomId:
              Number(roomId),

            userId:
              Number(userId),

            status:
              "pending",
          },
        }
      );

    if (
      existingRequest
    ) {
      throw new Error(
        "Hand already raised"
      );
    }

    // ==========================
    // CREATE REQUEST
    // ==========================

    const request =
      await prisma.room_hand_raises.create(
        {
          data: {
            roomId:
              Number(roomId),

            userId:
              Number(userId),
          },

          include: {
            user: {
              select: {
                id: true,
                name: true,
                userid:
                  true,
              },
            },
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
      "hand_raised",
      request
    );

    return request;
  };

module.exports = {
  raiseHandService,
};