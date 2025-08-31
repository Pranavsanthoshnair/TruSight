"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Download, 
  Github, 
  Shield, 
  Target, 
  Zap, 
  Globe, 
  CheckCircle,
  Star,
  Users,
  Code,
  Palette
} from "lucide-react"
import PrismaticBurst from '@/components/PrismaticBurst'
import Prism from '@/components/Prism'

export default function ExtensionPage() {
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || theme

  const features = [
    {
      icon: Target,
      title: "Political Bias Analysis",
      description: "Identifies left-leaning, right-leaning, or center political bias with confidence metrics"
    },
    {
      icon: Shield,
      title: "Bias Subtypes Detection",
      description: "Detects framing bias, loaded language, selective reporting, and emotional manipulation"
    },
    {
      icon: Zap,
      title: "Tone Analysis",
      description: "Analyzes emotional tone including fear, anger, sympathy, optimism, and neutral"
    },
    {
      icon: Globe,
      title: "Evidence Extraction",
      description: "Provides specific quotes as evidence for bias detection with neutral rewrite suggestions"
    }
  ]

  const stats = [
    { icon: Download, label: "Downloads", value: "1K+" },
    { icon: Star, label: "Rating", value: "4.8★" },
    { icon: Users, label: "Users", value: "500+" },
    { icon: Code, label: "Open Source", value: "MIT" }
  ]

  const browsers = [
    { name: "Chrome", icon: "🟢", supported: true },
    { name: "Edge", icon: "🔵", supported: true },
    { name: "Brave", icon: "🟠", supported: true },
    { name: "Firefox", icon: "🟡", supported: true }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-4 sm:px-6 lg:px-8 pt-20">
        {/* Dynamic Background based on Theme */}
        <div className="absolute inset-0 overflow-hidden">
          {currentTheme === "light" ? (
            <Prism
              height={4.0}
              baseWidth={6.0}
              animationType="3drotate"
              glow={1.2}
              noise={0.3}
              scale={4.0}
              hueShift={0.2}
              colorFrequency={1.2}
              timeScale={0.4}
              bloom={1.4}
              suspendWhenOffscreen={false}
            />
          ) : (
            <PrismaticBurst
              animationType="rotate3d"
              intensity={1.5}
              speed={0.3}
              distort={2.0}
              paused={false}
              offset={{ x: 0, y: 0 }}
              hoverDampness={0.25}
              rayCount={16}
              mixBlendMode="lighten"
              colors={['#ff007a', '#4d3dff', '#00d4ff', '#ffffff']}
            />
          )}
        </div>

        {/* Hero Content */}
        <motion.div
          className="text-center max-w-5xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl">
              <Target className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-foreground mb-6 leading-tight tracking-tight">
            TruSight
            <span className="block text-3xl md:text-4xl lg:text-5xl text-primary font-light mt-2">
              Browser Extension
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            A powerful browser extension that uses AI to detect bias in news articles and provides 
            integrated website summaries to help you navigate the digital information landscape more effectively.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => window.open('https://github.com/Pranavsanthoshnair/truext', '_blank')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 h-auto font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              Get Your Extension
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-4 h-auto font-medium border-2 hover:bg-muted/50 transition-all duration-300"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Powerful Features for Bias Detection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered extension provides comprehensive analysis to help you identify and understand 
              potential bias in the content you consume online.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg bg-background hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Browser Support */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Cross-Browser Compatibility
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Works seamlessly across all major browsers with full feature support
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {browsers.map((browser, index) => (
              <motion.div
                key={browser.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Card className="p-6 border-0 shadow-lg bg-background hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="text-4xl mb-3">{browser.icon}</div>
                    <div className="text-lg font-semibold text-foreground mb-2">
                      {browser.name}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">
                        Supported
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Easy Installation
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started with TruSight extension in just a few simple steps
              </p>
            </div>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Download the Extension
                      </h3>
                      <p className="text-muted-foreground">
                        Visit our GitHub repository and download the latest release
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Enable Developer Mode
                      </h3>
                      <p className="text-muted-foreground">
                        Open your browser's extension settings and enable developer mode
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Load the Extension
                      </h3>
                      <p className="text-muted-foreground">
                        Click "Load unpacked" and select the extension folder
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Start Analyzing
                      </h3>
                      <p className="text-muted-foreground">
                        Navigate to any website and click the TruSight icon to analyze content
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-primary/20">
                  <Button
                    onClick={() => window.open('https://github.com/Pranavsanthoshnair/truext', '_blank')}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-4 h-auto font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Github className="w-5 h-5" />
                    Get Extension from GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-8 max-w-3xl mx-auto">
              <CardContent className="p-0">
                <Target className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Ready to Detect Bias?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of users who are already making more informed decisions 
                  with our AI-powered bias detection extension.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => window.open('https://github.com/Pranavsanthoshnair/truext', '_blank')}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    Get Extension
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/")}
                    className="border-2 hover:bg-muted/50"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
