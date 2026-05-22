'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import Image from 'next/image'
import type { ActivityCard } from '@/lib/data/mock-activities'

interface SwipeCardProps {
  activity: ActivityCard
  onSwipe: (direction: 'left' | 'right' | 'down') => void
  onClick: () => void
  onFlipBack?: () => void
  isTop: boolean
  direction?: 'left' | 'right' | 'down'
  className?: string
  isFlipped?: boolean
}

const SWIPE_THRESHOLD = 120
const SWIPE_VELOCITY = 500

const cardVariants = {
  initial: { scale: 0.9, opacity: 0, y: 40 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exitLeft: { x: -800, y: 0, rotate: -35, opacity: 0 },
  exitRight: { x: 800, y: 0, rotate: 35, opacity: 0 },
  exitDown: { x: 0, y: 800, rotate: 0, opacity: 0 },
}

export default function SwipeCard({
  activity,
  onSwipe,
  onClick,
  onFlipBack,
  isTop,
  direction,
  className,
  isFlipped = false,
}: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isPressed, setIsPressed] = useState(false)

  const rotate = useTransform(x, [-300, 300], [-18, 18])
  const opacity = useTransform(x, [-300, 0, 300], [0.4, 1, 0.4])

  // Direction indicators opacity
  const dislikeOpacity = useTransform(x, [-20, -100], [0, 1])
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const favoriteOpacity = useTransform(y, [20, 100], [0, 1])

  // Reset position when flipped
  useEffect(() => {
    if (isFlipped) {
      x.set(0)
      y.set(0)
      setIsPressed(true)
      const t = setTimeout(() => setIsPressed(false), 120)
      return () => clearTimeout(t)
    }
  }, [isFlipped, x, y])

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const { offset, velocity } = info

    if (offset.y > SWIPE_THRESHOLD && velocity.y > 200) {
      onSwipe('down')
    } else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
      onSwipe('right')
    } else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
      onSwipe('left')
    }
  }

  const dragProps = isTop && !isFlipped
    ? {
        drag: true as const,
        dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
        dragElastic: 0.9,
        onDragEnd: handleDragEnd,
      }
    : {}

  const exitVariant = direction === 'right' ? 'exitRight' : direction === 'down' ? 'exitDown' : 'exitLeft'

  return (
    <motion.div
      ref={cardRef}
      style={{ x, y, rotate, opacity, touchAction: 'none' }}
      {...dragProps}
      onTap={() => isTop && !isFlipped && onClick()}
      className={`absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl ${className || ''}`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit={exitVariant}
      transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }}
    >
      {/* 3D flip wrapper */}
      <div className="w-full h-full" style={{ perspective: 1000 }}>
        <motion.div
          animate={{
            rotateY: isFlipped ? 180 : 0,
            scale: isPressed ? 0.92 : 1,
          }}
          transition={{
            rotateY: { type: 'spring', stiffness: 180, damping: 20 },
            scale: { type: 'spring', stiffness: 500, damping: 25 },
          }}
          style={{ transformStyle: 'preserve-3d' }}
          className="w-full h-full relative"
        >
          {/* Front face */}
          <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          {/* Image */}
          <div className="absolute inset-0">
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              className="object-cover"
              draggable={false}
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(45,42,38,0.1) 0%, rgba(45,42,38,0.3) 50%, rgba(45,42,38,0.85) 100%)',
              }}
            />
          </div>

          {/* Direction indicators */}
          {isTop && (
            <>
              <motion.div
                className="absolute top-10 left-5 z-20 border-[3px] border-red-400 rounded-xl px-3 py-1 md:top-14 md:left-7 md:px-4 md:py-1.5"
                style={{ opacity: dislikeOpacity, color: '#ff6b6b', fontWeight: 700, fontSize: 22, letterSpacing: 2 }}
              >
                ✕
              </motion.div>
              <motion.div
                className="absolute top-10 right-5 z-20 border-[3px] border-emerald-400 rounded-xl px-3 py-1 md:top-14 md:right-7 md:px-4 md:py-1.5"
                style={{ opacity: likeOpacity, color: '#34d399', fontWeight: 700, fontSize: 22, letterSpacing: 2 }}
              >
                ✓
              </motion.div>
              <motion.div
                className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 border-[3px] border-amber-400 rounded-xl px-3 py-1 md:bottom-28 md:px-4 md:py-1.5"
                style={{ opacity: favoriteOpacity, color: '#fbbf24', fontWeight: 700, fontSize: 22, letterSpacing: 2 }}
              >
                ★ 收藏
              </motion.div>
            </>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
            <div className="flex gap-2 mb-2 md:mb-3 flex-wrap">
              {activity.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[11px] font-ui"
                  style={{ background: 'rgba(245,241,234,0.12)', color: 'rgba(245,241,234,0.8)', border: '1px solid rgba(245,241,234,0.1)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3
              className="font-serif mb-1"
              style={{ fontSize: 'clamp(17px, 4vw, 26px)', fontWeight: 500, color: '#f5f1ea', lineHeight: 1.3 }}
            >
              {activity.title}
            </h3>
            <p className="font-ui text-xs md:text-sm mb-2 md:mb-3" style={{ color: 'rgba(245,241,234,0.6)' }}>
              {activity.location} · {activity.host} · {activity.duration}
            </p>
            <p className="font-ui text-xs md:text-sm mb-3 md:mb-4" style={{ color: 'rgba(245,241,234,0.5)', lineHeight: 1.6 }}>
              {activity.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-display text-base md:text-lg" style={{ color: '#c9a96e', fontWeight: 500 }}>
                ¥{activity.price}
              </span>
              <span className="font-ui text-[11px] md:text-xs" style={{ color: 'rgba(245,241,234,0.35)' }}>
                最多 {activity.maxPeople} 人
              </span>
            </div>
          </div>
        </div>

        {/* Back face - Detail */}
        <div
          className="absolute inset-0 rounded-2xl flex flex-col"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', background: '#2d2a26' }}
          onClick={() => isTop && onFlipBack?.()}
        >
          {/* Image header */}
          <div className="relative h-32 md:h-40 shrink-0">
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              className="object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2d2a26]" />

            {/* 已采纳印章 */}
            <motion.div
              initial={{ opacity: 0, scale: 1.6, rotate: 25 }}
              animate={{ opacity: 1, scale: 1, rotate: -10 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 180, damping: 12 }}
              className="absolute top-4 right-4 md:top-5 md:right-5 z-20 flex items-center justify-center rounded-full border-[2.5px] border-dashed"
              style={{
                width: 72,
                height: 72,
                borderColor: 'rgba(52,211,153,0.5)',
                color: 'rgba(52,211,153,0.85)',
              }}
            >
              <div className="text-center leading-tight">
                <div className="text-base md:text-lg">✓</div>
                <div className="font-ui text-[9px] md:text-[10px] font-bold tracking-widest">已采纳</div>
              </div>
            </motion.div>
          </div>

          {/* Detail content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <h3
              className="font-serif mb-2"
              style={{ fontSize: 'clamp(17px, 4vw, 24px)', fontWeight: 500, color: '#f5f1ea', lineHeight: 1.3 }}
            >
              {activity.title}
            </h3>
            <p className="font-ui text-xs md:text-sm mb-3 md:mb-4" style={{ color: 'rgba(245,241,234,0.6)' }}>
              {activity.location} · {activity.host} · {activity.duration}
            </p>
            <p className="font-ui text-xs md:text-sm mb-4 md:mb-6" style={{ color: 'rgba(245,241,234,0.5)', lineHeight: 1.7 }}>
              {activity.description}
            </p>

            {/* Tags */}
            <div className="flex gap-2 mb-4 md:mb-6 flex-wrap">
              {activity.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[11px] font-ui"
                  style={{ background: 'rgba(245,241,234,0.1)', color: 'rgba(245,241,234,0.7)', border: '1px solid rgba(245,241,234,0.08)' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Info */}
            <div className="space-y-2 md:space-y-3 mb-5 md:mb-8">
              <div className="flex justify-between font-ui text-xs md:text-sm">
                <span style={{ color: 'rgba(245,241,234,0.4)' }}>价格</span>
                <span className="font-display text-sm md:text-base" style={{ color: '#c9a96e' }}>¥{activity.price}</span>
              </div>
              <div className="flex justify-between font-ui text-xs md:text-sm">
                <span style={{ color: 'rgba(245,241,234,0.4)' }}>人数上限</span>
                <span style={{ color: '#f5f1ea' }}>最多 {activity.maxPeople} 人</span>
              </div>
            </div>

            {/* Close button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onFlipBack?.() }}
              className="w-full py-2.5 md:py-3 rounded-full font-ui text-xs md:text-sm tracking-wider"
              style={{ background: '#c9a96e', color: '#2d2a26' }}
            >
              继续浏览
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  </motion.div>
  )
}
