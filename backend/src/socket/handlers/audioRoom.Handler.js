const { prisma } =
  require("../../../prisma");

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
      (
        roomId
      ) => {

        socket.join(
          `audio-room:${roomId}`
        );

        socket.currentRoomId =
          Number(
            roomId
          );

        console.log(
          `User ${socket.user?.id} joined room ${roomId}`
        );

        io.to(
          `audio-room:${roomId}`
        ).emit(
          "participant_updated"
        );
      }
    );

    // ==========================
    // LEAVE AUDIO ROOM
    // ==========================

    socket.on(
      "leave_audio_room",
      async (
        roomId
      ) => {

        await prisma.room_participants.updateMany(
          {
            where: {
              roomId:
                Number(
                  roomId
                ),

              userId:
                socket.user.id,

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

        io.to(
          `audio-room:${roomId}`
        ).emit(
          "participant_updated"
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
                socket.user.id,

              leftAt:
                null,
            },

            data: {
              leftAt:
                new Date(),
            },
          }
        );

        io.to(
          `audio-room:${roomId}`
        ).emit(
          "participant_updated"
        );

        console.log(
          `User ${socket.user.id} disconnected from room ${roomId}`
        );
      }
    );
  };