"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TermsOfServicePage() {
  const router = useRouter()

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: CheckCircle,
      content: "By accessing and using TruSight, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service."
    },
    {
      title: "Service Description",
      icon: FileText,
      content: "TruSight provides AI-powered bias detection services for news articles and other content. We analyze text to identify potential biases and provide insights to help users make informed decisions."
    },
    {
      title: "User Responsibilities",
      icon: Shield,
      content: "Users are responsible for the content they submit for analysis. You must not submit illegal, harmful, or inappropriate content. You are also responsible for maintaining the security of your account."
    },
    {
      title: "Prohibited Uses",
      icon: XCircle,
      content: "You may not use our service for illegal purposes, to harass others, or to attempt to gain unauthorized access to our systems. Commercial use requires proper licensing."
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
          
          <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            The terms and conditions governing your use of TruSight
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
                <FileText className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">Important Information</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                These Terms of Service outline the rules and guidelines for using TruSight. 
                Please read them carefully before using our platform. By using our service, 
                you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms Sections */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Key Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Key Terms & Definitions</CardTitle>
              <CardDescription>
                Important terms you should understand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Service</h4>
                    <p className="text-sm text-muted-foreground">
                      The TruSight bias detection platform and related services
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">User</h4>
                    <p className="text-sm text-muted-foreground">
                      Any individual or entity using our service
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Text, articles, or other materials submitted for analysis
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Your personal TruSight user account and profile
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      The AI-powered bias detection results we provide
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Platform</h4>
                    <p className="text-sm text-muted-foreground">
                      Our website, mobile apps, and API services
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Limitations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Limitations & Disclaimers
              </CardTitle>
              <CardDescription>
                Important limitations of our service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">AI Accuracy</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  While our AI strives for accuracy, bias detection results are not guaranteed to be 100% accurate. 
                  Users should exercise critical thinking and not rely solely on our analysis.
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Service Availability</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  We strive for high availability but cannot guarantee uninterrupted service. 
                  Maintenance, updates, and technical issues may temporarily affect availability.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Termination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
              <CardDescription>
                When and how accounts may be terminated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">By You</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Delete your account anytime</li>
                      <li>• Export your data first</li>
                      <li>• Contact support for assistance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">By Us</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Violation of terms</li>
                      <li>• Illegal or harmful activity</li>
                      <li>• Extended inactivity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Questions About Terms?</CardTitle>
              <CardDescription>
                Contact our legal team for clarification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  If you have questions about these terms or need legal clarification, 
                  please contact our legal team.
                </p>
                <Button variant="outline" onClick={() => router.push('/contact')}>
                  Contact Legal Team
                </Button>
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
            Accept & Continue
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
