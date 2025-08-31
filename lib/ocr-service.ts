/**
 * OCR Service for processing images and PDFs using OCR.space API
 * Supports file upload, URL processing, and base64 string processing
 */

export interface OCRResult {
  success: boolean
  text: string
  confidence?: number
  error?: string
  pages?: number
}

export interface OCROptions {
  language?: string
  engine?: 1 | 2
  detectOrientation?: boolean
  scale?: boolean
  isTable?: boolean
}

export class OCRService {
  private static readonly API_ENDPOINT = 'https://api.ocr.space/parse/image'
  private static readonly API_KEY = process.env.OCR_SPACE_API_KEY

  /**
   * Process image or PDF file using OCR.space API
   */
  static async processFile(
    file: File, 
    options: OCROptions = {}
  ): Promise<OCRResult> {
    if (!this.API_KEY) {
      return {
        success: false,
        text: '',
        error: 'OCR API key not configured. Please add OCR_SPACE_API_KEY to your environment variables.'
      }
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('apikey', this.API_KEY)
      formData.append('language', options.language || 'eng')
      formData.append('OCREngine', (options.engine || 2).toString())
      
      if (options.detectOrientation) {
        formData.append('detectOrientation', 'true')
      }
      
      if (options.scale) {
        formData.append('scale', 'true')
      }
      
      if (options.isTable) {
        formData.append('isTable', 'true')
      }

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`OCR API request failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return this.parseOCRResponse(result)
    } catch (error) {
      console.error('OCR processing error:', error)
      return {
        success: false,
        text: '',
        error: error instanceof Error ? error.message : 'Unknown OCR processing error'
      }
    }
  }

  /**
   * Process image from URL using OCR.space API
   */
  static async processUrl(
    imageUrl: string, 
    options: OCROptions = {}
  ): Promise<OCRResult> {
    if (!this.API_KEY) {
      return {
        success: false,
        text: '',
        error: 'OCR API key not configured. Please add OCR_SPACE_API_KEY to your environment variables.'
      }
    }

    try {
      const formData = new FormData()
      formData.append('url', imageUrl)
      formData.append('apikey', this.API_KEY)
      formData.append('language', options.language || 'eng')
      formData.append('OCREngine', (options.engine || 2).toString())
      
      if (options.detectOrientation) {
        formData.append('detectOrientation', 'true')
      }
      
      if (options.scale) {
        formData.append('scale', 'true')
      }
      
      if (options.isTable) {
        formData.append('isTable', 'true')
      }

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`OCR API request failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return this.parseOCRResponse(result)
    } catch (error) {
      console.error('OCR processing error:', error)
      return {
        success: false,
        text: '',
        error: error instanceof Error ? error.message : 'Unknown OCR processing error'
      }
    }
  }

  /**
   * Process base64 encoded image using OCR.space API
   */
  static async processBase64(
    base64String: string, 
    options: OCROptions = {}
  ): Promise<OCRResult> {
    if (!this.API_KEY) {
      return {
        success: false,
        text: '',
        error: 'OCR API key not configured. Please add OCR_SPACE_API_KEY to your environment variables.'
      }
    }

    try {
      const formData = new FormData()
      formData.append('base64Image', base64String)
      formData.append('apikey', this.API_KEY)
      formData.append('language', options.language || 'eng')
      formData.append('OCREngine', (options.engine || 2).toString())
      
      if (options.detectOrientation) {
        formData.append('detectOrientation', 'true')
      }
      
      if (options.scale) {
        formData.append('scale', 'true')
      }
      
      if (options.isTable) {
        formData.append('isTable', 'true')
      }

      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`OCR API request failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return this.parseOCRResponse(result)
    } catch (error) {
      console.error('OCR processing error:', error)
      return {
        success: false,
        text: '',
        error: error instanceof Error ? error.message : 'Unknown OCR processing error'
      }
    }
  }

  /**
   * Convert File to base64 string with proper content type prefix
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Add content type prefix if not present
        if (!result.startsWith('data:')) {
          const mimeType = file.type || 'application/octet-stream'
          const base64Data = result.split(',')[1] || result
          resolve(`data:${mimeType};base64,${base64Data}`)
        } else {
          resolve(result)
        }
      }
      reader.onerror = () => reject(new Error('Failed to convert file to base64'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Check if file type is supported for OCR processing
   */
  static isSupportedFileType(file: File): boolean {
    const supportedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'application/pdf'
    ]
    
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.pdf']
    
    return supportedTypes.includes(file.type.toLowerCase()) || 
           supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  }

  /**
   * Parse OCR.space API response and extract text
   */
  private static parseOCRResponse(response: any): OCRResult {
    try {
      if (!response) {
        return {
          success: false,
          text: '',
          error: 'Empty response from OCR API'
        }
      }

      if (response.IsErroredOnProcessing) {
        return {
          success: false,
          text: '',
          error: response.ErrorMessage || 'OCR processing failed'
        }
      }

      if (!response.ParsedResults || response.ParsedResults.length === 0) {
        return {
          success: false,
          text: '',
          error: 'No text found in the image/document'
        }
      }

      // Combine text from all pages/results
      const extractedText = response.ParsedResults
        .map((result: any) => result.ParsedText || '')
        .join('\n\n')
        .trim()

      if (!extractedText) {
        return {
          success: false,
          text: '',
          error: 'No readable text detected in the image/document'
        }
      }

      // Calculate average confidence if available
      let confidence: number | undefined
      const confidenceValues = response.ParsedResults
        .map((result: any) => result.TextOverlay?.HasOverlay ? 1 : 0.8)
        .filter((conf: number) => conf > 0)
      
      if (confidenceValues.length > 0) {
        confidence = confidenceValues.reduce((a: number, b: number) => a + b, 0) / confidenceValues.length
      }

      return {
        success: true,
        text: extractedText,
        confidence,
        pages: response.ParsedResults.length
      }
    } catch (error) {
      console.error('Error parsing OCR response:', error)
      return {
        success: false,
        text: '',
        error: 'Failed to parse OCR response'
      }
    }
  }

  /**
   * Get optimal OCR options based on file type and content
   */
  static getOptimalOptions(file: File): OCROptions {
    const options: OCROptions = {
      engine: 2, // Engine 2 supports more languages
      detectOrientation: true,
      scale: true
    }

    // Enable table detection for PDFs and certain image types
    if (file.type === 'application/pdf' || 
        file.name.toLowerCase().includes('table') ||
        file.name.toLowerCase().includes('receipt')) {
      options.isTable = true
    }

    return options
  }
}
