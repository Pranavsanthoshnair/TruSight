import { supabase } from './supabase'
import type { ChatHistory, ChatMessage } from './types'

export class ChatService {
  // Create a new chat history
  static async createChatHistory(title: string, userId?: string): Promise<ChatHistory> {
    const { data, error } = await supabase
      .from('chat_histories')
      .insert({
        title,
        user_id: userId,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      messages: [],
      createdAt: new Date(data.created_at),
    }
  }

  // Get all chat histories for a user
  static async getChatHistories(userId?: string): Promise<ChatHistory[]> {
    const query = supabase
      .from('chat_histories')
      .select(`
        *,
        chat_messages (*)
      `)
      .order('created_at', { ascending: false })

    if (userId) {
      query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) throw error

    return data.map(chat => ({
      id: chat.id,
      title: chat.title,
      createdAt: new Date(chat.created_at),
      messages: chat.chat_messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
        type: msg.type,
      })).sort((a: ChatMessage, b: ChatMessage) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      ),
    }))
  }

  // Get a specific chat history with messages
  static async getChatHistory(chatId: string): Promise<ChatHistory | null> {
    const { data, error } = await supabase
      .from('chat_histories')
      .select(`
        *,
        chat_messages (*)
      `)
      .eq('id', chatId)
      .single()

    if (error) return null

    return {
      id: data.id,
      title: data.title,
      createdAt: new Date(data.created_at),
      messages: data.chat_messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
        type: msg.type,
      })).sort((a: ChatMessage, b: ChatMessage) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      ),
    }
  }

  // Add a message to a chat history
  static async addMessage(
    chatId: string, 
    content: string, 
    sender: 'user' | 'system',
    type?: 'analysis' | 'message'
  ): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        chat_history_id: chatId,
        content,
        sender,
        type,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // Update the chat history's updated_at timestamp
    await supabase
      .from('chat_histories')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatId)

    return {
      id: data.id,
      content: data.content,
      sender: data.sender,
      timestamp: new Date(data.timestamp),
      type: data.type,
    }
  }

  // Delete a chat history and all its messages
  static async deleteChatHistory(chatId: string): Promise<void> {
    // Delete messages first (due to foreign key constraint)
    await supabase
      .from('chat_messages')
      .delete()
      .eq('chat_history_id', chatId)

    // Delete the chat history
    const { error } = await supabase
      .from('chat_histories')
      .delete()
      .eq('id', chatId)

    if (error) throw error
  }

  // Update chat history title
  static async updateChatTitle(chatId: string, title: string): Promise<void> {
    const { error } = await supabase
      .from('chat_histories')
      .update({ 
        title,
        updated_at: new Date().toISOString()
      })
      .eq('id', chatId)

    if (error) throw error
  }
}
