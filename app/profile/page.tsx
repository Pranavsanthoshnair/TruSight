"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Shield, Target, Award, MessageSquare, TrendingUp } from "lucide-react"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { ChatService } from "@/lib/chat-service"
import type { ChatHistory, ChatMessage } from "@/lib/types"

function ProfileContent() {
  const { user } = useUser()
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChatHistories = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        setError(null)
        const histories = await ChatService.getChatHistories(user.id)
        setChatHistories(histories)
      } catch (err) {
        console.error('Failed to load chat histories:', err)
        setError('Failed to load chat histories')
      } finally {
        setIsLoading(false)
      }
    }

    loadChatHistories()
  }, [user])

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const getAnalysisCount = () => {
    return chatHistories.reduce((total, chat) => {
      return total + chat.messages.filter(msg => msg.type === 'analysis').length
    }, 0)
  }

  const getRecentActivity = () => {
    const allMessages: Array<{ chat: ChatHistory; message: ChatMessage }> = []
    
    chatHistories.forEach(chat => {
      chat.messages.forEach(message => {
        allMessages.push({ chat, message })
      })
    })
    
    // Sort by timestamp (most recent first) and take the last 5
    return allMessages
      .sort((a, b) => b.message.timestamp.getTime() - a.message.timestamp.getTime())
      .slice(0, 5)
  }

  const getBiasDetectionLevel = () => {
    const analysisCount = getAnalysisCount()
    if (analysisCount >= 50) return 'Expert'
    if (analysisCount >= 25) return 'Advanced'
    if (analysisCount >= 10) return 'Intermediate'
    return 'Beginner'
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
            <p className="text-muted-foreground">
              Manage your TruSight account and view your analysis history
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your personal account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  {user.imageUrl && (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || "User"}
                      className="h-16 w-16 rounded-full border-2 border-border"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user.fullName || "Anonymous User"}
                    </h3>
                    <p className="text-muted-foreground">
                      @{user.username || "no-username"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span>{user.primaryEmailAddress?.emailAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Member since:</span>
                    <span>
                      {user.createdAt?.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Stats
                </CardTitle>
                <CardDescription>
                  Your TruSight activity and achievements
                  {isLoading && <span className="text-xs text-muted-foreground"> (Loading...)</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {isLoading ? '...' : getAnalysisCount()}
                    </div>
                    <div className="text-sm text-muted-foreground">Analyses</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Status</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bias Detection Level</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {getBiasDetectionLevel()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest bias detection analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading activity...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-destructive">Failed to load activity</p>
                    <p className="text-sm">{error}</p>
                  </div>
                ) : getRecentActivity().length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No analyses yet</p>
                    <p className="text-sm">Start your first bias detection analysis to see your activity here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getRecentActivity().map(({ chat, message }, index) => (
                      <motion.div
                        key={`${chat.id}-${message.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          {message.sender === 'user' ? (
                            <MessageSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {message.type === 'analysis' && (
                              <Badge variant="outline" size="sm" className="text-xs">
                                Analysis
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground line-clamp-2">
                            {message.sender === 'user' 
                              ? `Asked: ${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}`
                              : message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')
                            }
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            From: {chat.title}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button onClick={() => window.location.href = "/bias"}>
              Start Analysis
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function AuthRequiredMessage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
        >
          <Shield className="h-8 w-8 text-primary" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Sign In Required
          </h1>
          <p className="text-muted-foreground">
            Sign in to view your profile and access your TruSight account information.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SignInButton mode="modal">
            <Button size="lg" className="w-full">
              Sign In to View Profile
            </Button>
          </SignInButton>
        </motion.div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <>
      <SignedIn>
        <ProfileContent />
      </SignedIn>
      <SignedOut>
        <AuthRequiredMessage />
      </SignedOut>
    </>
  )
}
