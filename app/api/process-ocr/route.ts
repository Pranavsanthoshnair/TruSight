import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check if OCR API key is configured
    if (!process.env.OCR_SPACE_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OCR service not configured. Please add OCR_SPACE_API_KEY to environment variables.' 
        },
        { status: 500 }
      )
    }

    // Validate file type
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
    const isSupported = supportedTypes.includes(file.type.toLowerCase()) || 
                       supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    
    if (!isSupported) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unsupported file type. Please upload an image (JPG, PNG, GIF, BMP, TIFF) or PDF file.' 
        },
        { status: 400 }
      )
    }

    // Check file size (OCR.space has limits)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File too large. Please upload a file smaller than 10MB.' 
        },
        { status: 400 }
      )
    }

    // Prepare OCR request
    const ocrFormData = new FormData()
    ocrFormData.append('file', file)
    ocrFormData.append('apikey', process.env.OCR_SPACE_API_KEY)
    ocrFormData.append('language', 'eng')
    ocrFormData.append('OCREngine', '2')
    ocrFormData.append('detectOrientation', 'true')
    ocrFormData.append('scale', 'true')
    
    // Enable table detection for PDFs and certain file types
    if (file.type === 'application/pdf' || 
        file.name.toLowerCase().includes('table') ||
        file.name.toLowerCase().includes('receipt')) {
      ocrFormData.append('isTable', 'true')
    }

    // Call OCR.space API
    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: ocrFormData
    })

    if (!ocrResponse.ok) {
      throw new Error(`OCR API request failed: ${ocrResponse.status} ${ocrResponse.statusText}`)
    }

    const ocrResult = await ocrResponse.json()

    // Parse OCR response
    if (ocrResult.IsErroredOnProcessing) {
      return NextResponse.json(
        { 
          success: false, 
          error: ocrResult.ErrorMessage || 'OCR processing failed' 
        },
        { status: 500 }
      )
    }

    if (!ocrResult.ParsedResults || ocrResult.ParsedResults.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No text found in the image/document' 
        },
        { status: 400 }
      )
    }

    // Extract text from all pages/results
    const extractedText = ocrResult.ParsedResults
      .map((result: any) => result.ParsedText || '')
      .join('\n\n')
      .trim()

    if (!extractedText) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No readable text detected in the image/document' 
        },
        { status: 400 }
      )
    }

    // Calculate confidence score
    let confidence: number | undefined
    const confidenceValues = ocrResult.ParsedResults
      .map((result: any) => result.TextOverlay?.HasOverlay ? 1 : 0.8)
      .filter((conf: number) => conf > 0)
    
    if (confidenceValues.length > 0) {
      confidence = confidenceValues.reduce((a: number, b: number) => a + b, 0) / confidenceValues.length
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
      confidence,
      pages: ocrResult.ParsedResults.length,
      filename: file.name,
      fileType: file.type
    })

  } catch (error) {
    console.error('OCR processing error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown OCR processing error' 
      },
      { status: 500 }
    )
  }
}
