"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Loader2, Volume1 } from "lucide-react"
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
  const [currentProvider, setCurrentProvider] = useState<'elevenlabs' | 'browser' | null>(null)

  // Always render the button since we have browser fallback
  // Only hide if neither service is available

  const handleVoicePlay = async () => {
    if (isPlaying || isLoading) return

    try {
      setIsLoading(true)
      setHasError(false)
      setCurrentProvider(null)
      
      const response = await elevenLabsService.speakBiasAnalysis(analysisData)
      
      if (response.success) {
        setCurrentProvider(response.provider)
        setIsPlaying(true)
        setIsLoading(false)
        
        // Reset playing state after a delay
        setTimeout(() => {
          setIsPlaying(false)
          setCurrentProvider(null)
        }, 5000) // Assume average analysis takes ~5 seconds to speak
      } else {
        setHasError(true)
        setIsLoading(false)
        
        // Reset error state after a delay
        setTimeout(() => {
          setHasError(false)
        }, 3000)
      }
      
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
          h-8 w-8 p-0 rounded-full relative
          hover:bg-primary/10 hover:text-primary
          transition-all duration-200
          ${isPlaying ? 'text-primary bg-primary/20' : ''}
          ${hasError ? 'text-red-500 hover:text-red-600' : ''}
          ${className || ''}
        `}
        title={
          isPlaying 
            ? `Playing audio (${currentProvider === 'elevenlabs' ? 'ElevenLabs' : 'Browser TTS'})...` 
            : hasError 
              ? 'Click to retry' 
              : 'Listen to analysis'
        }
              >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPlaying ? (
            currentProvider === 'elevenlabs' ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <Volume1 className="h-4 w-4" />
            )
          ) : hasError ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        
        {/* Provider indicator */}
        {isPlaying && currentProvider && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white"
            style={{
              backgroundColor: currentProvider === 'elevenlabs' ? '#3b82f6' : '#10b981'
            }}
            title={`Using ${currentProvider === 'elevenlabs' ? 'ElevenLabs' : 'Browser TTS'}`}
          >
            {currentProvider === 'elevenlabs' ? 'E' : 'B'}
          </motion.div>
        )}
      </motion.div>
    )
  }
