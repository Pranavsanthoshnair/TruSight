"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ChatWindow } from "@/components/chat-window"
import { InputBox } from "@/components/input-box"
import { AnalysisCard } from "@/components/analysis-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ConfettiEffect } from "@/components/confetti-effect"
import { XPNotification } from "@/components/xp-notification"
import type { ChatHistory, ChatMessage } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Menu, X, Target, ArrowLeft, Brain, TrendingUp, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"

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
  const [analysisData, setAnalysisData] = useState<{ bias: string; confidence: number; owner: string; missingPerspectives: string[] } | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -30])

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

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
    } catch {}
  }, [chatHistories, currentChat, truthScore])

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

  const sendMessage = (content: string) => {
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

    // Move random generation to a separate function to prevent hydration issues
    const generateAnalysisData = () => {
      const biases = ["Left-Leaning", "Center", "Right-Leaning"]
      const bias = biases[Math.floor(Math.random() * biases.length)]
      const confidence = Math.round((0.6 + Math.random() * 0.4) * 100) / 100 // 0.6..1.0
      const owner = "Example Media Corp"
      const missingPerspectives = ["Economic impact", "Opposition statement", "Local community view"].filter(
        () => Math.random() > 0.4,
      )
      return { bias, confidence, owner, missingPerspectives }
    }

    setTimeout(() => {
      const analysisData = generateAnalysisData()
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

      // Gamified score 1-5
      const inc = 1 + Math.floor(Math.random() * 5)
      setTruthScore((s) => s + inc)

      // Silent rewards; no poppers/notifications
    }, 1200)
  }

  function generateAnalysisSummary(
    data: { bias: string; confidence: number; owner: string; missingPerspectives: string[] },
    userText: string,
  ) {
    const lines = [
      `Detected Bias: ${data.bias} (confidence ${Math.round(data.confidence * 100)}%)`,
      `Publisher: ${data.owner}`,
      data.missingPerspectives.length > 0
        ? `Missing perspectives: ${data.missingPerspectives.join(", ")}`
        : "Missing perspectives: none detected",
    ]
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
      <div className="hidden md:block w-80 border-r border-border/60 bg-sidebar shadow-lg">
        <Sidebar
          chatHistories={chatHistories}
          currentChat={currentChat}
          onSelectChat={setCurrentChat}
          onNewAnalysis={startNewAnalysis}
        />
      </div>

      {/* Mobile Sidebar Slide-over */}
      <AnimatePresence>
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
              className="relative h-full w-80 max-w-[85%] bg-sidebar border-r border-border/60 shadow-2xl"
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
              <div className="absolute right-3 top-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(false)}
                  className="h-10 w-10 hover:bg-muted/50 hover-scale focus-ring rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
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
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-border/60 bg-card px-6 sm:px-8 py-6 relative overflow-hidden shadow-sm">
          {/* Background Elements */}
          {isMounted && (
            <motion.div
              className="absolute inset-0 opacity-5"
              style={{ y }}
            >
              <div className="absolute top-3 left-12 w-28 h-28 bg-primary rounded-full blur-3xl" />
              <div className="absolute top-5 right-24 w-24 h-24 bg-secondary rounded-full blur-3xl" />
            </motion.div>
          )}

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <Button 
                className="md:hidden hover-scale focus-ring h-11 w-11 rounded-lg" 
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
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground hover-scale focus-ring h-10 px-4 rounded-lg"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Back to News</span>
              </Button>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight ink-bleed">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  Bias Detection
                </div>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-full bg-secondary text-secondary-foreground text-sm hover-scale hover-glow transition-all duration-300 shadow-sm">
                <span className="font-medium">Truth Points</span>
                <div className="w-24 sm:w-28 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.min(100, truthScore)}%` }} />
                </div>
                <span className="tabular-nums font-semibold text-base">{truthScore}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm md:text-base text-muted-foreground">
            <span className="uppercase tracking-wider font-medium">Edition • International</span>
            <span className="font-medium">{todayString}</span>
          </div>
        </header>

        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <ChatWindow messages={currentChat?.messages || []} isLoading={isLoading} />
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
          </div>

          {showAnalysis && (
            <div className="hidden lg:block w-80 border-l border-border/60 bg-sidebar p-6 overflow-y-auto shadow-lg">
              {analysisData && (
                <AnalysisCard
                  bias={analysisData.bias}
                  confidence={analysisData.confidence}
                  owner={analysisData.owner}
                  missingPerspectives={analysisData.missingPerspectives}
                />
              )}
            </div>
          )}
        </div>

        {/* Mobile Analysis section below chat */}
        {showAnalysis && (
          <div className="lg:hidden border-t border-border/60 bg-sidebar p-6 overflow-x-hidden">
            {analysisData && (
              <AnalysisCard
                bias={analysisData.bias}
                confidence={analysisData.confidence}
                owner={analysisData.owner}
                missingPerspectives={analysisData.missingPerspectives}
              />
            )}
          </div>
        )}

        {/* Feature Highlights for Mobile */}
        {!showAnalysis && (
          <div className="lg:hidden border-t border-border/60 bg-sidebar p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Quick Features</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Brain, title: "AI Analysis", color: "text-blue-500" },
                { icon: TrendingUp, title: "Real-time", color: "text-green-500" },
                { icon: Shield, title: "Bias Detection", color: "text-purple-500" }
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl bg-card/50 border border-border/50 hover-lift shadow-sm"
                >
                  <div className={`p-2 bg-${feature.color.split('-')[1]}/10 rounded-lg w-12 h-12 mx-auto mb-3 flex items-center justify-center`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <p className="text-xs font-medium text-foreground text-center">{feature.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BiasDetectionPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground font-medium">Loading bias detection...</p>
        </div>
      </div>
    }>
      <BiasDetectionContent />
    </Suspense>
  )
}
