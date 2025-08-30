"use client"

import { motion } from "framer-motion"

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <motion.h1
          className="text-4xl md:text-5xl font-serif font-bold text-foreground text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Learn More about TruSight
        </motion.h1>
        <motion.p
          className="mt-3 text-center text-muted-foreground max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          From quick bias checks to perspective discovery, TruSight turns raw news into insights you can trust.
        </motion.p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Bias Detection"
            description="We highlight possible leanings like Left, Center, or Right with a confidence estimate."
          />
          <FeatureCard
            title="Perspective Finder"
            description="Surface missing angles such as economic impact or community voices to round out your view."
          />
          <FeatureCard
            title="Analysis History"
            description="Keep track of your previous analyses and build a comprehensive understanding of media bias patterns."
          />
          <FeatureCard
            title="Attach & Analyze"
            description="Drop in links, PDFs, or images. We keep the flow simple — you keep your focus."
          />
          <FeatureCard
            title="Newspaper Aesthetic"
            description="A calm, print-inspired design that keeps attention on the words that matter."
          />
          <FeatureCard
            title="Fast & Private"
            description="No sign-in required for mock analysis. Your session lives locally in your browser."
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      className="rounded-lg border border-border bg-card p-5 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  )
}


