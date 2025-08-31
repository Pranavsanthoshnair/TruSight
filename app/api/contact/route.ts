import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, subject, message, type = 'contact' } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Here you would typically integrate with an email service
    // For now, we'll simulate sending an email
    console.log('📧 Email would be sent:', {
      to: type === 'job' ? 'careers@trusight.com' : 'contact@trusight.com',
      from: email,
      subject: type === 'job' ? `Job Application: ${subject}` : subject,
      body: `
Name: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject}
Type: ${type === 'job' ? 'Job Application' : 'Contact Form'}

Message:
${message}
      `
    })

    // In a real implementation, you would use a service like:
    // - SendGrid
    // - Resend
    // - Nodemailer with SMTP
    // - AWS SES

    return NextResponse.json({
      success: true,
      message: type === 'job' 
        ? 'Your job application has been submitted successfully! We\'ll get back to you within 48 hours.'
        : 'Your message has been sent successfully! We\'ll get back to you within 24 hours.'
    })

  } catch (error) {
    console.error('Error in contact API:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
