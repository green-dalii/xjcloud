'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SwipeCard from './SwipeCard'
import type { ActivityCard } from '@/lib/data/mock-activities'

interface CardStackProps {
  cards: ActivityCard[]
  onShowAll: () => void
}

type SwipeAction = { id: string; direction: 'left' | 'right' | 'down' }

export default function CardStack({ cards, onShowAll }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [actions, setActions] = useState<SwipeAction[]>([])
  const [exitingDirection, setExitingDirection] = useState<'left' | 'right' | 'down'>('left')

  const currentCard = cards[currentIndex]
  const nextCard = cards[currentIndex + 1]
  const thirdCard = cards[currentIndex + 2]

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'down') => {
    if (!currentCard) return
    setExitingDirection(direction)
    setActions((prev) => [...prev, { id: currentCard.id, direction }])
    // Delay index update to let exit animation play
    setTimeout(() => {
      setCurrentIndex((i) => i + 1)
    }, 80)
  }, [currentCard])

  const handleButtonSwipe = (direction: 'left' | 'right' | 'down') => {
    setExitingDirection(direction)
    if (currentCard) {
      setActions((prev) => [...prev, { id: currentCard.id, direction }])
    }
    setTimeout(() => {
      setCurrentIndex((i) => i + 1)
    }, 80)
  }

  const handleClick = useCallback(() => {
    // Like + navigate to detail (for now just log)
    if (currentCard) {
      console.log('View detail:', currentCard.id)
    }
  }, [currentCard])

  if (!currentCard) {
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 100%)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
            <span className="text-3xl">✦</span>
          </div>
          <h2 className="font-serif mb-4" style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, color: '#f5f1ea' }}>
            已经浏览完毕
          </h2>
          <p className="font-ui mb-10" style={{ color: 'rgba(245,241,234,0.45)', fontSize: 14 }}>
            共浏览 {actions.length} 个体验，收藏 {actions.filter(a => a.direction === 'down').length} 个
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShowAll}
            className="font-ui text-sm tracking-wider rounded-full"
            style={{ padding: '14px 36px', background: '#c9a96e', color: '#2d2a26', border: 'none', cursor: 'pointer' }}
          >
            展示全部结果
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center" style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 100%)', paddingTop: 80, paddingBottom: 140 }}>
      {/* Card container */}
      <div className="relative w-full max-w-md mx-auto" style={{ height: 'calc(100vh - 220px)', maxHeight: 640 }}>
        {/* Third layer */}
        {thirdCard && (
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              transform: 'scale(0.92) translateY(24px)',
              opacity: 0.35,
              background: '#3a3630',
              zIndex: 1,
            }}
          />
        )}

        {/* Second layer */}
        {nextCard && (
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              transform: 'scale(0.96) translateY(12px)',
              opacity: 0.65,
              zIndex: 2,
            }}
          >
            <SwipeCard activity={nextCard} onSwipe={() => {}} onClick={() => {}} isTop={false} />
          </div>
        )}

        {/* Top layer */}
        <AnimatePresence mode="popLayout">
          {currentCard && (
            <SwipeCard
              key={currentCard.id}
              activity={currentCard}
              onSwipe={handleSwipe}
              onClick={handleClick}
              isTop={true}
              direction={exitingDirection}
              className="z-[3]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action buttons */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-50"
        style={{ padding: '16px 28px', borderRadius: 60, background: 'rgba(45,42,38,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(245,241,234,0.08)' }}>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleButtonSwipe('left')}
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl"
          style={{ background: 'rgba(255,107,107,0.15)', border: '2px solid rgba(255,107,107,0.3)', color: '#ff6b6b' }}
        >
          ✕
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleButtonSwipe('down')}
          className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
          style={{ background: 'rgba(251,191,36,0.12)', border: '2px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}
        >
          ★
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleButtonSwipe('right')}
          className="w-14 h-14 rounded-full flex items-center justify-center text-xl"
          style={{ background: 'rgba(52,211,153,0.12)', border: '2px solid rgba(52,211,153,0.3)', color: '#34d399' }}
        >
          ♥
        </motion.button>
      </div>

      {/* Skip to list */}
      <motion.button
        className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 font-ui text-xs tracking-widest cursor-pointer"
        style={{ color: 'rgba(245,241,234,0.3)', background: 'none', border: 'none' }}
        whileHover={{ color: 'rgba(245,241,234,0.6)' }}
        onClick={onShowAll}
      >
        跳过，看全部结果 →
      </motion.button>

      {/* Counter */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 font-ui text-xs" style={{ color: 'rgba(245,241,234,0.3)' }}>
        {currentIndex + 1} / {cards.length}
      </div>
    </div>
  )
}
