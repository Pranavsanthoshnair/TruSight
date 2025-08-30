"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface StampEffectProps {
  children: ReactNode
  isStamped?: boolean
  stampText?: string
}

export function StampEffect({ children, isStamped = false, stampText = "ANALYZED" }: StampEffectProps) {
  return (
    <div className="relative">
      {children}
      {isStamped && (
        <motion.div
          className="absolute -top-1 -right-1 translate-x-1/3 -translate-y-1/3 pointer-events-none"
          initial={{ scale: 0.85, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: -8, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <div className="bg-primary/10 border border-primary/70 text-primary px-2 py-0.5 rounded font-serif font-semibold text-[10px] md:text-xs shadow-sm">
            {stampText}
          </div>
        </motion.div>
      )}
    </div>
  )
}
