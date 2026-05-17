import { Server } from "socket.io"
import { AuthenticatedSocket } from "../types/socket.types"

export const registerTypingHandler = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  socket.on(
    "typing_start",
    (conversationId) => {
      socket.to(
        `conversation:${conversationId}`
      ).emit(
        "typing_started",
        {
          userId:
            socket.user!.id,
        }
      )
    }
  )

  socket.on(
    "typing_stop",
    (conversationId) => {
      socket.to(
        `conversation:${conversationId}`
      ).emit(
        "typing_stopped",
        {
          userId:
            socket.user!.id,
        }
      )
    }
  )
}