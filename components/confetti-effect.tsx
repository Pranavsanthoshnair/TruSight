"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ConfettiEffectProps {
  trigger: boolean
  onComplete?: () => void
}

export function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([])

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ["#dc2626", "#f97316", "#eab308", "#22c55e", "#3b82f6"][Math.floor(Math.random() * 5)],
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  if (!trigger || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ scale: 0, y: 0, rotate: 0 }}
          animate={{
            scale: [0, 1, 0],
            y: [0, -100, 100],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
