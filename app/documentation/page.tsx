"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Code, FileText, Database, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DocumentationPage() {
  const router = useRouter()

  const sections = [
    {
      title: "Getting Started",
      description: "Quick start guide for new users",
      icon: BookOpen,
      color: "text-blue-500",
      topics: ["Installation", "First Analysis", "Basic Usage"]
    },
    {
      title: "API Reference",
      description: "Complete API documentation",
      icon: FileText,
      color: "text-green-500",
      topics: ["Authentication", "Endpoints", "Rate Limits"]
    },
    {
      title: "SDK & Libraries",
      description: "Client libraries and examples",
      icon: Code,
      color: "text-purple-500",
      topics: ["JavaScript", "Python", "React Components"]
    },
    {
      title: "Database Schema",
      description: "Data structure and relationships",
      icon: Database,
      color: "text-orange-500",
      topics: ["Tables", "Relations", "Indexes"]
    },
    {
      title: "Security",
      description: "Security best practices",
      icon: Shield,
      color: "text-red-500",
      topics: ["Authentication", "Authorization", "Data Privacy"]
    }
  ]

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
          
          <h1 className="text-4xl font-bold text-foreground mb-4">Documentation</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Everything you need to integrate and use TruSight effectively
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Search Documentation</h2>
                <p className="text-muted-foreground mb-4">
                  Find answers to your questions quickly
                </p>
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Documentation Sections */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${section.color}`} />
                      {section.title}
                    </CardTitle>
                    <CardDescription>
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.topics.map((topic) => (
                        <div key={topic} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>
                Get up and running with TruSight in 5 minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Badge variant="secondary" className="mt-1">1</Badge>
                  <div>
                    <h4 className="font-semibold">Install TruSight</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      npm install trusight
                    </code>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Badge variant="secondary" className="mt-1">2</Badge>
                  <div>
                    <h4 className="font-semibold">Initialize the Client</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      const trusight = new TruSight('your-api-key')
                    </code>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Badge variant="secondary" className="mt-1">3</Badge>
                  <div>
                    <h4 className="font-semibold">Analyze Content</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      const result = await trusight.analyze('your text here')
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Popular Topics</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Bias Detection Accuracy</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn about our AI model's performance and how to interpret results
                </p>
                <Button variant="outline" size="sm">Read More</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">API Rate Limits</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Understand our rate limiting policies and best practices
                </p>
                <Button variant="outline" size="sm">Read More</Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <Button size="lg" onClick={() => router.push('/bias')}>
            Start Building
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
