const { prisma } = require("../../../prisma");
const {
  getRoomDetailsService,
} = require("../../modules/AUDIO_ROOM/room-details/roomDetails.service");
const {
  canModerateRoom,
} = require("../../modules/AUDIO_ROOM/audioRoomAuthz");

exports.registerModerationHandler = (io, socket) => {
  const emitParticipantUpdate = async (roomId, userId) => {
    const roomDetails = await getRoomDetailsService(roomId, userId);

    io.to(`audio-room:${roomId}`).emit("participant_updated", {
      roomId: Number(roomId),
      participants: roomDetails.participants,
    });
  };

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
      if (!(await canModerateRoom(roomId, socket.user?.id))) {
        socket.emit("audio_room_error", {
          message: "Only hosts or moderators can mute speakers",
        });
        return;
      }

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
          roomId: Number(roomId),
        }
      );

      await emitParticipantUpdate(roomId, userId);
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
      if (!(await canModerateRoom(roomId, socket.user?.id))) {
        socket.emit("audio_room_error", {
          message: "Only hosts or moderators can unmute speakers",
        });
        return;
      }

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
          roomId: Number(roomId),
        }
      );

      await emitParticipantUpdate(roomId, userId);
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
      if (!(await canModerateRoom(roomId, socket.user?.id))) {
        socket.emit("audio_room_error", {
          message: "Only hosts or moderators can change participant roles",
        });
        return;
      }

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

      await emitParticipantUpdate(roomId, userId);
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
      if (!(await canModerateRoom(roomId, socket.user?.id))) {
        socket.emit("audio_room_error", {
          message: "Only hosts or moderators can remove participants",
        });
        return;
      }

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

      await emitParticipantUpdate(roomId, userId);
    } catch (error) {
      console.error("❌ Remove participant error:", error);
    }
  });
};
