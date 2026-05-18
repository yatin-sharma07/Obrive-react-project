import { Socket } from "socket.io"

export const joinConversationRoom = (
  socket: Socket,
  conversationId: number
) => {
  socket.join(
    `conversation:${conversationId}`
  )
}

export const leaveConversationRoom = (
  socket: Socket,
  conversationId: number
) => {
  socket.leave(
    `conversation:${conversationId}`
  )
}