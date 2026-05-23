'use client'

import { useState } from 'react'
import ActivityCalendar from './ActivityCalendar'
import { ALL_LOCATIONS } from '@/lib/data/mock-calendar-events'

export default function CalendarPageClient() {
  const [filterLocation, setFilterLocation] = useState('全部')
  const [regionOpen, setRegionOpen] = useState(false)

  const locations = ['全部', ...ALL_LOCATIONS]

  return (
    <div>
      {/* Title + Region selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(22px, 3vw, 30px)',
            color: 'var(--text-heading)',
            fontWeight: 300,
            letterSpacing: 2,
          }}
        >
          活动日历
        </h1>
        <div className="region-selector">
          <button
            className="region-btn"
            onClick={() => setRegionOpen(!regionOpen)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{filterLocation === '全部' ? '全部地点' : filterLocation}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: regionOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {regionOpen && (
            <div className="region-dropdown">
              {locations.map((loc) => (
                <button
                  key={loc}
                  className="region-option"
                  style={{
                    color: loc === filterLocation ? 'var(--color-wheat)' : 'var(--text-body)',
                    fontWeight: loc === filterLocation ? 600 : 400,
                  }}
                  onClick={() => {
                    setFilterLocation(loc)
                    setRegionOpen(false)
                  }}
                >
                  {loc === '全部' ? '全部地点' : loc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ActivityCalendar filterLocation={filterLocation} />
    </div>
  )
}
