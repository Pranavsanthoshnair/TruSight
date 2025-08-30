import { NewsArticle } from "@/components/news-card"
import { config, hasValidApiKey, getBestNewsApiConfig } from "./config"

// Free News API endpoints (you can replace these with your preferred API)
const NEWS_API_ENDPOINTS = {
  // GNews API (free tier: 100 requests/day)
  gnews: "https://gnews.io/api/v4/top-headlines",
  // NewsAPI (free tier: 100 requests/day)
  newsapi: "https://newsapi.org/v2/top-headlines",
  // Alternative: NewsData.io (free tier: 200 requests/day)
  newsdata: "https://newsdata.io/api/1/news",
}

// Mock data as fallback when API fails
const MOCK_NEWS: NewsArticle[] = [
  {
    id: "1",
    title: "AI Breakthrough: New Model Shows Unprecedented Accuracy in Bias Detection",
    description: "Researchers at leading universities have developed a revolutionary AI model that can detect media bias with 95% accuracy, potentially transforming how we consume news.",
    url: "https://example.com/ai-breakthrough",
    urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    source: { name: "Tech Daily" },
    category: "technology",
    content: "Full article content would go here..."
  },
  {
    id: "2",
    title: "Global Markets React to New Economic Policies",
    description: "Major stock exchanges worldwide show mixed reactions as governments implement new economic stimulus packages aimed at boosting post-pandemic recovery.",
    url: "https://example.com/global-markets",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    source: { name: "Business Weekly" },
    category: "business",
    content: "Full article content would go here..."
  },
  {
    id: "3",
    title: "Climate Summit Yields Historic Agreement on Carbon Reduction",
    description: "World leaders reach unprecedented consensus on climate action, setting ambitious targets for carbon neutrality by 2050.",
    url: "https://example.com/climate-summit",
    urlToImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    source: { name: "Environmental News" },
    category: "general",
    content: "Full article content would go here..."
  },
  {
    id: "4",
    title: "Revolutionary Medical Discovery: New Treatment for Chronic Diseases",
    description: "Scientists announce breakthrough in treating previously incurable chronic conditions, offering hope to millions of patients worldwide.",
    url: "https://example.com/medical-discovery",
    urlToImage: "https://images.unsplash.com/photo-1576091160399-112ba8a25e7f?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    source: { name: "Health Today" },
    category: "health",
    content: "Full article content would go here..."
  },
  {
    id: "5",
    title: "Space Exploration Milestone: First Human Mission to Mars Announced",
    description: "NASA and international partners reveal plans for the first crewed mission to the Red Planet, scheduled for the next decade.",
    url: "https://example.com/mars-mission",
    urlToImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    source: { name: "Space Weekly" },
    category: "science",
    content: "Full article content would go here..."
  },
  {
    id: "6",
    title: "Sports History Made: Underdog Team Wins Championship",
    description: "In an unprecedented upset, the underdog team defeats the reigning champions, creating one of the most memorable moments in sports history.",
    url: "https://example.com/sports-upset",
    urlToImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    source: { name: "Sports Central" },
    category: "sports",
    content: "Full article content would go here..."
  }
]

export interface NewsApiResponse {
  articles: NewsArticle[]
  totalResults: number
  status: string
}

export class NewsService {
  private static instance: NewsService
  private lastFetchTime: number = 0
  private cachedNews: NewsArticle[] = []
  private cacheDuration: number = 30 * 60 * 1000 // 30 minutes

  private constructor() {
    // No need to check localStorage for API key anymore
    // API keys are now managed through environment variables
  }

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService()
    }
    return NewsService.instance
  }

  public async fetchTopHeadlines(
    category: string = "general",
    country: string = "us",
    pageSize: number = 20
  ): Promise<NewsArticle[]> {
    // Check if we have cached data and it's recent
    const now = Date.now()
    if (this.cachedNews.length > 0 && (now - this.lastFetchTime) < this.cacheDuration) {
      return this.filterNewsByCategory(this.cachedNews, category)
    }

    try {
      // Try to fetch from real API first
      if (hasValidApiKey()) {
        const news = await this.fetchFromRealApi(category, country, pageSize)
        if (news.length > 0) {
          this.cachedNews = news
          this.lastFetchTime = now
          return this.filterNewsByCategory(news, category)
        }
      }
    } catch (error) {
      console.warn("Failed to fetch from real API, using mock data:", error)
    }

    // Fallback to mock data
    this.cachedNews = MOCK_NEWS
    this.lastFetchTime = now
    return this.filterNewsByCategory(MOCK_NEWS, category)
  }

  public async searchNews(query: string, pageSize: number = 20): Promise<NewsArticle[]> {
    try {
      // Try to fetch from real API first
      if (hasValidApiKey()) {
        const news = await this.searchFromRealApi(query, pageSize)
        if (news.length > 0) {
          return news
        }
      }
    } catch (error) {
      console.warn("Failed to search from real API, using mock data:", error)
    }

    // Fallback to mock data with search filtering
    return MOCK_NEWS.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase()) ||
      article.source.name.toLowerCase().includes(query.toLowerCase())
    )
  }

  private async fetchFromRealApi(
    category: string,
    country: string,
    pageSize: number
  ): Promise<NewsArticle[]> {
    const apiConfig = getBestNewsApiConfig()
    if (!apiConfig) {
      throw new Error("No valid API configuration found")
    }

    const { provider, config: apiSettings } = apiConfig

    try {
      if (provider === 'gnews') {
        return await this.fetchFromGNews(apiSettings, category, country, pageSize)
      } else if (provider === 'newsapi') {
        return await this.fetchFromNewsAPI(apiSettings, category, country, pageSize)
      }
    } catch (error) {
      console.error(`Failed to fetch from ${provider}:`, error)
      throw error
    }

    throw new Error("Unsupported API provider")
  }

  private async fetchFromGNews(
    apiSettings: any,
    category: string,
    country: string,
    pageSize: number
  ): Promise<NewsArticle[]> {
    const params = new URLSearchParams({
      country: country,
      max: pageSize.toString(),
      apikey: apiSettings.apiKey
    })

    // GNews doesn't support category filtering in top-headlines, so we'll fetch general news
    // and filter by category later if needed
    const url = `${apiSettings.baseUrl}${apiSettings.endpoints.topHeadlines}?${params}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const articles = this.transformGNewsData(data.articles || [])
    
    // Filter by category if specified and not general
    if (category && category !== "general") {
      return articles.filter(article => article.category === category)
    }
    
    return articles
  }

  private async fetchFromNewsAPI(
    apiSettings: any,
    category: string,
    country: string,
    pageSize: number
  ): Promise<NewsArticle[]> {
    const params = new URLSearchParams({
      country: country,
      pageSize: pageSize.toString(),
      apiKey: apiSettings.apiKey
    })

    // Add category if specified and not general
    if (category && category !== "general") {
      params.append('category', category)
    }

    const url = `${apiSettings.baseUrl}${apiSettings.endpoints.topHeadlines}?${params}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return this.transformNewsApiData(data.articles || [])
  }

  private async searchFromRealApi(query: string, pageSize: number): Promise<NewsArticle[]> {
    const apiConfig = getBestNewsApiConfig()
    if (!apiConfig) {
      throw new Error("No valid API configuration found")
    }

    const { provider, config: apiSettings } = apiConfig

    try {
      if (provider === 'gnews') {
        return await this.searchFromGNews(apiSettings, query, pageSize)
      } else if (provider === 'newsapi') {
        return await this.searchFromNewsAPI(apiSettings, query, pageSize)
      }
    } catch (error) {
      console.error(`Failed to search from ${provider}:`, error)
      throw error
    }

    throw new Error("Unsupported API provider")
  }

  private async searchFromGNews(
    apiSettings: any,
    query: string,
    pageSize: number
  ): Promise<NewsArticle[]> {
    const params = new URLSearchParams({
      q: query,
      max: pageSize.toString(),
      apikey: apiSettings.apiKey
    })

    const url = `${apiSettings.baseUrl}${apiSettings.endpoints.search}?${params}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GNews search API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return this.transformGNewsData(data.articles || [])
  }

  private async searchFromNewsAPI(
    apiSettings: any,
    query: string,
    pageSize: number
  ): Promise<NewsArticle[]> {
    const params = new URLSearchParams({
      q: query,
      pageSize: pageSize.toString(),
      apiKey: apiSettings.apiKey,
      sortBy: 'publishedAt',
      language: 'en'
    })

    const url = `${apiSettings.baseUrl}${apiSettings.endpoints.search}?${params}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`NewsAPI search error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return this.transformNewsApiData(data.articles || [])
  }

  private transformGNewsData(articles: any[]): NewsArticle[] {
    return articles.map((article, index) => ({
      id: `gnews_${index}_${Date.now()}`,
      title: article.title || "No Title",
      description: article.description || "No description available",
      url: article.url || "#",
      urlToImage: article.image || article.urlToImage,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: { name: article.source?.name || "Unknown Source" },
      category: article.category || "general",
      content: article.content || ""
    }))
  }

  private transformNewsApiData(articles: any[]): NewsArticle[] {
    return articles.map((article, index) => ({
      id: `newsapi_${index}_${Date.now()}`,
      title: article.title || "No Title",
      description: article.description || "No description available",
      url: article.url || "#",
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: { name: article.source?.name || "Unknown Source" },
      category: "general", // NewsAPI doesn't provide category in search results
      content: article.content || ""
    }))
  }

  private filterNewsByCategory(news: NewsArticle[], category: string): NewsArticle[] {
    if (!category || category === "general") {
      return news
    }
    return news.filter(article => article.category === category)
  }

  public getMockNews(): NewsArticle[] {
    return MOCK_NEWS
  }
}

// Export singleton instance
export const newsService = NewsService.getInstance()
