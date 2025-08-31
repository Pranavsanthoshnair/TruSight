"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send, FileImage, FileText, Loader2, X, Plus } from "lucide-react"

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
        <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> : 
        <FileImage className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
    }
    return <Paperclip className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
  }

  const getFileStatus = (file: File) => {
    const processing = processingFiles.get(file.name)
    if (!processing) return null

    switch (processing.status) {
      case 'processing':
        return <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
      case 'completed':
        return <div className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      case 'error':
        return <div className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">✗</span>
        </div>
      default:
        return null
    }
  }

  return (
    <motion.div 
      className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* File Previews */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-2" 
              initial={{ opacity: 0, y: -10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {attachedFiles.map((file, index) => (
                <motion.div 
                  key={`${file.name}-${index}`}
                  className="group bg-muted/50 hover:bg-muted/80 border border-border/50 hover:border-border rounded-xl px-3 py-2 text-sm flex items-center gap-2.5 transition-all duration-200"
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  {getFileIcon(file)}
                  <span className="max-w-[140px] sm:max-w-[200px] truncate font-medium text-foreground/90">
                    {file.name}
                  </span>
                  {isImageOrPDF(file) && (
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                      OCR
                    </span>
                  )}
                  {getFileStatus(file)}
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-1 p-1 rounded-full hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground transition-all duration-200 opacity-0 group-hover:opacity-100"
                    disabled={isProcessingOCR}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* OCR Processing Status */}
        <AnimatePresence>
          {isProcessingOCR && (
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-4"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-300">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Processing images and PDFs for text extraction...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <div className="relative group">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message, paste a link, or attach files..."
                className="min-h-[56px] max-h-[200px] resize-none pr-14 pl-4 py-3 text-base border-2 border-border/50 hover:border-border focus:border-primary/50 rounded-2xl bg-background/50 backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                disabled={isProcessingOCR}
              />
              
              {/* Attach Button */}
              <motion.div className="absolute right-2 top-2">
                <motion.label 
                  className={`
                    inline-flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-300
                    ${isProcessingOCR 
                      ? 'bg-muted/50 text-muted-foreground cursor-not-allowed' 
                      : 'bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground hover:shadow-md active:scale-95'
                    }
                  `}
                  whileHover={!isProcessingOCR ? { scale: 1.05, rotate: 5 } : {}}
                  whileTap={!isProcessingOCR ? { scale: 0.95 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileAttach}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
                    disabled={isProcessingOCR}
                  />
                  <Paperclip className="w-5 h-5" />
                </motion.label>
              </motion.div>
            </div>
          </div>

          {/* Send Button */}
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleSend}
              disabled={(!message.trim() && attachedFiles.length === 0) || isProcessingOCR}
              className="h-[56px] px-6 rounded-2xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isProcessingOCR ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="hidden sm:inline ml-2 text-base">
                {isProcessingOCR ? "Processing..." : "Send"}
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
