'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cases = [
  { image: '/images/featured-shaxi.jpg', host: '沙溪老院 · 阿明', title: '把百年白族院子改成开放茶室', desc: '3个月，47位体验者，营收破10万', tag: '老宅改造' },
  { image: '/images/featured-tonglu.jpg', host: '桐庐云舍 · 小鹿', title: '在云雾茶园里做瑜伽 retreat', desc: '周末场场爆满，回头客达 68%', tag: '自然疗愈' },
  { image: '/images/featured-jingdezhen.jpg', host: '景德镇 · 老周陶艺', title: '让游客亲手做一把柴烧壶', desc: '单日体验定价 480 元，预约排到三个月后', tag: '手作体验' },
]

const steps = [
  { num: '01', title: '选择你的土地', desc: '院子、农田、山林、工作室……告诉我们你有什么', fields: ['地点', '面积', '现有设施'] },
  { num: '02', title: '设定时间节奏', desc: '周末体验 / 短期驻留 / 长期共建，灵活安排', fields: ['活动类型', '开放频率', '接待人数'] },
  { num: '03', title: '设计独特玩法', desc: '我们的策划团队帮你打磨体验细节', fields: ['核心玩法', '定价建议', '物料清单'] },
]

export default function HostPage() {
  return (
    <div className="bg-paper">
      <HeroSection />
      <InspirationSection />
      <CreateFlowSection />
      <CtaSection />
    </div>
  )
}

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    if (!section || !text) return
    gsap.fromTo(text.children, { yPercent: 40, opacity: 0 }, {
      yPercent: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out', delay: 0.3,
    })
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden" style={{ height: '100vh', minHeight: '600px' }}>
      <video className="absolute inset-0 w-full h-full object-cover" src="/videos/lifestyle-slow-living.mp4" autoPlay loop muted playsInline preload="auto" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(107,90,62,0.65) 0%, rgba(139,111,71,0.5) 50%, rgba(120,90,55,0.6) 100%)' }} />
      <div ref={textRef} className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="font-display text-paper" style={{ fontSize: 'clamp(12px, 1.1vw, 15px)', fontStyle: 'italic', opacity: 0.5, letterSpacing: '0.1em', marginBottom: 16 }}>Let the land be seen</p>
        <h1 className="font-serif font-light text-paper" style={{ fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '-0.02em', lineHeight: 1.2, wordBreak: 'keep-all', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>让土地被看见</h1>
        <p className="font-serif mt-6" style={{ fontSize: 'clamp(14px, 1.2vw, 17px)', color: 'rgba(245,241,234,0.65)', lineHeight: 1.8, maxWidth: 480 }}>
          你守护的不只是一片土地，更是一种生活方式<br />加入我们，成为有门槛、有调性的专业共建者
        </p>
        <div className="flex gap-4 mt-12">
          <a href="#inspiration" className="font-ui text-xs tracking-widest uppercase transition-all duration-500 hover:bg-wheat hover:border-wheat" style={{ padding: '14px 32px', color: 'rgba(245,241,234,0.85)', border: '1px solid rgba(245,241,234,0.2)', borderRadius: 50, background: 'rgba(245,241,234,0.05)' }}>看看别人怎么玩</a>
          <a href="#create" className="font-ui text-xs tracking-widest uppercase transition-all duration-500 hover:bg-wheat hover:border-wheat hover:text-white" style={{ padding: '14px 32px', color: '#2c3e2d', borderRadius: 50, background: 'rgba(245,241,234,0.95)' }}>开始创建</a>
        </div>
      </div>
    </section>
  )
}

function InspirationSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll<HTMLDivElement>('.case-card')
    if (!cards) return
    cards.forEach((card, i) => {
      gsap.fromTo(card, { yPercent: 20, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
        delay: i * 0.1,
      })
    })
  }, [])

  return (
    <section ref={sectionRef} id="inspiration" style={{ padding: 'clamp(120px, 15vh, 200px) 0' }}>
      <div className="max-w-[1200px] mx-auto px-8 lg:px-12">
        <div className="mb-16">
          <p className="font-display text-stone font-light" style={{ fontSize: 'clamp(11px, 1vw, 13px)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Inspiration Gallery</p>
          <h2 className="font-serif text-moss mt-3" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.2 }}>看看别人怎么玩</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, idx) => (
            <div key={idx} className="case-card group cursor-pointer" style={{ opacity: 0 }}>
              <div className="relative overflow-hidden mb-5" style={{ borderRadius: 8, aspectRatio: '4/3' }}>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute top-4 left-4 font-ui text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(45,42,38,0.7)', color: 'rgba(245,241,234,0.9)', backdropFilter: 'blur(4px)' }}>{item.tag}</span>
              </div>
              <p className="font-ui text-xs tracking-wider text-stone mb-2" style={{ textTransform: 'uppercase' }}>{item.host}</p>
              <h3 className="font-serif text-moss mb-2" style={{ fontSize: 'clamp(16px, 1.3vw, 20px)', fontWeight: 500, lineHeight: 1.4 }}>{item.title}</h3>
              <p className="font-ui text-stone" style={{ fontSize: 13, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CreateFlowSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll<HTMLDivElement>('.step-item')
    if (!items) return
    items.forEach((item, i) => {
      gsap.fromTo(item, { xPercent: i % 2 === 0 ? -20 : 20, opacity: 0 }, {
        xPercent: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
      })
    })
  }, [])

  return (
    <section ref={sectionRef} id="create" className="bg-ink" style={{ padding: 'clamp(120px, 15vh, 200px) 0' }}>
      <div className="max-w-[1200px] mx-auto px-8 lg:px-12">
        <div className="mb-20 text-center">
          <p className="font-display font-light" style={{ fontSize: 'clamp(11px, 1vw, 13px)', color: 'rgba(245,241,234,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Create in 3 Steps</p>
          <h2 className="font-serif text-paper mt-3" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.2 }}>快速创建你的体验</h2>
        </div>
        <div className="space-y-16">
          {steps.map((step, idx) => (
            <div key={idx} className="step-item flex flex-col md:flex-row items-start gap-8 md:gap-16" style={{ opacity: 0 }}>
              <div className="flex-shrink-0">
                <span className="font-display" style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 300, color: 'rgba(212,163,115,0.25)', lineHeight: 1 }}>{step.num}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-paper mb-3" style={{ fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 400, letterSpacing: '-0.01em' }}>{step.title}</h3>
                <p className="font-ui mb-4" style={{ fontSize: 14, color: 'rgba(245,241,234,0.4)', lineHeight: 1.7 }}>{step.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {step.fields.map((field) => (
                    <span key={field} className="font-ui text-xs px-3 py-1.5 rounded-full" style={{ color: 'rgba(245,241,234,0.45)', border: '1px solid rgba(245,241,234,0.08)' }}>{field}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="relative bg-paper text-center" style={{ padding: 'clamp(100px, 12vh, 160px) 0' }}>
      <div className="max-w-[600px] mx-auto px-8">
        <p className="font-display text-stone font-light" style={{ fontSize: 'clamp(11px, 1vw, 13px)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24 }}>Start Your Journey</p>
        <h2 className="font-serif text-moss mb-6" style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.3 }}>准备好分享你的土地了吗？</h2>
        <p className="font-ui text-stone mb-10" style={{ fontSize: 14, lineHeight: 1.8 }}>每一个伟大的共建项目，都始于一次简单的分享<br />我们的团队会在 24 小时内与你联系</p>
        <button className="font-ui text-sm tracking-wider transition-all duration-500 hover:opacity-90" style={{ padding: '16px 48px', background: '#2c3e2d', color: '#f5f1ea', borderRadius: 50 }}>提交申请</button>
      </div>
    </section>
  )
}
