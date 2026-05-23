'use client'

import { motion } from 'framer-motion'
import type { CalendarEvent, EventType } from '@/lib/data/mock-calendar-events'
import { EVENT_TYPE_CONFIG } from '@/lib/data/mock-calendar-events'

interface EventDetailModalProps {
  event: CalendarEvent
  onClose: () => void
}

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const config = EVENT_TYPE_CONFIG[event.type as EventType]
  const dateObj = new Date(event.date)
  const dateStr = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
  const weekStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dateObj.getDay()]

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="event-modal-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Type tag */}
        <div className="event-modal-tag" style={{
          color: config.color,
          background: config.bg,
          border: `1px solid ${config.border}`,
        }}>
          {config.label}
        </div>

        {/* Title */}
        <div className="event-modal-title">{event.title}</div>

        {/* Date */}
        <div className="event-modal-date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{dateStr} · {weekStr}</span>
        </div>

        {/* Location */}
        <div className="event-modal-meta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span>{event.location}</span>
        </div>

        {/* Host */}
        <div className="event-modal-meta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span>组织者：{event.host}</span>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />

        {/* Description */}
        <p className="event-modal-desc">{event.description}</p>

        {/* Info grid */}
        <div className="event-modal-info-grid">
          <div className="event-modal-info-item">
            <div className="event-modal-info-label">价格</div>
            <div className="event-modal-info-value">¥{event.price}</div>
          </div>
          <div className="event-modal-info-item">
            <div className="event-modal-info-label">时长</div>
            <div className="event-modal-info-value">{event.duration}</div>
          </div>
          <div className="event-modal-info-item">
            <div className="event-modal-info-label">名额</div>
            <div className="event-modal-info-value">{event.maxPeople}人</div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions" style={{ marginTop: 20 }}>
          <button className="btn-outline" onClick={onClose}>关闭</button>
          <button className="btn-primary">立即报名</button>
        </div>
      </motion.div>
    </motion.div>
  )
}
