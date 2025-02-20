export interface ImessageGet {
  id: number
  chatId: number
  senderId?: number | null
  senderType: string
  content: string
  createdAt: string
}
export interface IsendMessageToAI {
  role: string
  content: string
}
