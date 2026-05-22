'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const LOADING_TEXTS = [
  '正在分析你的偏好...',
  '正在为你匹配最合适的乡建体验...',
  '正在筛选优质活动...',
]

export default function LoadingScreen() {
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((i) => (i + 1) % LOADING_TEXTS.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 50%, #2d2a26 100%)' }}
    >
      {/* Spinner */}
      <motion.div
        className="relative w-16 h-16 md:w-20 md:h-20 mb-10 md:mb-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid transparent',
            borderTopColor: '#c9a96e',
            borderRightColor: 'rgba(201,169,110,0.3)',
          }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            border: '2px solid transparent',
            borderBottomColor: '#c9a96e',
            borderLeftColor: 'rgba(201,169,110,0.2)',
          }}
          animate={{ rotate: -720 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center dot */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ background: '#c9a96e' }}
        />
      </motion.div>

      {/* Animated text */}
      <div className="h-8 md:h-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-ui text-sm md:text-base text-center"
            style={{ color: 'rgba(245,241,234,0.6)' }}
          >
            {LOADING_TEXTS[textIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Decorative dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#c9a96e' }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}
