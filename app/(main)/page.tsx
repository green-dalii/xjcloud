'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import TypewriterText from '@/components/shared/TypewriterText'

export default function LandingPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [taglineVisible, setTaglineVisible] = useState(false)
  const [ctaShiver, setCtaShiver] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const leftVideoRef = useRef<HTMLVideoElement>(null)
  const rightVideoRef = useRef<HTMLVideoElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth <= 768)
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    const t = setTimeout(() => setLoaded(true), 150)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Infinite shiver loop: stable 3.5s → shiver 0.5s → repeat, after button appears
  useEffect(() => {
    if (!taglineVisible) return
    let cancelled = false

    const shiverCycle = () => {
      if (cancelled) return
      setTimeout(() => {
        if (cancelled) return
        setCtaShiver(true)
        setTimeout(() => {
          if (cancelled) return
          setCtaShiver(false)
          shiverCycle()
        }, 500)
      }, 3500)
    }

    const initial = setTimeout(shiverCycle, 1200)

    return () => {
      cancelled = true
      clearTimeout(initial)
    }
  }, [taglineVisible])

  useEffect(() => {
    if (!mounted) return
    leftVideoRef.current?.play().catch(() => {})
    rightVideoRef.current?.play().catch(() => {})
  }, [mounted])

  const scrollToPanels = () => {
    // Delay scroll so the release bounce animation plays out visibly (~400ms)
    setTimeout(() => {
      panelsRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 400)
  }

  // Mechanical release: ring pulse only, CSS handles the spring-back
  const handleCtaUp = () => {
    const btn = ctaRef.current
    if (!btn) return
    btn.classList.add('released')
    setTimeout(() => btn.classList.remove('released'), 600)
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
          <TypewriterText
            text="开启一种新的生活方式"
            pauseAtIndex={4}
            breakAtIndex={isMobile ? 4 : undefined}
            midPauseMs={1000}
            className="landing-hero-slogan"
            onDone={() => setTaglineVisible(true)}
          />
          <p
            className="landing-hero-sub"
            style={{
              opacity: taglineVisible ? 1 : 0,
              transform: taglineVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            简单 · 美好
          </p>
          <button
            className={`landing-hero-cta${ctaShiver ? ' shiver' : ''}`}
            ref={ctaRef}
            onClick={scrollToPanels}
            onMouseUp={handleCtaUp}
            onTouchEnd={handleCtaUp}
            style={{
              opacity: taglineVisible ? 1 : 0,
              transform: taglineVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            出发
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
