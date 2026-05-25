const { prisma } = require("../../../prisma");

exports.registerModerationHandler = (io, socket) => {
  // ==========================
  // MUTE SPEAKER
  // ==========================

  socket.on("mute_speaker", async (data) => {
    const { roomId, userId } = data;

    if (!roomId || !userId) {
      console.error("❌ Missing roomId or userId for mute_speaker");
      return;
    }

    try {
      await prisma.room_participants.updateMany({
        where: {
          roomId: Number(roomId),
          userId: Number(userId),
          leftAt: null,
        },
        data: {
          isMuted: true,
          isSpeaking: false,
        },
      });

      console.log(
        `✅ User ${userId} muted in room ${roomId}`
      );

      io.to(`audio-room:${roomId}`).emit(
        "speaker_muted",
        {
          userId: Number(userId),
          isMuted: true,
        }
      );
    } catch (error) {
      console.error("❌ Mute speaker error:", error);
    }
  });

  // ==========================
  // UNMUTE SPEAKER
  // ==========================

  socket.on("unmute_speaker", async (data) => {
    const { roomId, userId } = data;

    if (!roomId || !userId) {
      console.error("❌ Missing roomId or userId for unmute_speaker");
      return;
    }

    try {
      await prisma.room_participants.updateMany({
        where: {
          roomId: Number(roomId),
          userId: Number(userId),
          leftAt: null,
        },
        data: {
          isMuted: false,
          isSpeaking: true,
        },
      });

      console.log(
        `✅ User ${userId} unmuted in room ${roomId}`
      );

      io.to(`audio-room:${roomId}`).emit(
        "speaker_unmuted",
        {
          userId: Number(userId),
          isMuted: false,
        }
      );
    } catch (error) {
      console.error("❌ Unmute speaker error:", error);
    }
  });

  // ==========================
  // DOWNGRADE SPEAKER TO LISTENER
  // ==========================

  socket.on("downgrade_to_listener", async (data) => {
    const { roomId, userId } = data;

    if (!roomId || !userId) {
      console.error("❌ Missing roomId or userId for downgrade_to_listener");
      return;
    }

    try {
      await prisma.room_participants.updateMany({
        where: {
          roomId: Number(roomId),
          userId: Number(userId),
          leftAt: null,
        },
        data: {
          roomRole: "listener",
          isMuted: true,
          isSpeaking: false,
        },
      });

      console.log(
        `✅ User ${userId} downgraded to listener in room ${roomId}`
      );

      io.to(`audio-room:${roomId}`).emit(
        "role_changed",
        {
          userId: Number(userId),
          newRole: "listener",
        }
      );

      io.to(`audio-room:${roomId}`).emit(
        "participant_updated"
      );
    } catch (error) {
      console.error("❌ Downgrade speaker error:", error);
    }
  });

  // ==========================
  // REMOVE PARTICIPANT FROM ROOM
  // ==========================

  socket.on("remove_participant", async (data) => {
    const { roomId, userId } = data;

    if (!roomId || !userId) {
      console.error("❌ Missing roomId or userId for remove_participant");
      return;
    }

    try {
      await prisma.room_participants.updateMany({
        where: {
          roomId: Number(roomId),
          userId: Number(userId),
          leftAt: null,
        },
        data: {
          leftAt: new Date(),
        },
      });

      console.log(
        `✅ User ${userId} removed from room ${roomId}`
      );

      io.to(`audio-room:${roomId}`).emit(
        "participant_removed",
        {
          userId: Number(userId),
        }
      );

      io.to(`audio-room:${roomId}`).emit(
        "participant_updated"
      );
    } catch (error) {
      console.error("❌ Remove participant error:", error);
    }
  });
};
