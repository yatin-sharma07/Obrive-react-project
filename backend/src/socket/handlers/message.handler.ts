import { Server } from "socket.io"
import { AuthenticatedSocket } from "../types/socket.types"
import { queueMessage } from "../store/messageQueue"

export const registerMessageHandler = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  socket.on(
    "send_message",
    async (data) => {
      try {
        const payload = {
          conversation_id:
            data.conversationId,

          sender_id:
            socket.user!.id,

          content: data.content,
        }

        io.to(
          `conversation:${data.conversationId}`
        ).emit(
          "message_received",
          {
            ...payload,
            created_at:
              new Date(),
          }
        )

        queueMessage(payload)
      } catch (error) {
        console.error(error)
      }
    }
  )
}