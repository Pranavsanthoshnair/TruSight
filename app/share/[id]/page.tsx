"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Shield, 
  Eye, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface SharedAnalysis {
  share_id: string
  chat_id: string
  message_id: string
  analysis_data: {
    bias: string
    confidence: number
    owner: string
    missingPerspectives: string[]
    reasoning?: string
  }
  created_at: string
}

export default function SharedAnalysisPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<SharedAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchSharedAnalysis()
  }, [params.id])

  const fetchSharedAnalysis = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/share?id=${params.id}`)
      
      if (!response.ok) {
        throw new Error('Analysis not found')
      }

      const result = await response.json()
      setAnalysis(result.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load analysis')
    } finally {
      setLoading(false)
    }
  }

  // Get bias color for badges
  const getBiasColor = (bias: string) => {
    const biasLower = bias.toLowerCase()
    if (biasLower.includes('left')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    if (biasLower.includes('right')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    if (biasLower.includes('center')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  // Get spectrum position for bias visualization
  const getSpectrumPosition = (bias: string, confidence: number) => {
    const biasLower = bias.toLowerCase()
    if (biasLower.includes('left')) return Math.max(10, 25 - (confidence * 15))
    if (biasLower.includes('right')) return Math.min(90, 75 + (confidence * 15))
    if (biasLower.includes('center')) return 50
    return 50
  }

  // Generate share text
  const generateShareText = (platform: string) => {
    if (!analysis) return ''
    
    const baseText = `🔍 Bias Analysis: ${analysis.analysis_data.bias} (${Math.round(analysis.analysis_data.confidence * 100)}% confidence)`
    const publisherText = `Source: ${analysis.analysis_data.owner}`
    const hashtags = `#BiasDetection #MediaLiteracy #TruSight`
    
    switch (platform) {
      case 'twitter':
        return `${baseText}\n${publisherText}\n\nAnalyzed with TruSight - AI-powered bias detection\n${hashtags}`
      case 'facebook':
        return `${baseText}\n\n${publisherText}\n\nI just analyzed this content for media bias using TruSight's AI-powered bias detection tool. Check it out!`
      case 'linkedin':
        return `${baseText}\n\n${publisherText}\n\nMedia literacy is crucial in today's information landscape. I used TruSight's AI-powered bias detection to analyze this content.`
      default:
        return `${baseText}\n${publisherText}\n\nAnalyzed with TruSight - AI-powered bias detection`
    }
  }

  // Generate share URLs
  const generateShareUrl = (platform: string) => {
    const text = encodeURIComponent(generateShareText(platform))
    const url = encodeURIComponent(window.location.href)
    
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${text}`
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
      default:
        return ''
    }
  }

  // Handle social media sharing
  const handleShare = (platform: string) => {
    const url = generateShareUrl(platform)
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  // Handle copy to clipboard
  const handleCopy = async () => {
    const text = generateShareText('default')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading shared analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <Target className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Analysis Not Found</h1>
          <p className="text-muted-foreground">
            {error || "This shared analysis could not be found or may have been removed."}
          </p>
          <Button onClick={() => router.push('/bias')}>
            Try Your Own Analysis
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/bias')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bias Detection
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Shared Bias Analysis</h1>
              <p className="text-lg text-muted-foreground">
                Analysis shared from TruSight - AI-powered bias detection
              </p>
            </div>
            
            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
              
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare('twitter')}
                  className="h-9 w-9"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare('facebook')}
                  className="h-9 w-9"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare('linkedin')}
                  className="h-9 w-9"
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analysis Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Bias Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header with Bias Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Detected Bias</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getBiasColor(analysis.analysis_data.bias)}>
                    {analysis.analysis_data.bias}
                  </Badge>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Confidence</span>
                  <span className="text-primary font-semibold">
                    {Math.round(analysis.analysis_data.confidence * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.analysis_data.confidence * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Bias Spectrum */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="w-3 h-3 text-blue-500 flex-shrink-0" />
                  <span>Left</span>
                  <Minus className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>Center</span>
                  <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
                  <span>Right</span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full">
                    <motion.div
                      className="absolute -top-0.5 h-3 w-3 rounded-full bg-background border-2 border-primary shadow-sm"
                      style={{ 
                        left: `calc(${getSpectrumPosition(analysis.analysis_data.bias, analysis.analysis_data.confidence)}% - 6px)` 
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Left</span>
                    <span>Center</span>
                    <span>Right</span>
                  </div>
                </div>
              </div>

              {/* Source Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="w-3 h-3 text-primary flex-shrink-0" />
                  Source
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Publisher</span>
                  <span className="text-xs font-medium truncate max-w-[60%]">{analysis.analysis_data.owner}</span>
                </div>
              </div>

              {/* Missing Perspectives */}
              {analysis.analysis_data.missingPerspectives.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Eye className="w-3 h-3 text-primary flex-shrink-0" />
                    Missing Perspectives
                  </div>
                  <div className="space-y-1">
                    {analysis.analysis_data.missingPerspectives.map((perspective, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + (idx * 0.05) }}
                        className="flex items-start gap-2"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground break-words">{perspective}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Reasoning */}
              {analysis.analysis_data.reasoning && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Info className="w-3 h-3 text-primary flex-shrink-0" />
                    Analysis
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed break-words">
                    {analysis.analysis_data.reasoning}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Analysis performed on {new Date(analysis.created_at).toLocaleDateString()} using TruSight's AI-powered bias detection
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <Button size="lg" onClick={() => router.push('/bias')}>
            Try Your Own Analysis
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
