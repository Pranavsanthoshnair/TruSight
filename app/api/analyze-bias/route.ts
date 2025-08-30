import { NextRequest, NextResponse } from 'next/server'
import { groqService, type GroqAnalysisRequest } from '@/lib/groq-service'

export async function POST(request: NextRequest) {
  try {
    const body: GroqAnalysisRequest = await request.json()
    
    // Validate required fields
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Analyze the content using Groq
    const result = await groqService.analyzeBias(body)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in bias analysis API:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze bias',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Test API connectivity
    const isConnected = await groqService.testConnection()
    
    return NextResponse.json({
      status: isConnected ? 'connected' : 'disconnected',
      message: isConnected ? 'Groq API is available' : 'Groq API is unavailable'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to test Groq API connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
