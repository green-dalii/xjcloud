'use client'

import { motion, AnimatePresence } from 'framer-motion'

export interface GuideOption {
  label: string
  value: string
  subtitle?: string
  desc?: string
  emoji?: string
}

export interface GuideQuestion {
  key: string
  question: string
  options: GuideOption[]
  multi?: boolean
  layout?: 'vertical' | 'grid'
}

interface MultiStepGuideProps {
  step: number
  totalSteps: number
  questions: GuideQuestion[]
  answers: Record<string, string | string[]>
  onSelect: (key: string, value: string) => void
  onNext: () => void
  onPrev?: () => void
  onSkip: () => void
  onAuth?: () => void
  skipLabel?: string
  /** 点击这些选项值时不会自动推进到下一步 */
  preventAutoAdvance?: string[]
}

// Bento grid spans: row1 [7,5], row2 [4,4,4], row3 [3,6,3]
const BENTO_SPANS = [
  'col-span-7',
  'col-span-5',
  'col-span-4',
  'col-span-4',
  'col-span-4',
  'col-span-3',
  'col-span-6',
  'col-span-3',
]

export default function MultiStepGuide({
  step,
  totalSteps,
  questions,
  answers,
  onSelect,
  onNext,
  onPrev,
  onSkip,
  onAuth,
  skipLabel = '跳过，看全部结果 →',
  preventAutoAdvance = [],
}: MultiStepGuideProps) {
  const currentQ = questions[step - 1]
  if (!currentQ) return null

  const isFirstStep = step === 1
  const isMulti = !!currentQ.multi

  function isSelected(optValue: string): boolean {
    const val = answers[currentQ.key]
    if (Array.isArray(val)) return val.includes(optValue)
    return val === optValue
  }

  function handleOptionClick(optValue: string) {
    onSelect(currentQ.key, optValue)
    if (!isMulti && !preventAutoAdvance.includes(optValue)) {
      onNext()
    }
  }

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pt-28 md:pt-32 pb-20"
      style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 50%, #2d2a26 100%)' }}
    >
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
            {currentQ.question}
            {isMulti && '（可多选）'}
          </h2>

          {/* Single choice — responsive */}
          {!isMulti && (
            <div className={`flex gap-3 md:gap-4 w-full ${currentQ.layout === 'grid' ? 'flex-col md:grid md:grid-cols-2' : 'flex-col'}`}>
              {currentQ.options.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(201,169,110,0.12)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleOptionClick(opt.value)}
                  className={`w-full transition-colors duration-300 ${currentQ.layout === 'grid' ? 'py-5 px-6 rounded-2xl text-left' : 'py-4 px-8 rounded-full text-center'}`}
                  style={{
                    border: '1.5px solid rgba(245,241,234,0.18)',
                    backgroundColor: isSelected(opt.value)
                      ? 'rgba(201,169,110,0.15)'
                      : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {currentQ.layout === 'grid' ? (
                    <>
                      <div className="flex items-center gap-2.5 mb-1">
                        {opt.emoji && <span className="text-xl flex-shrink-0">{opt.emoji}</span>}
                        <span
                          className="font-serif"
                          style={{
                            color: isSelected(opt.value) ? '#c9a96e' : '#f5f1ea',
                            fontSize: 'clamp(15px, 2vw, 17px)',
                            fontWeight: 500,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {opt.label}
                        </span>
                      </div>
                      {opt.subtitle && (
                        <span
                          className="font-ui block"
                          style={{
                            color: isSelected(opt.value) ? 'rgba(201,169,110,0.7)' : 'rgba(245,241,234,0.45)',
                            fontSize: 'clamp(11px, 1.3vw, 12px)',
                            lineHeight: 1.5,
                            marginLeft: opt.emoji ? '2rem' : 0,
                          }}
                        >
                          {opt.subtitle}
                        </span>
                      )}
                    </>
                  ) : (
                    <span
                      className="font-serif"
                      style={{
                        color: isSelected(opt.value) ? '#c9a96e' : 'rgba(245,241,234,0.85)',
                        fontSize: 'clamp(16px, 2.5vw, 20px)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {opt.emoji && <>{opt.emoji} </>}
                      {opt.label}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          )}

          {/* Multi choice — Bento grid */}
          {isMulti && currentQ.options.length <= 8 && (
            <div className="w-full">
              <div className="grid grid-cols-12 gap-3 w-full">
                {currentQ.options.map((opt, idx) => {
                  const selected = isSelected(opt.value)
                  const spanClass = BENTO_SPANS[idx] || 'col-span-6'
                  return (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick(opt.value)}
                      className={`${spanClass} h-[88px] md:h-[96px] rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center px-3 overflow-hidden`}
                      style={{
                        border: selected
                          ? '1.5px solid rgba(201,169,110,0.5)'
                          : '1.5px solid rgba(245,241,234,0.1)',
                        backgroundColor: selected
                          ? 'rgba(201,169,110,0.1)'
                          : 'rgba(245,241,234,0.02)',
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
                        {opt.emoji && `${opt.emoji} `}
                        {opt.label}
                      </span>
                      {opt.subtitle && (
                        <span
                          className="font-ui mt-1"
                          style={{
                            fontSize: 'clamp(10px, 1.3vw, 11px)',
                            color: selected
                              ? 'rgba(201,169,110,0.7)'
                              : 'rgba(245,241,234,0.4)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {opt.subtitle}
                        </span>
                      )}
                      {opt.desc && (
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
                      )}
                    </motion.button>
                  )
                })}
              </div>

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

          {/* Multi choice — simple grid for >8 options */}
          {isMulti && currentQ.options.length > 8 && (
            <div className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                {currentQ.options.map((opt) => {
                  const selected = isSelected(opt.value)
                  return (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick(opt.value)}
                      className="h-[72px] md:h-[80px] rounded-2xl text-center transition-all duration-200 flex flex-col items-center justify-center px-3 overflow-hidden"
                      style={{
                        border: selected
                          ? '1.5px solid rgba(201,169,110,0.5)'
                          : '1.5px solid rgba(245,241,234,0.1)',
                        backgroundColor: selected
                          ? 'rgba(201,169,110,0.1)'
                          : 'rgba(245,241,234,0.02)',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        className="font-serif"
                        style={{
                          fontSize: 'clamp(14px, 2vw, 16px)',
                          fontWeight: 500,
                          color: selected ? '#c9a96e' : '#f5f1ea',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {opt.emoji && `${opt.emoji} `}
                        {opt.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>

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
        {skipLabel}
      </motion.button>
    </div>
  )
}
