import { Server } from "socket.io"

import { socketAuthMiddleware } from "./middleware/auth.middleware"

import { registerConnectionHandler } from "./handlers/connection.handler"

export const initializeSocket = (
  httpServer: any
) => {
  const io = new Server(httpServer, {
    cors: {
      origin:
        process.env.FRONTEND_URL,
      credentials: true,
    },
  })

  io.use(socketAuthMiddleware)

  io.on("connection", (socket) => {
    registerConnectionHandler(
      io,
      socket as any
    )
  })

  return io
}