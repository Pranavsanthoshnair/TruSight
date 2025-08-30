"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ChatWindow } from "@/components/chat-window"
import { InputBox } from "@/components/input-box"
import { AnalysisCard } from "@/components/analysis-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConfettiEffect } from "@/components/confetti-effect"
import { XPNotification } from "@/components/xp-notification"
import type { ChatHistory, ChatMessage } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Menu, X, Target, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

function BiasDetectionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [currentChat, setCurrentChat] = useState<ChatHistory | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showXPNotification, setShowXPNotification] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [truthScore, setTruthScore] = useState(0)
  const [analysisData, setAnalysisData] = useState<{ bias: string; confidence: number; owner: string; missingPerspectives: string[]; reasoning?: string } | null>(null)

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

  // Load persisted chats and score
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ts_chats")
      const savedCurrent = localStorage.getItem("ts_current")
      const savedScore = localStorage.getItem("ts_score")
      const savedAnalysis = localStorage.getItem("ts_analysis")
      const savedShowAnalysis = localStorage.getItem("ts_show_analysis")
      
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
      if (savedScore) setTruthScore(parseInt(savedScore))
      if (savedAnalysis) setAnalysisData(JSON.parse(savedAnalysis))
      if (savedShowAnalysis) setShowAnalysis(JSON.parse(savedShowAnalysis))
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
      localStorage.setItem("ts_score", String(truthScore))
      localStorage.setItem("ts_analysis", JSON.stringify(analysisData))
      localStorage.setItem("ts_show_analysis", JSON.stringify(showAnalysis))
    } catch {}
  }, [chatHistories, currentChat, truthScore, analysisData, showAnalysis])

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
    setShowAnalysis(false)
  }

  const sendMessage = async (content: string) => {
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
      
      const systemMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: generateAnalysisSummary(analysisData, content),
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
      setShowAnalysis(true)
      setIsLoading(false)
      setAnalysisData(analysisData)

      // Gamified score based on confidence
      const inc = Math.max(1, Math.floor(analysisData.confidence * 5))
      setTruthScore((s) => s + inc)

    } catch (error) {
      console.error('Error analyzing bias:', error)
      
      // Fallback to mock data if API fails
      const fallbackData = {
        bias: "Center",
        confidence: 0.5,
        owner: "Unknown Publisher",
        missingPerspectives: ["Analysis unavailable"],
        reasoning: "API error - using fallback data"
      }
      
      const systemMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: generateAnalysisSummary(fallbackData, content),
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
      setShowAnalysis(true)
      setIsLoading(false)
      setAnalysisData(fallbackData)

      // Minimal score for fallback
      setTruthScore((s) => s + 1)
    }
  }

  function generateAnalysisSummary(
    data: { bias: string; confidence: number; owner: string; missingPerspectives: string[]; reasoning?: string },
    userText: string,
  ) {
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
      <ConfettiEffect trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      <XPNotification
        show={showXPNotification}
        xpGained={10}
        message="Bias Hunter Achievement!"
        onComplete={() => setShowXPNotification(false)}
      />

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 border-r border-border bg-sidebar">
        <Sidebar
          chatHistories={chatHistories}
          currentChat={currentChat}
          onSelectChat={setCurrentChat}
          onNewAnalysis={startNewAnalysis}
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
            />
          </motion.div>
        </motion.div>
      )}

      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                className="md:hidden hover-scale focus-ring" 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation</span>
              </Button>
              
              {/* Back to News Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to News</span>
              </Button>

              <motion.h1
                className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight ink-bleed"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Bias Detection
                </div>
              </motion.h1>
            </div>
            <div className="flex items-center gap-2">
              <motion.div 
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs hover-scale hover-glow transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span>Truth Points</span>
                <div className="w-20 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, truthScore)}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
                <span className="tabular-nums font-medium">{truthScore}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <ThemeToggle />
              </motion.div>
            </div>
          </div>
          <motion.div
            className="mt-2 flex items-center justify-between text-xs md:text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="uppercase tracking-wider">Edition • International</span>
            <span>{todayString}</span>
          </motion.div>
        </header>

        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <ChatWindow messages={currentChat?.messages || []} isLoading={isLoading} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <InputBox
                onSendMessage={sendMessage}
                onSendFiles={(fileNames) => {
                  if (!currentChat) {
                    // create chat then re-call
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
            </motion.div>
          </div>

          {showAnalysis && (
            <motion.div
              className="hidden lg:block w-96 border-l border-border bg-background/50 backdrop-blur-sm p-6 overflow-y-auto"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {analysisData && (
                <AnalysisCard
                  bias={analysisData.bias}
                  confidence={analysisData.confidence}
                  owner={analysisData.owner}
                  missingPerspectives={analysisData.missingPerspectives}
                  reasoning={analysisData.reasoning}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Mobile Analysis section below chat */}
        {showAnalysis && (
          <motion.div 
            className="lg:hidden border-t border-border bg-background/50 backdrop-blur-sm p-6 overflow-x-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {analysisData && (
              <AnalysisCard
                bias={analysisData.bias}
                confidence={analysisData.confidence}
                owner={analysisData.owner}
                missingPerspectives={analysisData.missingPerspectives}
                reasoning={analysisData.reasoning}
              />
            )}
          </motion.div>
        )}
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
