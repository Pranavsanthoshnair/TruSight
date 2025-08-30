"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send } from "lucide-react"

interface InputBoxProps {
  onSendMessage: (content: string) => void
  onSendFiles?: (fileNames: string[]) => void
}

export function InputBox({ onSendMessage, onSendFiles }: InputBoxProps) {
  const [message, setMessage] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])

  const handleSend = () => {
    if (message.trim()) {
      if (attachedFiles.length && onSendFiles) {
        onSendFiles(attachedFiles.map((f) => f.name))
      }
      onSendMessage(message)
      setMessage("")
      setAttachedFiles([])
    }
  }

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachedFiles((prev) => [...prev, ...files])
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
                <Paperclip className="w-3 h-3" />
                <span className="max-w-[120px] sm:max-w-[200px] truncate">{file.name}</span>
                <button
                  onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== index))}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Input Area */}
        <div className="flex gap-2 sm:gap-3">
          <div className="flex-1 relative group">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste article link or text..."
              className="min-h-[60px] resize-none pr-12 font-sans focus-ring transition-all duration-300 group-hover:shadow-md"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
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
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
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
              disabled={!message.trim()}
              className="h-[60px] px-4 sm:px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-serif font-semibold shadow-lg hover-glow focus-ring transition-all duration-300"
              style={{
                background: "linear-gradient(145deg, #dc2626, #b91c1c)",
                boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline ml-2">Send</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
