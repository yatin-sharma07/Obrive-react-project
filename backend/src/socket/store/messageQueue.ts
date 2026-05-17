import prisma from "../../../prisma"

type PendingMessage = {
  conversation_id: number
  sender_id: number
  content: string
}

const messageQueue: PendingMessage[] = []

export const queueMessage = (
  message: PendingMessage
) => {
  messageQueue.push(message)
}

setInterval(async () => {
  if (messageQueue.length === 0) return

  const messagesToInsert = [...messageQueue]

  messageQueue.length = 0

  try {
    await prisma.messages.createMany({
      data: messagesToInsert,
    })

    console.log(
      `Inserted ${messagesToInsert.length} messages`
    )
  } catch (error) {
    console.error("Message batch insert failed", error)
  }
}, 3000)