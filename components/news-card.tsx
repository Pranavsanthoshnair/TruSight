"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, TrendingUp, Clock, Target } from "lucide-react"

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: {
    name: string
  }
  category?: string
  content?: string
}

interface NewsCardProps {
  article: NewsArticle
  onAnalyzeBias: (article: NewsArticle) => void
  index: number
}

export function NewsCard({ article, onAnalyzeBias, index }: NewsCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyzeBias = async () => {
    setIsAnalyzing(true)
    try {
      await onAnalyzeBias(article)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + "..."
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
        <CardHeader className="pb-3">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg mb-3">
            {article.urlToImage && !imageError ? (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <div className="text-muted-foreground text-center p-4">
                  <div className="text-2xl mb-2">📰</div>
                  <div className="text-sm">No Image</div>
                </div>
              </div>
            )}
            
            {/* Category Badge */}
            {article.category && (
              <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground">
                {article.category}
              </Badge>
            )}
            
            {/* Trending Badge */}
            {index < 3 && (
              <Badge className="absolute top-2 right-2 bg-orange-500 text-white flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Trending
              </Badge>
            )}
          </div>

          {/* Source and Time */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{article.source.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(article.publishedAt)}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold line-clamp-2 leading-tight text-foreground">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {truncateText(article.description, 150)}
          </p>
        </CardContent>

        <CardFooter className="pt-0 flex flex-col gap-3">
          {/* Action Buttons */}
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleAnalyzeBias}
              disabled={isAnalyzing}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3" />
                  Analyze Bias
                </div>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-shrink-0"
            >
              <Link href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
