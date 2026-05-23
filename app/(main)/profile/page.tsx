'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, type User } from '@/lib/auth-context'

const ROLE_LABELS: Record<string, string> = {
  participant: '参与者',
  organizer: '组织者',
  provider: '服务方',
}

interface ProfileEditorProps {
  user: User
  onSave: (data: Partial<User>) => Promise<void>
  onCancel: () => void
}

function ProfileEditor({ user, onSave, onCancel }: ProfileEditorProps) {
  const [form, setForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    phone: user.phone || '',
    location: user.location || '',
    website: user.website || '',
    avatar: user.avatar || '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    background: 'rgba(245,241,234,0.08)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 8,
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontSize: 14,
    fontFamily: 'var(--font-ui)',
    width: '100%' as const,
    outline: 'none',
  }

  return (
    <div style={{
      background: 'rgba(45, 42, 38, 0.6)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 16,
      padding: 24,
      backdropFilter: 'blur(8px)',
    }}>
      <h3 className="font-serif mb-5" style={{ fontSize: 18, color: 'var(--text-heading)', fontWeight: 500 }}>
        编辑资料
      </h3>
      <div className="space-y-4">
        <div>
          <label className="font-ui text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>姓名</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <label className="font-ui text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>头像 URL</label>
          <input value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} style={inputStyle} placeholder="https://..." />
        </div>
        <div>
          <label className="font-ui text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>个人简介</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' as const }} />
        </div>
        <div>
          <label className="font-ui text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>手机号</label>
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <label className="font-ui text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>所在地</label>
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={inputStyle} />
        </div>
        <div>
          <label className="font-ui text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>个人网站</label>
          <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} style={inputStyle} placeholder="https://..." />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
          {saving ? '保存中...' : '保存'}
        </button>
        <button onClick={onCancel} className="btn-ghost flex-1">
          取消
        </button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, loading, logout, updateProfile } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)

  if (loading) {
    return (
      <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
        <div className="max-w-[600px] mx-auto px-6 py-8 text-center font-ui" style={{ color: 'var(--text-secondary)' }}>
          加载中...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
        <div className="max-w-[600px] mx-auto px-6 py-8 text-center">
          <p className="font-ui mb-4" style={{ color: 'var(--text-secondary)' }}>请先登录</p>
          <button
            onClick={() => router.push('/login')}
            className="font-ui font-medium transition-colors duration-300 hover:underline"
            style={{ color: 'var(--color-wheat)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            去登录 →
          </button>
        </div>
      </div>
    )
  }

  const cardStyle = {
    background: 'rgba(45, 42, 38, 0.6)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 16,
    padding: 24,
    backdropFilter: 'blur(8px)',
  }

  const handleSave = async (data: Partial<User>) => {
    await updateProfile(data)
    setEditing(false)
  }

  return (
    <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div className="max-w-[600px] mx-auto px-6 py-8 space-y-6">
        {/* User info card */}
        <div style={cardStyle}>
          <div className="flex items-center gap-4 mb-6">
            {user.avatar ? (
              <img src={user.avatar} alt="" style={{
                width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
              }} />
            ) : (
              <div className="flex items-center justify-center text-2xl" style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--color-wheat)', color: 'var(--bg-ink)',
                fontWeight: 600, fontFamily: 'var(--font-ui)', flexShrink: 0,
              }}>
                {user.name[0]}
              </div>
            )}
            <div>
              <h2 className="font-serif" style={{ fontSize: 20, color: 'var(--text-heading)', fontWeight: 500 }}>
                {user.name}
              </h2>
              <p className="font-ui" style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}>
                {user.email}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="font-ui text-xs" style={{
                  background: 'var(--wheat-bg)', color: 'var(--color-wheat)',
                  padding: '2px 10px', borderRadius: 50,
                }}>
                  {ROLE_LABELS[user.role] || user.role}
                </span>
                <span className="font-ui text-xs" style={{
                  background: 'var(--success-bg)', color: 'var(--color-success)',
                  padding: '2px 10px', borderRadius: 50,
                }}>
                  {user.riceBalance} 稻米
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {user.bio && (
              <div>
                <span className="font-ui text-xs" style={{ color: 'var(--text-muted)' }}>简介</span>
                <p className="font-ui text-sm mt-0.5" style={{ color: 'var(--text-body)' }}>{user.bio}</p>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-2">
                <span className="font-ui text-xs" style={{ color: 'var(--text-muted)' }}>手机</span>
                <span className="font-ui text-sm" style={{ color: 'var(--text-body)' }}>{user.phone}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-2">
                <span className="font-ui text-xs" style={{ color: 'var(--text-muted)' }}>所在地</span>
                <span className="font-ui text-sm" style={{ color: 'var(--text-body)' }}>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-2">
                <span className="font-ui text-xs" style={{ color: 'var(--text-muted)' }}>网站</span>
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="font-ui text-sm" style={{ color: 'var(--color-wheat)' }}>
                  {user.website}
                </a>
              </div>
            )}
            {user.interests && user.interests.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-ui text-xs" style={{ color: 'var(--text-muted)' }}>兴趣</span>
                {user.interests.map((tag, i) => (
                  <span key={i} className="font-ui text-xs" style={{
                    background: 'rgba(201,169,110,0.12)', color: 'var(--color-wheat)',
                    padding: '2px 8px', borderRadius: 50,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {!user.bio && !user.phone && !user.location && !user.website && (!user.interests || user.interests.length === 0) && (
              <p className="font-ui text-sm" style={{ color: 'var(--text-muted)' }}>
                暂无更多信息
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setEditing(true)} className="btn-primary flex-1">
              编辑资料
            </button>
            <button onClick={() => { logout(); router.push('/') }} className="btn-ghost flex-1">
              退出登录
            </button>
          </div>
        </div>

        {editing && (
          <ProfileEditor
            user={user}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        )}

        <div style={cardStyle}>
          <h3 className="font-serif mb-4" style={{ fontSize: 16, color: 'var(--text-heading)', fontWeight: 500 }}>
            我的活动
          </h3>
          <p className="font-ui text-sm" style={{ color: 'var(--text-secondary)' }}>
            暂无活动（活动功能即将上线）
          </p>
        </div>

        <div style={cardStyle}>
          <h3 className="font-serif mb-4" style={{ fontSize: 16, color: 'var(--text-heading)', fontWeight: 500 }}>
            我的发布
          </h3>
          <p className="font-ui text-sm" style={{ color: 'var(--text-secondary)' }}>
            暂无内容（去广场发布第一条吧）
          </p>
        </div>
      </div>
    </div>
  )
}
