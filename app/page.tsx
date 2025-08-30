"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { SearchBar } from "@/components/search-bar"
import { NewsCard, NewsArticle } from "@/components/news-card"
import { Footer } from "@/components/footer"
import { newsService } from "@/lib/news-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, RefreshCw, Target, ChevronDown, Globe, TrendingUp, Shield, Zap } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [news, setNews] = useState<NewsArticle[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  useEffect(() => {
    setIsMounted(true)
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
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg text-muted-foreground font-medium">Loading the latest news...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Full-screen Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-6 sm:px-8 lg:px-12 overflow-hidden">
        {/* Background Elements */}
        {isMounted && (
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{ y }}
          >
            <div className="absolute top-20 left-10 w-40 h-40 bg-primary rounded-full blur-3xl" />
            <div className="absolute top-40 right-20 w-32 h-32 bg-secondary rounded-full blur-3xl" />
            <div className="absolute bottom-40 left-20 w-36 h-36 bg-accent rounded-full blur-3xl" />
          </motion.div>
        )}

        <div className="text-center max-w-6xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-normal text-foreground mb-8 md:mb-12 leading-tight tracking-tight">
            Stay Informed,<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Stay Objective
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl md:max-w-4xl mx-auto leading-relaxed mb-12 md:mb-16 font-medium">
            Discover the latest news from around the world, then analyze potential bias 
            with our AI-powered detection tool. Make informed decisions with TruSight.
          </p>
          
          <div className="mb-20 md:mb-24">
            <Button
              onClick={() => document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 h-auto font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover-glow rounded-xl"
            >
              Explore News
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20 md:mb-24">
            {[
              { icon: Shield, title: "Bias Detection", desc: "AI-powered analysis" },
              { icon: TrendingUp, title: "Real-time News", desc: "Latest updates" },
              { icon: Zap, title: "Instant Insights", desc: "Quick analysis" }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-sm hover-lift hover-glow shadow-lg"
              >
                <div className="p-3 bg-primary/10 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Scroll indicator - part of main content */}
          <motion.div 
            className="flex flex-col items-center text-muted-foreground"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <span className="text-sm md:text-base font-medium mb-4 text-muted-foreground/80 tracking-wide">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-muted-foreground/60"
            >
              <ChevronDown className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* News Content Section */}
      <section id="news-section" className="py-20 bg-background relative">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          {/* Search and Filters */}
          <div className="mb-12">
            <SearchBar
              onSearch={handleSearch}
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          </div>

          {/* Stats and Refresh */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-base text-muted-foreground">
                <div className="p-2 bg-muted/50 rounded-lg">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="font-medium">{filteredNews.length} articles found</span>
              </div>
              {selectedCategory && (
                <Badge variant="secondary" className="capitalize hover-scale px-4 py-2 text-sm font-medium">
                  {selectedCategory}
                </Badge>
              )}
            </div>
            
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-3 hover-scale focus-ring px-6 py-2 h-10 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8">
              <Card className="border-destructive/50 bg-destructive/5 hover-scale shadow-lg">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-destructive mb-1">{error}</p>
                    <p className="text-sm text-destructive/70 leading-relaxed">
                      Some features may be limited. Check your internet connection.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* News Grid */}
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((article, index) => (
                <div key={article.id} className="hover-lift">
                  <NewsCard
                    article={article}
                    onAnalyzeBias={handleAnalyzeBias}
                    index={index}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto leading-relaxed">
                Try adjusting your search terms or category selection.
              </p>
              <Button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("") }}
                className="hover-scale focus-ring px-8 py-3 h-12 rounded-lg text-base font-medium"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Category Distribution */}
          {news.length > 0 && (
            <div className="mt-24">
              <h2 className="text-3xl font-semibold text-foreground mb-10 text-center">
                News Distribution by Category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {getCategoryStats().map(([category, count], index) => (
                  <div key={category} className="hover-lift">
                    <Card className="text-center p-6 hover-glow shadow-lg rounded-xl">
                      <CardContent className="p-0">
                        <div className="text-3xl font-bold text-primary mb-3">
                          {count}
                        </div>
                        <div className="text-sm text-muted-foreground capitalize font-medium">
                          {category}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-24 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-12 hover-scale hover-glow shadow-xl rounded-2xl">
              <CardContent className="p-0">
                <div className="p-4 bg-primary/10 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Target className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-3xl font-semibold text-foreground mb-6">
                  Ready to Analyze Bias?
                </h3>
                <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
                  Use our advanced AI-powered bias detection tool to analyze any article, 
                  text, or URL. Get instant insights into potential media bias and missing perspectives.
                </p>
                <Button
                  onClick={() => router.push("/bias")}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground hover-glow focus-ring px-10 py-4 h-14 text-lg font-semibold rounded-xl shadow-lg"
                >
                  Try Bias Detection
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
