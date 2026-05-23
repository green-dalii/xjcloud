'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { TravelPlan, PlanDay, PlanCategory, PlanItem } from '@/lib/data/mock-travel-plan'

interface PlanResultProps {
  plan: TravelPlan
  onBack: () => void
}

/* ─── Category Section ─── */

function CategorySection({ category }: { category: PlanCategory }) {
  return (
    <div className="mb-5">
      {/* Category header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{category.icon}</span>
        <span
          className="font-ui text-xs tracking-[0.15em] uppercase"
          style={{ color: 'var(--color-wheat)', fontWeight: 600 }}
        >
          {category.label}
        </span>
      </div>

      {/* Items grid */}
      <div className="grid gap-2.5">
        {category.items.map((item, i) => (
          <PlanItemCard key={i} item={item} />
        ))}
      </div>
    </div>
  )
}

/* ─── Item Card ─── */

function PlanItemCard({ item }: { item: PlanItem }) {
  return (
    <div
      className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: 'rgba(45, 42, 38, 0.4)',
        border: '1px solid rgba(245,241,234,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4
          className="font-ui font-medium"
          style={{
            fontSize: 14,
            color: 'var(--text-heading)',
            lineHeight: 1.4,
          }}
        >
          {item.title}
        </h4>
        {item.time !== '——' && (
          <span
            className="font-ui text-xs flex-shrink-0 px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(201,169,110,0.1)',
              color: 'var(--color-wheat)',
              whiteSpace: 'nowrap',
            }}
          >
            {item.time}
          </span>
        )}
      </div>
      <p
        className="font-ui text-sm mb-2"
        style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
      >
        {item.desc}
      </p>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {item.tags.map((tag, i) => (
            <span
              key={i}
              className="font-ui text-[11px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(201,169,110,0.1)',
                color: 'var(--color-wheat)',
                border: '1px solid rgba(201,169,110,0.15)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-start gap-1.5">
        <span className="font-ui text-xs mt-px flex-shrink-0" style={{ color: 'rgba(201,169,110,0.6)' }}>
          💡
        </span>
        <p
          className="font-ui text-xs"
          style={{ color: 'var(--text-dim)', lineHeight: 1.55 }}
        >
          {item.tips}
        </p>
      </div>
    </div>
  )
}

/* ─── Day Block ─── */

function DayBlock({ day, isFirst }: { day: PlanDay; isFirst: boolean }) {
  return (
    <motion.div
      className="relative pl-8 md:pl-10 pb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Vertical line */}
      {!isFirst && (
        <div
          className="absolute left-[11px] md:left-[15px] top-0 bottom-0 w-[1px]"
          style={{ background: 'var(--border-subtle)' }}
        />
      )}

      {/* Timeline node */}
      <div
        className="absolute left-0 md:left-1 top-0 w-[23px] h-[23px] md:w-[30px] md:h-[30px] rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: 'var(--bg-ink)',
          border: '2px solid var(--color-wheat)',
        }}
      >
        <div
          className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
          style={{ background: 'var(--color-wheat)' }}
        />
      </div>

      {/* Day header */}
      <div className="mb-5">
        <p
          className="font-ui text-xs tracking-[0.15em] uppercase mb-2"
          style={{ color: 'var(--color-wheat)', fontWeight: 500 }}
        >
          {day.dayLabel} · {day.weekday}
        </p>
        <p
          className="font-ui text-sm"
          style={{ color: 'var(--text-dim)' }}
        >
          {day.date}
        </p>
      </div>

      {/* Categories */}
      <div>
        {day.categories.map((cat, i) => (
          <CategorySection key={i} category={cat} />
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Save / Share Buttons ─── */

function ActionButtons({ plan }: { plan: TravelPlan }) {
  const [saved, setSaved] = useState(false)
  const [shared, setShared] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleShare = async () => {
    const text = `${plan.title}\n\n${plan.days.map((d) =>
      `${d.dayLabel} ${d.weekday}（${d.date}）\n${d.categories.map((c) =>
        `${c.icon} ${c.label}\n${c.items.map((i) => `  ${i.title}`).join('\n')}`
      ).join('\n')}`
    ).join('\n\n')}`

    if (navigator.share) {
      await navigator.share({ title: plan.title, text })
    }
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  const btnBase = {
    background: 'transparent',
    border: '1px solid rgba(245,241,234,0.12)',
    borderRadius: 50,
    padding: '10px 22px',
    cursor: 'pointer',
    fontFamily: 'var(--font-ui)',
    fontSize: 13,
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    gap: 6,
    transition: 'all 0.3s ease',
  }

  return (
    <div className="flex gap-3">
      <button onClick={handleSave} style={btnBase} className="hover:border-[var(--color-wheat)]">
        <span>{saved ? '✓' : '💾'}</span>
        <span style={{ color: saved ? 'var(--color-wheat)' : 'var(--text-secondary)' }}>
          {saved ? '已保存' : '保存方案'}
        </span>
      </button>
      <button onClick={handleShare} style={btnBase} className="hover:border-[var(--color-wheat)]">
        <span>{shared ? '✓' : '📤'}</span>
        <span style={{ color: shared ? 'var(--color-wheat)' : 'var(--text-secondary)' }}>
          {shared ? '已分享' : '分享方案'}
        </span>
      </button>
    </div>
  )
}

/* ─── Main ─── */

export default function PlanResult({ plan, onBack }: PlanResultProps) {
  return (
    <div className="max-w-[720px] mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="font-ui text-xs tracking-wider mb-6 transition-all duration-300 hover:underline inline-flex items-center gap-1"
        style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        ← 返回搜索
      </button>

      {/* Plan header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p
          className="font-ui text-[11px] tracking-[0.2em] uppercase mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          📋 AI 方案梳理
        </p>
        <h2
          className="font-serif mb-2"
          style={{
            fontSize: 'clamp(22px, 4vw, 30px)',
            fontWeight: 400,
            color: 'var(--text-heading)',
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          {plan.title}
        </h2>
        <p
          className="font-ui text-sm mb-5"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
        >
          {plan.subtitle}
        </p>
        <ActionButtons plan={plan} />
      </motion.div>

      {/* Days timeline */}
      <div className="relative">
        {plan.days.map((day, i) => (
          <DayBlock key={day.date} day={day} isFirst={i === 0} />
        ))}
      </div>

      {/* Footer actions */}
      <motion.div
        className="text-center pt-6 pb-8 mt-4"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p
          className="font-ui text-sm mb-4"
          style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}
        >
          方案仅供参考，具体安排可根据实际情况灵活调整
          <br />
          每个地点和店家建议出发前电话确认营业时间
        </p>
        <ActionButtons plan={plan} />
      </motion.div>
    </div>
  )
}
