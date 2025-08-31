"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Bot, Target, Shield, Eye, Info, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { StampEffect } from "./stamp-effect"
import type { ChatMessage } from "@/lib/types"

interface ChatWindowProps {
  messages: ChatMessage[]
  isLoading: boolean
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  // Parse analysis data from message content
  const parseAnalysisData = (content: string) => {
    try {
      const lines = content.split('\n')
      const biasLine = lines.find(line => line.startsWith('Detected Bias:'))
      const publisherLine = lines.find(line => line.startsWith('Publisher:'))
      const missingLine = lines.find(line => line.startsWith('Missing perspectives:'))
      
      if (!biasLine) return null
      
      const biasMatch = biasLine.match(/Detected Bias: (.+?) \(confidence (\d+)%\)/)
      if (!biasMatch) return null
      
      const bias = biasMatch[1]
      const confidence = parseInt(biasMatch[2]) / 100
      const owner = publisherLine ? publisherLine.replace('Publisher: ', '') : 'Unknown Publisher'
      const missingPerspectives = missingLine && missingLine !== 'Missing perspectives: none detected' 
        ? missingLine.replace('Missing perspectives: ', '').split(', ')
        : []
      
      // Extract reasoning if available
      const reasoningIndex = lines.findIndex(line => line.startsWith('Analysis:'))
      const reasoning = reasoningIndex !== -1 ? lines.slice(reasoningIndex).join('\n').replace('Analysis: ', '') : undefined
      
      return {
        bias,
        confidence,
        owner,
        missingPerspectives,
        reasoning
      }
    } catch (error) {
      return null
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

  return (
    <div className="h-full flex flex-col">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to Bias Hunter</h3>
              <p className="text-muted-foreground text-sm max-w-md">
                I'm your AI assistant for detecting media bias. Share any news article, text, or URL, and I'll analyze it for potential bias and missing perspectives.
              </p>
            </div>
          </motion.div>
        </div>
      ) : (
        <ScrollArea className="flex-1 h-full">
          <div className="p-4 space-y-4 min-h-full">
            <AnimatePresence>
              {messages.map((message, index) => {
                const analysisData = message.type === "analysis" ? parseAnalysisData(message.content) : null
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    className={cn(
                      "flex items-end gap-2",
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {message.sender === "system" && (
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 hover-scale transition-all duration-300 flex-shrink-0">
                        <AvatarImage src="/ai.png" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="flex flex-col max-w-[85%] min-w-0">
                      {analysisData ? (
                        <StampEffect>
                          <motion.div
                            className="w-full max-w-md"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                          >
                            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5 shadow-lg">
                              <CardContent className="p-4 space-y-4">
                                {/* Header with Bias Badge */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span className="text-sm font-semibold">Bias Analysis</span>
                                  </div>
                                  <Badge className={getBiasColor(analysisData.bias)}>
                                    {analysisData.bias}
                                  </Badge>
                                </div>

                                {/* Confidence Score */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">Confidence</span>
                                    <span className="text-primary font-semibold">
                                      {Math.round(analysisData.confidence * 100)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <motion.div
                                      className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${analysisData.confidence * 100}%` }}
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
                                          left: `calc(${getSpectrumPosition(analysisData.bias, analysisData.confidence)}% - 6px)` 
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
                                    <span className="text-xs font-medium truncate max-w-[60%]">{analysisData.owner}</span>
                                  </div>
                                </div>

                                {/* Missing Perspectives */}
                                {analysisData.missingPerspectives.length > 0 && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                      <Eye className="w-3 h-3 text-primary flex-shrink-0" />
                                      Missing Perspectives
                                    </div>
                                    <div className="space-y-1">
                                      {analysisData.missingPerspectives.map((perspective, idx) => (
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
                                {analysisData.reasoning && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                      <Info className="w-3 h-3 text-primary flex-shrink-0" />
                                      Analysis
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed break-words">
                                      {analysisData.reasoning}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        </StampEffect>
                      ) : (
                        // Regular message format
                        <motion.div
                          className={cn(
                            "rounded-2xl px-3 sm:px-4 py-2 shadow-sm",
                            "max-w-[85vw] sm:max-w-sm md:max-w-md lg:max-w-xl",
                            "hover-scale hover-glow transition-all duration-300",
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground border border-border",
                          )}
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line break-words overflow-hidden">{message.content}</p>
                        </motion.div>
                      )}
                      
                      <motion.span 
                        className="text-xs text-muted-foreground mt-1 block opacity-0 animate-fade-in-up"
                        style={{ animationDelay: `${(index * 0.1) + 0.3}s` }}
                      >
                        {message.timestamp.toLocaleTimeString('en-US', {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </motion.span>
                    </div>

                    {message.sender === "user" && (
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 hover-scale transition-all duration-300 flex-shrink-0">
                        <AvatarFallback className="bg-secondary">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-end gap-2"
              >
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                  <AvatarImage src="/ai.png" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                  </AvatarFallback>
                </Avatar>
                <motion.div 
                  className="rounded-2xl px-3 sm:px-4 py-3 shadow-sm bg-muted text-foreground border border-border hover-scale hover-glow"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <motion.div 
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                      />
                      <motion.div 
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">Analyzing...</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
