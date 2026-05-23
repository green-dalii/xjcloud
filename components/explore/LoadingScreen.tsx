'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const LOADING_TEXTS = [
  '搓搓期待的小手，你的专属「周末逃跑计划」正一路小跑向你奔来…',
  '正在努力为你切断工作群的信号，生成专属避世指南…',
  '别急，你的乡村乌托邦正在梳妆打扮，马上就出来见你啦…',
  '正在把你的烦恼一脚踢飞，为你打包一份纯粹的快乐…',
  '正在为你打包山风、晚霞和一整天的松弛感…',
  '村口的大黄狗正在帮你叼来最新的活动计划，请耐心等它跑过那片草地…',
]

function getRandomText() {
  return LOADING_TEXTS[Math.floor(Math.random() * LOADING_TEXTS.length)]
}

export default function LoadingScreen() {
  const [text] = useState(() => getRandomText())

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #2d2a26 0%, #3a3630 50%, #2d2a26 100%)' }}
    >
      {/* Spinner */}
      <motion.div
        className="relative w-16 h-16 md:w-20 md:h-20 mb-10 md:mb-12"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid transparent',
            borderTopColor: '#c9a96e',
            borderRightColor: 'rgba(201,169,110,0.3)',
          }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            border: '2px solid transparent',
            borderBottomColor: '#c9a96e',
            borderLeftColor: 'rgba(201,169,110,0.2)',
          }}
          animate={{ rotate: -720 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center dot */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ background: '#c9a96e' }}
        />
      </motion.div>

      {/* Animated text */}
      <div className="min-h-[3rem] md:min-h-[3.5rem] flex items-center justify-center max-w-md px-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-ui text-sm md:text-base text-center leading-relaxed"
          style={{ color: 'rgba(245,241,234,0.7)' }}
        >
          {text}
        </motion.p>
      </div>

      {/* Decorative dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#c9a96e' }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}
