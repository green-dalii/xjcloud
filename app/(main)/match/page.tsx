'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ALL_ACTIVITIES, INTEREST_TAG_MAP } from '@/lib/data/mock-activities'
import type { ActivityCard } from '@/lib/data/mock-activities'

function computeMatch(card: ActivityCard, userInterests: string[], userLocation: string): number {
  let score = 0

  // Tag matching via INTEREST_TAG_MAP
  if (userInterests.length > 0) {
    const relevantTags = new Set<string>()
    for (const interest of userInterests) {
      const tags = INTEREST_TAG_MAP[interest as keyof typeof INTEREST_TAG_MAP]
      if (tags) tags.forEach((t) => relevantTags.add(t))
    }
    const overlap = card.tags.filter((t) => relevantTags.has(t)).length
    score += overlap * 25
  }

  // Location bonus
  if (userLocation && card.location.includes(userLocation)) {
    score += 30
  }

  // Base matchScore from card
  score += card.matchScore / 5

  return Math.min(score, 98)
}

export default function MatchPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="font-serif mb-4" style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 300, color: 'var(--text-heading)' }}>
            需要登录才能使用精准匹配
          </h2>
          <p className="font-ui mb-6" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            登录后，我们将根据你的兴趣和所在地推荐最合适的乡建活动
          </p>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary"
          >
            去登录
          </button>
          <button
            onClick={() => router.push('/register')}
            className="btn-ghost ml-3"
          >
            注册
          </button>
        </div>
      </div>
    )
  }

  const userInterests = user.interests || []
  const userLocation = user.location || ''

  // Compute match scores
  const scored = ALL_ACTIVITIES.map((card) => ({
    ...card,
    matchScore: computeMatch(card, userInterests, userLocation),
  })).sort((a, b) => b.matchScore - a.matchScore)

  const hasProfile = userInterests.length > 0 || userLocation

  return (
    <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <p className="font-ui text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
            AI 精确匹配
          </p>
          <h2 className="font-serif" style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, color: 'var(--text-heading)', letterSpacing: '0.02em', lineHeight: 1.3 }}>
            {user.name || user.email?.split('@')[0]}，为你找到{' '}
            <span style={{ color: 'var(--color-wheat)' }}>{scored.length}</span> 个可能喜欢的体验
          </h2>
          {!hasProfile && (
            <div className="mt-4 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.15)' }}>
              <span className="text-lg">💡</span>
              <p className="font-ui text-sm" style={{ color: 'var(--text-secondary)' }}>
                完善
                <button
                  onClick={() => router.push('/profile')}
                  className="font-medium mx-1"
                  style={{ color: 'var(--color-wheat)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  个人资料
                </button>
                中的兴趣方向和所在地，可以获得更精准的匹配结果
              </p>
            </div>
          )}
          {hasProfile && (
            <div className="mt-4 flex flex-wrap gap-2">
              {userInterests.map((interest) => (
                <span key={interest} className="font-ui text-xs" style={{
                  background: 'rgba(201,169,110,0.1)', color: 'var(--color-wheat)',
                  padding: '4px 12px', borderRadius: 50,
                }}>
                  {interest}
                </span>
              ))}
              {userLocation && (
                <span className="font-ui text-xs" style={{
                  background: 'rgba(61,90,63,0.1)', color: 'var(--color-moss)',
                  padding: '4px 12px', borderRadius: 50,
                }}>
                  📍 {userLocation}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {scored.map((card) => (
            <div
              key={card.id}
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'rgba(45, 42, 38, 0.6)',
                border: '1px solid var(--border-subtle)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
              }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                {/* Match score badge */}
                <div className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-ui font-medium"
                  style={{
                    background: card.matchScore >= 70 ? 'rgba(52,211,153,0.15)' : 'rgba(201,169,110,0.15)',
                    color: card.matchScore >= 70 ? '#34d399' : '#c9a96e',
                    border: `1px solid ${card.matchScore >= 70 ? 'rgba(52,211,153,0.25)' : 'rgba(201,169,110,0.25)'}`,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {card.matchScore}% 匹配
                </div>
              </div>
              {/* Content */}
              <div className="p-4">
                <p className="font-ui text-xs tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{card.location}</p>
                <h3 className="font-serif mb-2" style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-heading)', lineHeight: 1.3 }}>
                  {card.title}
                </h3>
                <p className="font-ui text-sm mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {card.description}
                </p>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {card.tags.slice(0, 4).map((tag) => {
                    const isMatch = userInterests.some((i) => {
                      const matchTags = INTEREST_TAG_MAP[i as keyof typeof INTEREST_TAG_MAP]
                      return matchTags?.includes(tag)
                    })
                    return (
                      <span key={tag} className="font-ui text-xs px-2 py-0.5 rounded-full" style={{
                        background: isMatch ? 'rgba(201,169,110,0.12)' : 'rgba(245,241,234,0.05)',
                        color: isMatch ? 'var(--color-wheat)' : 'var(--text-muted)',
                      }}>
                        {tag}
                      </span>
                    )
                  })}
                </div>
                {/* Meta row */}
                <div className="flex items-center justify-between font-ui text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>¥{card.price}</span>
                  <span>{card.duration}</span>
                  <span>{card.maxPeople}人</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {scored.length === 0 && (
          <div className="text-center py-20">
            <p className="font-ui" style={{ color: 'var(--text-secondary)' }}>暂无匹配结果</p>
          </div>
        )}
      </div>
    </div>
  )
}
