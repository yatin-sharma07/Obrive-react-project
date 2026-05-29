import {
  Room,
} from "livekit-client";

class LiveKitService {
  constructor() {
    this.room = null;
    this.isConnecting = false;
    this.pendingDisconnect = false;
  }

  async connect({
    token,
    roomId,
  }) {
    try {
      this.isConnecting = true;
      this.pendingDisconnect = false;

      const livekitUrl =
        process.env
          .NEXT_PUBLIC_LIVEKIT_URL;

      this.room =
        new Room();

      await this.room.connect(
        livekitUrl,
        token
      );

      // ==========================
      // PLAY REMOTE AUDIO
      // ==========================

      this.room.on(
        "trackSubscribed",
        (
          track
        ) => {
          if (
            track.kind ===
            "audio"
          ) {
            track.attach();

            console.log(
              "🔊 Remote audio attached"
            );
          }
        }
      );

      console.log(
        "LiveKit connected:",
        roomId
      );

      if (this.pendingDisconnect) {
        this.room.disconnect();
        this.room = null;
        this.pendingDisconnect = false;
      }

      return this.room;
    } catch (error) {
      console.error(
        "LiveKit connection error:",
        error
      );

      throw error;
    } finally {
      this.isConnecting = false;

      if (this.pendingDisconnect && this.room) {
        this.room.disconnect();
        this.room = null;
        this.pendingDisconnect = false;
      }
    }
  }

  disconnect() {
    if (this.isConnecting) {
      this.pendingDisconnect = true;
      return;
    }

    if (this.room) {
      this.room.disconnect();
      this.room = null;
    }

    this.pendingDisconnect = false;
  }

  getRoom() {
    return this.room;
  }


  async enableMicrophone() {
  try {
    if (!this.room) {
      return;
    }

    await this.room.localParticipant
  .setMicrophoneEnabled(
    true,
    {
      echoCancellation:
        true,

      noiseSuppression:
        true,

      autoGainControl:
        true,
    }
  );

    console.log(
      "🎤 Microphone enabled"
    );
  } catch (error) {
    console.error(
      "Mic enable error:",
      error
    );
  }
}

  async disableMicrophone() {
  try {
    if (!this.room) {
      return;
    }

    await this.room.localParticipant
      .setMicrophoneEnabled(
        false
      );

    console.log(
      "Microphone disabled"
    );
  } catch (error) {
    console.error(
      "Mic disable error:",
      error
    );
  }
}

  isMicrophoneEnabled() {
    return Boolean(
      this.room?.localParticipant
        ?.isMicrophoneEnabled
    );
  }
}

export default new LiveKitService();
