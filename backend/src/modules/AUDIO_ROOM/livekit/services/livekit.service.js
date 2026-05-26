import { Room, } from "livekit-client";

class LiveKitService {
  constructor() {
    this.room = null;
  }

// the tokens were generated at the backend in file src/modules/AUTH/services/auth.service.js using the signAccessToken function from src/utils/jwt.js, and then sent to the frontend where they are used to connect to the LiveKit room. The token contains the necessary information for authentication and authorization when connecting to the LiveKit server. The LiveKit client library uses this token to establish a secure connection and manage the audio room functionalities.

//but we are using the access tokens direcly without importing the jwt functions here, because the tokens are generated at the backend stored in the local storage or cookies and can be used directly in the frontend when connecting to LiveKit, without needing to generate them again in the frontend. The jwt functions are used in the backend to create the tokens, but in the frontend, we only need to use the tokens for authentication when connecting to LiveKit.

//  so we don't need to generate them again in the frontend. We just need to use the tokens we received from the backend to connect to the LiveKit room. The jwt functions are used in the backend to create the tokens, but in the frontend, we only need to use the tokens for authentication when connecting to LiveKit.

  async connect({ token, roomId,
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