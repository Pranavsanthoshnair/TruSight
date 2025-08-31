# Supabase Setup Guide

## 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard:
- Go to Settings > API
- Copy the Project URL and anon/public key

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

**Key Features:**
- Real-time chat history persistence
- Analysis data storage and retrieval
- Automatic error handling and fallbacks
- Performance optimized with proper indexing

## 7. Migration from localStorage

The system automatically handles migration:
- Existing localStorage data is used as fallback if Supabase fails
- Old localStorage entries are cleaned up after successful Supabase integration
- Seamless transition for existing users

## 8. Troubleshooting

**Common Issues:**

1. **RLS Policy Errors**: Ensure session context is properly set
2. **Connection Issues**: Check environment variables and network connectivity
3. **Permission Denied**: Verify RLS policies are correctly applied

**Debug Mode:**
Enable detailed logging by checking browser console for ChatService operations.
