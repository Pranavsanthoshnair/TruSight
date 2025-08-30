"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Bot, User, Target, Shield, Eye, Info } from "lucide-react"
import { StampEffect } from "@/components/stamp-effect"

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
    switch (bias.toLowerCase()) {
      case "left-leaning":
        return "bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-800"
      case "right-leaning":
        return "bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-800"
      case "center":
        return "bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-800"
      case "neutral":
        return "bg-gray-500/10 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-800"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-800"
    }
  }

  // Calculate spectrum position
  const getSpectrumPosition = (bias: string, confidence: number): number => {
    const biasLower = bias.toLowerCase()
    
    switch (biasLower) {
      case "left-leaning":
        return Math.max(5, Math.min(40, 25 - (confidence * 20)))
      case "right-leaning":
        return Math.max(60, Math.min(95, 75 + (confidence * 20)))
      case "center":
        return Math.max(40, Math.min(60, 50 + (confidence - 0.5) * 20))
      case "neutral":
        return Math.max(45, Math.min(55, 50 + (confidence - 0.5) * 10))
      default:
        return 50
    }
  }

  return (
    <div className="h-full flex flex-col">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            className="text-center max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-3xl font-serif font-bold text-foreground mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              TruSight is ready when you are...
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Paste an article link or text below to begin your bias analysis
            </motion.p>
          </motion.div>
        </div>
      ) : (
        <ScrollArea className="flex-1 h-full">
          <div className="p-3 sm:p-4 space-y-3 md:space-y-4 max-w-4xl mx-auto">
            <AnimatePresence>
              {messages.map((message, index) => {
                const isAnalysis = message.type === "analysis"
                const analysisData = isAnalysis ? parseAnalysisData(message.content) : null
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                  >
                    <div className={cn("flex items-end gap-2 w-full", message.sender === "user" ? "justify-end" : "justify-start")}>
                      {message.sender !== "user" && (
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 hover-scale transition-all duration-300">
                          <AvatarImage src="/placeholder-user.png" />
                          <AvatarFallback className="bg-muted">
                            <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={cn("flex flex-col", message.sender === "user" ? "items-end" : "items-start")}>
                        {isAnalysis && analysisData ? (
                          // New Analysis Card Format
                          <StampEffect isStamped={true} stampText="ANALYZED">
                            <motion.div
                              className="max-w-[85vw] sm:max-w-md md:max-w-lg lg:max-w-xl"
                              whileHover={{ scale: 1.02, y: -2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card className="border-0 shadow-sm bg-card/50">
                                <CardContent className="p-4 space-y-4">
                                  {/* Header */}
                                  <div className="text-center space-y-1">
                                    <div className="flex items-center justify-center gap-2">
                                      <Target className="w-4 h-4 text-primary" />
                                      <h3 className="text-base font-semibold text-foreground">Analysis Results</h3>
                                    </div>
                                  </div>

                                  {/* Main Analysis */}
                                  <div className="space-y-3">
                                    {/* Bias Classification */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Detected Bias</span>
                                        <Badge 
                                          variant="outline" 
                                          className={`${getBiasColor(analysisData.bias)} text-xs font-medium`}
                                        >
                                          {analysisData.bias}
                                        </Badge>
                                      </div>
                                      
                                      {/* Confidence */}
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="text-muted-foreground">Confidence</span>
                                          <span className="font-medium">{Math.round(analysisData.confidence * 100)}%</span>
                                        </div>
                                        <Progress 
                                          value={analysisData.confidence * 100} 
                                          className="h-1.5 bg-muted/50"
                                        />
                                      </div>
                                    </div>

                                    {/* Bias Spectrum */}
                                    <div className="space-y-2">
                                      <span className="text-xs text-muted-foreground">Bias Spectrum</span>
                                      <div className="relative h-1.5 bg-gradient-to-r from-blue-500 via-gray-400 to-red-500 rounded-full">
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
                                      <Shield className="w-3 h-3 text-primary" />
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
                                        <Eye className="w-3 h-3 text-primary" />
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
                                            <span className="text-xs text-muted-foreground">{perspective}</span>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* AI Reasoning */}
                                  {analysisData.reasoning && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm font-medium">
                                        <Info className="w-3 h-3 text-primary" />
                                        Analysis
                                      </div>
                                      <p className="text-xs text-muted-foreground leading-relaxed">
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
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 hover-scale transition-all duration-300">
                          <AvatarFallback className="bg-secondary">
                            <User className="w-3 h-3 sm:w-4 sm:h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
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
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                  <AvatarFallback className="bg-muted">
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
