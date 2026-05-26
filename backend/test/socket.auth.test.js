const test = require("node:test");
const assert = require("node:assert/strict");
const { socketAuthMiddleware } = require("../src/socket/middleware/auth.middleware");
const { signAccessToken } = require("../src/utils/jwt");
const { prisma } = require("../prisma");

process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "test-access-secret";

const originalUsers = { ...prisma.users };

test.afterEach(() => {
  Object.assign(prisma.users, originalUsers);
});

const runSocketAuth = (socket) =>
  new Promise((resolve) => {
    socketAuthMiddleware(socket, (error) => resolve(error));
  });

test("socket auth rejects a missing handshake token", async () => {
  const socket = {
    handshake: {
      auth: {},
      headers: {},
    },
  };

  const error = await runSocketAuth(socket);

  assert.ok(error);
  assert.match(error.message, /No token provided/);
});

test("socket auth rejects an invalid handshake token", async () => {
  const socket = {
    handshake: {
      auth: {
        token: "invalid-token",
      },
      headers: {},
    },
  };

  const error = await runSocketAuth(socket);

  assert.ok(error);
  assert.match(error.message, /Invalid token/);
});

test("socket auth accepts a valid access token and attaches socket.user", async () => {
  prisma.users.findUnique = async () => ({
    id: 7,
    name: "Test User",
    role: "employee",
    status: "online",
    is_active: true,
  });

  const token = signAccessToken({
    id: 7,
    role: "employee",
  });

  const socket = {
    handshake: {
      auth: {
        token,
      },
      headers: {},
    },
  };

  const error = await runSocketAuth(socket);

  assert.equal(error, undefined);
  assert.equal(socket.user.id, 7);
});
