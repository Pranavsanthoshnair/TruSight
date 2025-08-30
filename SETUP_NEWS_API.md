# Setting Up NewsAPI for TruSight

## Overview
Your TruSight app is now configured to fetch real-time news from NewsAPI.org instead of using hardcoded mock data. The app will automatically fall back to mock data if the API is unavailable.

## Step 1: Get Your NewsAPI Key

1. Go to [https://newsapi.org/](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. **Free tier**: 100 requests/day

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# NewsAPI.org (Primary choice)
NEXT_PUBLIC_NEWSAPI_KEY=your_newsapi_key_here

# Optional: GNews API as fallback
# NEXT_PUBLIC_GNEWS_API_KEY=your_gnews_api_key_here
```

## Step 3: Restart Your Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## Step 4: Verify Setup

1. Open your app in the browser
2. You should see a green "Live News API Connected" indicator
3. Real-time news should load automatically
4. Check the console for any API-related errors

## NewsAPI Features

- ✅ Top headlines by country and category
- ✅ Advanced search with filters
- ✅ Sort by relevance, date, popularity
- ✅ Multiple languages support
- ✅ Reliable and fast API

## Troubleshooting

### Common Issues

1. **"No valid API configuration found"**
   - Check that your `.env.local` file exists
   - Verify the API key is correct
   - Restart your development server

2. **"API rate limit exceeded"**
   - You've reached your daily request limit (100/day)
   - Wait until tomorrow or upgrade your plan
   - The app will fall back to mock data

3. **"Failed to fetch from API"**
   - Check your internet connection
   - Verify NewsAPI service is working
   - Check the console for specific error messages

### Fallback Behavior

If the API fails for any reason, the app will:
1. Log the error to the console
2. Display an error message to the user
3. Automatically fall back to mock data
4. Show a note that cached data is being used

## Cost Considerations

- **NewsAPI**: Free tier includes 100 requests/day
- **Typical usage**: ~10-20 requests per user session
- **Recommendation**: Perfect for development and small projects

## Next Steps

Once your API is working:
1. Test the search functionality
2. Try different categories
3. Verify that images are loading
4. Check that the bias detection still works with real articles

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is working with a simple curl request
3. Check [NewsAPI status page](https://newsapi.org/)
4. Review the error handling in your news service
