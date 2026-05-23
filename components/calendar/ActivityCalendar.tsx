'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getEventsByDateFiltered, EVENT_TYPE_CONFIG } from '@/lib/data/mock-calendar-events'
import type { CalendarEvent, EventType } from '@/lib/data/mock-calendar-events'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

interface CalendarDay {
  date: number
  month: number
  year: number
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
  dateStr: string
}

function generateCalendarDays(year: number, month: number, filterLocation: string): CalendarDay[] {
  const eventsMap = getEventsByDateFiltered(filterLocation)
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const startWeekday = firstDayOfMonth.getDay()

  const today = new Date()
  const isCurrentYearMonth = today.getFullYear() === year && today.getMonth() + 1 === month
  const todayDate = today.getDate()

  const days: CalendarDay[] = []

  // Previous month padding
  const prevMonthDays = new Date(year, month - 1, 0).getDate()
  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = prevMonthDays - i
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      date: d, month: prevMonth, year: prevYear,
      isCurrentMonth: false, isToday: false,
      events: eventsMap[dateStr] || [],
      dateStr,
    })
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      date: d, month, year,
      isCurrentMonth: true,
      isToday: isCurrentYearMonth && d === todayDate,
      events: eventsMap[dateStr] || [],
      dateStr,
    })
  }

  // Next month padding (fill to 42 cells = 6 rows)
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({
      date: d, month: nextMonth, year: nextYear,
      isCurrentMonth: false, isToday: false,
      events: eventsMap[dateStr] || [],
      dateStr,
    })
  }

  return days
}

interface ActivityCalendarProps {
  filterLocation?: string
}

export default function ActivityCalendar({ filterLocation = '全部' }: ActivityCalendarProps) {
  const router = useRouter()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  const calendarDays = useMemo(() => generateCalendarDays(year, month, filterLocation), [year, month, filterLocation])

  const goPrevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else { setMonth(m => m - 1) }
  }

  const goNextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else { setMonth(m => m + 1) }
  }

  const goToday = () => {
    setYear(today.getFullYear())
    setMonth(today.getMonth() + 1)
  }

  const handleDayClick = (day: CalendarDay) => {
    if (day.events.length > 0) {
      router.push(`/calendar/day/${day.dateStr}`)
    }
  }

  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]

  return (
    <div className="calendar-root">
      {/* Header */}
      <div className="calendar-header">
        <div className="calendar-header-left">
          <button className="calendar-nav-btn" onClick={goPrevMonth} aria-label="上个月">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="calendar-title">{year}年 {monthNames[month - 1]}</span>
          <button className="calendar-nav-btn" onClick={goNextMonth} aria-label="下个月">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <button className="calendar-today-btn" onClick={goToday}>今天</button>
      </div>

      {/* Weekday headers */}
      <div className="calendar-weekdays">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={`calendar-weekday${i === 0 || i === 6 ? ' weekend' : ''}`}>
            {w}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid">
        {calendarDays.map((day, idx) => (
          <motion.div
            key={`${day.year}-${day.month}-${day.date}-${idx}`}
            className={`calendar-cell${day.isCurrentMonth ? '' : ' other-month'}${day.isToday ? ' today' : ''}${day.events.length > 0 ? ' has-events' : ''}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.005 }}
            onClick={() => handleDayClick(day)}
          >
            <div className="calendar-cell-date">
              <span className={`calendar-date-num${day.isToday ? ' today-num' : ''}`}>{day.date}</span>
            </div>
            <div className="calendar-cell-events">
              {day.events.slice(0, 2).map((ev) => {
                const cfg = EVENT_TYPE_CONFIG[ev.type as EventType]
                return (
                  <div
                    key={ev.id}
                    className="calendar-event-tag"
                    style={{
                      color: cfg.color,
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                    }}
                    title={ev.title}
                  >
                    <span className="calendar-event-dot" style={{ background: cfg.color }} />
                    <span className="calendar-event-label">{cfg.label}</span>
                    <span className="calendar-event-title">{ev.title}</span>
                  </div>
                )
              })}
              {day.events.length > 2 && (
                <div className="calendar-event-more">···</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
