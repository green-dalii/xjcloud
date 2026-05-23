import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEventsByDate, EVENT_TYPE_CONFIG } from '@/lib/data/mock-calendar-events'
import type { EventType } from '@/lib/data/mock-calendar-events'

interface DayPageProps {
  params: { date: string }
}

// 静态导出：预渲染所有有活动的日期页面
export function generateStaticParams() {
  const eventsMap = getEventsByDate()
  return Object.keys(eventsMap).map((date) => ({ date }))
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return {
    full: `${y}年${m}月${d}日`,
    weekday: weekdays[date.getDay()],
    prev: new Date(y, m - 1, d - 1),
    next: new Date(y, m - 1, d + 1),
  }
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function DayPage({ params }: DayPageProps) {
  const { date } = params
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound()
  }

  const eventsMap = getEventsByDate()
  const events = eventsMap[date] || []
  const info = formatDate(date)

  return (
    <main className="page-bg" style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px' }}>
        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <Link
            href="/calendar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            className="day-nav-back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            返回月视图
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href={`/calendar/day/${toDateStr(info.prev)}`} className="day-nav-btn" aria-label="前一天">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <Link href={`/calendar/day/${toDateStr(info.next)}`} className="day-nav-btn" aria-label="后一天">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Date header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(24px, 4vw, 36px)',
            color: 'var(--text-heading)',
            fontWeight: 300,
            letterSpacing: 2,
            marginBottom: 8,
          }}>
            {info.full}
          </h1>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 15,
            color: 'var(--color-wheat)',
            letterSpacing: 4,
          }}>
            {info.weekday}
          </p>
        </div>

        {/* Event count */}
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--text-muted)',
          marginBottom: 24,
        }}>
          共 {events.length} 场活动
        </div>

        {/* Events list */}
        {events.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            border: '1px dashed var(--border-default)',
            borderRadius: 16,
          }}>
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 15,
              color: 'var(--text-muted)',
            }}>
              今天没有安排活动
            </p>
            <Link href="/calendar" style={{
              display: 'inline-block',
              marginTop: 16,
              color: 'var(--color-wheat)',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              textDecoration: 'none',
            }}>
              返回日历查看其他日期 →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {events.map((ev) => {
              const cfg = EVENT_TYPE_CONFIG[ev.type as EventType]
              return (
                <div
                  key={ev.id}
                  style={{
                    background: 'rgba(45, 42, 38, 0.5)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 14,
                    padding: '20px 24px',
                    transition: 'border-color 0.3s, transform 0.2s',
                  }}
                  className="day-event-card"
                >
                  {/* Type tag */}
                  <div style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 11,
                    fontWeight: 500,
                    marginBottom: 10,
                    color: cfg.color,
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                  }}>
                    {cfg.label}
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 18,
                    color: 'var(--text-heading)',
                    fontWeight: 400,
                    marginBottom: 10,
                    lineHeight: 1.4,
                    wordBreak: 'keep-all',
                  }}>
                    {ev.title}
                  </h2>

                  {/* Meta row */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px 16px',
                    marginBottom: 12,
                  }}>
                    <span className="day-event-meta">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {ev.location}
                    </span>
                    <span className="day-event-meta">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {ev.host}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 14,
                    color: 'var(--text-body)',
                    lineHeight: 1.7,
                    marginBottom: 14,
                  }}>
                    {ev.description}
                  </p>

                  {/* Info grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 10,
                    paddingTop: 14,
                    borderTop: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>价格</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-heading)', fontWeight: 600 }}>¥{ev.price}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>时长</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-heading)', fontWeight: 600 }}>{ev.duration}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>名额</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-heading)', fontWeight: 600 }}>{ev.maxPeople}人</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
