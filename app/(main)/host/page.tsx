'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from '@/lib/auth-context'
import MultiStepGuide from '@/components/shared/MultiStepGuide'
import type { GuideQuestion } from '@/components/shared/MultiStepGuide'

gsap.registerPlugin(ScrollTrigger)

/* ─── Host Guide Questions ─── */

const ROLE_QUESTION: GuideQuestion = {
  key: 'hostRole',
  question: '你是以什么身份发起活动？',
  options: [
    { label: '我是想法发起人', value: 'idea_initiator', desc: '我有一个活动创意，正在寻找合适的场地和伙伴' },
    { label: '我是在地主理人', value: 'local_host', desc: '我有一片土地/空间，想把它变成独特的体验场所' },
  ],
}

const EVENT_TYPE_QUESTION: GuideQuestion = {
  key: 'eventType',
  question: '你想发起哪一种相遇？',
  layout: 'grid',
  options: [
    { emoji: '🍽️', label: '饭桌共创局', value: 'dinner', subtitle: '从一顿饭开始，认识一群人和一个地方。' },
    { emoji: '🛠️', label: '一起动手局', value: 'craft', subtitle: '做陶、做木、做饭，让陌生人先从手上熟起来。' },
    { emoji: '📖', label: '地方故事局', value: 'story', subtitle: '跟着本地人走走，把一条街巷慢慢看懂。' },
    { emoji: '🌿', label: '自然共处局', value: 'nature', subtitle: '去山野、田地、河边，和同频的人待在一起。' },
    { emoji: '💬', label: '主题分享局', value: 'share', subtitle: '围绕一个兴趣、议题或生活经验，坐下来聊聊。' },
    { emoji: '🤝', label: '一起帮忙局', value: 'help', subtitle: '为一个地方做点实事，顺手认识一群人。' },
    { emoji: '🤔', label: '我还没想好', value: 'undecided', subtitle: '先逛逛，看到喜欢的再说' },
    { emoji: '✨', label: '我来输入', value: 'custom', subtitle: '有其他想法？自己写一个' },
  ],
}

const LOCATION_QUESTION: GuideQuestion = {
  key: 'eventLocation',
  question: '在哪里举行？',
  options: [
    { label: '云南沙溪', value: 'yunnan_shaxi', subtitle: '茶马古道上的千年集市' },
    { label: '浙江桐庐', value: 'zhejiang_tonglu', subtitle: '富春江边的隐逸山水' },
    { label: '景德镇', value: 'jiangxi_jingdezhen', subtitle: '千年瓷都，手艺人的乌托邦' },
    { label: '四川明月村', value: 'sichuan_mingyue', subtitle: '川西林盘里的新乡村实验' },
    { label: '福建泰宁', value: 'fujian_taining', subtitle: '丹霞地貌间的客家聚落' },
    { label: '广东中山旗溪', value: 'guangdong_qixi', subtitle: '珠三角的恬静田园' },
    { label: '江苏计家墩', value: 'jiangsu_jijiadun', subtitle: '离上海最近的理想村' },
    { label: '其他地点', value: 'other', subtitle: '我有别的地方想去' },
  ],
}

const TIME_QUESTION: GuideQuestion = {
  key: 'eventTime',
  question: '我想什么时候举行？',
  options: [
    { label: '马上！立刻！', value: 'now' },
    { label: '近一周', value: 'week' },
    { label: '近一个月', value: 'month' },
    { label: '近半年', value: 'half_year' },
    { label: '其他', value: 'other' },
  ],
}

/* ─── Auth Prompt Screen ─── */

function AuthPrompt() {
  const router = useRouter()

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 50%, #2d2a26 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
      >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
          style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}
        >
          <span className="text-3xl">🏡</span>
        </div>

        <h2
          className="font-serif mb-4"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, color: '#f5f1ea', letterSpacing: '0.02em' }}
        >
          造趣需要一点仪式感
        </h2>

        <p className="font-ui mb-10" style={{ color: 'rgba(245,241,234,0.55)', fontSize: 15, lineHeight: 1.7 }}>
          在发起活动之前，我们需要确认你的身份，
          <br />
          这样才能为你提供最合适的发起工具和场地资源
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/login')}
            className="font-ui text-sm tracking-wider py-3.5 px-8 rounded-full transition-all duration-300 hover:brightness-110"
            style={{
              background: '#c9a96e',
              color: '#2d2a26',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            登录
          </button>
          <button
            onClick={() => router.push('/register')}
            className="font-ui text-sm tracking-wider py-3.5 px-8 rounded-full transition-all duration-300"
            style={{
              background: 'transparent',
              color: '#c9a96e',
              border: '1.5px solid rgba(201,169,110,0.35)',
              cursor: 'pointer',
            }}
          >
            注册
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Profile Incomplete Prompt ─── */

function ProfilePrompt({ onGoProfile }: { onGoProfile: () => void }) {
  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 50%, #2d2a26 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
      >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
          style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}
        >
          <span className="text-3xl">📋</span>
        </div>

        <h2
          className="font-serif mb-4"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, color: '#f5f1ea', letterSpacing: '0.02em' }}
        >
          完善个人资料
        </h2>

        <p className="font-ui mb-10" style={{ color: 'rgba(245,241,234,0.55)', fontSize: 15, lineHeight: 1.7 }}>
          在发起活动前，需要先完善你的个人资料，
          <br />
          这样其他参与者才能更好地了解你
        </p>

        <button
          onClick={onGoProfile}
          className="font-ui text-sm tracking-wider py-3.5 px-8 rounded-full transition-all duration-300 hover:brightness-110"
          style={{
            background: '#c9a96e',
            color: '#2d2a26',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          前往完善资料
        </button>
      </motion.div>
    </div>
  )
}

/* ─── Confirmation Screen ─── */

function ConfirmationScreen({ onGoProfile }: { onGoProfile: () => void }) {
  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 50%, #2d2a26 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 16 }}
          className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
          style={{ background: 'rgba(61,90,63,0.3)', border: '1px solid rgba(61,90,63,0.4)' }}
        >
          <span className="text-3xl">✨</span>
        </motion.div>

        <h2
          className="font-serif mb-4"
          style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, color: '#f5f1ea', letterSpacing: '0.02em' }}
        >
          活动意向已创建！
        </h2>

        <p className="font-ui mb-4" style={{ color: 'rgba(245,241,234,0.55)', fontSize: 15, lineHeight: 1.7 }}>
          你的想法已经被记录下来。
        </p>

        <p className="font-ui mb-10" style={{ color: 'rgba(245,241,234,0.4)', fontSize: 14, lineHeight: 1.7 }}>
          前往个人资料页的「我发布的活动」，
          <br />
          可以进一步完善活动信息并发布。
        </p>

        <button
          onClick={onGoProfile}
          className="font-ui text-sm tracking-wider py-3.5 px-8 rounded-full transition-all duration-300 hover:brightness-110"
          style={{
            background: '#c9a96e',
            color: '#2d2a26',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          前往个人资料页
        </button>
      </motion.div>
    </div>
  )
}

/* ─── Landing Content (original host page) ─── */

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

function LandingContent() {
  return (
    <div className="bg-paper">
      <HeroSection />
      <InspirationSection />
      <CreateFlowSection />
      <CtaSection />
    </div>
  )
}

/* ─── Main Page ─── */

export default function HostPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [phase, setPhase] = useState<'guide' | 'landing' | 'confirmed'>('guide')
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [customInput, setCustomInput] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const roleRef = useRef<string | undefined>(undefined)

  // Determine which questions to show based on role answer
  const hostRole = answers.hostRole as string | undefined
  const isIdeaInitiator = hostRole === 'idea_initiator'

  // Build dynamic question list
  const questions = useMemo<GuideQuestion[]>(() => {
    const qs: GuideQuestion[] = [ROLE_QUESTION]
    if (isIdeaInitiator) {
      qs.push(EVENT_TYPE_QUESTION, LOCATION_QUESTION, TIME_QUESTION)
    }
    return qs
  }, [isIdeaInitiator])
  const totalSteps = questions.length

  const handleSelect = useCallback((key: string, value: string) => {
    if (key === 'eventType' && value === 'custom') {
      setShowCustomInput(true)
    }
    if (key === 'hostRole') {
      roleRef.current = value
    }
    setAnswers((prev) => {
      const q = questions[step - 1]
      if (q?.multi) {
        const current = (prev[key] as string[]) || []
        const exists = current.includes(value)
        if (exists) {
          return { ...prev, [key]: current.filter((v) => v !== value) }
        }
        return { ...prev, [key]: [...current, value] }
      }
      return { ...prev, [key]: value }
    })
  }, [step, questions])

  const handleCustomSubmit = useCallback(() => {
    const trimmed = customInput.trim()
    if (!trimmed) return
    setAnswers((prev) => ({ ...prev, eventType: trimmed }))
    setShowCustomInput(false)
    setCustomInput('')
    // Advance to next step
    if (step < totalSteps) {
      setStep((s) => s + 1)
    } else {
      setPhase('confirmed')
    }
  }, [customInput, step, totalSteps])

  const handleNext = useCallback(() => {
    // Step 1 branching: check the role via ref (sync) not answers state (async)
    if (step === 1) {
      if (roleRef.current === 'idea_initiator') {
        setStep(2)
        return
      }
      // local_host or no selection → landing
      setPhase('landing')
      return
    }

    if (step < totalSteps) {
      setStep((s) => s + 1)
    } else {
      if (isIdeaInitiator) {
        setPhase('confirmed')
      } else {
        setPhase('landing')
      }
    }
  }, [step, totalSteps, isIdeaInitiator])

  const handlePrev = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1)
    }
  }, [step])

  const handleSkip = useCallback(() => {
    setPhase('landing')
  }, [])

  if (!user) {
    return <AuthPrompt />
  }

  const hasMinimalProfile = !!(user.bio && user.phone && user.location && user.skills && user.skills.length > 0)

  if (!hasMinimalProfile) {
    return <ProfilePrompt onGoProfile={() => router.push('/profile?section=edit')} />
  }

  if (phase === 'confirmed') {
    return <ConfirmationScreen onGoProfile={() => router.push('/profile?section=published')} />
  }

  if (phase === 'landing') {
    return <LandingContent />
  }

  // Custom input overlay for event type question
  const showEventTypeCustomInput = showCustomInput && questions[step - 1]?.key === 'eventType'

  return (
    <>
      <MultiStepGuide
        step={step}
        totalSteps={totalSteps}
        questions={questions}
        answers={answers}
        onSelect={handleSelect}
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={handleSkip}
        skipLabel="跳过，先看看别人怎么玩 →"
        preventAutoAdvance={['custom']}
      />

      {/* Custom input modal for "我来输入" */}
      {showEventTypeCustomInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 rounded-2xl"
            style={{ background: '#3a3630', border: '1px solid rgba(201,169,110,0.25)' }}
          >
            <h3 className="font-serif mb-4" style={{ fontSize: 20, color: '#f5f1ea', fontWeight: 400 }}>
              你想发起什么样的相遇？
            </h3>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCustomSubmit() }}
              placeholder="输入你的想法…"
              autoFocus
              className="w-full font-ui text-base px-4 py-3 rounded-xl mb-4 transition-all duration-200"
              style={{
                background: 'rgba(245,241,234,0.06)',
                border: '1.5px solid rgba(201,169,110,0.3)',
                color: '#f5f1ea',
                outline: 'none',
              }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowCustomInput(false); setCustomInput('') }}
                className="font-ui text-sm px-5 py-2.5 rounded-full transition-colors duration-200"
                style={{ color: 'rgba(245,241,234,0.5)', background: 'transparent', border: '1px solid rgba(245,241,234,0.15)', cursor: 'pointer' }}
              >
                取消
              </button>
              <button
                onClick={handleCustomSubmit}
                disabled={!customInput.trim()}
                className="font-ui text-sm px-6 py-2.5 rounded-full transition-all duration-200"
                style={{
                  background: customInput.trim() ? '#c9a96e' : 'rgba(201,169,110,0.3)',
                  color: customInput.trim() ? '#2d2a26' : 'rgba(45,42,38,0.5)',
                  border: 'none',
                  cursor: customInput.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                确定
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
