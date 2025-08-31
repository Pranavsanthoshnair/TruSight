"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Loader2 } from "lucide-react"
import { elevenLabsService } from "@/lib/elevenlabs-service"
import { motion } from "framer-motion"

interface VoiceButtonProps {
  analysisData: {
    bias: string
    confidence: number
    owner: string
    missingPerspectives: string[]
    reasoning?: string
  }
  className?: string
}

export function VoiceButton({ analysisData, className }: VoiceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Check if ElevenLabs service is available
  if (!elevenLabsService.isAvailable()) {
    return null // Don't render if service is not available
  }

  const handleVoicePlay = async () => {
    if (isPlaying || isLoading) return

    try {
      setIsLoading(true)
      setHasError(false)
      
      await elevenLabsService.speakBiasAnalysis(analysisData)
      
      setIsPlaying(true)
      setIsLoading(false)
      
      // Reset playing state after a delay (audio duration is unknown)
      setTimeout(() => {
        setIsPlaying(false)
      }, 5000) // Assume average analysis takes ~5 seconds to speak
      
    } catch (error) {
      console.error('Failed to play voice:', error)
      setIsLoading(false)
      setHasError(true)
      
      // Reset error state after a delay
      setTimeout(() => {
        setHasError(false)
      }, 3000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleVoicePlay}
        disabled={isLoading || isPlaying}
        className={`
          h-8 w-8 p-0 rounded-full
          hover:bg-primary/10 hover:text-primary
          transition-all duration-200
          ${isPlaying ? 'text-primary bg-primary/20' : ''}
          ${hasError ? 'text-red-500 hover:text-red-600' : ''}
          ${className || ''}
        `}
        title={isPlaying ? 'Playing audio...' : hasError ? 'Click to retry' : 'Listen to analysis'}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Volume2 className="h-4 w-4" />
        ) : hasError ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </motion.div>
  )
}
