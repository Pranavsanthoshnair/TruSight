"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield, Eye, Target, TrendingUp, Info } from "lucide-react"

interface AnalysisCardProps {
  bias: string
  confidence: number // 0..1
  owner: string
  missingPerspectives: string[]
  reasoning?: string
}

export function AnalysisCard({ bias, confidence, owner, missingPerspectives, reasoning }: AnalysisCardProps) {
  const getBiasColor = (bias: string) => {
    switch (bias.toLowerCase()) {
      case "left-leaning":
        return "bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-800"
      case "right-leaning":
        return "bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-800"
      case "center":
        return "bg-green-500/10 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-800"
      case "neutral":
        return "bg-gray-500/10 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-800"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-800"
    }
  }

  const getBiasIcon = (bias: string) => {
    switch (bias.toLowerCase()) {
      case "left-leaning":
        return "←"
      case "right-leaning":
        return "→"
      case "center":
        return "•"
      case "neutral":
        return "○"
      default:
        return "•"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2"
        >
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Bias Analysis</h2>
        </motion.div>
        <p className="text-sm text-muted-foreground">AI-powered media bias detection</p>
      </div>

      {/* Main Analysis Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            {/* Bias Classification */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Detected Bias</span>
                <Badge 
                  variant="outline" 
                  className={`${getBiasColor(bias)} font-medium`}
                >
                  <span className="mr-1">{getBiasIcon(bias)}</span>
                  {bias}
                </Badge>
              </div>
              
              {/* Confidence Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium">{Math.round(confidence * 100)}%</span>
                </div>
                <Progress 
                  value={confidence * 100} 
                  className="h-2 bg-muted/50"
                />
              </div>
            </div>

            {/* Bias Spectrum */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Bias Spectrum</span>
              <div className="relative h-2 bg-gradient-to-r from-blue-500 via-gray-400 to-red-500 rounded-full">
                <motion.div
                  className="absolute -top-1 h-4 w-4 rounded-full bg-background border-2 border-primary shadow-sm"
                  style={{ 
                    left: `calc(${bias === 'left-leaning' ? 25 : bias === 'right-leaning' ? 75 : 50}% - 8px)` 
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Left</span>
                <span>Center</span>
                <span>Right</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Source Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Shield className="w-4 h-4 text-primary" />
              Source Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Publisher</span>
              <span className="text-sm font-medium truncate max-w-[60%]">{owner}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Missing Perspectives */}
      {missingPerspectives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Eye className="w-4 h-4 text-primary" />
                Missing Perspectives
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {missingPerspectives.map((perspective, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{perspective}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* AI Reasoning */}
      {reasoning && reasoning.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Info className="w-4 h-4 text-primary" />
                Analysis Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reasoning}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
