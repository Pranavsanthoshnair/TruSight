"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare, Clock } from "lucide-react"
import type { ChatHistory } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface SidebarProps {
  chatHistories: ChatHistory[]
  currentChat: ChatHistory | null
  onSelectChat: (chat: ChatHistory) => void
  onNewAnalysis: () => void
}

export function Sidebar({ chatHistories, currentChat, onSelectChat, onNewAnalysis }: SidebarProps) {
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
        className="p-4 sm:p-6 border-b border-sidebar-border"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-sidebar-accent/20 hover:ring-sidebar-accent/40 transition-all duration-300 hover-scale">
            <AvatarImage src="/placeholder-user.png" />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground font-serif text-lg">
              BH
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif font-semibold text-sidebar-foreground text-sm sm:text-base truncate">Bias Hunter</h3>
            <p className="text-xs sm:text-sm text-sidebar-foreground/70 truncate">Media Analyst</p>
          </div>
        </div>

        <Button
          onClick={onNewAnalysis}
          className="w-full bg-sidebar-accent hover:bg-sidebar-accent/90 text-sidebar-accent-foreground font-medium transition-all duration-300 hover:scale-105 hover-lift focus-ring"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Start New Analysis</span>
          <span className="sm:hidden">New</span>
        </Button>
      </motion.div>

      {/* Chat History */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 sm:p-4 border-b border-sidebar-border">
          <h4 className="font-serif font-semibold text-sidebar-foreground flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Recent Analyses</span>
            <span className="sm:hidden">Analyses</span>
          </h4>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {chatHistories.length === 0 ? (
              <motion.div
                className="text-center py-6 sm:py-8 px-3 sm:px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-sidebar-foreground/40" />
                <p className="text-sidebar-foreground/60 text-xs sm:text-sm">
                  <span className="hidden sm:inline">No analyses yet. Start your first bias analysis above!</span>
                  <span className="sm:hidden">No analyses yet!</span>
                </p>
              </motion.div>
            ) : (
              <div className="space-y-1">
                {chatHistories.map((chat, index) => (
                  <motion.button
                    key={chat.id}
                    onClick={() => onSelectChat(chat)}
                    className={cn(
                      "w-full text-left p-2 sm:p-3 rounded-lg transition-all duration-300 hover:bg-sidebar-primary group",
                      "border border-transparent hover:border-sidebar-border",
                      "hover-lift hover-glow",
                      currentChat?.id === chat.id && "bg-sidebar-primary border-sidebar-accent/30 shadow-md",
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-2 h-2 rounded-full bg-sidebar-accent mt-2 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sidebar-foreground text-ellipsis-overflow group-hover:text-sidebar-accent transition-colors duration-300 text-xs sm:text-sm">
                          {chat.title}
                        </h5>
                        <p className="text-xs text-sidebar-foreground/60 mt-1">{formatDate(chat.createdAt)}</p>
                        {chat.messages.length > 0 && (
                          <p className="text-xs text-sidebar-foreground/50 mt-1 line-clamp-2 text-wrap-break">
                            {chat.messages[chat.messages.length - 1].content.length > 80 
                              ? chat.messages[chat.messages.length - 1].content.substring(0, 80) + "..."
                              : chat.messages[chat.messages.length - 1].content
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Enhanced newspaper-style underline effect */}
                    <div className="h-px bg-gradient-to-r from-transparent via-sidebar-accent/20 to-transparent mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer with XP History */}
      <motion.div
        className="p-3 sm:p-4 border-t border-sidebar-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-sidebar-foreground/60">Online</span>
          </div>
          <div className="text-xs text-sidebar-foreground/60">
            <span className="hidden sm:inline">Analyses: </span>{chatHistories.length}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
