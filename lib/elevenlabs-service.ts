export interface ElevenLabsVoice {
  voice_id: string
  name: string
  category: string
  description: string
  preview_url: string
}

export interface ElevenLabsResponse {
  audio: ArrayBuffer
  format: string
}

export interface SpeechResponse {
  success: boolean
  provider: 'elevenlabs' | 'browser'
  error?: string
}

class ElevenLabsService {
  private apiKey: string
  private baseUrl = 'https://api.elevenlabs.io/v1'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || ''
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found. Voice functionality will be disabled.')
    }
  }

  /**
   * Check if the service is available
   */
  isAvailable(): boolean {
    return !!this.apiKey
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    if (!this.isAvailable()) {
      throw new Error('ElevenLabs service not available')
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`)
      }

      const data = await response.json()
      return data.voices || []
    } catch (error) {
      console.error('Error fetching voices:', error)
      throw error
    }
  }

  /**
   * Convert text to speech
   */
  async textToSpeech(
    text: string,
    voiceId: string = 'pNInz6obpgDQGcFmaJgB' // Default voice (Adam)
  ): Promise<ElevenLabsResponse> {
    if (!this.isAvailable()) {
      throw new Error('ElevenLabs service not available')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Text-to-speech failed: ${response.status}`)
      }

      const audioBuffer = await response.arrayBuffer()
      return {
        audio: audioBuffer,
        format: 'audio/mpeg',
      }
    } catch (error) {
      console.error('Error in text-to-speech:', error)
      throw error
    }
  }

  /**
   * Play audio from ArrayBuffer
   */
  playAudio(audioBuffer: ArrayBuffer): HTMLAudioElement {
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' })
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    
    // Clean up URL when audio is done
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(url)
    })
    
    return audio
  }

  /**
   * Generate and play speech for bias analysis with fallback
   */
  async speakBiasAnalysis(analysisData: {
    bias: string
    confidence: number
    owner: string
    missingPerspectives: string[]
    reasoning?: string
  }): Promise<SpeechResponse> {
    try {
      // Create a natural language summary for speech
      const speechText = this.generateSpeechText(analysisData)
      
      // Try ElevenLabs first
      if (this.isAvailable()) {
        try {
          const response = await this.textToSpeech(speechText)
          const audio = this.playAudio(response.audio)
          await audio.play()
          return { success: true, provider: 'elevenlabs' }
        } catch (elevenLabsError) {
          console.warn('ElevenLabs failed, falling back to browser TTS:', elevenLabsError)
          // Fall back to browser TTS
          return this.speakWithBrowserTTS(speechText)
        }
      } else {
        // ElevenLabs not available, use browser TTS
        return this.speakWithBrowserTTS(speechText)
      }
    } catch (error) {
      console.error('Error speaking bias analysis:', error)
      // Final fallback to browser TTS
      try {
        const speechText = this.generateSpeechText(analysisData)
        return this.speakWithBrowserTTS(speechText)
      } catch (fallbackError) {
        return { 
          success: false, 
          provider: 'browser', 
          error: 'Both ElevenLabs and browser TTS failed' 
        }
      }
    }
  }

  /**
   * Fallback to browser's built-in text-to-speech
   */
  private speakWithBrowserTTS(text: string): SpeechResponse {
    try {
      // Check if browser supports speech synthesis
      if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Configure voice settings
        utterance.rate = 0.9 // Slightly slower for clarity
        utterance.pitch = 1.0 // Normal pitch
        utterance.volume = 1.0 // Full volume
        
        // Try to use a good voice if available
        const voices = speechSynthesis.getVoices()
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.default
        ) || voices.find(voice => 
          voice.lang.startsWith('en')
        ) || voices[0]
        
        if (preferredVoice) {
          utterance.voice = preferredVoice
        }
        
        // Speak the text
        speechSynthesis.speak(utterance)
        
        return { success: true, provider: 'browser' }
      } else {
        return { 
          success: false, 
          provider: 'browser', 
          error: 'Browser does not support speech synthesis' 
        }
      }
    } catch (error) {
      console.error('Browser TTS failed:', error)
      return { 
        success: false, 
        provider: 'browser', 
        error: 'Browser TTS error: ' + error.message 
      }
    }
  }

  /**
   * Generate natural language text for speech synthesis
   */
  private generateSpeechText(analysisData: {
    bias: string
    confidence: number
    owner: string
    missingPerspectives: string[]
    reasoning?: string
  }): string {
    const { bias, confidence, owner, missingPerspectives, reasoning } = analysisData
    
    let text = `Bias analysis complete. `
    text += `The detected bias is ${bias.toLowerCase()} with ${Math.round(confidence * 100)}% confidence. `
    text += `The publisher is ${owner}. `
    
    if (missingPerspectives.length > 0) {
      text += `Missing perspectives include: ${missingPerspectives.join(', ')}. `
    } else {
      text += `No missing perspectives were detected. `
    }
    
    if (reasoning && reasoning.trim()) {
      text += `Analysis: ${reasoning}`
    }
    
    return text
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService()
export default ElevenLabsService
