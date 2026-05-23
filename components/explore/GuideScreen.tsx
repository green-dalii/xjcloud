'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Filters, Gender, TravelMode, CompanionType, ActivityInterest } from '@/lib/data/mock-activities'
import { INTEREST_OPTIONS } from '@/lib/data/mock-activities'

interface GuideScreenProps {
  step: number
  filters: Filters
  onSelect: (key: keyof Filters, value: string) => void
  onNext: (key?: keyof Filters, value?: string) => void
  onPrev?: () => void
  onSkip: () => void
  onAuth?: () => void
}

const BASE_QUESTIONS = [
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

const INTEREST_QUESTION = {
  key: 'interests' as const,
  question: '想往哪个方向走？',
  options: INTEREST_OPTIONS.map((o) => ({ label: o.label, value: o.value, subtitle: o.subtitle, desc: o.desc })),
  multi: true,
}

export default function GuideScreen({ step, filters, onSelect, onNext, onPrev, onSkip, onAuth }: GuideScreenProps) {
  const allQuestions = [...BASE_QUESTIONS, INTEREST_QUESTION]
  const currentQ = allQuestions[step - 1]
  if (!currentQ) return null

  const isFirstStep = step === 1
  const isMulti = 'multi' in currentQ && currentQ.multi
  const totalSteps = 4

  // Bento grid spans: row1 [7,5], row2 [4,4,4], row3 [3,6,3]
  const BENTO_SPANS = ['col-span-7', 'col-span-5', 'col-span-4', 'col-span-4', 'col-span-4', 'col-span-3', 'col-span-6', 'col-span-3']

  function isSelected(optValue: string): boolean {
    if (isMulti) {
      const arr = filters.interests || []
      return arr.includes(optValue as ActivityInterest)
    }
    return filters[currentQ.key] === optValue
  }

  function handleOptionClick(optValue: string) {
    onSelect(currentQ.key, optValue)
    if (!isMulti) {
      onNext(currentQ.key, optValue)
    }
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pt-28 md:pt-32 pb-20" style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 50%, #2d2a26 100%)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col items-center w-full ${isMulti ? 'max-w-3xl' : 'max-w-lg'}`}
        >
          {/* Top row: back button + step indicator */}
          <div className="w-full flex items-center mb-10">
            {/* Left: back button or spacer */}
            <div className="flex-1 flex justify-start">
              {!isFirstStep && onPrev && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  whileHover={{ color: 'rgba(245,241,234,0.85)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPrev}
                  className="font-ui text-xs tracking-widest cursor-pointer flex items-center gap-1.5"
                  style={{ color: 'rgba(245,241,234,0.45)', background: 'none', border: 'none' }}
                >
                  ← 返回上一步
                </motion.button>
              )}
            </div>

            {/* Center: step indicator */}
            <div className="flex gap-3">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
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

            {/* Right: spacer to balance layout */}
            <div className="flex-1" />
          </div>

          <h2
            className="font-serif text-center mb-10"
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 300,
              color: '#f5f1ea',
              letterSpacing: '0.02em',
              lineHeight: 1.3,
            }}
          >
            {currentQ.question}{isMulti ? '（可多选）' : ''}
          </h2>

          {/* Single choice — vertical stack */}
          {!isMulti && (
            <div className="flex flex-col gap-4 w-full">
              {currentQ.options.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(201,169,110,0.12)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleOptionClick(opt.value)}
                  className="w-full py-4 px-8 rounded-full text-center transition-colors duration-300"
                  style={{
                    border: '1.5px solid rgba(245,241,234,0.18)',
                    backgroundColor: isSelected(opt.value) ? 'rgba(201,169,110,0.15)' : 'transparent',
                    color: isSelected(opt.value) ? '#c9a96e' : 'rgba(245,241,234,0.85)',
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
          )}

          {/* Multi choice — Bento grid */}
          {isMulti && (
            <div className="w-full">
              <div className="grid grid-cols-12 gap-3 w-full">
                {INTEREST_OPTIONS.map((opt, idx) => {
                  const selected = isSelected(opt.value)
                  const spanClass = BENTO_SPANS[idx]
                  return (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick(opt.value)}
                      className={`${spanClass} h-[88px] md:h-[96px] rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center px-3 overflow-hidden`}
                      style={{
                        border: selected ? '1.5px solid rgba(201,169,110,0.5)' : '1.5px solid rgba(245,241,234,0.1)',
                        backgroundColor: selected ? 'rgba(201,169,110,0.1)' : 'rgba(245,241,234,0.02)',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        className="font-serif flex items-center gap-1.5"
                        style={{
                          fontSize: 'clamp(15px, 2.2vw, 18px)',
                          fontWeight: 500,
                          color: selected ? '#c9a96e' : '#f5f1ea',
                          letterSpacing: '0.02em',
                          lineHeight: 1.3,
                        }}
                      >
                        {opt.emoji} {opt.label}
                      </span>
                      <span
                        className="font-ui mt-1"
                        style={{
                          fontSize: 'clamp(10px, 1.3vw, 11px)',
                          color: selected ? 'rgba(201,169,110,0.7)' : 'rgba(245,241,234,0.4)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {opt.subtitle}
                      </span>
                      {/* Desc toggles via opacity — zero layout shift */}
                      <span
                        className="font-ui mt-1.5 transition-opacity duration-200"
                        style={{
                          fontSize: 'clamp(9px, 1.2vw, 10px)',
                          color: 'rgba(245,241,234,0.5)',
                          lineHeight: 1.4,
                          opacity: selected ? 1 : 0,
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {opt.desc}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Next button for multi-select */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNext()}
                className="w-full py-3.5 rounded-full text-center mt-5 transition-colors duration-300 font-ui text-sm tracking-wider"
                style={{
                  background: '#c9a96e',
                  color: '#2d2a26',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                下一步
              </motion.button>
            </div>
          )}

          {/* Auth prompt on first step */}
          {isFirstStep && onAuth && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              whileHover={{ scale: 1.03, borderColor: 'rgba(201,169,110,0.5)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onAuth}
              className="w-full py-3.5 px-8 rounded-full text-center mt-6 transition-colors duration-300"
              style={{
                border: '1.5px dashed rgba(201,169,110,0.35)',
                backgroundColor: 'transparent',
                color: '#c9a96e',
                fontSize: 'clamp(14px, 2vw, 18px)',
                fontFamily: "'Noto Serif SC', serif",
                letterSpacing: '0.05em',
                cursor: 'pointer',
              }}
            >
              注册 / 登录进行更个性化的精准匹配
            </motion.button>
          )}
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
