# Supabase Setup Guide

## 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

You can find these values in your Supabase project dashboard:
- Go to Settings > API
- Copy the Project URL and anon/public key

**ElevenLabs API Key:**
- Sign up at [elevenlabs.io](https://elevenlabs.io)
- Go to your profile settings
- Copy your API key
- This enables optional voice responses for bias analysis results

## 2. Database Setup

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema.sql` 
3. Run the SQL to create the necessary tables, functions, and policies

### Schema Features

The updated schema includes:
- **Enhanced chat_histories table** with session support for anonymous users
- **Improved chat_messages table** with JSONB analysis_data field for storing bias analysis results
- **Session management** for anonymous users via session_id
- **Row Level Security (RLS)** policies supporting both authenticated and anonymous users
- **Performance indexes** including GIN index for analysis data search

## 3. Row Level Security (RLS)

The schema includes comprehensive RLS policies that:
- Allow users to access their own chat histories (authenticated users)
- Support anonymous users via session_id mechanism
- Automatically handle permissions for related messages
- Secure data isolation between different users/sessions

## 4. Usage

The chat service now provides full Supabase integration:

```typescript
import { ChatService } from '@/lib/chat-service'

// Create a new chat (automatically handles session management)
const chat = await ChatService.createChatHistory('My Analysis')

// Add a message with optional analysis data
await ChatService.addMessage(
  chat.id, 
  'Hello', 
  'user',
  'message'
)

// Add analysis results
await ChatService.addMessage(
  chat.id,
  'Analysis summary',
  'system',
  'analysis',
  { bias: 'neutral', confidence: 0.85, reasoning: '...' }
)

// Get all chats (automatically filtered by user/session)
const chats = await ChatService.getChatHistories()

// Search chat histories
const results = await ChatService.searchChatHistories('bias analysis')

// Delete a chat
await ChatService.deleteChatHistory(chat.id)
```

## 5. Session Management

For anonymous users, the system automatically:
- Generates unique session IDs stored in localStorage
- Associates chat histories with session IDs
- Maintains data isolation between browser sessions
- Provides seamless experience without requiring authentication

## 6. Integration Status

**Fully Integrated Components:**
- Bias detection page (`app/bias/page.tsx`)
- Chat service (`lib/chat-service.ts`)
- Database schema with RLS policies
- Session management for anonymous users
- Voice response system (`lib/elevenlabs-service.ts`)

**Key Features:**
- Real-time chat history persistence
- Analysis data storage and retrieval
- Automatic error handling and fallbacks
- Performance optimized with proper indexing
- Optional voice narration of bias analysis results
- ElevenLabs integration for high-quality text-to-speech

## 7. Migration from localStorage

The system automatically handles migration:
- Existing localStorage data is used as fallback if Supabase fails
- Old localStorage entries are cleaned up after successful Supabase integration
- Seamless transition for existing users

## 8. Voice Response System

The application includes an optional voice response feature powered by ElevenLabs:

**Features:**
- **Text-to-Speech**: Converts bias analysis results to natural speech
- **Optional Usage**: Only activates when user clicks the voice button
- **High Quality**: Uses ElevenLabs' advanced AI voice models
- **Natural Language**: Automatically generates conversational summaries

**How to Use:**
1. After receiving a bias analysis, look for the speaker icon (🔊) in the top-right of the analysis card
2. Click the voice button to hear the analysis narrated
3. The button shows loading, playing, and error states
4. Voice automatically stops when narration is complete

**Voice Button States:**
- 🔊 **Default**: Click to play
- 🔄 **Loading**: Processing text-to-speech
- 🔊 **Playing**: Currently narrating (button is highlighted)
- ❌ **Error**: Failed to play (click to retry)

**Customization:**
- Voice settings can be adjusted in `lib/elevenlabs-service.ts`
- Default voice is "Adam" (professional male voice)
- Other voices available through ElevenLabs API

## 9. Troubleshooting

**Common Issues:**

1. **RLS Policy Errors**: Ensure session context is properly set
2. **Connection Issues**: Check environment variables and network connectivity
3. **Permission Denied**: Verify RLS policies are correctly applied
4. **Voice Not Working**: Check ElevenLabs API key and internet connection
5. **Audio Playback Issues**: Ensure browser supports audio playback and volume is enabled

**Debug Mode:**
Enable detailed logging by checking browser console for ChatService operations.
