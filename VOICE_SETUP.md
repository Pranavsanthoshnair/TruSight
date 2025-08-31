# Voice Response Setup Guide

## Overview

The bias detection application now includes an optional voice response feature that reads out bias analysis results using ElevenLabs' advanced text-to-speech technology.

## Setup Instructions

### 1. Get ElevenLabs API Key

1. Visit [elevenlabs.io](https://elevenlabs.io)
2. Sign up for a free account
3. Go to your profile settings
4. Copy your API key

### 2. Add Environment Variable

Add this line to your `.env.local` file:

```bash
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_actual_api_key_here
```

**Note**: The `NEXT_PUBLIC_` prefix is required for client-side access.

### 3. Restart Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## How It Works

### Voice Button Location
- The voice button appears as a speaker icon (🔊) in the top-right corner of bias analysis cards
- It only appears for system messages that contain bias analysis results
- **Always Available**: The button is now always visible thanks to browser TTS fallback

### Fallback System
- **Primary**: ElevenLabs AI voices (high quality, natural)
- **Fallback**: Browser's built-in text-to-speech (always available)
- **Automatic**: Seamlessly switches between providers based on availability

### Voice Button States
- **🔊 Default**: Click to play voice narration
- **🔄 Loading**: Processing text-to-speech (shows spinner)
- **🔊 Playing**: Currently narrating (button highlighted in primary color)
- **❌ Error**: Failed to play (click to retry)

### What Gets Narrated
The system automatically generates a natural language summary of the bias analysis:

> "Bias analysis complete. The detected bias is left-leaning with 85% confidence. The publisher is CNN. Missing perspectives include: conservative viewpoints, right-leaning sources. Analysis: The article shows clear bias through selective use of sources and emotional language."

### Provider Indicators
- **🔊 (Volume2)**: ElevenLabs AI voice (high quality)
- **🔊 (Volume1)**: Browser TTS (built-in fallback)
- **E Badge**: Blue indicator showing ElevenLabs is active
- **B Badge**: Green indicator showing Browser TTS is active

## Customization

### Voice Settings
You can modify voice characteristics in `lib/elevenlabs-service.ts`:

```typescript
voice_settings: {
  stability: 0.5,        // 0-1: Higher = more stable
  similarity_boost: 0.5, // 0-1: Higher = more similar to original
}
```

### Different Voices
Change the default voice by modifying the `voiceId` parameter in the `textToSpeech` method. Some popular voices:

- **Adam** (default): `pNInz6obpgDQGcFmaJgB` - Professional male
- **Rachel**: `21m00Tcm4TlvDq8ikWAM` - Professional female
- **Sam**: `AZnzlk1XvdvUeBnXmlld` - Casual male

### Speech Text Generation
Modify the `generateSpeechText` method to change how the analysis is narrated.

## Browser TTS Fallback

### How It Works
- **Automatic Fallback**: If ElevenLabs fails or is unavailable, browser TTS activates automatically
- **No Setup Required**: Works in all modern browsers without additional configuration
- **Voice Selection**: Automatically selects the best available voice for your language
- **Performance**: Instant response with no API calls or network delays

### Browser Compatibility
- **Chrome/Edge**: Full support with multiple voice options
- **Firefox**: Good support with voice selection
- **Safari**: Basic support with system voices
- **Mobile**: Works on iOS Safari and Android Chrome

## Troubleshooting

### Voice Button Not Appearing
1. The voice button is now always visible thanks to browser TTS fallback
2. If you still don't see it, check browser console for errors
3. Ensure you're viewing a bias analysis result

### Audio Not Playing
1. Ensure browser volume is enabled
2. Check that no other audio is playing
3. Verify internet connection (ElevenLabs API calls required)
4. Check browser console for error messages

### API Errors
1. Verify your ElevenLabs API key is correct
2. Check your ElevenLabs account for usage limits
3. Ensure the API key has text-to-speech permissions

### Performance Issues
1. Voice generation happens on-demand (only when clicked)
2. Audio is cached in memory during the session
3. Consider implementing audio caching for frequently accessed analyses

## API Usage

### Free Tier Limits
- ElevenLabs free tier includes 10,000 characters per month
- Each bias analysis typically uses 100-300 characters
- Monitor usage in your ElevenLabs dashboard

### Cost Optimization
- Voice is only generated when explicitly requested
- No automatic voice generation on page load
- Consider implementing user preferences for voice usage

## Security Notes

- The API key is exposed to the client (required for direct API calls)
- ElevenLabs API calls are made directly from the browser
- No sensitive data is sent to ElevenLabs beyond the analysis text
- Consider implementing rate limiting if needed

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your ElevenLabs API key and account status
3. Test with a simple text-to-speech request
4. Check the ElevenLabs service logs in `lib/elevenlabs-service.ts`

The voice functionality is completely optional - the application works perfectly without it!
