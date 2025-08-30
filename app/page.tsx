"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { SearchBar } from "@/components/search-bar"
import { NewsCard, NewsArticle } from "@/components/news-card"
import { Footer } from "@/components/footer"
import { newsService } from "@/lib/news-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, RefreshCw, Target, ChevronDown, Globe } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [news, setNews] = useState<NewsArticle[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchNews()
  }, [])

  useEffect(() => {
    // Filter news based on category and search
    let filtered = news

    if (selectedCategory && selectedCategory !== "general") {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredNews(filtered)
  }, [news, selectedCategory, searchQuery])

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const articles = await newsService.fetchTopHeadlines(selectedCategory || "general")
      setNews(articles)
      setFilteredNews(articles)
    } catch (err) {
      console.error("Failed to fetch news:", err)
      setError("Failed to load news. Using cached data.")
      
      // Fallback to mock data
      const mockArticles = newsService.getMockNews()
      setNews(mockArticles)
      setFilteredNews(mockArticles)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setSearchQuery("") // Clear search when category changes
  }

  const handleAnalyzeBias = (article: NewsArticle) => {
    // Navigate to bias detection page with article data
    const articleData = encodeURIComponent(JSON.stringify({
      title: article.title,
      content: article.content || article.description,
      url: article.url,
      source: article.source.name
    }))
    
    router.push(`/bias?article=${articleData}`)
  }

  const handleRefresh = () => {
    fetchNews()
  }

  const getCategoryStats = () => {
    const stats = news.reduce((acc, article) => {
      const category = article.category || "general"
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
  }

  if (isLoading && news.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading the latest news...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Full-screen Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-normal text-foreground mb-6 md:mb-8 leading-tight tracking-tight">
            Stay Informed,<br />
            Stay Objective
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl md:max-w-3xl mx-auto leading-relaxed mb-8 md:mb-10">
            Discover the latest news from around the world, then analyze potential bias 
            with our AI-powered detection tool. Make informed decisions with TruSight.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16 md:mb-20"
          >
            <Button
              onClick={() => document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-base md:text-lg px-8 md:px-10 py-4 md:py-5 h-auto font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore News
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="flex flex-col items-center text-muted-foreground">
            <span className="text-xs md:text-sm font-medium mb-3 md:mb-4 text-muted-foreground/80">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-muted-foreground/60"
            >
              <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* News Content Section */}
      <section id="news-section" className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SearchBar
              onSearch={handleSearch}
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          </motion.div>

          {/* Stats and Refresh */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>{filteredNews.length} articles found</span>
              </div>
              {selectedCategory && (
                <Badge variant="secondary" className="capitalize">
                  {selectedCategory}
                </Badge>
              )}
            </div>
            
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="flex items-center gap-3 p-4">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="text-sm font-medium text-destructive">{error}</p>
                    <p className="text-xs text-destructive/70">
                      Some features may be limited. Check your internet connection.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* News Grid */}
          {filteredNews.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {filteredNews.map((article, index) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onAnalyzeBias={handleAnalyzeBias}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or category selection.
              </p>
              <Button onClick={() => { setSearchQuery(""); setSelectedCategory("") }}>
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* Category Distribution */}
          {news.length > 0 && (
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
                News Distribution by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {getCategoryStats().map(([category, count]) => (
                  <Card key={category} className="text-center p-4">
                    <CardContent className="p-0">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {count}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {category}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-8">
              <CardContent className="p-0">
                <Target className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Ready to Analyze Bias?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Use our advanced AI-powered bias detection tool to analyze any article, 
                  text, or URL. Get instant insights into potential media bias and missing perspectives.
                </p>
                <Button
                  onClick={() => router.push("/bias")}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Try Bias Detection
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
