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
3. Run the SQL to create the necessary tables and policies

## 3. Row Level Security (RLS)

The schema includes Row Level Security policies that:
- Allow users to only access their own chat histories
- Support anonymous users (when user_id is NULL)
- Automatically handle permissions for related messages

## 4. Usage

The chat service is now ready to use:

```typescript
import { ChatService } from '@/lib/chat-service'

// Create a new chat
const chat = await ChatService.createChatHistory('My Analysis')

// Add a message
await ChatService.addMessage(chat.id, 'Hello', 'user')

// Get all chats
const chats = await ChatService.getChatHistories()

// Delete a chat
await ChatService.deleteChatHistory(chat.id)
```

## 5. Integration with Sidebar

The sidebar component now includes a delete button for each analysis. Make sure to pass the `onDeleteChat` prop when using the Sidebar component.
