// Configuration for external APIs and services
export const config = {
  // News API Configuration
  news: {
    // NewsAPI.org (100 requests/day free) - Primary choice
    newsapi: {
      apiKey: process.env.NEXT_PUBLIC_NEWSAPI_KEY || '',
      baseUrl: 'https://newsapi.org/v2',
      endpoints: {
        topHeadlines: '/top-headlines',
        search: '/everything'
      }
    },
    // GNews API (100 requests/day free) - Fallback
    gnews: {
      apiKey: process.env.NEXT_PUBLIC_GNEWS_API_KEY || '',
      baseUrl: 'https://gnews.io/api/v4',
      endpoints: {
        topHeadlines: '/top-headlines',
        search: '/search',
        everything: '/everything'
      }
    }
  },
  
  // App Configuration
  app: {
    name: 'TruSight',
    description: 'AI-powered bias detection for news articles',
    version: '1.0.0'
  }
}

// Helper function to check if API keys are configured
export const hasValidApiKey = (): boolean => {
  // Check environment variables first
  const hasEnvKey = !!(config.news.newsapi.apiKey || config.news.gnews.apiKey)
  
  // Also check localStorage for backward compatibility
  if (typeof window !== 'undefined') {
    const localStorageKey = localStorage.getItem('trusight_news_api_key')
    if (localStorageKey) {
      return true
    }
  }
  
  return hasEnvKey
}

// Helper function to get the best available API configuration
export const getBestNewsApiConfig = () => {
  // Check NewsAPI first (user's preference)
  if (config.news.newsapi.apiKey) {
    return { provider: 'newsapi', config: config.news.newsapi }
  }
  
  // Check GNews as fallback
  if (config.news.gnews.apiKey) {
    return { provider: 'gnews', config: config.news.gnews }
  }
  
  // Check localStorage for backward compatibility
  if (typeof window !== 'undefined') {
    const localStorageKey = localStorage.getItem('trusight_news_api_key')
    if (localStorageKey) {
      return { 
        provider: 'gnews', 
        config: {
          ...config.news.gnews,
          apiKey: localStorageKey
        }
      }
    }
  }
  
  return null
}
