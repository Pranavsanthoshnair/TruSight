# OCR Setup Guide

This guide explains how to set up OCR (Optical Character Recognition) functionality in TruSight to detect bias in images and PDF documents.

## Overview

TruSight now supports bias detection in:
- **Images**: JPG, PNG, GIF, BMP, TIFF
- **PDF documents**: Single and multi-page PDFs

The OCR functionality uses the [OCR.space API](https://ocr.space/ocrapi) to extract text from uploaded files, which is then analyzed for bias using the existing bias detection pipeline.

## Setup Instructions

### 1. Get Your OCR.space API Key

1. Visit [OCR.space API registration](https://ocr.space/ocrapi/freekey)
2. Register for a free API key
3. Copy your API key from the confirmation email

### 2. Configure Environment Variables

Add your OCR.space API key to your environment variables:

```bash
# Add to your .env.local file
OCR_SPACE_API_KEY=your_api_key_here
```

### 3. Restart Your Application

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Usage

### Uploading Files for OCR Processing

1. **Navigate to the Bias Detection page**
2. **Click the attachment button** (📎) in the chat input
3. **Select image or PDF files** - supported formats:
   - Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`
   - Documents: `.pdf`
4. **Files will be automatically processed** with OCR before bias analysis
5. **View the extracted text** and bias analysis results

### OCR Processing Features

- **Automatic text extraction** from images and PDFs
- **Multi-page PDF support** - text from all pages is combined
- **Table detection** - automatically enabled for PDFs and files with "table" or "receipt" in the name
- **Orientation detection** - handles rotated images
- **Progress indicators** - real-time status updates during processing
- **Error handling** - graceful fallback if OCR fails

## API Limits

### Free Tier
- **500 requests per day** per IP address
- **10MB file size limit**
- **Multiple file formats supported**

### Upgrading
For higher usage limits, consider upgrading to OCR.space PRO plans:
- **PRO**: Unlimited requests, faster processing
- **PRO PDF**: Enhanced PDF processing capabilities

## Technical Implementation

### OCR Service (`lib/ocr-service.ts`)
- Handles file upload and processing
- Supports multiple input methods (file upload, URL, base64)
- Automatic file type detection and validation
- Error handling and response parsing

### API Endpoint (`/api/process-ocr`)
- Server-side OCR processing
- File validation and size checking
- Integration with OCR.space API
- Structured JSON responses

### UI Integration (`components/input-box.tsx`)
- File attachment with OCR indicators
- Real-time processing status
- Automatic text extraction and bias analysis
- Enhanced file type icons and status indicators

## Troubleshooting

### Common Issues

**"OCR service not configured" error**
- Ensure `OCR_SPACE_API_KEY` is set in your environment variables
- Restart your application after adding the environment variable

**"File too large" error**
- OCR.space has a 10MB file size limit
- Compress your images or split large PDFs

**"No text found" error**
- Image quality may be too low for OCR
- Try uploading a higher resolution image
- Ensure text in the image is clearly visible

**Rate limit exceeded**
- Free tier allows 500 requests per day
- Wait 24 hours or upgrade to a PRO plan

### File Format Issues

**Unsupported file type**
- Only images (JPG, PNG, GIF, BMP, TIFF) and PDFs are supported
- Convert other document formats to PDF first

**Poor OCR accuracy**
- Ensure good image quality and contrast
- Text should be horizontal and clearly readable
- Avoid heavily stylized or handwritten fonts

## Security Considerations

- **API Key Protection**: Never commit your API key to version control
- **File Validation**: Only supported file types are processed
- **Size Limits**: Files are validated for size before processing
- **Error Handling**: Sensitive information is not exposed in error messages

## Integration with Bias Detection

The OCR functionality seamlessly integrates with TruSight's existing bias detection:

1. **File Upload** → OCR text extraction
2. **Text Extraction** → Combined with user message
3. **Bias Analysis** → Standard Groq-powered analysis
4. **Results Display** → Enhanced analysis cards with source information

The extracted text is automatically formatted and included in the bias analysis, allowing you to detect bias in news articles, social media posts, documents, and other text-based content regardless of format.
