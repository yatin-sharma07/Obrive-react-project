const test = require("node:test");
const assert = require("node:assert/strict");
const auth = require("../src/middleware/auth");
const {
  createLiveKitTokenForRoom,
} = require("../src/modules/AUDIO_ROOM/livekit/services/livekitToken.service");
const { prisma } = require("../prisma");

process.env.LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || "test-key";
process.env.LIVEKIT_API_SECRET =
  process.env.LIVEKIT_API_SECRET || "test-secret";

const originalPrisma = {
  room_configs: { ...prisma.room_configs },
  room_participants: { ...prisma.room_participants },
  users: { ...prisma.users },
};

test.afterEach(() => {
  Object.assign(prisma.room_configs, originalPrisma.room_configs);
  Object.assign(prisma.room_participants, originalPrisma.room_participants);
  Object.assign(prisma.users, originalPrisma.users);
});

test("audio auth middleware returns 401 without an access token", async () => {
  const req = {
    cookies: {},
    headers: {},
  };

  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await auth(req, res, () => {
    throw new Error("next should not be called");
  });

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.success, false);
});

test("LiveKit token service rejects users without room access", async () => {
  prisma.room_configs.findUnique = async () => ({
    id: 10,
    roomStatus: "live",
    allowGuestUsers: false,
    joinPermissions: [],
    roleAssignments: [],
  });
  prisma.users.findUnique = async () => ({
    id: 7,
    name: "Test User",
    role: "employee",
  });
  prisma.room_participants.findFirst = async () => null;

  await assert.rejects(
    () =>
      createLiveKitTokenForRoom({
        roomId: 10,
        userId: 7,
      }),
    /not allowed/
  );
});

test("LiveKit token service returns a signed token for an allowed user", async () => {
  prisma.room_configs.findUnique = async () => ({
    id: 10,
    roomStatus: "live",
    allowGuestUsers: false,
    joinPermissions: [],
    roleAssignments: [
      {
        assignmentType: "specific-user",
        userId: 7,
        assignedRoomRole: "speaker",
      },
    ],
  });
  prisma.users.findUnique = async () => ({
    id: 7,
    name: "Test User",
    role: "employee",
  });
  prisma.room_participants.findFirst = async () => null;

  const result = await createLiveKitTokenForRoom({
    roomId: 10,
    userId: 7,
  });

  assert.equal(result.roomId, 10);
  assert.equal(result.roomRole, "speaker");
  assert.match(result.token, /^[\w-]+\.[\w-]+\.[\w-]+$/);
});
