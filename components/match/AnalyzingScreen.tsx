'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { LOADING_MESSAGES } from '@/lib/data/mock-travel-plan'

interface AnalyzingScreenProps {
  query: string
  onComplete: () => void
  /** Duration in ms before auto-transition (default 4000) */
  duration?: number
}

export default function AnalyzingScreen({ query, onComplete, duration = 4000 }: AnalyzingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    // Cycle messages every 2s
    const msgCycle = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 2000)

    // Auto-transition after duration
    timerRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 500) // after fade-out
    }, duration)

    return () => {
      clearInterval(msgCycle)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [duration, onComplete])

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 md:py-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated ring spinner */}
      <div className="relative mb-10">
        <motion.div
          className="w-16 h-16 md:w-20 md:h-20 rounded-full"
          style={{
            border: '2px solid rgba(201,169,110,0.15)',
            borderTopColor: 'var(--color-wheat)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 md:inset-3 rounded-full"
          style={{
            border: '2px solid rgba(201,169,110,0.08)',
            borderRightColor: 'rgba(201,169,110,0.5)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center emoji */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xl md:text-2xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌾
          </motion.span>
        </div>
      </div>

      {/* Title */}
      <motion.p
        className="font-serif text-center mb-5"
        style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          color: 'var(--text-heading)',
          fontWeight: 400,
          letterSpacing: '0.02em',
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        正在为你梳理
        <span style={{ color: 'var(--color-wheat)' }}>
          {query.length > 12 ? query.slice(0, 12) + '…' : query}
        </span>
        的方案
      </motion.p>

      {/* Rotating message */}
      <div className="h-12 flex items-center justify-center overflow-hidden">
        <motion.p
          key={msgIndex}
          className="font-ui text-sm md:text-base text-center"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
        >
          {LOADING_MESSAGES[msgIndex]}
        </motion.p>
      </div>

      {/* Subtle breathing dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--color-wheat)' }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
