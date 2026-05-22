const { prisma } =
  require("../../../prisma");
const {
  getRoomDetailsService,
} = require("../../modules/AUDIO_ROOM/room-details/roomDetails.service");

exports.registerAudioRoomHandler =
  (
    io,
    socket
  ) => {

    // ==========================
    // JOIN AUDIO ROOM
    // ==========================

    socket.on(
      "join_audio_room",
      async (
        payload,
        legacyUserId
      ) => {
        const roomId =
          typeof payload ===
          "object"
            ? payload.roomId
            : payload;

        const userId =
          Number(
            typeof payload ===
            "object"
              ? payload.userId
              : legacyUserId
          ) ||
          Number(
            socket.user?.id
          );

        if (
          !roomId ||
          !userId
        ) {
          return;
        }

        socket.join(
          `audio-room:${roomId}`
        );

        socket.currentRoomId =
          Number(
            roomId
          );

        console.log(
          `User ${userId} joined room ${roomId}`
        );

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
    );

    // ==========================
    // LEAVE AUDIO ROOM
    // ==========================

    socket.on(
      "leave_audio_room",
      async (
        payload,
        legacyUserId
      ) => {
        const roomId =
          typeof payload ===
          "object"
            ? payload.roomId
            : payload;

        const userId =
          Number(
            typeof payload ===
            "object"
              ? payload.userId
              : legacyUserId
          ) ||
          Number(
            socket.user?.id
          );

        if (
          !roomId ||
          !userId
        ) {
          return;
        }

        await prisma.room_participants.updateMany(
          {
            where: {
              roomId:
                Number(
                  roomId
                ),

              userId:
                userId,

              leftAt:
                null,
            },

            data: {
              leftAt:
                new Date(),
            },
          }
        );

        socket.leave(
          `audio-room:${roomId}`
        );

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
    );

    // ==========================
    // DISCONNECT
    // ==========================

    socket.on(
      "disconnect",
      async () => {

        const roomId =
          socket.currentRoomId;

        if (
          !roomId
        ) return;

        await prisma.room_participants.updateMany(
          {
            where: {
              roomId,
              userId:
                Number(
                  socket.user.id
                ),

              leftAt:
                null,
            },

            data: {
              leftAt:
                new Date(),
            },
          }
        );

        const roomDetails =
          await getRoomDetailsService(
            roomId,
            socket.user.id
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

        console.log(
          `User ${socket.user.id} disconnected from room ${roomId}`
        );
      }
    );
  };
