import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
        }
        Insert: {
          id?: string
          title: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          title?: string
          created_at?: string
          updated_at?: string
          user_id?: string
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
          created_at: string
        }
        Insert: {
          id?: string
          chat_history_id: string
          content: string
          sender: 'user' | 'system'
          timestamp?: string
          type?: 'analysis' | 'message'
          created_at?: string
        }
        Update: {
          id?: string
          chat_history_id?: string
          content?: string
          sender?: 'user' | 'system'
          timestamp?: string
          type?: 'analysis' | 'message'
          created_at?: string
        }
      }
    }
  }
}
