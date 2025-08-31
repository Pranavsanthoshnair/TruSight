import { supabase, getSessionId, setSessionContext } from './supabase'
import type { ChatHistory, ChatMessage } from './types'

export class ChatService {
  // Initialize session context for anonymous users
  static async initializeSession(): Promise<void> {
    const sessionId = getSessionId()
    await setSessionContext(sessionId)
  }

  // Create a new chat history
  static async createChatHistory(title: string, userId?: string): Promise<ChatHistory> {
    try {
      await this.initializeSession()
      
      const sessionId = getSessionId()
      
      // Debug logging
      console.log('🔍 ChatService.createChatHistory:', { 
        title, 
        userId, 
        sessionId,
        hasUserId: !!userId,
        userIdType: typeof userId 
      })
      
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('chat_histories')
        .select('count')
        .limit(1)
      
      if (testError) {
        console.error('❌ Supabase connection test failed:', testError)
        throw new Error(`Supabase connection failed: ${testError.message}`)
      }
      
      console.log('✅ Supabase connection test passed')
      
      const insertData = {
        title,
        user_id: userId || null,
        session_id: userId ? null : sessionId,
      }
      
      console.log('🔍 Inserting data:', insertData)
      
      const { data, error } = await supabase
        .from('chat_histories')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('❌ Error creating chat history:', {
          error,
          errorMessage: error.message,
          errorDetails: error.details,
          errorHint: error.hint,
          errorCode: error.code,
          insertData
        })
        
        // Check if it's an RLS policy issue
        if (error.code === 'PGRST116' || error.message?.includes('policy')) {
          throw new Error(`Permission denied: RLS policy blocking insert. Check your Supabase RLS policies.`)
        }
        
        throw new Error(`Failed to create chat history: ${error.message || 'Unknown error'}`)
      }

      // Debug logging for created record
      console.log('✅ Created chat history:', {
        id: data.id,
        user_id: data.user_id,
        session_id: data.session_id,
        title: data.title
      })

      return {
        id: data.id,
        title: data.title,
        messages: [],
        createdAt: new Date(data.created_at),
      }
    } catch (err) {
      console.error('❌ ChatService.createChatHistory failed:', err)
      throw err
    }
  }

  // Get all chat histories for a user or session
  static async getChatHistories(userId?: string): Promise<ChatHistory[]> {
    await this.initializeSession()
    
    // Debug logging
    console.log('🔍 ChatService.getChatHistories:', { 
      userId, 
      hasUserId: !!userId,
      userIdType: typeof userId 
    })
    
    const query = supabase
      .from('chat_histories')
      .select(`
        *,
        chat_messages (*)
      `)
      .order('created_at', { ascending: false })

    // If userId is provided, filter by user_id, otherwise use session_id
    if (userId) {
      query.eq('user_id', userId)
      console.log('🔍 Filtering by user_id:', userId)
    } else {
      const sessionId = getSessionId()
      query.eq('session_id', sessionId)
      console.log('🔍 Filtering by session_id:', sessionId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching chat histories:', error)
      throw new Error(`Failed to fetch chat histories: ${error.message}`)
    }

    // Debug logging for fetched records
    console.log('✅ Fetched chat histories:', data.map(chat => ({
      id: chat.id,
      user_id: chat.user_id,
      session_id: chat.session_id,
      title: chat.title
    })))

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
        analysisData: msg.analysis_data,
      })).sort((a: ChatMessage, b: ChatMessage) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      ),
    }))
  }

  // Get a specific chat history with messages
  static async getChatHistory(chatId: string): Promise<ChatHistory | null> {
    await this.initializeSession()
    
    const { data, error } = await supabase
      .from('chat_histories')
      .select(`
        *,
        chat_messages (*)
      `)
      .eq('id', chatId)
      .single()

    if (error) {
      console.error('Error fetching chat history:', error)
      return null
    }

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
        analysisData: msg.analysis_data,
      })).sort((a: ChatMessage, b: ChatMessage) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      ),
    }
  }

  // Add a message to a chat history with optional analysis data
  static async addMessage(
    chatId: string, 
    content: string, 
    sender: 'user' | 'system',
    type?: 'analysis' | 'message',
    analysisData?: any
  ): Promise<ChatMessage> {
    await this.initializeSession()
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        chat_history_id: chatId,
        content,
        sender,
        type,
        analysis_data: analysisData,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding message:', error)
      throw new Error(`Failed to add message: ${error.message}`)
    }

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
      analysisData: data.analysis_data,
    }
  }

  // Delete a chat history and all its messages
  static async deleteChatHistory(chatId: string): Promise<void> {
    await this.initializeSession()
    
    // Messages will be deleted automatically due to CASCADE constraint
    const { error } = await supabase
      .from('chat_histories')
      .delete()
      .eq('id', chatId)

    if (error) {
      console.error('Error deleting chat history:', error)
      throw new Error(`Failed to delete chat history: ${error.message}`)
    }
  }

  // Update chat history title
  static async updateChatTitle(chatId: string, title: string): Promise<void> {
    await this.initializeSession()
    
    const { error } = await supabase
      .from('chat_histories')
      .update({ 
        title,
        updated_at: new Date().toISOString()
      })
      .eq('id', chatId)

    if (error) {
      console.error('Error updating chat title:', error)
      throw new Error(`Failed to update chat title: ${error.message}`)
    }
  }

  // Get analysis data from a specific message
  static async getAnalysisData(messageId: string): Promise<any | null> {
    await this.initializeSession()
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('analysis_data')
      .eq('id', messageId)
      .eq('type', 'analysis')
      .single()

    if (error) {
      console.error('Error fetching analysis data:', error)
      return null
    }

    return data.analysis_data
  }

  // Search chat histories by content
  static async searchChatHistories(query: string, userId?: string): Promise<ChatHistory[]> {
    await this.initializeSession()
    
    const searchQuery = supabase
      .from('chat_histories')
      .select(`
        *,
        chat_messages!inner (*)
      `)
      .ilike('chat_messages.content', `%${query}%`)
      .order('created_at', { ascending: false })

    if (userId) {
      searchQuery.eq('user_id', userId)
    } else {
      const sessionId = getSessionId()
      searchQuery.eq('session_id', sessionId)
    }

    const { data, error } = await searchQuery

    if (error) {
      console.error('Error searching chat histories:', error)
      throw new Error(`Failed to search chat histories: ${error.message}`)
    }

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
        analysisData: msg.analysis_data,
      })).sort((a: ChatMessage, b: ChatMessage) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      ),
    }))
  }
}
