'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const moodTags = ['发呆', '劳作', '聚会', '学习', '骑行', '手作', '露营', '采摘']

const featuredItems = [
  { image: '/images/featured-shaxi.jpg', title: '云南 · 沙溪', subtitle: '老院子改造计划' },
  { image: '/images/featured-tonglu.jpg', title: '杭州 · 桐庐', subtitle: '云雾茶园山居' },
  { image: '/images/featured-jingdezhen.jpg', title: '景德镇 · 手作坊', subtitle: '泥土与火焰的温度' },
]

const lifestyleTags = ['手作工坊', '稻田骑行', '古法染布', '星空露营', '乡野徒步', '茶艺体验', '木工雕刻', '有机采摘']

export default function ExplorePage() {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <div className="bg-paper">
      <section ref={heroRef} className="relative w-full overflow-hidden" style={{ height: '100vh', minHeight: '600px' }}>
        <video className="absolute inset-0 w-full h-full object-cover" src="/videos/hero-farm-life.mp4" autoPlay loop muted playsInline preload="auto" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(45,42,38,0.5) 0%, rgba(45,42,38,0.3) 50%, rgba(45,42,38,0.7) 100%)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          <p className="font-display text-paper text-center" style={{ fontSize: 'clamp(13px, 1.2vw, 16px)', fontStyle: 'italic', opacity: 0.6, letterSpacing: '0.1em', marginBottom: 16 }}>
            Rediscover the origin of life
          </p>
          <h1 className="font-serif font-light text-paper text-center" style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '-0.02em', lineHeight: 1.2, wordBreak: 'keep-all', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
            去有风的地方
          </h1>
          <p className="font-serif text-center mt-6" style={{ fontSize: 'clamp(14px, 1.2vw, 17px)', color: 'rgba(245,241,234,0.6)', lineHeight: 1.8, maxWidth: 480 }}>
            滑动选择你的心情关键词，发现属于你的乡村体验
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-12 max-w-xl">
            {moodTags.map((tag) => (
              <button key={tag} className="font-ui text-sm transition-all duration-300 hover:bg-wheat hover:text-white hover:border-wheat" style={{ padding: '10px 24px', color: 'rgba(245,241,234,0.85)', border: '1px solid rgba(245,241,234,0.2)', borderRadius: 50, background: 'rgba(245,241,234,0.04)', backdropFilter: 'blur(4px)' }}>
                {tag}
              </button>
            ))}
          </div>
          <button className="mt-12 font-ui text-xs tracking-widest uppercase transition-all duration-500 hover:bg-wheat hover:border-wheat hover:text-white" style={{ padding: '14px 36px', color: 'rgba(245,241,234,0.8)', border: '1px solid rgba(245,241,234,0.15)', borderRadius: 50, background: 'transparent' }}>
            查看全部活动
          </button>
        </div>
      </section>

      <FeaturedGridSection />
      <AtmosphereSection />
    </div>
  )
}

function FeaturedGridSection() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const items = document.querySelectorAll<HTMLDivElement>('.grid__item')
      items.forEach((item) => {
        const img = item.querySelector<HTMLDivElement>('.grid__item-img')
        const inner = item.querySelector<HTMLDivElement>('.grid__item-img-inner')
        const text = item.querySelector<HTMLDivElement>('.grid__item-text')
        if (!img || !inner) return

        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 80%', end: 'top top', scrub: true },
        })
        tl.fromTo(img, { yPercent: -12 }, { yPercent: 12 }, 0)
        tl.fromTo(inner, { yPercent: 5, scale: 1.2 }, { yPercent: -5, scale: 1 }, 0)

        if (text) {
          gsap.fromTo(text, { yPercent: 40, opacity: 0 }, {
            yPercent: 0, opacity: 1, ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 70%', end: 'top 40%', scrub: true },
          })
        }
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <section className="relative bg-paper" style={{ padding: 'clamp(120px, 15vh, 200px) 0' }}>
      <div className="max-w-[1200px] mx-auto px-8 lg:px-12 mb-16">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="font-display text-stone font-light" style={{ fontSize: 'clamp(11px, 1vw, 13px)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Featured Places</p>
            <h2 className="font-serif text-moss mt-3" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.2 }}>精选共建地</h2>
          </div>
          <span className="hidden md:block font-ui text-xs tracking-widest text-stone hover:text-wheat transition-colors duration-500 cursor-pointer" style={{ borderBottom: '1px solid currentColor', paddingBottom: '2px' }}>查看全部</span>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-8 lg:px-12">
        {featuredItems.map((item, idx) => (
          <div key={idx} className="grid__item relative mb-8">
            <div className="grid__item-imgwrap relative overflow-hidden" style={{ margin: '10vh -5vw 0', width: 'calc(100% + 10vw)' }}>
              <div className="grid__item-img relative" style={{ paddingBottom: '65%', height: 0 }}>
                <div className="absolute inset-0" style={{ height: '120%', top: '-10%' }}>
                  <div className="grid__item-img-inner w-full h-full" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: '50% 50%' }} />
                </div>
              </div>
              <div className="grid__item-text absolute bottom-8 left-8 z-10" style={{ opacity: 0 }}>
                <p className="font-display text-paper font-light" style={{ fontSize: 'clamp(24px, 3vw, 42px)', letterSpacing: '-0.01em', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>{item.title}</p>
                <p className="font-ui text-paper mt-1" style={{ fontSize: 'clamp(11px, 1vw, 14px)', opacity: 0.75, letterSpacing: '0.1em', textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>{item.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function AtmosphereSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const text = textRef.current
    const section = sectionRef.current
    const video = videoRef.current
    if (!text || !section || !video) return

    gsap.fromTo(text, { yPercent: 30, opacity: 0 }, {
      yPercent: 0, opacity: 1, ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 60%', end: 'top 20%', scrub: 1 },
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { video.play().catch(() => {}) }
        else { video.pause() }
      })
    }, { threshold: 0.3 })
    observer.observe(section)

    return () => { observer.disconnect() }
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden" style={{ height: '100vh', minHeight: '600px', marginBottom: 0 }}>
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" src="/videos/lifestyle-slow-living.mp4" loop muted playsInline preload="metadata" />
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(45, 42, 38, 0.45)' }} />
      <div ref={textRef} className="relative z-10 flex flex-col items-center justify-center h-full px-6" style={{ opacity: 0 }}>
        <h2 className="font-serif text-paper text-center" style={{ fontSize: 'clamp(32px, 5.5vw, 68px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.2, wordBreak: 'keep-all', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>造趣，源于自然</h2>
        <p className="font-display text-paper text-center mt-4" style={{ fontSize: 'clamp(14px, 1.5vw, 20px)', fontStyle: 'italic', opacity: 0.6, letterSpacing: '0.05em' }}>Where joy meets the wild</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden py-6">
        <div className="flex animate-marquee whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...lifestyleTags, ...lifestyleTags].map((tag, i) => (
            <span key={i} className="font-ui mx-6" style={{ fontSize: 'clamp(11px, 1vw, 13px)', color: 'rgba(245, 241, 234, 0.5)', letterSpacing: '0.15em' }}>
              {tag}<span className="ml-6" style={{ opacity: 0.3 }}>/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
