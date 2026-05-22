'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const regions = ['浙江莫干山', '云南大理', '福建屏南', '江西景德镇', '四川明月村']

export default function LandingPage() {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('云南大理')
  const [mounted, setMounted] = useState(false)
  const leftVideoRef = useRef<HTMLVideoElement>(null)
  const rightVideoRef = useRef<HTMLVideoElement>(null)
  const regionRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!mounted) {
    return <div style={{ width: '100%', height: '100vh', background: '#2d2a26' }} />
  }

  return (
    <div id="landing-root" suppressHydrationWarning>
      <nav className="landing-nav">
        <div className="landing-logo">
          原<span style={{ color: '#c9a96e' }}>乡</span>
        </div>

        <div className="landing-nav-center">
          <div className="landing-region" ref={regionRef}>
            <button
              className="landing-region-btn"
              onClick={() => setRegionOpen(!regionOpen)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, opacity: 0.7 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {selectedRegion}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4, transition: 'transform 0.2s', transform: regionOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {regionOpen && (
              <div className="landing-region-dropdown">
                {regions.map((r) => (
                  <button
                    key={r}
                    className="landing-region-option"
                    style={{ color: r === selectedRegion ? '#c9a96e' : 'rgba(245,241,234,0.7)' }}
                    onClick={() => { setSelectedRegion(r); setRegionOpen(false) }}
                  >
                    {r === selectedRegion && '✓ '}
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="landing-nav-links">
            {['活动日历', '在地故事', '关于'].map((item) => (
              <span key={item} className="landing-nav-link">{item}</span>
            ))}
          </div>
        </div>

        <div className="landing-nav-right" />
      </nav>

      <div className="landing-panels">
        <div className="landing-panel landing-panel-left" onClick={() => router.push('/explore')}>
          <video ref={leftVideoRef} muted loop playsInline autoPlay preload="auto" className="landing-panel-video">
            <source src="/videos/hero-farm-life.mp4" type="video/mp4" />
          </video>
          <div className="landing-panel-overlay-left" />
          <div className="landing-dot landing-dot-1" />
          <div className="landing-dot landing-dot-2" />

          <div className="landing-avatars landing-avatars-left">
            {['A', '林', '禾'].map((name, i) => (
              <div key={i} className="landing-avatar" style={{
                marginLeft: i > 0 ? -8 : 0,
                background: `linear-gradient(135deg, #${['c9a96e', '6b8e5a', '8b6f47'][i]}, #${['a08560', '5a7d50', '6b5a3e'][i]})`,
              }}>{name}</div>
            ))}
            <span className="landing-avatar-live"><span className="landing-live-dot" />238人在路上</span>
          </div>

          <div className="landing-content landing-content-left" style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}>
            <span className="landing-tag">FOR &middot; TRAVELER</span>
            <h1 className="landing-headline">找一个周末<br /><strong>去别人的生活里住几天</strong></h1>
            <p className="landing-subline">从插秧到围炉，128个真实在地体验等你解锁</p>
            <button className="landing-cta landing-cta-left">开始探索<span className="landing-cta-arrow">→</span></button>
          </div>
        </div>

        <div className="landing-divider" />

        <div className="landing-panel landing-panel-right" onClick={() => router.push('/host')}>
          <video ref={rightVideoRef} muted loop playsInline preload="auto" className="landing-panel-video">
            <source src="/videos/lifestyle-slow-living.mp4" type="video/mp4" />
          </video>
          <div className="landing-panel-overlay-right" />
          <div className="landing-dot landing-dot-3" />

          <div className="landing-avatars landing-avatars-right">
            <span className="landing-avatar-live"><span className="landing-live-dot" />62位主理人在线</span>
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
            <button className="landing-cta landing-cta-right">成为主理人<span className="landing-cta-arrow">→</span></button>
          </div>
        </div>
      </div>

      <div className="landing-bottombar" onClick={() => router.push('/explore')}>
        <span className="landing-bottombar-icon">✦</span>
        <span className="landing-bottombar-text">说一句 <strong>&ldquo;我想要这样的周末&rdquo;</strong>，让主理人来找你 →</span>
      </div>

      <style>{`
        #landing-root { width: 100%; height: 100vh; min-height: 600px; background-color: #2d2a26; overflow: hidden; position: relative; font-family: -apple-system, 'PingFang SC', 'Helvetica Neue', sans-serif; }
        .landing-nav { position: absolute; top: 0; left: 0; right: 0; height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; z-index: 100; background: rgba(0,0,0,0.15); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .landing-logo { color: #f5f1ea; font-size: 18px; font-weight: 600; letter-spacing: 2px; font-family: 'Noto Serif SC', serif; flex-shrink: 0; }
        .landing-nav-center { display: flex; align-items: center; gap: 32px; position: absolute; left: 50%; transform: translateX(-50%); }
        .landing-nav-links { display: flex; gap: 28px; }
        .landing-nav-link { color: rgba(245,241,234,0.55); font-size: 13px; letter-spacing: 0.05em; cursor: default; transition: color 0.3s; white-space: nowrap; }
        .landing-nav-link:hover { color: rgba(245,241,234,0.9); }
        .landing-nav-right { width: 60px; flex-shrink: 0; }
        .landing-region { position: relative; }
        .landing-region-btn { display: inline-flex; align-items: center; gap: 2px; padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(201, 169, 110, 0.35); background: rgba(201, 169, 110, 0.08); color: #c9a96e; font-size: 12px; letter-spacing: 0.05em; cursor: pointer; white-space: nowrap; font-family: inherit; transition: all 0.25s; }
        .landing-region-btn:hover { background: rgba(201, 169, 110, 0.15); border-color: rgba(201, 169, 110, 0.5); }
        .landing-region-dropdown { position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); min-width: 140px; padding: 6px; background: rgba(45, 42, 38, 0.95); backdrop-filter: blur(12px); border: 1px solid rgba(245,241,234,0.08); border-radius: 10px; z-index: 200; box-shadow: 0 12px 40px rgba(0,0,0,0.3); animation: regionFadeIn 0.2s ease; }
        @keyframes regionFadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-6px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .landing-region-option { display: block; width: 100%; text-align: left; padding: 8px 12px; border-radius: 6px; border: none; background: none; font-size: 13px; cursor: pointer; white-space: nowrap; font-family: inherit; transition: background 0.15s; }
        .landing-region-option:hover { background: rgba(245,241,234,0.06); }
        .landing-panels { display: flex; width: 100%; height: 100%; position: relative; }
        .landing-panel { flex: 1; position: relative; overflow: hidden; cursor: pointer; transition: flex 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
        .landing-panel-left { background: linear-gradient(135deg, #4a6741 0%, #6b8e5a 50%, #5a7d50 100%); }
        .landing-panel-right { background: linear-gradient(135deg, #8b6f47 0%, #a08560 50%, #c9a96e 100%); }
        @media (min-width: 769px) {
          .landing-panel-left:hover ~ .landing-panel-right, .landing-panels:has(.landing-panel-right:hover) .landing-panel-left { flex: 0.7; }
          .landing-panel:hover { flex: 1.4; }
        }
        .landing-panel-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; }
        .landing-panel-left .landing-panel-video { opacity: 0.55; }
        .landing-panel-right .landing-panel-video { opacity: 0.5; }
        .landing-panel:hover .landing-panel-video { transform: scale(1.05); }
        .landing-panel-overlay-left { position: absolute; inset: 0; background: radial-gradient(circle at 20% 30%, rgba(212,163,115,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(122,158,126,0.2) 0%, transparent 50%); pointer-events: none; }
        .landing-panel-overlay-right { position: absolute; inset: 0; background: radial-gradient(circle at 70% 20%, rgba(255,200,120,0.2) 0%, transparent 45%), radial-gradient(circle at 30% 80%, rgba(180,130,80,0.2) 0%, transparent 50%); pointer-events: none; }
        .landing-divider { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: linear-gradient(to bottom, transparent 0%, rgba(245,241,234,0.25) 20%, rgba(245,241,234,0.25) 80%, transparent 100%); transform: translateX(-50%); z-index: 20; pointer-events: none; }
        .landing-dot { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.5); pointer-events: none; }
        .landing-dot-1 { width: 6px; height: 6px; top: 25%; right: 15%; animation: floatDot 4s ease-in-out infinite; }
        .landing-dot-2 { width: 4px; height: 4px; top: 60%; left: 20%; animation: floatDot 4s ease-in-out 1s infinite; }
        .landing-dot-3 { width: 8px; height: 8px; bottom: 20%; right: 30%; animation: floatDot 4s ease-in-out 2s infinite; }
        @keyframes floatDot { 0%, 100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-12px); opacity: 0.9; } }
        .landing-avatars { position: absolute; display: flex; align-items: center; gap: 0; z-index: 10; }
        .landing-avatars-left { top: 80px; left: 60px; }
        .landing-avatars-right { top: 80px; right: 60px; }
        .landing-avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(245,241,234,0.8); color: #fff; font-size: 11px; display: flex; align-items: center; justify-content: center; font-family: inherit; }
        .landing-avatar-live { margin-left: 8px; font-size: 11px; color: rgba(245,241,234,0.8); display: flex; align-items: center; gap: 4px; font-family: inherit; }
        .landing-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #ff6b6b; animation: pulseDot 1.5s infinite; display: inline-block; }
        @keyframes pulseDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .landing-content { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; padding: 0 60px; z-index: 10; }
        .landing-content-right { align-items: flex-end; text-align: right; }
        .landing-tag { display: inline-block; width: fit-content; padding: 6px 14px; border: 1px solid rgba(245,241,234,0.35); border-radius: 20px; font-size: 11px; letter-spacing: 3px; color: rgba(245,241,234,0.85); margin-bottom: 24px; backdrop-filter: blur(4px); font-family: inherit; }
        .landing-headline { font-size: clamp(28px, 3.5vw, 44px); font-weight: 300; color: #f5f1ea; line-height: 1.4; letter-spacing: 1px; margin-bottom: 12px; font-family: 'Noto Serif SC', serif; word-break: keep-all; }
        .landing-headline strong { font-weight: 600; color: #fff; }
        .landing-subline { font-size: 14px; color: rgba(245,241,234,0.75); line-height: 1.7; margin-bottom: 36px; max-width: 380px; font-family: inherit; }
        .landing-cta { display: inline-flex; align-items: center; gap: 12px; width: fit-content; padding: 14px 28px; background: rgba(245,241,234,0.95); color: #2d2a26; border-radius: 50px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; font-family: inherit; transition: all 0.3s ease; }
        .landing-cta:hover { background: #fff; }
        .landing-cta-left:hover { transform: translateX(4px); }
        .landing-cta-right:hover { transform: translateX(-4px); }
        .landing-cta-arrow { width: 24px; height: 24px; border-radius: 50%; background: #2d2a26; color: #f5f1ea; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; }
        .landing-bottombar { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; padding: 14px 24px; background: rgba(245,241,234,0.95); border-radius: 50px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); z-index: 100; backdrop-filter: blur(12px); cursor: pointer; transition: transform 0.3s ease; white-space: nowrap; }
        .landing-bottombar:hover { transform: translateX(-50%) scale(1.03); }
        .landing-bottombar-icon { width: 28px; height: 28px; border-radius: 50%; background: #c9a96e; display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; flex-shrink: 0; }
        .landing-bottombar-text { color: #2d2a26; font-size: 13px; font-family: inherit; }
        .landing-bottombar-text strong { color: #4a6741; }
        @media (max-width: 768px) {
          #landing-root { min-height: auto; height: auto; overflow: visible; }
          .landing-nav { padding: 0 16px; }
          .landing-nav-center { gap: 16px; right: 16px; left: auto; transform: none; }
          .landing-nav-links { display: none !important; }
          .landing-nav-right { display: none; }
          .landing-region-btn { font-size: 11px; padding: 4px 10px; }
          .landing-panels { flex-direction: column; height: auto; padding-top: 56px; }
          .landing-panel { flex: none !important; height: 50vh; min-height: 380px; }
          .landing-divider { left: 0; right: 0; top: auto; bottom: auto; position: relative; width: 100%; height: 2px; background: linear-gradient(to right, transparent 0%, rgba(245,241,234,0.25) 20%, rgba(245,241,234,0.25) 80%, transparent 100%); transform: none; }
          .landing-avatars { top: 20px; }
          .landing-avatars-left { left: 20px; }
          .landing-avatars-right { right: 20px; }
          .landing-content { padding: 0 28px; }
          .landing-content-right { align-items: flex-start; text-align: left; }
          .landing-headline { font-size: clamp(24px, 6vw, 32px); }
          .landing-subline { max-width: 100%; }
          .landing-bottombar { position: fixed; bottom: 12px; padding: 10px 16px; max-width: 92vw; }
          .landing-bottombar-text { font-size: 12px; }
        }
      `}</style>
    </div>
  )
}
