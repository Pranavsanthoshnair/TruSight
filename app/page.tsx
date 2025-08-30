"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <motion.h1
            className="text-5xl md:text-7xl font-serif font-bold ink-bleed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            TruSight
          </motion.h1>
          <motion.p
            className="mt-4 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Read the news. See the bias. Sharpen your perspective.
          </motion.p>
          <motion.div className="mt-8 flex items-center justify-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <a href="/analyze" className="inline-flex">
              <Button className="px-6 py-6 text-base font-serif bg-primary hover:bg-primary/90">Get Started</Button>
            </a>
            <a href="/learn-more" className="inline-flex">
              <Button variant="ghost" className="px-6 py-6 text-base">Learn More</Button>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
