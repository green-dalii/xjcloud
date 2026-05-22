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
        <div className="modal-title">打赏稻米 🌾</div>
        <div className="modal-desc">
          喜欢 @{post.author.handle} 的帖子？<br />
          说明很有价值啊~ 打赏作者稻米吧~ 🌾
        </div>

        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
          className="modal-input"
        />

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
