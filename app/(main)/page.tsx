'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const leftVideoRef = useRef<HTMLVideoElement>(null)
  const rightVideoRef = useRef<HTMLVideoElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setLoaded(true), 150)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!mounted) return
    leftVideoRef.current?.play().catch(() => {})
    rightVideoRef.current?.play().catch(() => {})
  }, [mounted])

  const scrollToPanels = () => {
    panelsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (!mounted) {
    return <div style={{ width: '100%', height: '100vh', background: 'var(--bg-ink)' }} />
  }

  return (
    <div className={`landing-root${loaded ? ' loaded' : ''}`} suppressHydrationWarning>
      {/* ── New Hero (first screen) ── */}
      <section className="landing-hero">
        <div className="landing-hero-bg" />
        <div className="landing-hero-overlay" />

        <div
          className="landing-hero-content"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <h1 className="landing-hero-slogan">
            开启一种<br className="md:hidden" />新的生活方式
          </h1>
          <p className="landing-hero-sub">
            简单 · 美好
          </p>
          <button className="landing-hero-cta" onClick={scrollToPanels}>
            出发~ 🚀
          </button>
        </div>

        {/* Scroll-down hint */}
        <div className="landing-hero-hint" onClick={scrollToPanels}>
          <span>向下探索</span>
          <div className="landing-hero-hint-line" />
        </div>
      </section>

      {/* ── Existing Dual Panels (second screen) ── */}
      <div ref={panelsRef} className="landing-panels-section">
        <div className="landing-panels">
          <div className="landing-panel landing-panel-left" onClick={() => router.push('/explore')}>
            <video ref={leftVideoRef} muted loop playsInline autoPlay preload="auto" className="landing-video">
              <source src="/videos/hero-farm-life.mp4" type="video/mp4" />
            </video>
            <div className="landing-overlay-left" />
            <div className="landing-dot landing-dot-1" />
            <div className="landing-dot landing-dot-2" />

            <div className="landing-avatars landing-avatars-left">
              {['A', '林', '禾'].map((name, i) => (
                <div key={i} className="landing-avatar" style={{
                  marginLeft: i > 0 ? -8 : 0,
                  background: `linear-gradient(135deg, #${['c9a96e', '6b8e5a', '8b6f47'][i]}, #${['a08560', '5a7d50', '6b5a3e'][i]})`,
                }}>{name}</div>
              ))}
              <span className="landing-avatar-live"><span className="live-dot" />238人在路上</span>
            </div>

            <div className="landing-content" style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}>
              <span className="landing-tag">FOR &middot; TRAVELER</span>
              <h1 className="landing-headline">一段旅行，<br /><strong>一份心情</strong></h1>
              <p className="landing-subline">聆听时光故事，亲近乡土文明</p>
              <button className="landing-cta landing-cta-left">我要探索<span className="landing-cta-arrow">&rarr;</span></button>
            </div>
          </div>

          <div className="landing-panel landing-panel-right" onClick={() => router.push('/host')}>
            <video ref={rightVideoRef} muted loop playsInline preload="auto" className="landing-video">
              <source src="/videos/lifestyle-slow-living.mp4" type="video/mp4" />
            </video>
            <div className="landing-overlay-right" />
            <div className="landing-dot landing-dot-3" />

            <div className="landing-avatars landing-avatars-right">
              <span className="landing-avatar-live"><span className="live-dot" />62位主理人在线</span>
              {['阿', '木', '茶'].map((name, i) => (
                <div key={i} className="landing-avatar" style={{
                  marginLeft: i > 0 ? -8 : 8,
                  background: `linear-gradient(135deg, #${['8b6f47', 'c9a96e', '6b8e5a'][i]}, #${['6b5a3e', 'a08560', '5a7d50'][i]})`,
                }}>{name}</div>
              ))}
            </div>

            <div className="landing-content landing-content-right" style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
            }}>
              <span className="landing-tag">FOR &middot; HOST</span>
              <h1 className="landing-headline">去乡村田园里，<br /><strong>创造美好空间</strong></h1>
              <p className="landing-subline">不止是组织者，你也是这片土地的讲述者与守护者</p>
              <button className="landing-cta landing-cta-right">我要造趣<span className="landing-cta-arrow">&rarr;</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
