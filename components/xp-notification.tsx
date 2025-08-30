"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Award, Star } from "lucide-react"
import { useEffect, useState } from "react"

interface XPNotificationProps {
  show: boolean
  xpGained: number
  message?: string
  onComplete?: () => void
}

export function XPNotification({ show, xpGained, message = "Great work!", onComplete }: XPNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center gap-3">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                <Award className="w-6 h-6" />
              </motion.div>
              <div>
                <div className="font-serif font-bold text-lg">+{xpGained} XP!</div>
                <div className="text-sm opacity-90">{message}</div>
              </div>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: 2 }}>
                <Star className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
