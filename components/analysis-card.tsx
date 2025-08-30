"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Shield, Eye, Info } from "lucide-react"

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Analysis Results</h2>
        </div>
      </div>

      {/* Main Analysis */}
      <Card className="border-0 shadow-sm bg-card/50">
        <CardContent className="p-4 space-y-4">
          {/* Bias Classification */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Detected Bias</span>
              <Badge 
                variant="outline" 
                className={`${getBiasColor(bias)} text-xs font-medium`}
              >
                {bias}
              </Badge>
            </div>
            
            {/* Confidence */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-medium">{Math.round(confidence * 100)}%</span>
              </div>
              <Progress 
                value={confidence * 100} 
                className="h-1.5 bg-muted/50"
              />
            </div>
          </div>

          {/* Bias Spectrum */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Bias Spectrum</span>
            <div className="relative h-1.5 bg-gradient-to-r from-blue-500 via-gray-400 to-red-500 rounded-full">
              <motion.div
                className="absolute -top-0.5 h-3 w-3 rounded-full bg-background border-2 border-primary shadow-sm"
                style={{ 
                  left: `calc(${bias === 'left-leaning' ? 25 : bias === 'right-leaning' ? 75 : 50}% - 6px)` 
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
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

      {/* Source Information */}
      <Card className="border-0 shadow-sm bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Shield className="w-3 h-3 text-primary" />
            Source
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Publisher</span>
            <span className="text-xs font-medium truncate max-w-[60%]">{owner}</span>
          </div>
        </CardContent>
      </Card>

      {/* Missing Perspectives */}
      {missingPerspectives.length > 0 && (
        <Card className="border-0 shadow-sm bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Eye className="w-3 h-3 text-primary" />
              Missing Perspectives
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {missingPerspectives.map((perspective, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                  className="flex items-start gap-2"
                >
                  <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{perspective}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Reasoning */}
      {reasoning && reasoning.trim() && (
        <Card className="border-0 shadow-sm bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Info className="w-3 h-3 text-primary" />
              Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {reasoning}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
