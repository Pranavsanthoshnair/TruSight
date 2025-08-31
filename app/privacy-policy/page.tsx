"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Lock, Eye, Database, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Account information (name, email, username)",
        "Usage data and analytics",
        "Content you submit for bias analysis",
        "Technical information (IP address, browser type)"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        "Provide and improve our bias detection services",
        "Personalize your experience",
        "Send important updates and notifications",
        "Analyze usage patterns to enhance our platform"
      ]
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "End-to-end encryption for all data transmission",
        "Secure data centers with industry-standard security",
        "Regular security audits and updates",
        "Limited access to personal information"
      ]
    },
    {
      title: "Your Rights",
      icon: Users,
      content: [
        "Access and download your personal data",
        "Request deletion of your account and data",
        "Opt-out of marketing communications",
        "Control privacy settings and preferences"
      ]
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
          
          <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            How we collect, use, and protect your personal information
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
                <Shield className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold">Our Commitment to Privacy</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                At TruSight, we believe your privacy is fundamental. This policy explains how we collect, 
                use, and protect your personal information when you use our bias detection platform. 
                We are committed to transparency and giving you control over your data.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Policy Sections */}
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
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Data Retention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Data Retention & Deletion</CardTitle>
              <CardDescription>
                How long we keep your data and how to request deletion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Data Retention Periods</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Account data: Until account deletion</li>
                    <li>• Analysis results: 30 days</li>
                    <li>• Usage analytics: 12 months</li>
                    <li>• Logs: 90 days</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Deletion Options</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Delete specific analyses</li>
                    <li>• Deactivate account temporarily</li>
                    <li>• Permanently delete account</li>
                    <li>• Export data before deletion</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Third Parties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
              <CardDescription>
                Services we use and how they handle your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">AI Services</h4>
                  <p className="text-sm text-muted-foreground">
                    We use Groq and ElevenLabs for AI processing. These services receive only the content 
                    you submit for analysis and do not store it permanently.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Analytics & Hosting</h4>
                  <p className="text-sm text-muted-foreground">
                    We use Vercel for hosting and may use analytics services to improve our platform. 
                    All data is anonymized and aggregated.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Questions About Privacy?</CardTitle>
              <CardDescription>
                Contact our privacy team for any concerns or questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  If you have questions about this privacy policy or how we handle your data, 
                  please don't hesitate to reach out.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => router.push('/contact')}>
                    Contact Privacy Team
                  </Button>
                  <Button variant="outline">
                    Download Policy (PDF)
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
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center"
        >
          <Button size="lg" onClick={() => router.push('/bias')}>
            Start Using TruSight
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
