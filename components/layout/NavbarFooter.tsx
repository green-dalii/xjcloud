'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isExplore = pathname === '/explore'
  const textColor = scrolled ? '#2d2a26' : '#f5f1ea'
  const mutedColor = scrolled ? 'rgba(45,42,38,0.5)' : 'rgba(245,241,234,0.6)'

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
          style={{ color: textColor, letterSpacing: 2, fontSize: 17, fontWeight: 600, fontFamily: "'Noto Serif SC', serif", background: 'none', border: 'none', cursor: 'pointer' }}
        >
          原<span style={{ color: '#c9a96e' }}>乡</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {(isExplore ? ['探索', '指南', '共建', '关于'] : ['灵感库', '创建流程', '关于']).map((item) => (
            <span key={item} className="font-ui text-xs tracking-widest uppercase cursor-default transition-colors duration-500" style={{ color: mutedColor }}>
              {item}
            </span>
          ))}
        </div>

        <button
          onClick={() => router.push(isExplore ? '/host' : '/explore')}
          className="font-ui text-xs tracking-widest uppercase transition-all duration-500"
          style={{
            color: scrolled ? '#3d5a3f' : 'rgba(245,241,234,0.8)',
            border: scrolled ? '1px solid rgba(61,90,63,0.2)' : '1px solid rgba(245,241,234,0.15)',
            borderRadius: 50,
            padding: '8px 18px',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: "-apple-system, 'PingFang SC', sans-serif",
          }}
        >
          {isExplore ? '成为共建者 →' : '← 我想探索'}
        </button>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#2d2a26', padding: 'clamp(80px, 10vh, 130px) 0 clamp(36px, 4vh, 56px)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div>
            <h3 style={{ fontSize: 'clamp(26px, 2.8vw, 38px)', fontWeight: 300, color: '#f5f1ea', letterSpacing: '-0.02em', fontFamily: "'Noto Serif SC', serif", lineHeight: 1.2 }}>原乡</h3>
            <p style={{ fontSize: 13, color: 'rgba(245,241,234,0.35)', lineHeight: 1.8, maxWidth: 300, marginTop: 14, fontFamily: "-apple-system, 'PingFang SC', sans-serif" }}>
              一个深度去中心化的乡村生活共建与探索平台。连接土地与人，重建城乡之间的情感纽带。
            </p>
          </div>
          <div className="flex gap-14">
            <div>
              <p className="font-ui text-xs tracking-widest uppercase mb-5" style={{ color: 'rgba(245,241,234,0.25)' }}>探索</p>
              <ul className="space-y-3">
                {['活动日历', '共建地地图', '生活方式', '行前指南'].map((item) => (
                  <li key={item}><span className="font-ui text-sm cursor-default transition-colors duration-300 hover:text-wheat" style={{ color: 'rgba(245,241,234,0.45)' }}>{item}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-ui text-xs tracking-widest uppercase mb-5" style={{ color: 'rgba(245,241,234,0.25)' }}>共建</p>
              <ul className="space-y-3">
                {['创建活动', '成为共建者', '能力需求', '灵感库'].map((item) => (
                  <li key={item}><span className="font-ui text-sm cursor-default transition-colors duration-300 hover:text-wheat" style={{ color: 'rgba(245,241,234,0.45)' }}>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full mb-7" style={{ height: 1, backgroundColor: 'rgba(245,241,234,0.06)' }} />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-ui text-xs" style={{ color: 'rgba(245,241,234,0.2)' }}>&copy; 2026 原乡. All rights reserved.</p>
          <p className="font-display text-xs" style={{ color: 'rgba(245,241,234,0.12)', fontStyle: 'italic', letterSpacing: '0.05em' }}>Rediscover the origin of life</p>
        </div>
      </div>
    </footer>
  )
}
