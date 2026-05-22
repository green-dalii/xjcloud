'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Post } from '@/lib/data/mock-posts'

export default function RiceModal({
  post,
  onClose,
  onConfirm,
}: {
  post: Post
  onClose: () => void
  onConfirm: (amount: number) => void
}) {
  const [amount, setAmount] = useState(10)

  const decrement = () => setAmount((v) => Math.max(1, v - 1))
  const increment = () => setAmount((v) => v + 1)

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-title">打赏稻米</div>
        <div className="modal-desc">
          喜欢 @{post.author.handle} 的帖子？<br />
          说明很有价值啊~ 打赏作者稻米吧~
        </div>

        {/* Amount stepper */}
        <div className="amount-stepper">
          <button
            className="amount-stepper-btn"
            onClick={decrement}
            disabled={amount <= 1}
            aria-label="减少"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= 1) setAmount(v)
            }}
            className="amount-stepper-value"
          />
          <button
            className="amount-stepper-btn"
            onClick={increment}
            aria-label="增加"
          >
            +
          </button>
        </div>

        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>取消</button>
          <button className="btn-primary" onClick={() => onConfirm(amount)}>
            打赏 {amount} 稻米
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
