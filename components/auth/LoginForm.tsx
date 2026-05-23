'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '邮箱或密码错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="auth-heading">登录</h2>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)' }}>
          <span className="text-sm flex-shrink-0">⚠️</span>
          <p className="font-ui text-sm" style={{ color: '#dc3545' }}>{error}</p>
        </div>
      )}

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

      <button
        type="submit"
        disabled={loading}
        className="auth-submit"
      >
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  )
}
