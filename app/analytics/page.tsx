"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, TrendingUp, Users, Target } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AnalyticsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">Analytics</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Track your bias detection performance and insights
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">1,247</div>
                <div className="text-sm text-muted-foreground">Total Analyses</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">89%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">156</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">23</div>
                <div className="text-sm text-muted-foreground">Sources Analyzed</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Bias Distribution</CardTitle>
                <CardDescription>Analysis results by bias type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Left-leaning</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Center</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Right-leaning</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Analyses performed this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{day}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.random() * 60 + 20}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8 text-right">
                          {Math.floor(Math.random() * 20 + 5)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <Button size="lg" onClick={() => router.push('/bias')}>
            View Full Analytics
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
