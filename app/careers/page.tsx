"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Users, Code, Target, Globe, Zap, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CareersPage() {
  const router = useRouter()
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const openPositions = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build the next generation of bias detection tools"
    },
    {
      title: "AI/ML Engineer",
      department: "Research",
      location: "San Francisco",
      type: "Full-time",
      description: "Improve our bias detection algorithms"
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create intuitive user experiences"
    }
  ]

  const handleApplyClick = (position: string) => {
    setSelectedPosition(position)
    setShowSuccess(false)
  }

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
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          subject: `Job Application: ${selectedPosition}`,
          message: `
Position: ${selectedPosition}
Phone: ${formData.phone}
Resume: ${formData.resume}
Cover Letter: ${formData.coverLetter}
          `,
          type: 'job'
        })
      })

      if (response.ok) {
        setShowSuccess(true)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          resume: '',
          coverLetter: ''
        })
        setSelectedPosition(null)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
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
          
          <h1 className="text-4xl font-bold text-foreground mb-4">Join Our Team</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Help us build the future of unbiased news and media literacy
          </p>
        </motion.div>

        {/* Company Values */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Mission-Driven
                </CardTitle>
                <CardDescription>
                  Fighting misinformation and bias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We're committed to making the internet a more truthful place through AI-powered bias detection
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Global Impact
                </CardTitle>
                <CardDescription>
                  Reach millions of users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your work will help people around the world make more informed decisions
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Fast-Paced
                </CardTitle>
                <CardDescription>
                  Rapid innovation and growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Join a startup environment where your ideas can make an immediate impact
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Open Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{position.title}</h3>
                        <p className="text-sm text-muted-foreground">{position.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{position.department}</Badge>
                          <Badge variant="outline">{position.location}</Badge>
                          <Badge variant="outline">{position.type}</Badge>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => handleApplyClick(position.title)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Job Application Form */}
        {selectedPosition && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Apply for {selectedPosition}</CardTitle>
                <CardDescription>
                  Fill out the form below to submit your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showSuccess ? (
                  <div className="text-center py-8">
                    <div className="text-green-600 text-6xl mb-4">✓</div>
                    <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
                    <p className="text-muted-foreground mb-4">
                      Thank you for your interest in joining our team. We'll review your application and get back to you within 48 hours.
                    </p>
                    <Button onClick={() => setSelectedPosition(null)}>
                      Close
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
                    <div className="grid gap-4 md:grid-cols-2">
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
                        <label className="text-sm font-medium mb-2 block">Phone</label>
                        <Input 
                          type="tel" 
                          placeholder="+1 (555) 123-4567" 
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Resume/CV Link *</label>
                      <Input 
                        placeholder="https://linkedin.com/in/johndoe or Google Drive link" 
                        value={formData.resume}
                        onChange={(e) => handleInputChange('resume', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Cover Letter</label>
                      <Textarea 
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                        rows={4}
                        value={formData.coverLetter}
                        onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Application
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setSelectedPosition(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Benefits & Perks
              </CardTitle>
              <CardDescription>
                What we offer to our team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Health & Wellness</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Comprehensive health insurance</li>
                    <li>• Mental health support</li>
                    <li>• Gym membership reimbursement</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Work & Life</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Flexible remote work</li>
                    <li>• Unlimited PTO</li>
                    <li>• Professional development budget</li>
                  </ul>
                </div>
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
          <Button size="lg" onClick={() => router.push('/about')}>
            Learn More About Us
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
