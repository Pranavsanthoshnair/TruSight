// Configuration for external APIs and services
export const config = {
  // News API Configuration
  news: {
    // GNews API (100 requests/day free)
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
  const hasEnvKey = !!config.news.gnews.apiKey
  
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
  // Check GNews API key
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
