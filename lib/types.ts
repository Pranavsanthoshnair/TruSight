export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "system"
  timestamp: Date
  type?: "analysis" | "message"
  analysisData?: any
}

export interface ChatHistory {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
}
