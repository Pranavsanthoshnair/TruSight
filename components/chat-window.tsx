"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ChatMessage } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Bot, User, CheckCircle } from "lucide-react"
import { StampEffect } from "@/components/stamp-effect"

interface ChatWindowProps {
  messages: ChatMessage[]
  isLoading: boolean
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  return (
    <div className="flex-1 flex flex-col">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="text-center max-w-md mx-auto p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-4xl font-serif font-bold text-foreground mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              TruSight is ready when you are...
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Paste an article link or text below to begin your bias analysis
            </motion.p>
          </motion.div>
        </div>
      ) : (
        <ScrollArea className="flex-1 p-3 sm:p-4 md:ml-0" style={{maxWidth: '100vw', overflowX: 'auto'}}>
          <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
            <AnimatePresence>
              {messages.map((message, index) => (
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
                  <div className={cn("flex items-end gap-2 w-full", message.sender === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.sender !== "user" && (
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 hover-scale transition-all duration-300">
                        <AvatarImage src="/placeholder-user.png" />
                        <AvatarFallback className="bg-muted">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={cn("flex flex-col", message.sender === "user" ? "items-end" : "items-start")}
                    >
                      <StampEffect isStamped={message.type === "analysis"} stampText="ANALYZED">
                        <motion.div
                          className={cn(
                            "rounded-2xl px-3 sm:px-4 py-2 shadow-sm",
                            "max-w-[85vw] sm:max-w-sm md:max-w-md lg:max-w-xl",
                            "hover-scale hover-glow transition-all duration-300",
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : message.type === "analysis"
                                ? "bg-accent/30 text-accent-foreground border-2 border-accent/70 shadow-md"
                                : "bg-muted text-foreground border border-border",
                          )}
                          whileHover={{ scale: 1.02, y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line break-words overflow-hidden">{message.content}</p>
                        </motion.div>
                      </StampEffect>
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
              ))}
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
