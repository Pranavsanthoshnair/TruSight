"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield, Eye, Award, Landmark, Target } from "lucide-react"

interface AnalysisCardProps {
  bias: string
  confidence: number // 0..1
  owner: string
  missingPerspectives: string[]
}

export function AnalysisCard({ bias, confidence, owner, missingPerspectives }: AnalysisCardProps) {
  const getBiasColor = (bias: string) => {
    switch (bias.toLowerCase()) {
      case "left-leaning":
        return "bg-blue-500"
      case "right-leaning":
        return "bg-red-500"
      case "center":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Bias Detection Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="torn-edge hover-scale hover-glow transition-all duration-300">
          <CardHeader className="px-4 py-3">
            <CardTitle className="flex items-center gap-2 font-serif text-sm sm:text-base">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              Bias Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-4">
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span className="font-medium text-sm sm:text-base">Detected Bias:</span>
              <Badge className={`${getBiasColor(bias)} text-white hover-scale transition-all duration-300`}>{bias}</Badge>
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Confidence Level</span>
                <span className="text-xs sm:text-sm font-medium">{Math.round(confidence * 100)}%</span>
              </div>
              <Progress value={confidence * 100} className="h-2 hover:scale-y-110 transition-transform duration-300" />

              {/* Bias Spectrum Meter */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Left</span>
                  <span>Center</span>
                  <span>Right</span>
                </div>
                <div className="relative h-3 rounded-full bg-gradient-to-r from-blue-500 via-gray-300 to-red-500 overflow-hidden">
                  <motion.div
                    className="absolute -top-1 h-5 w-5 rounded-full bg-primary border-2 border-background flex items-center justify-center"
                    style={{ left: `calc(${Math.round(confidence * 100)}% - 10px)` }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Target className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Source Transparency Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="torn-edge hover-scale hover-glow transition-all duration-300">
          <CardHeader className="px-4 py-3">
            <CardTitle className="flex items-center gap-2 font-serif text-sm sm:text-base">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              Source Transparency
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <span className="font-medium text-sm sm:text-base">Media Owner:</span>
              <span className="text-xs sm:text-sm flex items-center gap-1 max-w-[60%] truncate">
                <Landmark className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{owner}</span>
              </span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Missing Perspectives Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="torn-edge hover-scale hover-glow transition-all duration-300">
          <CardHeader className="px-4 py-3">
            <CardTitle className="flex items-center gap-2 font-serif text-sm sm:text-base">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              Missing Perspectives
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2">
              {missingPerspectives.map((perspective, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                  className="flex items-start gap-2 group"
                >
                  <motion.div 
                    className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" 
                  />
                  <span className="text-xs sm:text-sm break-words overflow-hidden group-hover:text-primary transition-colors duration-300">{perspective}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
