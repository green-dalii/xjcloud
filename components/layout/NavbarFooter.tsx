'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const textColor = scrolled ? 'var(--bg-ink)' : 'var(--text-heading)'
  const mutedColor = scrolled ? 'rgba(45,42,38,0.5)' : 'var(--text-secondary)'

  const navItems = ['探索', '指南', '共建', '广场']

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 transition-all duration-700"
      style={{
        backgroundColor: scrolled ? 'rgba(245, 241, 234, 0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px) saturate(160%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px) saturate(160%)' : 'none',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-14">
        <button
          onClick={() => router.push('/')}
          className="transition-colors duration-500"
          style={{
            color: textColor,
            letterSpacing: 2,
            fontSize: 17,
            fontWeight: 600,
            fontFamily: 'var(--font-serif)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          原<span style={{ color: 'var(--color-wheat)' }}>乡</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              className="font-ui text-xs tracking-widest uppercase cursor-pointer transition-colors duration-500"
              style={{ color: mutedColor, background: 'none', border: 'none' }}
              onClick={() => {
                if (item === '探索') router.push('/explore')
                if (item === '广场') router.push('/square')
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push('/host')}
          className="font-ui text-xs tracking-widest uppercase transition-all duration-500"
          style={{
            color: scrolled ? 'var(--color-moss)' : 'rgba(245,241,234,0.8)',
            border: scrolled ? '1px solid rgba(61,90,63,0.2)' : '1px solid var(--border-default)',
            borderRadius: 50,
            padding: '8px 18px',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
          }}
        >
          成为共建者 →
        </button>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-ink)', padding: 'var(--footer-py) 0 var(--footer-pb)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div>
            <h3 style={{
              fontSize: 'clamp(26px, 2.8vw, 38px)',
              fontWeight: 300,
              color: 'var(--text-heading)',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-serif)',
              lineHeight: 1.2,
            }}>
              原乡
            </h3>
            <p style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              maxWidth: 300,
              marginTop: 14,
              fontFamily: 'var(--font-ui)',
            }}>
              一个深度去中心化的乡村生活共建与探索平台。连接土地与人，重建城乡之间的情感纽带。
            </p>
          </div>
          <div className="flex gap-14">
            <div>
              <p className="font-ui text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--text-dim)' }}>探索</p>
              <ul className="space-y-3">
                {['活动日历', '共建地地图', '生活方式', '行前指南'].map((item) => (
                  <li key={item}>
                    <span className="font-ui text-sm cursor-default transition-colors duration-300 hover:text-wheat" style={{ color: 'var(--text-secondary)' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-ui text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--text-dim)' }}>共建</p>
              <ul className="space-y-3">
                {['创建活动', '成为共建者', '能力需求', '灵感库'].map((item) => (
                  <li key={item}>
                    <span className="font-ui text-sm cursor-default transition-colors duration-300 hover:text-wheat" style={{ color: 'var(--text-secondary)' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full mb-7" style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-ui text-xs" style={{ color: 'var(--text-dim)' }}>© 2026 原乡. All rights reserved.</p>
          <p className="font-display text-xs" style={{ color: 'var(--text-dim)', fontStyle: 'italic', letterSpacing: '0.05em' }}>Rediscover the origin of life</p>
        </div>
      </div>
    </footer>
  )
}
