'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import Image from 'next/image'
import type { ActivityCard } from '@/lib/data/mock-activities'

interface SwipeCardProps {
  activity: ActivityCard
  onSwipe: (direction: 'left' | 'right' | 'down') => void
  onClick: () => void
  isTop: boolean
  direction?: 'left' | 'right' | 'down'
  className?: string
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

export default function SwipeCard({ activity, onSwipe, onClick, isTop, direction, className }: SwipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotate = useTransform(x, [-300, 300], [-18, 18])
  const opacity = useTransform(x, [-300, 0, 300], [0.4, 1, 0.4])

  // Direction indicators opacity
  const dislikeOpacity = useTransform(x, [-20, -100], [0, 1])
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const favoriteOpacity = useTransform(y, [20, 100], [0, 1])

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

  const dragProps = isTop
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
      onClick={() => isTop && onClick()}
      className={`absolute inset-0 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl ${className || ''}`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit={exitVariant}
      transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }}
    >
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
            className="absolute top-16 left-8 z-20 border-4 border-red-400 rounded-xl px-4 py-2"
            style={{ opacity: dislikeOpacity, color: '#ff6b6b', fontWeight: 700, fontSize: 28, letterSpacing: 2 }}
          >
            ✕
          </motion.div>
          <motion.div
            className="absolute top-16 right-8 z-20 border-4 border-emerald-400 rounded-xl px-4 py-2"
            style={{ opacity: likeOpacity, color: '#34d399', fontWeight: 700, fontSize: 28, letterSpacing: 2 }}
          >
            ♥
          </motion.div>
          <motion.div
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 border-4 border-amber-400 rounded-xl px-4 py-2"
            style={{ opacity: favoriteOpacity, color: '#fbbf24', fontWeight: 700, fontSize: 28, letterSpacing: 2 }}
          >
            ★ 收藏
          </motion.div>
        </>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex gap-2 mb-3 flex-wrap">
          {activity.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-ui"
              style={{ background: 'rgba(245,241,234,0.12)', color: 'rgba(245,241,234,0.8)', border: '1px solid rgba(245,241,234,0.1)' }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h3
          className="font-serif mb-1"
          style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 500, color: '#f5f1ea', lineHeight: 1.3 }}
        >
          {activity.title}
        </h3>
        <p className="font-ui text-sm mb-3" style={{ color: 'rgba(245,241,234,0.6)' }}>
          {activity.location} · {activity.host} · {activity.duration}
        </p>
        <p className="font-ui text-sm mb-4" style={{ color: 'rgba(245,241,234,0.5)', lineHeight: 1.6 }}>
          {activity.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg" style={{ color: '#c9a96e', fontWeight: 500 }}>
            ¥{activity.price}
          </span>
          <span className="font-ui text-xs" style={{ color: 'rgba(245,241,234,0.35)' }}>
            最多 {activity.maxPeople} 人
          </span>
        </div>
      </div>
    </motion.div>
  )
}
