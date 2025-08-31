"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: 'contact'
        })
      })

      if (response.ok) {
        setShowSuccess(true)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
          
          <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Have questions about TruSight? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showSuccess ? (
                  <div className="text-center py-8">
                    <div className="text-green-600 text-6xl mb-4">✓</div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setShowSuccess(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium mb-2 block">First Name *</label>
                        <Input 
                          placeholder="John" 
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Last Name *</label>
                        <Input 
                          placeholder="Doe" 
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject *</label>
                      <Input 
                        placeholder="How can we help?" 
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message *</label>
                      <Textarea 
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">contact@trusight.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">123 Innovation St, San Francisco, CA 94105</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">How accurate is the bias detection?</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI model achieves 89% accuracy across diverse news sources and political spectrums.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Is TruSight free to use?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! Basic bias detection is completely free. Premium features are available for power users.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Can I integrate TruSight into my app?</h4>
                  <p className="text-sm text-muted-foreground">
                    Absolutely! We offer APIs and SDKs for developers. Contact us for partnership opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We typically respond to all inquiries within 24 hours during business days. 
                  For urgent matters, please call us directly.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button size="lg" onClick={() => router.push('/bias')}>
            Try Bias Detection
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
