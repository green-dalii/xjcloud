'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { ALL_ACTIVITIES, INTEREST_TAG_MAP } from '@/lib/data/mock-activities'
import type { ActivityCard } from '@/lib/data/mock-activities'

const ROTATING_PROMPTS = [
  '我想找一个能带家人一起的乡村手工艺体验...',
  '周末两天，希望去山里安静的地方住一晚...',
  '想学做陶艺或者蓝染，有没有合适的活动...',
  '想在春天去乡村看看油菜花，顺便体验农家乐...',
  '想找一群志同道合的朋友一起做乡村建设...',
  '想要带孩子去体验农活，认识大自然...',
  '工作太累了，想去乡下发呆、喝茶、晒太阳...',
  '想尝尝最地道的农家菜，顺便学几道拿手菜...',
]

function useRotatingPlaceholder(interval = 3000) {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const cycle = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATING_PROMPTS.length)
        setFade(true)
      }, 400)
    }, interval)
    return () => clearInterval(cycle)
  }, [interval])

  return { text: ROTATING_PROMPTS[index], fade }
}

function computeMatch(card: ActivityCard, relevantTags: Set<string>, userLocation: string): number {
  let score = 0

  if (relevantTags.size > 0) {
    const overlap = card.tags.filter((t) => relevantTags.has(t)).length
    score += overlap * 25
  }

  if (userLocation && card.location.includes(userLocation)) {
    score += 30
  }

  score += card.matchScore / 5

  return Math.min(score, 98)
}

/* ─── Dock Card Stack (macOS Dock style) ─── */

const CARD_ROTATIONS = [-2.5, 1.5, -1, 2, -1.5]
const CARD_Y_OFFSETS = [4, -2, 3, -3, 2]

function useWindowWidth() {
  const [width, setWidth] = useState(1200)
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth)
    handle()
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  return width
}

function DockCard({
  card,
  index,
  hoveredIndex,
  onHover,
  onLeave,
  isMobile,
}: {
  card: ActivityCard & { matchScore: number }
  index: number
  hoveredIndex: number | null
  onHover: (i: number) => void
  onLeave: () => void
  isMobile: boolean
}) {
  const distance = hoveredIndex !== null ? Math.abs(index - hoveredIndex) : 999
  const isHovered = hoveredIndex === index
  const isActive = hoveredIndex !== null

  const maxScale = isMobile ? 1.12 : 1.22
  const scaleStep = isMobile ? 0.04 : 0.06
  const maxY = isMobile ? 16 : 32
  const yStep = isMobile ? 6 : 10

  const scale = isActive ? Math.max(1, maxScale - distance * scaleStep) : 1
  const y = isActive ? Math.max(0, maxY - distance * yStep) : 0
  const rotate = isActive ? 0 : CARD_ROTATIONS[index] || 0
  const baseY = isActive ? 0 : CARD_Y_OFFSETS[index] || 0
  const zIndex = isActive ? 20 - distance : 10 - index

  const cardWidth = isMobile ? 100 : 170
  const cardHeight = isMobile ? 140 : 238
  const overlap = isMobile ? -36 : -50

  return (
    <motion.div
      className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
      style={{
        width: cardWidth,
        height: cardHeight,
        zIndex,
        marginLeft: index > 0 ? overlap : 0,
        transformOrigin: 'bottom center',
      }}
      animate={{
        scale,
        y: baseY - y,
        rotate,
      }}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 22,
        mass: 0.8,
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      {/* Glow ring on hover */}
      {isHovered && (
        <motion.div
          className="absolute -inset-[1px] rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(201,169,110,0.3), rgba(61,90,63,0.2))',
            filter: 'blur(8px)',
          }}
        />
      )}

      {/* Card body */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(45, 42, 38, 0.7)',
          border: isHovered
            ? '1px solid rgba(201,169,110,0.35)'
            : '1px solid rgba(245,241,234,0.06)',
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(201,169,110,0.1)'
            : '0 10px 30px -10px rgba(0,0,0,0.3)',
        }}
      >
        {/* Image */}
        <div className="relative h-[58%] overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${card.image})` }}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(45,42,38,0.85) 0%, rgba(45,42,38,0.2) 50%, transparent 100%)',
            }}
          />
          {/* Match badge */}
          <div
            className="absolute top-2 left-2 rounded-full px-2 py-0.5 font-ui"
            style={{
              fontSize: isMobile ? 9 : 11,
              background: 'rgba(45,42,38,0.7)',
              color: 'var(--color-wheat)',
              border: '1px solid rgba(201,169,110,0.3)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {card.matchScore}% 匹配
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 h-[42%] flex flex-col justify-between">
          <div>
            <p className="font-ui tracking-wider mb-0.5" style={{ fontSize: isMobile ? 9 : 10, color: 'var(--text-muted)' }}>
              {card.location}
            </p>
            <h3
              className="font-serif"
              style={{
                fontSize: isMobile ? 12 : 15,
                fontWeight: 500,
                color: isHovered ? 'var(--color-wheat)' : 'var(--text-heading)',
                lineHeight: 1.35,
                transition: 'color 0.3s ease',
              }}
            >
              {card.title}
            </h3>
          </div>
          <div className="flex items-center justify-between font-ui" style={{ fontSize: isMobile ? 9 : 11, color: 'var(--text-muted)' }}>
            <span>¥{card.price}</span>
            <span>{card.duration}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function DockCardStack({
  cards,
}: {
  cards: (ActivityCard & { matchScore: number })[]
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const width = useWindowWidth()
  const isMobile = width < 769

  const visibleCards = cards.slice(0, 5)

  return (
    <div
      className="relative flex justify-center items-end py-10 md:py-14"
      style={{ perspective: 1000 }}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Ambient glow behind the stack */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 60%, rgba(201,169,110,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative flex items-end">
        {visibleCards.map((card, i) => (
          <DockCard
            key={card.id}
            card={card}
            index={i}
            hoveredIndex={hoveredIndex}
            onHover={setHoveredIndex}
            onLeave={() => setHoveredIndex(null)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Search Hero ─── */

function SearchHero({
  value,
  onChange,
  onSubmit,
  placeholder,
  fade,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  placeholder: string
  fade: boolean
}) {
  return (
    <div className="w-full max-w-[640px] mx-auto">
      {/* Greeting */}
      <div className="text-center mb-8">
        <p className="font-ui text-xs tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
          AI 活动助手
        </p>
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(26px, 5vw, 40px)',
            fontWeight: 300,
            color: 'var(--text-heading)',
            letterSpacing: '0.02em',
            lineHeight: 1.3,
          }}
        >
          告诉我你想怎么度过
          <br />
          <span style={{ color: 'var(--color-wheat)' }}>接下来的时光</span>
        </h1>
      </div>

      {/* Search Box */}
      <div
        className="relative flex items-center gap-2 p-2 rounded-2xl transition-all duration-300"
        style={{
          background: 'rgba(45, 42, 38, 0.6)',
          border: '1px solid rgba(245,241,234,0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ opacity: 0.4 }}>
            🔎
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            className="w-full bg-transparent font-ui text-sm md:text-base outline-none placeholder:transition-opacity placeholder:duration-400"
            style={{
              color: 'var(--text-heading)',
              padding: '14px 14px 14px 44px',
            }}
            placeholder={placeholder}
          />
          {/* Fade overlay for placeholder cycling */}
          <style jsx>{`
            input::placeholder {
              opacity: ${fade ? 0.5 : 0};
              transition: opacity 0.4s ease;
              color: var(--text-muted);
            }
          `}</style>
        </div>
        <button
          onClick={onSubmit}
          className="font-ui font-medium text-sm md:text-base px-5 py-3.5 rounded-xl flex-shrink-0 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          style={{
            background: 'var(--color-wheat)',
            color: 'var(--bg-ink)',
            whiteSpace: 'nowrap',
          }}
        >
          帮我找到最适合的活动
        </button>
      </div>

      {/* Hint pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['周末短逃离', '亲子自然', '手作体验', '在地美食'].map((tag) => (
          <button
            key={tag}
            onClick={() => onChange(tag)}
            className="font-ui text-xs px-3 py-1.5 rounded-full transition-all duration-300 hover:brightness-110"
            style={{
              background: 'rgba(245,241,234,0.04)',
              color: 'var(--text-muted)',
              border: '1px solid rgba(245,241,234,0.06)',
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Main Page ─── */

export default function MatchPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const { text: placeholder, fade } = useRotatingPlaceholder(3500)

  const userInterests = user?.interests || []
  const userLocation = user?.location || ''

  const relevantTags = useMemo(() => {
    const set = new Set<string>()
    for (const interest of userInterests) {
      const tags = INTEREST_TAG_MAP[interest as keyof typeof INTEREST_TAG_MAP]
      if (tags) tags.forEach((t) => set.add(t))
    }
    return set
  }, [userInterests])

  const scored = useMemo(() =>
    ALL_ACTIVITIES.map((card) => ({
      ...card,
      matchScore: computeMatch(card, relevantTags, userLocation),
    })).sort((a, b) => b.matchScore - a.matchScore),
    [relevantTags, userLocation]
  )

  // Check if profile is basically empty (only has registration defaults)
  const hasMinimalProfile = useMemo(() => {
    if (!user) return false
    return (
      (user.interests && user.interests.length > 0) ||
      !!user.location ||
      !!user.bio ||
      !!user.skills ||
      user.gender !== null ||
      user.age !== null
    )
  }, [user])

  const handleSearch = useCallback(() => {
    setSearched(true)
  }, [])

  if (loading) {
    return (
      <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
        <div className="max-w-[800px] mx-auto px-6 py-8 text-center font-ui" style={{ color: 'var(--text-secondary)' }}>
          加载中...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
        <div className="max-w-[600px] mx-auto px-6 py-12 text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}
          >
            <span className="text-2xl">🔒</span>
          </div>
          <h2
            className="font-serif mb-4"
            style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 300, color: 'var(--text-heading)' }}
          >
            需要登录才能使用精准匹配
          </h2>
          <p className="font-ui mb-6" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            登录后，我们将根据你的兴趣和所在地推荐最合适的乡建活动
          </p>
          <button onClick={() => router.push('/login')} className="btn-primary">
            去登录
          </button>
          <button onClick={() => router.push('/register')} className="btn-ghost ml-3">
            注册
          </button>
        </div>
      </div>
    )
  }

  // Profile incomplete — prompt to fill in
  if (!hasMinimalProfile) {
    return (
      <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
        <div className="max-w-[600px] mx-auto px-6 py-12 text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}
          >
            <span className="text-2xl">✨</span>
          </div>
          <h2
            className="font-serif mb-4"
            style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 300, color: 'var(--text-heading)' }}
          >
            完善资料，获得精准推荐
          </h2>
          <p className="font-ui mb-8" style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
            我们需要了解你的兴趣方向、所在地等信息，
            <br />
            才能为你推荐最合适的乡建活动
          </p>
          <button onClick={() => router.push('/profile')} className="btn-primary">
            去完善
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Search Hero */}
        <div className="pt-8 md:pt-16 pb-4 md:pb-6">
          <SearchHero
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder={placeholder}
            fade={fade}
          />
        </div>

        {/* Recommendations — Dock Stack */}
        {!searched && scored.length > 0 && (
          <div className="mb-8">
            <div className="text-center mb-2">
              <p className="font-ui text-xs tracking-wider" style={{ color: 'var(--text-muted)' }}>
                为你推荐
                {userInterests.length > 0 && (
                  <span className="ml-2">· 基于你的兴趣：{userInterests.slice(0, 3).join('、')}</span>
                )}
              </p>
            </div>
            <DockCardStack cards={scored} />
          </div>
        )}

        {/* Search results (grid) */}
        {searched && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-5 rounded-full" style={{ background: 'var(--color-wheat)' }} />
              <h3
                className="font-serif"
                style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 400, color: 'var(--text-heading)' }}
              >
                搜索结果
              </h3>
            </div>

            <div
              className="grid gap-4 md:gap-5"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              }}
            >
              {scored
                .filter((c) => {
                  const q = query.toLowerCase()
                  return (
                    c.title.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q) ||
                    c.tags.some((t) => t.toLowerCase().includes(q)) ||
                    c.location.toLowerCase().includes(q)
                  )
                })
                .slice(0, 6)
                .map((card) => (
                  <div
                    key={card.id}
                    className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                    style={{
                      background: 'rgba(45, 42, 38, 0.5)',
                      border: '1px solid rgba(245,241,234,0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="relative h-44 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${card.image})` }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(45,42,38,0.7) 0%, rgba(45,42,38,0) 50%)' }}
                      />
                      <div
                        className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-ui"
                        style={{
                          background: 'rgba(45,42,38,0.6)',
                          color: 'var(--color-wheat)',
                          border: '1px solid rgba(201,169,110,0.25)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {card.matchScore}% 匹配
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-ui text-[11px] tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                        {card.location}
                      </p>
                      <h3
                        className="font-serif mb-2 transition-colors duration-300 group-hover:text-[var(--color-wheat)]"
                        style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-heading)', lineHeight: 1.35 }}
                      >
                        {card.title}
                      </h3>
                      <p
                        className="font-ui text-sm mb-3"
                        style={{
                          color: 'var(--text-secondary)',
                          lineHeight: 1.55,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {card.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {card.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="font-ui text-[11px] px-2 py-0.5 rounded-full"
                            style={{
                              background: relevantTags.has(tag)
                                ? 'rgba(201,169,110,0.1)'
                                : 'rgba(245,241,234,0.04)',
                              color: relevantTags.has(tag) ? 'var(--color-wheat)' : 'var(--text-muted)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {scored.filter((c) => {
              const q = query.toLowerCase()
              return (
                c.title.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q) ||
                c.tags.some((t) => t.toLowerCase().includes(q)) ||
                c.location.toLowerCase().includes(q)
              )
            }).length === 0 && (
              <div className="text-center py-16">
                <p className="font-ui text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                  没有找到匹配的活动
                </p>
                <button
                  onClick={() => {
                    setQuery('')
                    setSearched(false)
                  }}
                  className="font-ui text-sm transition-colors duration-300 hover:underline"
                  style={{ color: 'var(--color-wheat)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  查看全部推荐
                </button>
              </div>
            )}
          </div>
        )}

        {/* View all link */}
        {!searched && (
          <div className="text-center pt-4 pb-8">
            <button
              onClick={() => router.push('/activities')}
              className="font-ui text-sm inline-flex items-center gap-2 transition-colors duration-300 hover:text-[var(--color-wheat)]"
              style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              浏览全部活动
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
