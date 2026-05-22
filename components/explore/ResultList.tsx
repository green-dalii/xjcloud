'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import type { ActivityCard } from '@/lib/data/mock-activities'

interface ResultListProps {
  cards: ActivityCard[]
  onBack: () => void
}

export default function ResultList({ cards, onBack }: ResultListProps) {
  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="sticky top-0 z-30" style={{ background: 'rgba(245,241,234,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="font-ui text-sm cursor-pointer"
            style={{ color: 'var(--color-moss)', background: 'none', border: 'none' }}
          >
            ← 返回卡片模式
          </button>
          <span className="font-ui text-xs" style={{ color: 'var(--color-stone)' }}>
            共 {cards.length} 个体验
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer rounded-xl overflow-hidden"
              style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {card.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-[11px] font-ui"
                      style={{ background: 'rgba(45,42,38,0.65)', color: 'rgba(245,241,234,0.9)', backdropFilter: 'blur(4px)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <p className="font-ui text-xs tracking-wider mb-1" style={{ color: 'var(--color-stone)', textTransform: 'uppercase' }}>
                  {card.location} · {card.host}
                </p>
                <h3 className="font-serif mb-2" style={{ fontSize: 17, fontWeight: 500, color: 'var(--color-moss)', lineHeight: 1.4 }}>
                  {card.title}
                </h3>
                <p className="font-ui text-sm mb-3" style={{ color: 'var(--color-stone)', lineHeight: 1.6 }}>
                  {card.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg" style={{ color: 'var(--color-wheat)', fontWeight: 500 }}>
                    ¥{card.price}
                  </span>
                  <span className="font-ui text-xs" style={{ color: 'var(--color-stone)' }}>
                    {card.duration} · 最多{card.maxPeople}人
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
