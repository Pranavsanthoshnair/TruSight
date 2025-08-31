import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined'
  })
  throw new Error('Missing required Supabase environment variables')
}

console.log('✅ Supabase client initializing with:', {
  url: `${supabaseUrl.substring(0, 30)}...`,
  hasKey: !!supabaseAnonKey
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Since we're using Clerk for auth
  }
})

export type Database = {
  public: {
    Tables: {
      chat_histories: {
        Row: {
          id: string
          title: string
          created_at: string
          updated_at: string
          user_id?: string
          session_id?: string
        }
        Insert: {
          id?: string
          title: string
          created_at?: string
          updated_at?: string
          user_id?: string
          session_id?: string
        }
        Update: {
          id?: string
          title?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          session_id?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          chat_history_id: string
          content: string
          sender: 'user' | 'system'
          timestamp: string
          type?: 'analysis' | 'message'
          analysis_data?: any
          created_at: string
        }
        Insert: {
          id?: string
          chat_history_id: string
          content: string
          sender: 'user' | 'system'
          timestamp?: string
          type?: 'analysis' | 'message'
          analysis_data?: any
          created_at?: string
        }
        Update: {
          id?: string
          chat_history_id?: string
          content?: string
          sender?: 'user' | 'system'
          timestamp?: string
          type?: 'analysis' | 'message'
          analysis_data?: any
          created_at?: string
        }
      }
    }
  }
}

// Session management for anonymous users
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem('trusight_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('trusight_session_id', sessionId)
  }
  return sessionId
}

// Set session context for RLS policies
export const setSessionContext = async (sessionId: string) => {
  try {
    await supabase.rpc('set_config', {
      setting_name: 'app.session_id',
      setting_value: sessionId,
      is_local: true
    })
  } catch (error) {
    console.warn('Failed to set session context:', error)
  }
}
