"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, HelpCircle, MessageCircle, BookOpen, Video, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HelpCenterPage() {
  const router = useRouter()

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of using TruSight",
      icon: BookOpen,
      color: "text-blue-500",
      articles: ["How to analyze your first article", "Understanding bias scores", "Setting up your account"]
    },
    {
      title: "Bias Detection",
      description: "Learn how our AI analyzes content",
      icon: HelpCircle,
      color: "text-green-500",
      articles: ["How bias detection works", "Interpreting results", "Accuracy and limitations"]
    },
    {
      title: "Account & Billing",
      description: "Manage your account and subscription",
      icon: MessageCircle,
      color: "text-purple-500",
      articles: ["Updating profile information", "Subscription management", "Billing questions"]
    },
    {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      icon: HelpCircle,
      color: "text-orange-500",
      articles: ["API errors", "Slow performance", "Browser compatibility"]
    }
  ]

  const faqs = [
    {
      question: "How accurate is TruSight's bias detection?",
      answer: "Our AI model achieves 89% accuracy across diverse news sources and political spectrums. We continuously train and improve our algorithms."
    },
    {
      question: "What types of content can I analyze?",
      answer: "You can analyze news articles, social media posts, blog content, and any text-based content. We support multiple languages and formats."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes, we take data privacy seriously. All analyses are encrypted, and we don't store personal content. Your privacy is our priority."
    },
    {
      question: "Can I use TruSight for commercial purposes?",
      answer: "Yes, we offer commercial licenses and API access for businesses. Contact our sales team for enterprise solutions."
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
          
          <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find answers to your questions and learn how to use TruSight effectively
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
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">How can we help you?</h2>
              <p className="text-muted-foreground mb-6">
                Search our knowledge base for quick answers
              </p>
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 mb-12">
          {helpCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${category.color}`} />
                      {category.title}
                    </CardTitle>
                    <CardDescription>
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.articles.map((article) => (
                        <div key={article} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {article}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Still Need Help?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <Video className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Watch step-by-step guides and tutorials
                </p>
                <Button variant="outline" size="sm">Watch Videos</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get help from our support team
                </p>
                <Button variant="outline" size="sm" onClick={() => router.push('/contact')}>
                  Contact Us
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with our support team in real-time
                </p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center"
        >
          <Button size="lg" onClick={() => router.push('/bias')}>
            Try TruSight Now
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
