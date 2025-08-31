"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Plus, Bot } from "lucide-react"
import type { ChatHistory } from "@/lib/types"

interface SidebarProps {
  chatHistories: ChatHistory[]
  currentChat: ChatHistory | null
  onSelectChat: (chat: ChatHistory) => void
  onNewAnalysis: () => void
  onDeleteChat: (chatId: string) => void
}

export function Sidebar({ chatHistories, currentChat, onSelectChat, onNewAnalysis, onDeleteChat }: SidebarProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    // Use consistent date formatting to prevent hydration mismatch
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Profile Section */}
      <motion.div
        className="p-4 sm:p-6 border-b border-sidebar-border flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-sidebar-accent/20 hover:ring-sidebar-accent/40 transition-all duration-300 hover-scale">
            <AvatarImage src="/robot-avatar.svg" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-serif text-lg flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif font-semibold text-sidebar-foreground text-sm sm:text-base truncate">Bias Hunter</h3>
            <p className="text-xs sm:text-sm text-sidebar-foreground/70 truncate">AI Chatbot</p>
          </div>
        </div>

        <Button
          onClick={onNewAnalysis}
          className="w-full bg-sidebar-accent hover:bg-sidebar-accent/90 text-sidebar-accent-foreground font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </motion.div>

      {/* Chat History */}
      <div className="flex-1 min-h-0">
        <div className="p-4 sm:p-6">
          <h4 className="text-sm font-medium text-sidebar-foreground/80 mb-3">Recent Analyses</h4>
          
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {chatHistories.length === 0 ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="text-sidebar-foreground/50 mb-2">
                    <Bot className="h-8 w-8 mx-auto mb-2" />
                  </div>
                  <p className="text-xs text-sidebar-foreground/60">
                    No analyses yet.<br />
                    Start your first bias detection!
                  </p>
                </motion.div>
              ) : (
                chatHistories.map((chat, index) => {
                  const isActive = currentChat?.id === chat.id
                  const firstMessage = chat.messages.find(m => m.sender === "user")
                  const analysisMessage = chat.messages.find(m => m.type === "analysis")
                  
                  // Extract bias info from analysis message
                  let biasInfo = null
                  if (analysisMessage) {
                    try {
                      const lines = analysisMessage.content.split('\n')
                      const biasLine = lines.find(line => line.startsWith('Detected Bias:'))
                      if (biasLine) {
                        const match = biasLine.match(/Detected Bias: (.+?) \(confidence (\d+)%\)/)
                        if (match) {
                          biasInfo = {
                            bias: match[1],
                            confidence: parseInt(match[2])
                          }
                        }
                      }
                    } catch (error) {
                      // Ignore parsing errors
                    }
                  }

                  return (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div
                        className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          isActive
                            ? "bg-sidebar-accent/20 border border-sidebar-accent/30"
                            : "hover:bg-sidebar-foreground/5 border border-transparent hover:border-sidebar-border/50"
                        }`}
                        onClick={() => onSelectChat(chat)}
                      >
                        {/* Bias Badge */}
                        {biasInfo && (
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs px-2 py-1 ${
                                biasInfo.bias.toLowerCase().includes('left') 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                  : biasInfo.bias.toLowerCase().includes('right')
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  : biasInfo.bias.toLowerCase().includes('center')
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                              }`}
                            >
                              {biasInfo.bias}
                            </Badge>
                            <span className="text-xs text-sidebar-foreground/60">
                              {biasInfo.confidence}%
                            </span>
                          </div>
                        )}

                        {/* Chat Preview */}
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-sidebar-foreground line-clamp-2">
                            {firstMessage?.content.slice(0, 100) || "New analysis"}
                            {firstMessage?.content.length > 100 && "..."}
                          </p>
                          <p className="text-xs text-sidebar-foreground/60">
                            {formatDate(chat.createdAt)}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-sidebar-foreground/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteChat(chat.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
