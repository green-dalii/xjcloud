'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ALL_ACTIVITIES, INTEREST_OPTIONS, INTEREST_TAG_MAP } from '@/lib/data/mock-activities'
import type { ActivityInterest, ActivityCard } from '@/lib/data/mock-activities'

function extractCity(location: string): string {
  return location.split(' · ')[0]
}

const CITIES = ['全部', ...Array.from(new Set(ALL_ACTIVITIES.map(a => extractCity(a.location))))]
const DURATIONS = ['全部', ...Array.from(new Set(ALL_ACTIVITIES.map(a => a.duration)))]

const PRICE_RANGES = [
  { label: '全部价格', min: 0, max: Infinity },
  { label: '¥200以下', min: 0, max: 200 },
  { label: '¥200-500', min: 200, max: 500 },
  { label: '¥500-1000', min: 500, max: 1000 },
  { label: '¥1000以上', min: 1000, max: Infinity },
]

type SortBy = 'default' | 'priceAsc' | 'priceDesc' | 'match'

function ActivityCardItem({ card, index }: { card: ActivityCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
        <p className="font-ui text-xs tracking-wider mb-1" style={{ color: '#7a7468', textTransform: 'uppercase' }}>
          {card.location} · {card.host}
        </p>
        <h3 className="font-serif mb-2" style={{ fontSize: 17, fontWeight: 500, color: '#3d5a3f', lineHeight: 1.4 }}>
          {card.title}
        </h3>
        <p className="font-ui text-sm mb-3" style={{ color: '#7a7468', lineHeight: 1.6 }}>
          {card.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg" style={{ color: '#c9a96e', fontWeight: 500 }}>
            ¥{card.price}
          </span>
          <span className="font-ui text-xs" style={{ color: '#7a7468' }}>
            {card.duration} · 最多{card.maxPeople}人
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function ActivitiesPage() {
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('全部')
  const [durationFilter, setDurationFilter] = useState('全部')
  const [interestFilters, setInterestFilters] = useState<ActivityInterest[]>([])
  const [priceFilterIdx, setPriceFilterIdx] = useState(0)
  const [sortBy, setSortBy] = useState<SortBy>('default')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const sortRef = useRef<HTMLDivElement>(null)

  // Detect mobile/desktop
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggleInterest = useCallback((value: ActivityInterest) => {
    setInterestFilters(prev =>
      prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
    )
  }, [])

  // Active filter pills (excluding "全部" defaults)
  const activePills = useMemo(() => {
    const pills: { label: string; onClear: () => void }[] = []
    if (cityFilter !== '全部') pills.push({ label: cityFilter, onClear: () => setCityFilter('全部') })
    if (durationFilter !== '全部') pills.push({ label: durationFilter, onClear: () => setDurationFilter('全部') })
    if (priceFilterIdx !== 0) pills.push({ label: PRICE_RANGES[priceFilterIdx].label, onClear: () => setPriceFilterIdx(0) })
    interestFilters.forEach(v => {
      const opt = INTEREST_OPTIONS.find(o => o.value === v)
      if (opt) pills.push({ label: opt.label, onClear: () => toggleInterest(v) })
    })
    return pills
  }, [cityFilter, durationFilter, priceFilterIdx, interestFilters, toggleInterest])

  const hasPanelFilters = durationFilter !== '全部' || interestFilters.length > 0 || priceFilterIdx !== 0

  const filtered = useMemo(() => {
    let result = ALL_ACTIVITIES.filter(a => {
      if (cityFilter !== '全部' && !a.location.startsWith(cityFilter)) return false
      if (durationFilter !== '全部' && a.duration !== durationFilter) return false
      if (interestFilters.length > 0) {
        const allTags = interestFilters.flatMap(i => INTEREST_TAG_MAP[i] || [])
        if (!a.tags.some(t => allTags.includes(t))) return false
      }
      const range = PRICE_RANGES[priceFilterIdx]
      if (a.price < range.min || a.price >= range.max) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        const text = `${a.title} ${a.location} ${a.host} ${a.description} ${a.tags.join(' ')}`.toLowerCase()
        if (!text.includes(q)) return false
      }
      return true
    })

    if (sortBy === 'priceAsc') result = [...result].sort((a, b) => a.price - b.price)
    if (sortBy === 'priceDesc') result = [...result].sort((a, b) => b.price - a.price)
    if (sortBy === 'match') result = [...result].sort((a, b) => b.matchScore - a.matchScore)

    return result
  }, [cityFilter, durationFilter, interestFilters, priceFilterIdx, search, sortBy])

  const clearAll = useCallback(() => {
    setSearch('')
    setCityFilter('全部')
    setDurationFilter('全部')
    setInterestFilters([])
    setPriceFilterIdx(0)
    setSortBy('default')
  }, [])

  const clearPanelFilters = useCallback(() => {
    setDurationFilter('全部')
    setInterestFilters([])
    setPriceFilterIdx(0)
  }, [])

  const sortLabel: Record<SortBy, string> = {
    default: '综合排序',
    priceAsc: '价格从低到高',
    priceDesc: '价格从高到低',
    match: '匹配度',
  }

  return (
    <div className="min-h-screen" style={{ background: '#f5f1ea' }}>
      {/* ── Sticky header ── */}
      <div
        className="sticky top-0 z-30"
        style={{ background: 'rgba(245,241,234,0.95)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(45,42,38,0.06)' }}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          {/* Title row */}
          <div className="flex items-center justify-between py-3 md:py-4">
            <div className="flex items-center gap-3">
              <Link
                href="/explore"
                className="font-ui text-sm cursor-pointer shrink-0"
                style={{ color: '#3d5a3f', textDecoration: 'none' }}
              >
                ← 返回探索
              </Link>
              <h1 className="font-serif hidden md:block" style={{ fontSize: 18, fontWeight: 500, color: '#2d2a26' }}>
                全部体验
              </h1>
            </div>
            <span className="font-ui text-xs" style={{ color: '#7a7468' }}>
              共 {filtered.length} 个
            </span>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#7a7468' }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索活动名称、地点或关键词"
              className="w-full py-2.5 pl-10 pr-4 rounded-xl font-ui text-sm transition-all duration-200"
              style={{
                background: 'rgba(45,42,38,0.04)',
                border: '1.5px solid rgba(45,42,38,0.08)',
                color: '#2d2a26',
                outline: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(201,169,110,0.4)'; e.target.style.background = 'rgba(45,42,38,0.02)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(45,42,38,0.08)'; e.target.style.background = 'rgba(45,42,38,0.04)' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs cursor-pointer"
                style={{ color: '#7a7468' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* City tabs — primary category, always visible */}
          <div className="flex gap-1 pb-3 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {CITIES.map(city => {
              const active = cityFilter === city
              return (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className="shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-ui transition-all duration-200 cursor-pointer"
                  style={{
                    background: active ? '#2d2a26' : 'transparent',
                    color: active ? '#f5f1ea' : '#7a7468',
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {city}
                </button>
              )
            })}
          </div>

          {/* Sort + Filter row */}
          <div className="flex items-center justify-between pb-3">
            {/* Sort dropdown */}
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1 font-ui text-xs cursor-pointer py-1.5 px-3 rounded-lg transition-colors duration-200"
                style={{
                  color: '#7a7468',
                  background: showSortDropdown ? 'rgba(45,42,38,0.06)' : 'transparent',
                  border: 'none',
                }}
              >
                {sortLabel[sortBy]}
                <span style={{ fontSize: 10, transform: showSortDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
              </button>
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-20"
                    style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', minWidth: 140 }}
                  >
                    {(Object.keys(sortLabel) as SortBy[]).map(k => (
                      <button
                        key={k}
                        onClick={() => { setSortBy(k); setShowSortDropdown(false) }}
                        className="w-full text-left px-4 py-2.5 font-ui text-xs cursor-pointer transition-colors duration-150"
                        style={{
                          color: sortBy === k ? '#c9a96e' : '#2d2a26',
                          fontWeight: sortBy === k ? 500 : 400,
                          background: sortBy === k ? 'rgba(201,169,110,0.08)' : 'transparent',
                          border: 'none',
                        }}
                      >
                        {sortLabel[k]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter button + clear */}
            <div className="flex items-center gap-2">
              {activePills.length > 0 && (
                <button
                  onClick={clearAll}
                  className="font-ui text-xs cursor-pointer py-1 px-2 rounded-md"
                  style={{ color: '#c9a96e', background: 'rgba(201,169,110,0.06)', border: 'none' }}
                >
                  清除全部
                </button>
              )}
              <button
                onClick={() => setShowFilterPanel(true)}
                className="flex items-center gap-1.5 font-ui text-xs cursor-pointer py-1.5 px-3 rounded-lg transition-colors duration-200"
                style={{
                  color: hasPanelFilters ? '#c9a96e' : '#7a7468',
                  background: hasPanelFilters ? 'rgba(201,169,110,0.1)' : 'rgba(45,42,38,0.04)',
                  border: hasPanelFilters ? '1px solid rgba(201,169,110,0.25)' : '1px solid rgba(45,42,38,0.08)',
                }}
              >
                筛选
                {hasPanelFilters && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a96e' }} />}
              </button>
            </div>
          </div>

          {/* Active filter pills */}
          <AnimatePresence>
            {activePills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap gap-2 pb-3 overflow-hidden"
              >
                {activePills.map((pill, i) => (
                  <motion.button
                    key={`${pill.label}-${i}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    onClick={pill.onClear}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full font-ui text-xs cursor-pointer"
                    style={{
                      background: 'rgba(201,169,110,0.1)',
                      color: '#c9a96e',
                      border: '1px solid rgba(201,169,110,0.2)',
                    }}
                  >
                    {pill.label}
                    <span style={{ fontSize: 10, opacity: 0.7 }}>✕</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Filter panel overlay (mobile: bottom sheet, desktop: right drawer) ── */}
      <AnimatePresence>
        {showFilterPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.35)' }}
              onClick={() => setShowFilterPanel(false)}
            />
            {/* Panel */}
            <motion.div
              initial={isMobile ? { y: '100%' } : { x: '100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={isMobile
                ? 'fixed bottom-0 left-0 right-0 z-50'
                : 'fixed top-0 right-0 bottom-0 z-50 w-[360px]'
              }
              style={{
                background: '#f5f1ea',
                borderRadius: isMobile ? '20px 20px 0 0' : 0,
                maxHeight: isMobile ? '85vh' : '100vh',
                overflowY: 'auto',
              }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(45,42,38,0.15)' }} />
              </div>

              {/* Panel header */}
              <div className="flex items-center justify-between px-5 pt-2 pb-4">
                <h2 className="font-serif" style={{ fontSize: 18, fontWeight: 500, color: '#2d2a26' }}>
                  筛选条件
                </h2>
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ background: 'rgba(45,42,38,0.06)', border: 'none', color: '#7a7468' }}
                >
                  ✕
                </button>
              </div>

              {/* Duration */}
              <div className="px-5 pb-5" style={{ borderBottom: '1px solid rgba(45,42,38,0.06)' }}>
                <p className="font-ui text-xs tracking-wider mb-3" style={{ color: '#7a7468' }}>时间</p>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map(dur => (
                    <button
                      key={dur}
                      onClick={() => setDurationFilter(dur)}
                      className="px-3 py-1.5 rounded-lg font-ui text-xs cursor-pointer transition-all duration-150"
                      style={{
                        background: durationFilter === dur ? '#2d2a26' : 'rgba(45,42,38,0.04)',
                        color: durationFilter === dur ? '#f5f1ea' : '#7a7468',
                        border: 'none',
                      }}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest */}
              <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(45,42,38,0.06)' }}>
                <p className="font-ui text-xs tracking-wider mb-3" style={{ color: '#7a7468' }}>风格方向（可多选）</p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => toggleInterest(opt.value)}
                      className="px-3 py-1.5 rounded-lg font-ui text-xs cursor-pointer transition-all duration-150"
                      style={{
                        background: interestFilters.includes(opt.value) ? 'rgba(201,169,110,0.12)' : 'rgba(45,42,38,0.04)',
                        color: interestFilters.includes(opt.value) ? '#c9a96e' : '#7a7468',
                        border: interestFilters.includes(opt.value) ? '1.5px solid rgba(201,169,110,0.35)' : '1.5px solid transparent',
                      }}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(45,42,38,0.06)' }}>
                <p className="font-ui text-xs tracking-wider mb-3" style={{ color: '#7a7468' }}>价格区间</p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_RANGES.map((range, idx) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceFilterIdx(idx)}
                      className="px-3 py-1.5 rounded-lg font-ui text-xs cursor-pointer transition-all duration-150"
                      style={{
                        background: priceFilterIdx === idx ? '#2d2a26' : 'rgba(45,42,38,0.04)',
                        color: priceFilterIdx === idx ? '#f5f1ea' : '#7a7468',
                        border: 'none',
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel footer buttons */}
              <div className="sticky bottom-0 px-5 py-4 flex gap-3" style={{ background: '#f5f1ea', borderTop: '1px solid rgba(45,42,38,0.06)' }}>
                <button
                  onClick={clearPanelFilters}
                  className="flex-1 py-3 rounded-full font-ui text-sm cursor-pointer"
                  style={{
                    color: '#7a7468',
                    background: 'rgba(45,42,38,0.04)',
                    border: '1px solid rgba(45,42,38,0.1)',
                  }}
                >
                  重置
                </button>
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="flex-[2] py-3 rounded-full font-ui text-sm cursor-pointer"
                  style={{
                    color: '#2d2a26',
                    background: '#c9a96e',
                    border: 'none',
                  }}
                >
                  查看 {filtered.length} 个结果
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Results grid ── */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-3xl mb-4">🔍</span>
            <p className="font-serif text-lg mb-2" style={{ color: '#7a7468' }}>
              没有找到符合条件的体验
            </p>
            <button
              onClick={clearAll}
              className="font-ui text-sm cursor-pointer px-6 py-2 rounded-full mt-2"
              style={{ color: '#c9a96e', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}
            >
              清除全部条件
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((card, i) => (
              <ActivityCardItem key={card.id} card={card} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
