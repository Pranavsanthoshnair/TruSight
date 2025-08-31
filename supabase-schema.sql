-- Create chat_histories table
CREATE TABLE IF NOT EXISTS chat_histories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT, -- For anonymous users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table with enhanced analysis support
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_history_id UUID NOT NULL REFERENCES chat_histories(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'system')),
  type TEXT CHECK (type IN ('analysis', 'message')),
  -- Analysis-specific fields
  analysis_data JSONB, -- Store bias analysis results
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function for setting session context
CREATE OR REPLACE FUNCTION set_config(setting_name text, setting_value text, is_local boolean)
RETURNS text AS $$
BEGIN
  PERFORM set_config(setting_name, setting_value, is_local);
  RETURN setting_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_histories_user_id ON chat_histories(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_histories_session_id ON chat_histories(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_histories_created_at ON chat_histories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_history_id ON chat_messages(chat_history_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chat_messages_analysis_data ON chat_messages USING GIN (analysis_data);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_histories (support both authenticated and anonymous users)
CREATE POLICY "Users can view their own chat histories" ON chat_histories
  FOR SELECT USING (
    user_id = auth.uid()::text OR 
    user_id IS NULL OR
    (session_id IS NOT NULL AND session_id = current_setting('app.session_id', true))
  );

CREATE POLICY "Users can insert their own chat histories" ON chat_histories
  FOR INSERT WITH CHECK (
    user_id = auth.uid()::text OR 
    user_id IS NULL OR
    (session_id IS NOT NULL AND session_id = current_setting('app.session_id', true))
  );

CREATE POLICY "Users can update their own chat histories" ON chat_histories
  FOR UPDATE USING (
    user_id = auth.uid()::text OR 
    user_id IS NULL OR
    (session_id IS NOT NULL AND session_id = current_setting('app.session_id', true))
  );

CREATE POLICY "Users can delete their own chat histories" ON chat_histories
  FOR DELETE USING (
    user_id = auth.uid()::text OR 
    user_id IS NULL OR
    (session_id IS NOT NULL AND session_id = current_setting('app.session_id', true))
  );

-- Create policies for chat_messages
CREATE POLICY "Users can view messages from their chat histories" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_histories 
      WHERE chat_histories.id = chat_messages.chat_history_id 
      AND (
        chat_histories.user_id = auth.uid()::text OR 
        chat_histories.user_id IS NULL OR
        (chat_histories.session_id IS NOT NULL AND chat_histories.session_id = current_setting('app.session_id', true))
      )
    )
  );

CREATE POLICY "Users can insert messages to their chat histories" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_histories 
      WHERE chat_histories.id = chat_messages.chat_history_id 
      AND (
        chat_histories.user_id = auth.uid()::text OR 
        chat_histories.user_id IS NULL OR
        (chat_histories.session_id IS NOT NULL AND chat_histories.session_id = current_setting('app.session_id', true))
      )
    )
  );

CREATE POLICY "Users can update messages in their chat histories" ON chat_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_histories 
      WHERE chat_histories.id = chat_messages.chat_history_id 
      AND (
        chat_histories.user_id = auth.uid()::text OR 
        chat_histories.user_id IS NULL OR
        (chat_histories.session_id IS NOT NULL AND chat_histories.session_id = current_setting('app.session_id', true))
      )
    )
  );

CREATE POLICY "Users can delete messages from their chat histories" ON chat_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM chat_histories 
      WHERE chat_histories.id = chat_messages.chat_history_id 
      AND (
        chat_histories.user_id = auth.uid()::text OR 
        chat_histories.user_id IS NULL OR
        (chat_histories.session_id IS NOT NULL AND chat_histories.session_id = current_setting('app.session_id', true))
      )
    )
  );
