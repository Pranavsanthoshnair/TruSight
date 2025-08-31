"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ChatWindow } from "@/components/chat-window"
import { InputBox } from "@/components/input-box"
import { ThemeToggle } from "@/components/theme-toggle"

import type { ChatHistory, ChatMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Menu, X, Target, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

function BiasDetectionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [currentChat, setCurrentChat] = useState<ChatHistory | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check for article data from news page
  const articleParam = searchParams.get('article')
  const articleData = useMemo(() => {
    if (articleParam) {
      try {
        return JSON.parse(decodeURIComponent(articleParam))
      } catch {
        return null
      }
    }
    return null
  }, [articleParam])

  // Load persisted chats
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ts_chats")
      const savedCurrent = localStorage.getItem("ts_current")
      
      if (saved) {
        const parsed = JSON.parse(saved) as any[]
        const restored = parsed.map((c) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
        }))
        setChatHistories(restored)
        if (savedCurrent) {
          const found = restored.find((c) => c.id === savedCurrent)
          if (found) setCurrentChat(found)
        }
      }
    } catch {}
  }, [])

  // Auto-analyze article if provided from news page
  useEffect(() => {
    if (articleData && !currentChat) {
      const articleText = `${articleData.title}\n\n${articleData.content}\n\nSource: ${articleData.source}\nURL: ${articleData.url}`
      handleAutoAnalysis(articleText)
    }
  }, [articleData, currentChat])

  // Persist on change
  useEffect(() => {
    try {
      const serializable = chatHistories.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        messages: c.messages.map((m) => ({ ...m, timestamp: m.timestamp.toISOString() })),
      }))
      localStorage.setItem("ts_chats", JSON.stringify(serializable))
      localStorage.setItem("ts_current", currentChat?.id || "")
    } catch {}
  }, [chatHistories, currentChat])

  // Calculate dynamic confidence based on bias type and missing perspectives (shared with AnalysisCard)
  const getDynamicConfidence = (bias: string, confidence: number, missingPerspectives: string[]): number => {
    let adjustedConfidence = confidence
    
    // Adjust confidence based on missing perspectives
    if (missingPerspectives.length > 0) {
      // Reduce confidence if there are missing perspectives
      const perspectivePenalty = Math.min(0.3, missingPerspectives.length * 0.1)
      adjustedConfidence = Math.max(0.1, adjustedConfidence - perspectivePenalty)
    }
    
    // Adjust confidence based on bias type
    const biasLower = bias.toLowerCase()
    switch (biasLower) {
      case "left-leaning":
      case "right-leaning":
        // Stronger bias types get confidence boost
        adjustedConfidence = Math.min(1, adjustedConfidence * 1.2)
        break
      case "center":
        // Center bias gets moderate confidence
        adjustedConfidence = adjustedConfidence * 0.9
        break
      case "neutral":
        // Neutral bias gets lower confidence as it's harder to determine
        adjustedConfidence = adjustedConfidence * 0.8
        break
    }
    
    return Math.max(0.1, Math.min(1, adjustedConfidence))
  }

  const todayString = useMemo(() => {
    const d = new Date()
    return d.toLocaleDateString('en-US', {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }, [])

  const handleAutoAnalysis = (content: string) => {
    const newChat: ChatHistory = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: "Article Analysis",
      messages: [],
      createdAt: new Date(),
    }
    setChatHistories((prev) => [newChat, ...prev])
    setCurrentChat(newChat)
    
    // Auto-send the article content
    setTimeout(() => {
      sendMessage(content)
    }, 500)
  }

  const startNewAnalysis = () => {
    const newChat: ChatHistory = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: "New Analysis",
      messages: [],
      createdAt: new Date(),
    }
    setChatHistories((prev) => [newChat, ...prev])
    setCurrentChat(newChat)
  }

  const handleDeleteChat = (chatId: string) => {
    setChatHistories((prev) => prev.filter(chat => chat.id !== chatId))
    
    // If the deleted chat was the current one, clear current chat
    if (currentChat?.id === chatId) {
      setCurrentChat(null)
    }
  }

  const sendMessage = async (content: string) => {
    // Prevent multiple simultaneous analyses
    if (isLoading) {
      return
    }

    // Ensure a chat exists; if not, create one so the sidebar updates immediately
    let activeChat = currentChat
    if (!activeChat) {
      const newChat: ChatHistory = {
        id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: "New Analysis",
        messages: [],
        createdAt: new Date(),
      }
      setChatHistories((prev) => [newChat, ...prev])
      setCurrentChat(newChat)
      activeChat = newChat
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender: "user",
      timestamp: new Date(),
    }

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, userMessage],
      title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
    }

    setCurrentChat(updatedChat)
    setChatHistories((prev) => prev.map((chat) => (chat.id === activeChat!.id ? updatedChat : chat)))
    setIsLoading(true)

    try {
      // Call the Groq API for bias analysis
      const response = await fetch('/api/analyze-bias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          title: articleData?.title,
          source: articleData?.source,
          url: articleData?.url
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const analysisData = await response.json()
      
      // Apply dynamic confidence calculation to the analysis data
      const dynamicConfidence = getDynamicConfidence(
        analysisData.bias, 
        analysisData.confidence, 
        analysisData.missingPerspectives
      )
      
      const processedAnalysisData = {
        ...analysisData,
        confidence: dynamicConfidence
      }
      
      const systemMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: generateAnalysisSummary(processedAnalysisData, content),
        sender: "system",
        timestamp: new Date(),
        type: "analysis",
      }

      const finalized = {
        ...updatedChat,
        messages: [...updatedChat.messages, systemMessage],
      }
      setCurrentChat(finalized)
      setChatHistories((prev) => prev.map((chat) => (chat.id === finalized.id ? finalized : chat)))
      setIsLoading(false)

    } catch (error) {
      console.error('Error analyzing bias:', error)
      
      // Create error message for user
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: "Sorry, I couldn't analyze the bias at this time. Please check your connection and try again.",
        sender: "system",
        timestamp: new Date(),
      }

      const finalized = {
        ...updatedChat,
        messages: [...updatedChat.messages, errorMessage],
      }
      setCurrentChat(finalized)
      setChatHistories((prev) => prev.map((chat) => (chat.id === finalized.id ? finalized : chat)))
      setIsLoading(false)
    }
  }

  function generateAnalysisSummary(
    data: { bias: string; confidence: number; owner: string; missingPerspectives: string[]; reasoning?: string },
    userText: string,
  ) {
    // Use the confidence that's already been processed with dynamic calculation
    const lines = [
      `Detected Bias: ${data.bias} (confidence ${Math.round(data.confidence * 100)}%)`,
      `Publisher: ${data.owner}`,
      data.missingPerspectives.length > 0
        ? `Missing perspectives: ${data.missingPerspectives.join(", ")}`
        : "Missing perspectives: none detected",
    ]
    
    // Add reasoning if available
    if (data.reasoning && data.reasoning.trim()) {
      lines.push(`\nAnalysis: ${data.reasoning}`)
    }
    
    return lines.join("\n")
  }

  return (
    <div className="flex h-screen bg-background">

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 border-r border-border bg-sidebar">
        <Sidebar
          chatHistories={chatHistories}
          currentChat={currentChat}
          onSelectChat={setCurrentChat}
          onNewAnalysis={startNewAnalysis}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {/* Mobile Sidebar Slide-over */}
      {sidebarOpen && (
        <motion.div
          className="md:hidden fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative h-full w-80 max-w-[85%] bg-sidebar border-r border-border shadow-2xl"
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4
            }}
          >
            <motion.div 
              className="absolute right-2 top-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(false)}
                className="hover-scale focus-ring"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
            <Sidebar
              chatHistories={chatHistories}
              currentChat={currentChat}
              onSelectChat={(c) => {
                setCurrentChat(c)
                setSidebarOpen(false)
              }}
              onNewAnalysis={() => {
                startNewAnalysis()
                setSidebarOpen(false)
              }}
              onDeleteChat={handleDeleteChat}
            />
          </motion.div>
        </motion.div>
      )}

      <div className="flex-1 flex flex-col min-h-0">
        {/* Simplified Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur-sm px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                className="md:hidden" 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>

              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">
                  Bias Detection
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Chat Messages - Scrollable */}
            <div className="flex-1 min-h-0">
              <ChatWindow messages={currentChat?.messages || []} isLoading={isLoading} />
            </div>
            
            {/* Input Area - Fixed at bottom */}
            <div className="border-t border-border bg-background/50 flex-shrink-0">
              <InputBox
                onSendMessage={sendMessage}
                onSendFiles={(fileNames) => {
                  if (!currentChat) {
                    startNewAnalysis()
                  }
                  const targetChat = currentChat || chatHistories[0] || null
                  if (!targetChat) return
                  const fileMessages: ChatMessage[] = fileNames.map((name, i) => ({
                    id: `file_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
                    content: `Uploaded: ${name}`,
                    sender: "user",
                    timestamp: new Date(),
                  }))
                  const updated = {
                    ...targetChat,
                    messages: [...targetChat.messages, ...fileMessages],
                  }
                  setCurrentChat(updated)
                  setChatHistories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BiasDetectionPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading bias detection...</p>
        </div>
      </div>
    }>
      <BiasDetectionContent />
    </Suspense>
  )
}
