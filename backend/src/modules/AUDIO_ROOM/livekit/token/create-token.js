const {
  AccessToken,
} = require(
  "livekit-server-sdk"
);

const createLiveKitToken =
  async ({
    roomName,
    participantId,
    participantName,
    role,
  }) => {

          const apiKey =process.env .LIVEKIT_API_KEY;
          const apiSecret = process.env.LIVEKIT_API_SECRET;

    const normalizedRole =
      role?.toUpperCase();

    const canPublish =
      normalizedRole ===
        "HOST" ||
      normalizedRole ===
        "MODERATOR" ||
      normalizedRole ===
        "SPEAKER";

    const token =
      new AccessToken(
        apiKey,
        apiSecret,
        {
          identity:
            participantId,

          name:
            participantName,
        }
      );

    token.addGrant({
      room:
        roomName,

      roomJoin:
        true,

      canPublish,

      canSubscribe:
        true,
    });

    return await token.toJwt();
  };

module.exports = {
  createLiveKitToken,
};