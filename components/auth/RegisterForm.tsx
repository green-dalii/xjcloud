'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('participant')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await register({ name, email, password, role })
      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(61,90,63,0.1)' }}>
          <span className="text-3xl">&#10003;</span>
        </div>
        <h2 className="auth-heading">注册成功</h2>
        <p className="font-ui" style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
          欢迎加入原乡，即将跳转首页...
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="auth-heading">注册</h2>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)' }}>
          <span className="text-sm flex-shrink-0">⚠️</span>
          <p className="font-ui text-sm" style={{ color: '#dc3545' }}>{error}</p>
        </div>
      )}

      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="姓名"
          className="auth-input"
        />
      </div>

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="邮箱"
          className="auth-input"
        />
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="密码"
          className="auth-input"
        />
      </div>

      <div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="auth-input"
          style={{ cursor: 'pointer', color: 'var(--text-body)' }}
        >
          <option value="participant" style={{ background: 'var(--bg-ink)' }}>参与者</option>
          <option value="organizer" style={{ background: 'var(--bg-ink)' }}>组织者</option>
          <option value="provider" style={{ background: 'var(--bg-ink)' }}>服务方</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="auth-submit"
      >
        {loading ? '注册中...' : '注册'}
      </button>
    </form>
  )
}
