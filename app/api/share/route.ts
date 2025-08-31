import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatId, messageId, analysisData } = body

    if (!chatId || !messageId || !analysisData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate a unique share ID
    const shareId = generateShareId()
    
    // Store the shared analysis in the database
    const { data, error } = await supabase
      .from('shared_analyses')
      .insert({
        share_id: shareId,
        chat_id: chatId,
        message_id: messageId,
        analysis_data: analysisData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing shared analysis:', error)
      return NextResponse.json(
        { error: 'Failed to create share link' },
        { status: 500 }
      )
    }

    // Generate the share URL
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/share/${shareId}`

    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
      data
    })

  } catch (error) {
    console.error('Error in share API:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create share link',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get('id')

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the shared analysis from the database
    const { data, error } = await supabase
      .from('shared_analyses')
      .select('*')
      .eq('share_id', shareId)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Share not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('Error retrieving shared analysis:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve shared analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function generateShareId(): string {
  // Generate a random 8-character alphanumeric string
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
