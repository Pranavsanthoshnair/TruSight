"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Globe, 
  Shield, 
  Users, 
  TrendingUp, 
  Award, 
  Lightbulb, 
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const router = useRouter()

  const features = [
    {
      icon: Target,
      title: "AI-Powered Bias Detection",
      description: "Advanced machine learning algorithms analyze text for potential media bias, political leanings, and missing perspectives."
    },
    {
      icon: Globe,
      title: "Global News Coverage",
      description: "Access to news from around the world through multiple reliable sources and APIs."
    },
    {
      icon: Shield,
      title: "Fact-Checking Tools",
      description: "Built-in verification tools to help users distinguish between factual reporting and opinion pieces."
    },
    {
      icon: Users,
      title: "Community-Driven",
      description: "User contributions and feedback help improve our bias detection algorithms and news coverage."
    }
  ]

  const stats = [
    { label: "Articles Analyzed", value: "10K+", icon: Target },
    { label: "Active Users", value: "5K+", icon: Users },
    { label: "Accuracy Rate", value: "95%", icon: Award },
    { label: "News Sources", value: "100+", icon: Globe }
  ]

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Lead AI Researcher",
      bio: "Expert in natural language processing and media bias detection with 10+ years of experience.",
      avatar: "👩‍🔬"
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Product",
      bio: "Former journalist passionate about media literacy and digital democracy.",
      avatar: "👨‍💼"
    },
    {
      name: "Dr. Emily Watson",
      role: "Data Scientist",
      bio: "Specializes in machine learning for social good and ethical AI development.",
      avatar: "👩‍💻"
    }
  ]

  const values = [
    {
      title: "Transparency",
      description: "We believe in open, honest communication about our methods and limitations."
    },
    {
      title: "Accuracy",
      description: "Our bias detection algorithms are continuously refined for maximum precision."
    },
    {
      title: "Accessibility",
      description: "Making media literacy tools available to everyone, regardless of background."
    },
    {
      title: "Ethics",
      description: "Committed to responsible AI development and protecting user privacy."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            About TruSight
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We're on a mission to democratize media literacy through AI-powered bias detection 
            and comprehensive news coverage. In today's information age, critical thinking is 
            more important than ever.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <Target className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-semibold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                To empower individuals with the tools and knowledge they need to navigate 
                the complex media landscape, identify potential biases, and make informed 
                decisions based on multiple perspectives.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
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
              )
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{member.avatar}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-8">
            <CardContent className="p-0">
              <Lightbulb className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of users who are already making more informed decisions 
                with TruSight. Start analyzing news bias today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push("/")}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Browse News
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={() => router.push("/bias")}
                  variant="outline"
                  size="lg"
                >
                  Try Bias Detection
                  <Target className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
