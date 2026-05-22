'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SwipeCard from './SwipeCard'
import type { ActivityCard } from '@/lib/data/mock-activities'

interface CardStackProps {
  cards: ActivityCard[]
  onShowAll: () => void
  onShowSaved?: (savedIds: string[]) => void
  onNavigateToHost?: () => void
}

type SwipeAction = { id: string; direction: 'left' | 'right' | 'down' }

export default function CardStack({ cards, onShowAll, onShowSaved, onNavigateToHost }: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [actions, setActions] = useState<SwipeAction[]>([])
  const [exitingDirection, setExitingDirection] = useState<'left' | 'right' | 'down'>('left')
  const [showSaved, setShowSaved] = useState(false)
  const [showAdopted, setShowAdopted] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = cards[currentIndex]
  const nextCard = cards[currentIndex + 1]
  const thirdCard = cards[currentIndex + 2]

  // Reset flip when card changes
  useEffect(() => {
    setIsFlipped(false)
  }, [currentIndex])

  const recordAction = useCallback((direction: 'left' | 'right' | 'down') => {
    if (currentCard) {
      setActions((prev) => [...prev, { id: currentCard.id, direction }])
    }
  }, [currentCard])

  const advanceCard = useCallback(() => {
    setTimeout(() => {
      setCurrentIndex((i) => i + 1)
    }, 80)
  }, [])

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'down') => {
    if (!currentCard) return
    setExitingDirection(direction)
    recordAction(direction)
    advanceCard()
  }, [currentCard, recordAction, advanceCard])

  const handleDislike = () => {
    setExitingDirection('left')
    recordAction('left')
    advanceCard()
  }

  const handleSave = () => {
    setShowSaved(true)
    setTimeout(() => {
      setShowSaved(false)
      setExitingDirection('down')
      recordAction('down')
      advanceCard()
    }, 600)
  }

  const handleLikeDetail = () => {
    setShowAdopted(true)
    setTimeout(() => {
      setShowAdopted(false)
      setIsFlipped(true)
    }, 600)
  }

  const handleFlipBack = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setExitingDirection('right')
      recordAction('right')
      advanceCard()
    }, 500)
  }

  const buttonsDisabled = isFlipped || showSaved || showAdopted

  if (!currentCard) {
    const savedIds = actions.filter((a) => a.direction === 'down').map((a) => a.id)
    const hasSaved = savedIds.length > 0

    return (
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 100%)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center w-full max-w-sm"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-6 md:mb-8 flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
            <span className="text-2xl md:text-3xl">✦</span>
          </div>
          <h2 className="font-serif mb-3 md:mb-4" style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 300, color: '#f5f1ea' }}>
            已经浏览完毕
          </h2>
          <p className="font-ui mb-6 md:mb-8" style={{ color: 'rgba(245,241,234,0.45)', fontSize: 14 }}>
            共浏览 {actions.length} 个体验，收藏 {savedIds.length} 个
          </p>

          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onShowAll}
              className="w-full font-ui text-sm tracking-wider rounded-full"
              style={{ padding: '12px 24px', background: '#c9a96e', color: '#2d2a26', border: 'none', cursor: 'pointer' }}
            >
              展示全部结果
            </motion.button>

            {hasSaved && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onShowSaved?.(savedIds)}
                className="w-full font-ui text-sm tracking-wider rounded-full"
                style={{ padding: '12px 24px', background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)', cursor: 'pointer' }}
              >
                展示收藏的结果 ({savedIds.length})
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNavigateToHost}
              className="w-full font-ui text-sm tracking-wider rounded-full"
              style={{ padding: '12px 24px', background: 'transparent', color: 'rgba(245,241,234,0.6)', border: '1px solid rgba(245,241,234,0.15)', cursor: 'pointer' }}
            >
              没有需要的结果，我要提出需求
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNavigateToHost}
              className="w-full font-ui text-sm tracking-wider rounded-full"
              style={{ padding: '12px 24px', background: 'rgba(52,211,153,0.08)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)', cursor: 'pointer' }}
            >
              我想完善共创这个需求 →
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-[#2d2a26] to-[#3a3630] pt-20 md:pt-24 pb-24 md:pb-28">
      {/* Card container */}
      <div
        className="relative w-[90%] sm:w-[85%] md:w-full mx-auto transition-all duration-500 ease-out"
        style={{
          height: 'calc(100vh - 210px)',
          maxHeight: isFlipped ? 560 : 520,
          maxWidth: isFlipped ? 460 : 400,
        }}
      >
        {/* Third layer */}
        {thirdCard && (
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              transform: 'scale(0.92) translateY(20px)',
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
              transform: 'scale(0.96) translateY(10px)',
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
              onClick={() => {}}
              onFlipBack={handleFlipBack}
              isTop={true}
              direction={exitingDirection}
              isFlipped={isFlipped}
              className="z-[3]"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action buttons */}
      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3.5 md:gap-4 z-50 px-4 py-2.5 md:px-5 md:py-3 rounded-full backdrop-blur-xl border border-[rgba(245,241,234,0.08)]"
        style={{ background: 'rgba(45,42,38,0.75)' }}
      >
        {/* Saved toast overlay */}
        <AnimatePresence>
          {showSaved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center rounded-full z-20"
              style={{ background: 'rgba(251,191,36,0.92)' }}
            >
              <span className="font-ui text-sm font-medium" style={{ color: '#2d2a26' }}>已收藏</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Adopted toast overlay */}
        <AnimatePresence>
          {showAdopted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center rounded-full z-20"
              style={{ background: 'rgba(52,211,153,0.92)' }}
            >
              <span className="font-ui text-sm font-medium" style={{ color: '#2d2a26' }}>已采纳</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={buttonsDisabled ? {} : { scale: 1.12 }}
          whileTap={buttonsDisabled ? {} : { scale: 0.88 }}
          onClick={() => !buttonsDisabled && handleDislike()}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl disabled:opacity-40"
          style={{ background: 'rgba(255,107,107,0.15)', border: '2px solid rgba(255,107,107,0.3)', color: '#ff6b6b' }}
          disabled={buttonsDisabled}
        >
          ✕
        </motion.button>
        <motion.button
          whileHover={buttonsDisabled ? {} : { scale: 1.12 }}
          whileTap={buttonsDisabled ? {} : { scale: 0.88 }}
          onClick={() => !buttonsDisabled && handleSave()}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg disabled:opacity-40"
          style={{ background: 'rgba(251,191,36,0.12)', border: '2px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}
          disabled={buttonsDisabled}
        >
          ★
        </motion.button>
        <motion.button
          whileHover={buttonsDisabled ? {} : { scale: 1.12 }}
          whileTap={buttonsDisabled ? {} : { scale: 0.88 }}
          onClick={() => !buttonsDisabled && handleLikeDetail()}
          className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl disabled:opacity-40"
          style={{ background: 'rgba(52,211,153,0.12)', border: '2px solid rgba(52,211,153,0.3)', color: '#34d399' }}
          disabled={buttonsDisabled}
        >
          ✓
        </motion.button>
      </div>

      {/* Skip to list */}
      {!isFlipped && (
        <motion.button
          className="fixed bottom-[5.5rem] md:bottom-24 left-1/2 -translate-x-1/2 z-40 font-ui text-[11px] md:text-xs tracking-widest cursor-pointer"
          style={{ color: 'rgba(245,241,234,0.3)', background: 'none', border: 'none' }}
          whileHover={{ color: 'rgba(245,241,234,0.6)' }}
          onClick={onShowAll}
        >
          跳过，看全部结果 →
        </motion.button>
      )}

      {/* Counter */}
      <div className="fixed top-10 md:top-14 left-1/2 -translate-x-1/2 z-40 font-ui text-[11px] md:text-xs" style={{ color: 'rgba(245,241,234,0.3)' }}>
        {currentIndex + 1} / {cards.length}
      </div>
    </div>
  )
}
