const { prisma } =
  require("../../../../prisma");

const { getIO } =
  require("../../../socket");

const {
  getPendingHandRequestsService,
} = require("../room-hand-requests/roomHandRequests.service");

const {
  getRoomDetailsService,
} = require("../room-details/roomDetails.service");

const emitHandRaiseUpdated =
  async (roomId) => {
    const pendingHandRaises =
      await getPendingHandRequestsService(
        roomId
      );

    const io =
      getIO();

    io.to(
      `audio-room:${roomId}`
    ).emit(
      "hand_raise_updated",
      {
        roomId:
          Number(roomId),

        pendingHandRaises,
      }
    );

    return pendingHandRaises;
  };

const handleHandRequestActionService =
  async (payload) => {
    const {
      requestId,
      roomId,
      action,
    } = payload;

    if (
      action !== "approve" &&
      action !== "reject"
    ) {
      throw new Error(
        "Invalid hand request action"
      );
    }

    const request =
      await prisma.room_hand_raises.findFirst(
        {
          where: {
            id:
              Number(requestId),

            roomId:
              Number(roomId),

            status:
              "pending",
          },
        }
      );

    if (!request) {
      throw new Error(
        "Pending hand request not found"
      );
    }

    const status =
      action === "approve"
        ? "approved"
        : "rejected";

    const result =
      await prisma.$transaction(
        async (tx) => {
          const updatedRequest =
            await tx.room_hand_raises.update(
              {
                where: {
                  id:
                    request.id,
                },

                data: {
                  status,
                  respondedAt:
                    new Date(),
                },
              }
            );

          if (
            action === "approve"
          ) {
            await tx.room_participants.updateMany(
              {
                where: {
                  roomId:
                    Number(roomId),

                  userId:
                    request.userId,

                  leftAt:
                    null,
                },

                data: {
                  roomRole:
                    "speaker",
                },
              }
            );
          }

          return updatedRequest;
        }
      );

    const pendingHandRaises =
      await emitHandRaiseUpdated(
        roomId
      );

    if (
      action === "approve"
    ) {
      const roomDetails =
        await getRoomDetailsService(
          roomId,
          request.userId
        );

      const io =
        getIO();

      io.to(
        `audio-room:${roomId}`
      ).emit(
        "participant_updated",
        {
          roomId:
            Number(roomId),

          participants:
            roomDetails.participants,
        }
      );
    }

    return {
      request:
        result,

      pendingHandRaises,
    };
  };

module.exports = {
  emitHandRaiseUpdated,
  handleHandRequestActionService,
};
