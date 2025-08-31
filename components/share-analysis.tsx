"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy, 
  Check,
  X,
  Globe,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/lib/types"

interface ShareAnalysisProps {
  analysisMessage: ChatMessage | null
  chatId?: string
  isOpen: boolean
  onClose: () => void
}

export function ShareAnalysis({ analysisMessage, chatId, isOpen, onClose }: ShareAnalysisProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [creatingShare, setCreatingShare] = useState(false)

  // Parse analysis data from message content
  const parseAnalysisData = (content: string) => {
    try {
      const lines = content.split('\n')
      const biasLine = lines.find(line => line.startsWith('Detected Bias:'))
      const publisherLine = lines.find(line => line.startsWith('Publisher:'))
      
      if (!biasLine) return null
      
      const biasMatch = biasLine.match(/Detected Bias: (.+?) \(confidence (\d+)%\)/)
      if (!biasMatch) return null
      
      const bias = biasMatch[1]
      const confidence = parseInt(biasMatch[2])
      const publisher = publisherLine ? publisherLine.replace('Publisher: ', '') : 'Unknown Publisher'
      
      return {
        bias,
        confidence,
        publisher
      }
    } catch (error) {
      return null
    }
  }

  const analysisData = analysisMessage ? parseAnalysisData(analysisMessage.content) : null

  if (!analysisData) {
    return null
  }

  // Get bias color for badges
  const getBiasColor = (bias: string) => {
    const biasLower = bias.toLowerCase()
    if (biasLower.includes('left')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    if (biasLower.includes('right')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    if (biasLower.includes('center')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  // Generate share text
  const generateShareText = (platform: string) => {
    const baseText = `🔍 Bias Analysis: ${analysisData.bias} (${analysisData.confidence}% confidence)`
    const publisherText = `Source: ${analysisData.publisher}`
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

  // Create shareable URL
  const createShareUrl = async () => {
    if (!analysisMessage || !chatId) return
    
    try {
      setCreatingShare(true)
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId,
          messageId: analysisMessage.id,
          analysisData: analysisData
        })
      })

      if (response.ok) {
        const result = await response.json()
        setShareUrl(result.shareUrl)
      } else {
        console.error('Failed to create share URL')
      }
    } catch (error) {
      console.error('Error creating share URL:', error)
    } finally {
      setCreatingShare(false)
    }
  }

  // Copy share URL to clipboard
  const copyShareUrl = async () => {
    if (!shareUrl) return
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy share URL:', error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Share Analysis</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Analysis Preview */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-primary" />
                  Analysis Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getBiasColor(analysisData.bias)}>
                    {analysisData.bias}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {analysisData.confidence}% confidence
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Source: </span>
                  <span className="font-medium">{analysisData.publisher}</span>
                </div>
              </CardContent>
            </Card>

            {/* Share Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Share on social media</h3>
              
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20"
                >
                  <Twitter className="h-5 w-5 text-blue-500" />
                  <span className="text-xs">Twitter</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20"
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <span className="text-xs">Facebook</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  className="flex flex-col items-center gap-2 h-auto py-3 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20"
                >
                  <Linkedin className="h-5 w-5 text-blue-700" />
                  <span className="text-xs">LinkedIn</span>
                </Button>
              </div>

              {/* Copy to Clipboard */}
              <div className="pt-3 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="w-full flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Shareable URL */}
              <div className="pt-3 border-t border-border">
                {!shareUrl ? (
                  <Button
                    variant="outline"
                    onClick={createShareUrl}
                    disabled={creatingShare}
                    className="w-full flex items-center gap-2"
                  >
                    {creatingShare ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        <span>Creating Share Link...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4" />
                        <span>Create Shareable Link</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded border text-xs break-all">
                      <span className="text-muted-foreground">Share URL:</span>
                      <span className="flex-1">{shareUrl}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={copyShareUrl}
                      className="w-full flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Share URL</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Share your bias analysis to help others become more media literate
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
