'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('participant')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error?.message || '注册失败')
      } else {
        router.push('/login')
      }
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="auth-heading">注册</h2>

      {error && <p className="auth-error">{error}</p>}

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
