'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOCK_POSTS, CATEGORIES } from '@/lib/data/mock-posts'
import type { Post } from '@/lib/data/mock-posts'
import RiceModal from './RiceModal'

function PostActions({ post, onRice }: { post: Post; onRice: (postId: string, amount: number) => void }) {
  const [liked, setLiked] = useState(false)
  const [showRice, setShowRice] = useState(false)

  return (
    <>
      <div className="feed-actions">
        {/* Comment */}
        <button className="feed-action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{post.stats.comments || ''}</span>
        </button>

        {/* Repost */}
        <button className="feed-action-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
          <span>{post.stats.reposts || ''}</span>
        </button>

        {/* Like */}
        <button
          className={`feed-action-btn${liked ? ' liked' : ''}`}
          onClick={() => setLiked(!liked)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{post.stats.likes + (liked ? 1 : 0) || ''}</span>
        </button>

        {/* Donate Rice */}
        <button
          className="feed-action-btn"
          onClick={() => setShowRice(true)}
          title="打赏稻米"
        >
          <span style={{ fontSize: 15, lineHeight: 1 }}>🌾</span>
          <span>{post.stats.rice || ''}</span>
        </button>
      </div>

      <AnimatePresence>
        {showRice && (
          <RiceModal
            post={post}
            onClose={() => setShowRice(false)}
            onConfirm={(amount) => { onRice(post.id, amount); setShowRice(false) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function PostCard({ post, onRice }: { post: Post; onRice: (postId: string, amount: number) => void }) {
  return (
    <article className="feed-item">
      {/* Avatar */}
      {post.author.avatar ? (
        <img src={post.author.avatar} alt={post.author.name} className="feed-avatar" />
      ) : (
        <div className="feed-avatar-placeholder" style={{ background: post.author.color }}>
          {post.author.name[0]}
        </div>
      )}

      {/* Body */}
      <div className="feed-body">
        <div className="feed-author-row">
          <span className="feed-author-name">{post.author.name}</span>
          <span className="feed-author-id">@{post.author.handle}</span>
          <span className="feed-time">· {post.timestamp}</span>
        </div>

        <p className="feed-text" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

        {post.image && (
          <img src={post.image} alt="" className="feed-image" />
        )}

        <PostActions post={post} onRice={onRice} />
      </div>
    </article>
  )
}

export default function SquareFeed() {
  const [activeTab, setActiveTab] = useState('all')
  const [posts, setPosts] = useState(MOCK_POSTS)

  const filteredPosts = activeTab === 'all'
    ? posts
    : posts.filter((p) => p.category === activeTab)

  const handleRice = (postId: string, amount: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, stats: { ...p.stats, rice: p.stats.rice + amount } }
          : p
      )
    )
  }

  return (
    <div>
      {/* Tabs */}
      <div className="feed-header">
        <div className="feed-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`feed-tab${activeTab === cat.key ? ' active' : ''}`}
              onClick={() => setActiveTab(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="feed-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onRice={handleRice} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
