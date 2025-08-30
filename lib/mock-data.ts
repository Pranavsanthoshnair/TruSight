export const mockResponse = {
  bias: "Left-Leaning",
  confidence: 0.82,
  owner: "Example Media Corp",
  missingPerspectives: ["Economic impact", "Opposition statement"],
}

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "system"
  timestamp: Date
  type?: "analysis" | "message"
}

export interface ChatHistory {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
}
