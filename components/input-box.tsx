"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send, FileImage, FileText, Loader2 } from "lucide-react"

interface InputBoxProps {
  onSendMessage: (content: string) => void
  onSendFiles?: (fileNames: string[]) => void
}

interface ProcessingFile {
  file: File
  status: 'processing' | 'completed' | 'error'
  extractedText?: string
  error?: string
}

export function InputBox({ onSendMessage, onSendFiles }: InputBoxProps) {
  const [message, setMessage] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [processingFiles, setProcessingFiles] = useState<Map<string, ProcessingFile>>(new Map())
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)

  const isImageOrPDF = (file: File): boolean => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff']
    const pdfTypes = ['application/pdf']
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.pdf']
    
    return imageTypes.includes(file.type.toLowerCase()) || 
           pdfTypes.includes(file.type.toLowerCase()) ||
           supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  }

  const processOCRFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/process-ocr', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'OCR processing failed')
    }

    return result.text
  }

  const handleSend = async () => {
    if (!message.trim() && attachedFiles.length === 0) return

    // Check if we have image/PDF files that need OCR processing
    const ocrFiles = attachedFiles.filter(isImageOrPDF)
    const regularFiles = attachedFiles.filter(file => !isImageOrPDF(file))

    let finalMessage = message
    
    // Process OCR files if any
    if (ocrFiles.length > 0) {
      setIsProcessingOCR(true)
      
      try {
        const ocrResults: string[] = []
        
        for (const file of ocrFiles) {
          setProcessingFiles(prev => new Map(prev.set(file.name, {
            file,
            status: 'processing'
          })))

          try {
            const extractedText = await processOCRFile(file)
            
            setProcessingFiles(prev => new Map(prev.set(file.name, {
              file,
              status: 'completed',
              extractedText
            })))

            ocrResults.push(`**Text extracted from ${file.name}:**\n${extractedText}`)
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'OCR processing failed'
            
            setProcessingFiles(prev => new Map(prev.set(file.name, {
              file,
              status: 'error',
              error: errorMessage
            })))

            ocrResults.push(`**Failed to extract text from ${file.name}:** ${errorMessage}`)
          }
        }

        // Combine original message with OCR results
        if (ocrResults.length > 0) {
          finalMessage = message ? 
            `${message}\n\n${ocrResults.join('\n\n')}` : 
            ocrResults.join('\n\n')
        }
      } finally {
        setIsProcessingOCR(false)
      }
    }

    // Handle regular file attachments
    if (regularFiles.length > 0 && onSendFiles) {
      onSendFiles(regularFiles.map(f => f.name))
    }

    // Send the final message (original + OCR text)
    if (finalMessage.trim()) {
      onSendMessage(finalMessage)
    }

    // Clear state
    setMessage("")
    setAttachedFiles([])
    setProcessingFiles(new Map())
  }

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (isImageOrPDF(file)) {
      return file.type === 'application/pdf' ? 
        <FileText className="w-3 h-3" /> : 
        <FileImage className="w-3 h-3" />
    }
    return <Paperclip className="w-3 h-3" />
  }

  const getFileStatus = (file: File) => {
    const processing = processingFiles.get(file.name)
    if (!processing) return null

    switch (processing.status) {
      case 'processing':
        return <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
      case 'completed':
        return <span className="text-green-500 text-xs">✓</span>
      case 'error':
        return <span className="text-red-500 text-xs">✗</span>
      default:
        return null
    }
  }

  return (
    <motion.div 
      className="border-t border-border bg-card p-3 sm:p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="space-y-3">
        {/* File Previews */}
        {attachedFiles.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2" 
            initial={{ opacity: 0, y: 10, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {attachedFiles.map((file, index) => (
              <motion.div 
                key={index} 
                className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2 hover-scale hover-glow transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
              >
                {getFileIcon(file)}
                <span className="max-w-[120px] sm:max-w-[200px] truncate">{file.name}</span>
                {isImageOrPDF(file) && (
                  <span className="text-xs text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-1 rounded">
                    OCR
                  </span>
                )}
                {getFileStatus(file)}
                <button
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110"
                  disabled={isProcessingOCR}
                >
                  ×
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* OCR Processing Status */}
        {isProcessingOCR && (
          <motion.div
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing images and PDFs for text extraction...
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="flex gap-2 sm:gap-3">
          <div className="flex-1 relative group">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste article link or text, or attach images/PDFs..."
              className="min-h-[60px] resize-none pr-12 font-sans focus-ring transition-all duration-300 group-hover:shadow-md"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={isProcessingOCR}
            />
            <motion.label 
              className="absolute right-3 top-3 cursor-pointer hover-scale transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileAttach}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
                disabled={isProcessingOCR}
              />
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-foreground transition-colors duration-300" />
            </motion.label>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleSend}
              disabled={(!message.trim() && attachedFiles.length === 0) || isProcessingOCR}
              className="h-[60px] px-4 sm:px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-serif font-semibold shadow-lg hover-glow focus-ring transition-all duration-300"
              style={{
                background: "linear-gradient(145deg, #dc2626, #b91c1c)",
                boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {isProcessingOCR ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <span className="hidden sm:inline ml-2">
                {isProcessingOCR ? "Processing..." : "Send"}
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
