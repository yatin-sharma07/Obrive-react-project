export const onlineUsers = new Map<number, string>()

export const addOnlineUser = (
  userId: number,
  socketId: string
) => {
  onlineUsers.set(userId, socketId)
}

export const removeOnlineUser = (userId: number) => {
  onlineUsers.delete(userId)
}

export const isUserOnline = (userId: number) => {
  return onlineUsers.has(userId)
}