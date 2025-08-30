import { NewsArticle } from "@/components/news-card"
import { config, hasValidApiKey, getBestNewsApiConfig } from "./config"

// GNews API endpoint
const NEWS_API_ENDPOINTS = {
  // GNews API (free tier: 100 requests/day)
  gnews: "https://gnews.io/api/v4/top-headlines",
}

// Mock data as fallback when API fails
const MOCK_NEWS: NewsArticle[] = [
  {
    id: "1",
    title: "Progressive Tax Reform Bill Passes House, Republicans Call It 'Socialist Takeover'",
    description: "Democrats celebrate the passage of landmark tax legislation that raises rates on the wealthy while Republicans warn it will destroy American businesses and job creation.",
    url: "https://example.com/progressive-tax-reform",
    urlToImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    source: { name: "Liberal Daily" },
    category: "politics",
    content: "The House of Representatives today passed a sweeping tax reform bill that Democrats say will address income inequality and fund essential social programs. The legislation, championed by progressive lawmakers, raises taxes on corporations and the top 1% of earners while providing relief to working families. Republicans have denounced the bill as a 'socialist takeover' that will harm the economy and drive businesses overseas. The bill now moves to the Senate where it faces an uncertain future."
  },
  {
    id: "2",
    title: "Conservative Think Tank Report: Government Regulations 'Strangling' American Innovation",
    description: "A comprehensive study by the Heritage Foundation reveals that excessive government regulations are costing the economy trillions and preventing American businesses from competing globally.",
    url: "https://example.com/conservative-regulation-study",
    urlToImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    source: { name: "Conservative Weekly" },
    category: "business",
    content: "A groundbreaking report from the Heritage Foundation exposes how government overreach is destroying American competitiveness. The study shows that federal regulations cost the economy $2 trillion annually and prevent small businesses from thriving. The report calls for immediate deregulation to unleash American innovation and restore economic freedom. Critics argue the study ignores environmental and consumer protections."
  },
  {
    id: "3",
    title: "Climate Activists Block Major Highway, Demand Immediate Action on Environmental Crisis",
    description: "Environmental protesters brought traffic to a standstill in downtown, calling for urgent government action on climate change while commuters express frustration over the disruption.",
    url: "https://example.com/climate-activists-protest",
    urlToImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    source: { name: "Environmental News Network" },
    category: "environment",
    content: "Climate activists from Extinction Rebellion blocked major downtown intersections today, demanding immediate government action on the climate crisis. The protesters say they're willing to face arrest to draw attention to what they call an existential threat to humanity. Commuters expressed anger over the disruption, with some calling the protesters 'radical extremists.' Police arrested 15 demonstrators."
  },
  {
    id: "4",
    title: "Free Market Advocates Celebrate Supreme Court Decision on Business Regulations",
    description: "The Supreme Court ruled in favor of business interests today, striking down what conservatives call 'burdensome' regulations while liberals warn of environmental and consumer harm.",
    url: "https://example.com/supreme-court-business-ruling",
    urlToImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    source: { name: "Business Daily" },
    category: "politics",
    content: "The Supreme Court today delivered a major victory to business interests, striking down federal regulations that conservatives argued were stifling economic growth. The 6-3 decision was celebrated by free market advocates who say it will unleash American entrepreneurship. Liberal justices dissented, warning that the ruling removes important consumer and environmental protections."
  },
  {
    id: "5",
    title: "Social Justice Advocates Push for Police Reform After Latest Incident",
    description: "Community leaders and activists are calling for comprehensive police reform following another controversial incident, while law enforcement groups defend their officers' actions.",
    url: "https://example.com/police-reform-advocates",
    urlToImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    source: { name: "Social Justice Today" },
    category: "politics",
    content: "Community activists and social justice organizations are demanding immediate police reform after another controversial incident involving law enforcement. The groups say systemic racism continues to plague police departments nationwide and call for defunding police departments to redirect resources to community programs. Police unions defend their officers and say the calls for reform are politically motivated."
  },
  {
    id: "6",
    title: "Balanced Report: New Economic Policy Shows Mixed Results in First Quarter",
    description: "A bipartisan analysis of recent economic policies reveals both positive and negative impacts, with experts from across the political spectrum offering different interpretations of the data.",
    url: "https://example.com/balanced-economic-report",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    source: { name: "Centrist News" },
    category: "business",
    content: "A comprehensive bipartisan analysis of recent economic policies shows mixed results in the first quarter. The report, conducted by economists from both major political parties, found that while some sectors benefited from the policies, others faced challenges. Republican economists emphasize the positive aspects while Democratic economists highlight areas needing improvement. The study provides a balanced view of the policy's overall impact."
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


  private async searchFromRealApi(query: string, pageSize: number): Promise<NewsArticle[]> {
    const apiConfig = getBestNewsApiConfig()
    if (!apiConfig) {
      throw new Error("No valid API configuration found")
    }

    const { provider, config: apiSettings } = apiConfig

    try {
      if (provider === 'gnews') {
        return await this.searchFromGNews(apiSettings, query, pageSize)
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