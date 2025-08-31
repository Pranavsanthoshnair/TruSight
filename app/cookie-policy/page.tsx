"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Cookie, Settings, Shield, Info, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CookiePolicyPage() {
  const router = useRouter()

  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "Required for basic website functionality",
      examples: ["Authentication", "Security", "Session management"],
      necessary: true,
      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200"
    },
    {
      name: "Analytics Cookies",
      description: "Help us understand how visitors use our site",
      examples: ["Page views", "User behavior", "Performance metrics"],
      necessary: false,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
    },
    {
      name: "Preference Cookies",
      description: "Remember your settings and preferences",
      examples: ["Language", "Theme", "Display options"],
      necessary: false,
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200"
    },
    {
      name: "Marketing Cookies",
      description: "Used for targeted advertising and content",
      examples: ["Ad personalization", "Social media", "Third-party tracking"],
      necessary: false,
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200"
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
          
          <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            How we use cookies and similar technologies on TruSight
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: December 15, 2024
          </p>
        </motion.div>

        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">What Are Cookies?</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences, 
                analyzing how you use our site, and personalizing content. This policy explains how 
                we use cookies and how you can control them.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cookie Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Types of Cookies We Use</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {cookieTypes.map((cookie, index) => (
              <motion.div
                key={cookie.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{cookie.name}</CardTitle>
                      <Badge 
                        variant={cookie.necessary ? "default" : "outline"}
                        className={cookie.color}
                      >
                        {cookie.necessary ? "Necessary" : "Optional"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {cookie.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Examples:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {cookie.examples.map((example) => (
                          <li key={example} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How We Use Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                How We Use Cookies
              </CardTitle>
              <CardDescription>
                Specific purposes for which we use cookies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Website Functionality</h4>
                    <p className="text-sm text-muted-foreground">
                      Essential cookies that enable core features like user authentication, 
                      session management, and security measures.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Performance & Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Cookies that help us understand how visitors interact with our site, 
                      identify performance issues, and improve user experience.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Personalization</h4>
                    <p className="text-sm text-muted-foreground">
                      Cookies that remember your preferences, such as language settings, 
                      theme choices, and display options.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Security & Fraud Prevention</h4>
                    <p className="text-sm text-muted-foreground">
                      Cookies that help protect against fraud, abuse, and security threats 
                      to ensure a safe browsing experience.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Third-Party Cookies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
              <CardDescription>
                Cookies from external services we use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Analytics Services</h4>
                <p className="text-sm text-muted-foreground">
                  We may use services like Google Analytics to understand website usage. 
                  These services set their own cookies and have their own privacy policies.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Social Media</h4>
                <p className="text-sm text-muted-foreground">
                  Social media platforms may set cookies when you interact with social features 
                  on our site, such as sharing buttons or embedded content.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cookie Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Managing Your Cookie Preferences
              </CardTitle>
              <CardDescription>
                How to control and manage cookies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Browser Settings</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Clear cookies regularly</li>
                      <li>• Block third-party cookies</li>
                      <li>• Set cookie preferences</li>
                      <li>• Use incognito/private mode</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Our Cookie Banner</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Accept all cookies</li>
                      <li>• Accept only necessary</li>
                      <li>• Customize preferences</li>
                      <li>• Change settings later</li>
                    </ul>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Important Note</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Disabling certain cookies may affect website functionality. Essential cookies 
                    cannot be disabled as they are necessary for basic site operation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Updates & Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Stay Informed
              </CardTitle>
              <CardDescription>
                How to stay updated on cookie policy changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  We may update this cookie policy from time to time. We'll notify you of any 
                  significant changes through our website or email notifications.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => router.push('/contact')}>
                    Contact Us
                  </Button>
                  <Button variant="outline">
                    Download Policy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="text-center"
        >
          <Button size="lg" onClick={() => router.push('/bias')}>
            Accept Cookies & Continue
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
