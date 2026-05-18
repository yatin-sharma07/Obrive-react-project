import { Server } from "socket.io"
import {
  addOnlineUser,
  removeOnlineUser,
} from "../store/onlineUsers"

import { AuthenticatedSocket } from "../types/socket.types"

export const registerPresenceHandler = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  addOnlineUser(
    socket.user!.id,
    socket.id
  )

  io.emit("user_online", {
    userId: socket.user!.id,
  })

  socket.on("disconnect", () => {
    removeOnlineUser(
      socket.user!.id
    )

    io.emit("user_offline", {
      userId: socket.user!.id,
    })
  })
}