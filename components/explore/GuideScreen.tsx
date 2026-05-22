'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Filters, Gender, TravelMode, CompanionType } from '@/lib/data/mock-activities'

interface GuideScreenProps {
  step: number
  filters: Filters
  onSelect: (key: keyof Filters, value: string) => void
  onNext: () => void
  onSkip: () => void
}

const QUESTIONS = [
  { key: 'gender' as const, question: '你的性别？', options: [
    { label: '男', value: 'male' as Gender },
    { label: '女', value: 'female' as Gender },
  ]},
  { key: 'travelMode' as const, question: '出行方式？', options: [
    { label: '单人', value: 'solo' as TravelMode },
    { label: '与人同行', value: 'group' as TravelMode },
  ]},
  { key: 'companionType' as const, question: '同行身份是？', options: [
    { label: '伴侣', value: 'partner' as CompanionType },
    { label: '朋友', value: 'friend' as CompanionType },
    { label: '父母', value: 'parent' as CompanionType },
    { label: '子女', value: 'child' as CompanionType },
    { label: '其他', value: 'other' as CompanionType },
  ]},
]

export default function GuideScreen({ step, filters, onSelect, onNext, onSkip }: GuideScreenProps) {
  const currentQ = QUESTIONS[step - 1]
  if (!currentQ) return null

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 50%, #2d2a26 100%)' }}>
      {/* Step indicator */}
      <div className="absolute top-24 flex gap-3">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="rounded-full transition-all duration-500"
            style={{
              width: s === step ? 28 : 10,
              height: 10,
              backgroundColor: s <= step ? '#c9a96e' : 'rgba(245,241,234,0.2)',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full max-w-md"
        >
          <h2
            className="font-serif text-center mb-12"
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 300,
              color: '#f5f1ea',
              letterSpacing: '0.02em',
              lineHeight: 1.3,
            }}
          >
            {currentQ.question}
          </h2>

          <div className="flex flex-col gap-4 w-full">
            {currentQ.options.map((opt) => (
              <motion.button
                key={opt.value}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(201,169,110,0.12)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onSelect(currentQ.key, opt.value)
                  if (step < 3) {
                    // Step 2 + group → go to step 3
                    // Step 2 + solo → skip to cards
                    if (currentQ.key === 'travelMode' && opt.value === 'solo') {
                      onNext() // will trigger skip since no companionType needed
                    } else {
                      onNext()
                    }
                  } else {
                    onNext()
                  }
                }}
                className="w-full py-4 px-8 rounded-full text-center transition-colors duration-300"
                style={{
                  border: '1.5px solid rgba(245,241,234,0.18)',
                  backgroundColor: filters[currentQ.key] === opt.value ? 'rgba(201,169,110,0.15)' : 'transparent',
                  color: filters[currentQ.key] === opt.value ? '#c9a96e' : 'rgba(245,241,234,0.85)',
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  fontFamily: "'Noto Serif SC', serif",
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Skip button */}
      <motion.button
        className="absolute bottom-12 font-ui text-xs tracking-widest cursor-pointer"
        style={{ color: 'rgba(245,241,234,0.35)', background: 'none', border: 'none' }}
        whileHover={{ color: 'rgba(245,241,234,0.7)' }}
        onClick={onSkip}
      >
        跳过，看全部结果 →
      </motion.button>
    </div>
  )
}
