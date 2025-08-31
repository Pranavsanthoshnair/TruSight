"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, TrendingUp, Target, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BlogPage() {
  const router = useRouter()

  const blogPosts = [
    {
      title: "The Rise of AI-Powered Bias Detection",
      excerpt: "How artificial intelligence is revolutionizing the way we identify and understand media bias in the digital age.",
      author: "Dr. Sarah Chen",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      category: "AI & Technology",
      featured: true
    },
    {
      title: "Understanding Media Bias: A Complete Guide",
      excerpt: "Learn the different types of media bias and how to spot them in news articles, social media, and beyond.",
      author: "Marcus Rodriguez",
      date: "Dec 12, 2024",
      readTime: "8 min read",
      category: "Education"
    },
    {
      title: "Fact-Checking in the Age of Misinformation",
      excerpt: "Essential strategies for verifying information and combating the spread of false news online.",
      author: "Lisa Thompson",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Fact-Checking"
    },
    {
      title: "The Psychology Behind Confirmation Bias",
      excerpt: "Why we tend to believe information that confirms our existing beliefs and how to overcome this tendency.",
      author: "Dr. James Wilson",
      date: "Dec 8, 2024",
      readTime: "7 min read",
      category: "Psychology"
    },
    {
      title: "Building Media Literacy in Schools",
      excerpt: "How educators can help students develop critical thinking skills for the digital information landscape.",
      author: "Emma Davis",
      date: "Dec 5, 2024",
      readTime: "4 min read",
      category: "Education"
    }
  ]

  const categories = ["All", "AI & Technology", "Education", "Fact-Checking", "Psychology", "Case Studies"]

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
          
          <h1 className="text-4xl font-bold text-foreground mb-4">TruSight Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Insights, research, and stories about media bias, AI technology, and digital literacy
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                {category}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">Featured</Badge>
                <Badge variant="outline">{blogPosts[0].category}</Badge>
              </div>
              <CardTitle className="text-2xl">{blogPosts[0].title}</CardTitle>
              <CardDescription className="text-base">
                {blogPosts[0].excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {blogPosts[0].author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {blogPosts[0].date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {blogPosts[0].readTime}
                </div>
              </div>
              <Button>Read Full Article</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {blogPosts.slice(1).map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                    <Button variant="outline" size="sm">Read More</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get the latest insights on media bias, AI technology, and digital literacy delivered to your inbox.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <Button size="lg" onClick={() => router.push('/bias')}>
            Start Analyzing Bias
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
