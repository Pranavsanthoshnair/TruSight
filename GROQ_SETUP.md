# Groq API Setup for Bias Detection

TruSight now uses Groq's Llama 3.1 70B model for advanced AI-powered bias detection, replacing the previous hardcoded random data.

## What Changed

- **Before**: Bias detection used random values and hardcoded data
- **After**: Real AI analysis using Groq's Llama 3.1 70B model

## Features

The new bias detection system provides:

- **Accurate Bias Classification**: Left-Leaning, Center, Right-Leaning, or Neutral
- **Confidence Scores**: 0.0-1.0 confidence in the analysis
- **Publisher Detection**: Automatically infers the content publisher
- **Missing Perspectives**: Identifies viewpoints that may be missing
- **Detailed Reasoning**: Explains why the bias was detected

## Setup Instructions

### 1. Get a Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `gsk_`)

### 2. Configure Environment

1. Create or edit `.env.local` in your project root
2. Add your API key:
   ```
   GROQ_API_KEY=gsk_your_api_key_here
   ```
3. Save the file
4. Restart your development server

### 3. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the bias detection page
3. Enter some text for analysis
4. The system will now use real AI analysis instead of random data

## API Usage

The Groq API is used in two main places:

1. **Bias Detection Page** (`/bias`): Analyzes articles from the news feed
2. **Analysis Page** (`/analyze`): Analyzes any text input by users

## Fallback Behavior

If the Groq API is unavailable or fails:
- The system falls back to neutral bias detection
- Users still get a response (though less accurate)
- Error messages are logged to the console
- The UI continues to function normally

## Model Details

- **Model**: Llama 3.1 70B
- **Temperature**: 0.1 (for consistent results)
- **Max Tokens**: 1000
- **Response Format**: JSON

## Rate Limits

Groq provides generous free tier limits:
- Check [Groq's pricing page](https://console.groq.com/) for current limits
- The bias detection is optimized to minimize API calls

## Troubleshooting

### API Key Issues
- Ensure your API key starts with `gsk_`
- Check that the key is properly set in `.env.local`
- Restart your development server after adding the key

### Connection Issues
- Check your internet connection
- Verify Groq's service status
- Check browser console for error messages

### Analysis Quality
- Provide longer text for better analysis
- Include context about the source/publisher
- The model works best with news articles and opinion pieces

## Development

To test the API integration:

```bash
# Test the API connection
curl -X GET http://localhost:3000/api/analyze-bias

# Test bias analysis
curl -X POST http://localhost:3000/api/analyze-bias \
  -H "Content-Type: application/json" \
  -d '{"content": "Your text here"}'
```
