import {
  Room,
} from "livekit-client";

class LiveKitService {
  constructor() {
    this.room = null;
  }

  async connect({
    token,
    roomId,
  }) {
    try {
      const livekitUrl =
        process.env
          .NEXT_PUBLIC_LIVEKIT_URL;

      this.room =
        new Room();

      await this.room.connect(
        livekitUrl,
        token
      );

      console.log(
        "LiveKit connected:",
        roomId
      );

      return this.room;
    } catch (error) {
      console.error(
        "LiveKit connection error:",
        error
      );

      throw error;
    }
  }

  disconnect() {
    if (this.room) {
      this.room.disconnect();
      this.room = null;
    }
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
        true
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
}

export default new LiveKitService();