import { Server } from "socket.io"

import { AuthenticatedSocket } from "../types/socket.types"

import { registerMessageHandler } from "./message.handler"

import { registerTypingHandler } from "./typing.handler"

import { registerPresenceHandler } from "./presence.handler"

import {
  joinConversationRoom,
  leaveConversationRoom,
} from "../room/room.manager"

export const registerConnectionHandler = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  console.log(
    `User connected ${socket.user?.id}`
  )

  registerPresenceHandler(io, socket)

  registerMessageHandler(io, socket)

  registerTypingHandler(io, socket)

  socket.on(
    "join_conversation",
    (conversationId) => {
      joinConversationRoom(
        socket,
        conversationId
      )
    }
  )

  socket.on(
    "leave_conversation",
    (conversationId) => {
      leaveConversationRoom(
        socket,
        conversationId
      )
    }
  )
}