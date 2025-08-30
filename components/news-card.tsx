"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, TrendingUp, Clock, Target, Eye, Share2 } from "lucide-react"

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
  const [isHovered, setIsHovered] = useState(false)

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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: Math.min(index * 0.1, 0.5),
        ease: "easeOut"
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full group"
    >
      <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-500 border-border/50 hover:border-primary/30 bg-card/80 hover:bg-card backdrop-blur-sm rounded-xl overflow-hidden">
        <CardHeader className="pb-4 relative overflow-hidden">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
            {article.urlToImage && !imageError ? (
              <motion.img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ) : (
              <motion.div 
                className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-muted-foreground text-center p-6">
                  <motion.div 
                    className="text-3xl mb-3"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  >
                    📰
                  </motion.div>
                  <div className="text-sm font-medium">No Image</div>
                </div>
              </motion.div>
            )}
            
            {/* Category Badge */}
            {article.category && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="absolute top-3 left-3"
              >
                <Badge className="bg-primary/90 text-primary-foreground hover-scale focus-ring px-3 py-1.5 text-xs font-medium shadow-lg">
                  {article.category}
                </Badge>
              </motion.div>
            )}
            
            {/* Trending Badge */}
            {index < 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="absolute top-3 right-3"
              >
                <Badge className="bg-orange-500 text-white flex items-center gap-1.5 hover-scale px-3 py-1.5 text-xs font-medium shadow-lg">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                  </motion.div>
                  Trending
                </Badge>
              </motion.div>
            )}

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <div className="flex gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 h-10 w-10 p-0 rounded-lg">
                    <Eye className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button size="sm" variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 h-10 w-10 p-0 rounded-lg">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Source and Time */}
          <motion.div 
            className="flex items-center justify-between text-sm text-muted-foreground mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <motion.span 
                className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                {article.source.name}
              </motion.span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="p-1 bg-muted/50 rounded-lg"
              >
                <Clock className="h-3.5 w-3.5" />
              </motion.div>
              <span className="font-medium">{formatDate(article.publishedAt)}</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3 
            className="text-xl font-bold line-clamp-2 leading-tight text-foreground group-hover:text-primary transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {article.title}
          </motion.h3>
        </CardHeader>

        <CardContent className="flex-1 pb-4 px-6">
          {/* Description */}
          <motion.p 
            className="text-muted-foreground text-sm leading-relaxed line-clamp-3 group-hover:text-foreground/80 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {truncateText(article.description, 150)}
          </motion.p>
        </CardContent>

        <CardFooter className="pt-0 px-6 pb-6 flex flex-col gap-4">
          {/* Action Buttons */}
          <motion.div 
            className="flex gap-3 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={handleAnalyzeBias}
                disabled={isAnalyzing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground hover-glow-primary focus-ring h-11 rounded-lg font-medium shadow-sm"
                size="sm"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="rounded-full h-3.5 w-3.5 border-b-2 border-current"
                    />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Target className="h-4 w-4" />
                    </motion.div>
                    Analyze Bias
                  </div>
                )}
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-shrink-0 hover-scale focus-ring h-11 w-11 p-0 rounded-lg"
              >
                <Link href={article.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            className="flex items-center justify-between text-xs text-muted-foreground/70 pt-2 border-t border-border/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <span className="font-medium">ID: {article.id.slice(-6)}</span>
            <span className="text-primary/60 font-semibold">#{index + 1}</span>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
