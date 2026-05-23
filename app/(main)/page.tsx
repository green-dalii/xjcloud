'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const leftVideoRef = useRef<HTMLVideoElement>(null)
  const rightVideoRef = useRef<HTMLVideoElement>(null)

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

  if (!mounted) {
    return <div style={{ width: '100%', height: '100vh', background: 'var(--bg-ink)' }} />
  }

  return (
    <div className="landing-root" suppressHydrationWarning>
      {/* Panels */}
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
            <h1 className="landing-headline">找一个周末<br /><strong>去别人的生活里住几天</strong></h1>
            <p className="landing-subline">从插秧到围炉，128个真实在地体验等你解锁</p>
            <button className="landing-cta landing-cta-left">开始探索<span className="landing-cta-arrow">&rarr;</span></button>
          </div>
        </div>

        <div className="landing-divider" />

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
            <h1 className="landing-headline">把你的院子<br /><strong>分享给懂的人</strong></h1>
            <p className="landing-subline">不止是民宿主，你是这片土地的讲述者与守护者</p>
            <button className="landing-cta landing-cta-right">我要造趣<span className="landing-cta-arrow">&rarr;</span></button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="landing-bottombar" onClick={() => router.push('/explore')}>
        <span className="landing-bottombar-icon">&#10022;</span>
        <span className="landing-bottombar-text">说一句 <strong>&ldquo;我想要这样的周末&rdquo;</strong>，让主理人来找你 &rarr;</span>
      </div>
    </div>
  )
}
