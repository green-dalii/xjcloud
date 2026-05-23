'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth, getUserInitial, type User } from '@/lib/auth-context'
import { INTEREST_OPTIONS } from '@/lib/data/mock-activities'
import { PROVINCE_CITY_DATA, PROVINCES } from '@/lib/data/china-regions'
import {
  MOCK_ENROLLMENTS,
  MOCK_PUBLISHED_ACTIVITIES,
  ENROLLMENT_STATUS_LABEL,
  ENROLLMENT_STATUS_COLOR,
  PUBLISHED_STATUS_LABEL,
  PUBLISHED_STATUS_COLOR,
} from '@/lib/data/mock-profile'
import type { Gender, MyEnrollment, MyPublishedActivity } from '@/lib/data/mock-profile'

const ROLE_LABELS: Record<string, string> = {
  participant: '参与者',
  organizer: '组织者',
  provider: '服务方',
}

const GENDER_LABELS: Record<Gender, string> = {
  male: '男',
  female: '女',
  unspecified: '暂不透露',
}

type Section = 'info' | 'edit' | 'enrolled' | 'published'

function parseLocation(location: string | null): { province: string; city: string } {
  if (!location) return { province: '', city: '' }
  const parts = location.split(' · ')
  return { province: parts[0] || '', city: parts[1] || '' }
}

function formatLocation(province: string, city: string): string {
  if (!province) return ''
  if (!city) return province
  return `${province} · ${city}`
}

function groupByMonth<T extends { date: string }>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {}
  for (const item of items) {
    const d = new Date(item.date)
    const key = `${d.getFullYear()}年${d.getMonth() + 1}月`
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }
  return groups
}

function sortMonthKeysDesc(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const parse = (s: string) => {
      const m = s.match(/(\d+)年(\d+)月/)
      return m ? parseInt(m[1]) * 100 + parseInt(m[2]) : 0
    }
    return parse(b) - parse(a)
  })
}

/* ─── Tag Input (GitHub Topics style) ─── */

function TagInput({
  tags,
  onChange,
  placeholder,
  maxTags = 10,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}) {
  const [input, setInput] = useState('')

  const addTag = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (tags.includes(trimmed)) {
      setInput('')
      return
    }
    if (tags.length >= maxTags) return
    onChange([...tags, trimmed])
    setInput('')
  }

  const removeTag = (idx: number) => {
    onChange(tags.filter((_, i) => i !== idx))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === '，') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      style={{
        background: 'rgba(245,241,234,0.08)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        padding: '8px 10px',
        minHeight: 44,
      }}
    >
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 font-ui text-xs px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(52,211,153,0.12)',
            color: '#34d399',
            border: '1px solid rgba(52,211,153,0.2)',
          }}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="ml-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full transition-colors duration-200 hover:bg-[rgba(52,211,153,0.2)]"
            style={{ fontSize: 11, lineHeight: 1 }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (input.trim()) addTag(input)
        }}
        className="flex-1 bg-transparent font-ui text-sm outline-none min-w-[80px]"
        style={{ color: 'var(--text-primary)' }}
        placeholder={tags.length === 0 ? placeholder : ''}
      />
    </div>
  )
}

/* ─── Profile Editor ─── */

function ProfileEditor({
  user,
  onSave,
  onCancel,
}: {
  user: User
  onSave: (data: Partial<User>) => Promise<void>
  onCancel: () => void
}) {
  const loc = parseLocation(user.location)
  const [province, setProvince] = useState(loc.province)
  const [city, setCity] = useState(loc.city)

  const [form, setForm] = useState({
    name: user.name || '',
    role: user.role || 'participant',
    gender: (user.gender || 'unspecified') as Gender,
    age: user.age?.toString() || '',
    interests: user.interests || [],
    avatar: user.avatar || '',
    phone: user.phone || '',
    website: user.website || '',
    skills: user.skills || [],
    bio: user.bio || '',
  })
  const [saving, setSaving] = useState(false)

  const cities = province ? PROVINCE_CITY_DATA[province] || [] : []

  const handleProvinceChange = (p: string) => {
    setProvince(p)
    setCity('')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({
        name: form.name,
        role: form.role,
        gender: form.gender === 'unspecified' ? null : form.gender,
        age: form.age ? parseInt(form.age, 10) : null,
        location: formatLocation(province, city) || null,
        interests: form.interests.length > 0 ? form.interests : null,
        avatar: form.avatar || null,
        phone: form.phone || null,
        website: form.website || null,
        skills: form.skills.length > 0 ? form.skills : null,
        bio: form.bio || null,
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleInterest = (value: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }))
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

  const labelStyle = { color: 'var(--text-muted)' } as const

  return (
    <div className="space-y-6">
      {/* 基本身份 */}
      <div>
        <p className="font-ui text-xs tracking-widest uppercase mb-3" style={labelStyle}>基本身份</p>
        <div className="space-y-4">
          <div>
            <label className="font-ui text-xs block mb-2" style={labelStyle}>身份</label>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as User['role'] }))}
              className="auth-input"
              style={{ cursor: 'pointer', color: 'var(--text-body)' }}
            >
              <option value="participant" style={{ background: 'var(--bg-ink)' }}>参与者</option>
              <option value="organizer" style={{ background: 'var(--bg-ink)' }}>组织者</option>
              <option value="provider" style={{ background: 'var(--bg-ink)' }}>服务方</option>
            </select>
          </div>
          <div>
            <label className="font-ui text-xs block mb-2" style={labelStyle}>姓名</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* 匹配信息 */}
      <div>
        <p className="font-ui text-xs tracking-widest uppercase mb-3" style={labelStyle}>匹配信息</p>
        <div className="space-y-4">
          <div>
            <label className="font-ui text-xs block mb-2" style={labelStyle}>性别</label>
            <div className="flex gap-2 flex-wrap">
              {(['male', 'female', 'unspecified'] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, gender: g }))}
                  className="font-ui text-xs"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 50,
                    border: `1px solid ${form.gender === g ? 'var(--color-wheat)' : 'var(--border-subtle)'}`,
                    background: form.gender === g ? 'rgba(201,169,110,0.12)' : 'transparent',
                    color: form.gender === g ? 'var(--color-wheat)' : 'var(--text-body)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {GENDER_LABELS[g]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-ui text-xs block mb-2" style={labelStyle}>年龄</label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={3}
              value={form.age}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '')
                setForm((f) => ({ ...f, age: v }))
              }}
              style={inputStyle}
              placeholder="填写年龄有助于匹配适合的活动"
            />
          </div>
          <div>
            <label className="font-ui text-xs block mb-2" style={labelStyle}>常居地</label>
            <div className="flex gap-2">
              <select
                value={province}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="auth-input"
                style={{ cursor: 'pointer', color: 'var(--text-body)', flex: 1 }}
              >
                <option value="" style={{ background: 'var(--bg-ink)' }}>选择省份</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p} style={{ background: 'var(--bg-ink)' }}>{p}</option>
                ))}
              </select>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="auth-input"
                style={{ cursor: 'pointer', color: 'var(--text-body)', flex: 1 }}
                disabled={!province}
              >
                <option value="" style={{ background: 'var(--bg-ink)' }}>选择城市</option>
                {cities.map((c) => (
                  <option key={c} value={c} style={{ background: 'var(--bg-ink)' }}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="font-ui text-xs block mb-2" style={labelStyle}>技能特长</label>
            <TagInput
              tags={form.skills}
              onChange={(tags) => setForm((f) => ({ ...f, skills: tags }))}
              placeholder="输入技能后按回车或逗号添加，如摄影、编程..."
              maxTags={10}
            />
          </div>
          <div>
            <label className="font-ui text-xs block mb-2" style={labelStyle}>兴趣方向（可多选）</label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleInterest(opt.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 50,
                    border: `1px solid ${form.interests.includes(opt.value) ? 'var(--color-wheat)' : 'var(--border-subtle)'}`,
                    background: form.interests.includes(opt.value) ? 'rgba(201,169,110,0.12)' : 'transparent',
                    color: form.interests.includes(opt.value) ? 'var(--color-wheat)' : 'var(--text-body)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 联系方式 */}
      <div>
        <p className="font-ui text-xs tracking-widest uppercase mb-3" style={labelStyle}>联系方式</p>
        <div className="space-y-4">
          <div>
            <label className="font-ui text-xs block mb-2" style={labelStyle}>头像 URL</label>
            <input
              value={form.avatar}
              onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
              style={inputStyle}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="font-ui text-xs block mb-2" style={labelStyle}>手机号</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="font-ui text-xs block mb-2" style={labelStyle}>个人网站</label>
            <input
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              style={inputStyle}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* 关于你 */}
      <div>
        <p className="font-ui text-xs tracking-widest uppercase mb-3" style={labelStyle}>关于你</p>
        <div>
          <label className="font-ui text-xs block mb-2" style={labelStyle}>个人简介</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' as const }}
            placeholder="简单介绍一下自己，让更多人了解你..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
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

/* ─── Month Timeline (shared) ─── */

function MonthTimeline({ items, maxHeight = 480 }: { items: TimelineItem[]; maxHeight?: number }) {
  const grouped = useMemo(() => groupByMonth(items), [items])
  const sortedMonths = useMemo(() => sortMonthKeysDesc(Object.keys(grouped)), [grouped])

  return (
    <div className="overflow-y-auto pr-1" style={{ maxHeight }}>
      <div className="relative">
        <div
          className="absolute left-[11px] md:left-[15px] top-3 bottom-3 w-[1px]"
          style={{ background: 'var(--border-subtle)' }}
        />
        <div className="space-y-6">
          {sortedMonths.map((month) => (
            <div key={month}>
              <div className="relative flex items-center gap-3 mb-3">
                <div
                  className="relative z-10 w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--bg-ink)', border: '2px solid var(--color-wheat)' }}
                >
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ background: 'var(--color-wheat)' }} />
                </div>
                <span className="font-ui text-xs tracking-wider" style={{ color: 'var(--color-wheat)', fontWeight: 500 }}>
                  {month}
                </span>
              </div>
              <div className="space-y-3">
                {grouped[month].map((item) => (
                  <div key={item.id} className="relative pl-8 md:pl-10">
                    <div
                      className="absolute left-[14px] md:left-[18px] top-3 w-[5px] h-[5px] md:w-[6px] md:h-[6px] rounded-full"
                      style={{ background: 'var(--border-default)' }}
                    />
                    {item.render()}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface TimelineItem {
  id: string
  date: string
  render: () => React.ReactNode
}

/* ─── Enrollment Card ─── */

function EnrollmentCard({ enrollment }: { enrollment: MyEnrollment }) {
  const { activity, status } = enrollment
  const colors = ENROLLMENT_STATUS_COLOR[status]

  return (
    <div
      className="flex gap-3 p-3 rounded-xl"
      style={{
        background: 'rgba(45, 42, 38, 0.5)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="w-14 h-14 md:w-16 md:h-16 rounded-lg flex-shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${activity.image})` }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h4 className="font-serif text-sm truncate" style={{ color: 'var(--text-heading)', fontWeight: 500 }}>
            {activity.title}
          </h4>
          <span
            className="font-ui text-[11px] px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
          >
            {ENROLLMENT_STATUS_LABEL[status]}
          </span>
        </div>
        <p className="font-ui text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{activity.location}</p>
        <div className="flex items-center gap-3 font-ui text-xs" style={{ color: 'var(--text-dim)' }}>
          <span>¥{activity.price}</span>
          <span>{activity.duration}</span>
          <span>{activity.maxPeople}人</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Published Card ─── */

function PublishedCard({ activity }: { activity: MyPublishedActivity }) {
  const colors = PUBLISHED_STATUS_COLOR[activity.status]

  return (
    <div
      className="p-3 rounded-xl"
      style={{
        background: 'rgba(45, 42, 38, 0.5)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg flex-shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${activity.image})` }}
          />
          <div>
            <h4 className="font-serif text-sm" style={{ color: 'var(--text-heading)', fontWeight: 500 }}>
              {activity.title}
            </h4>
            <p className="font-ui text-xs" style={{ color: 'var(--text-muted)' }}>{activity.location}</p>
          </div>
        </div>
        <span
          className="font-ui text-[11px] px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
        >
          {PUBLISHED_STATUS_LABEL[activity.status]}
        </span>
      </div>
      <div className="flex items-center gap-4 font-ui text-xs" style={{ color: 'var(--text-dim)' }}>
        <span>{activity.startDate} ~ {activity.endDate}</span>
        <span>{activity.enrolledCount}/{activity.capacity} 人已报名</span>
      </div>
    </div>
  )
}

/* ─── User Info Section ─── */

function UserInfoSection({ user, hasDetails, onEdit }: { user: User; hasDetails: boolean; onEdit: () => void }) {
  const skillTags = user.skills || []

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt=""
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div
            className="flex items-center justify-center text-2xl"
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--color-wheat)', color: 'var(--bg-ink)',
              fontWeight: 600, fontFamily: 'var(--font-ui)', flexShrink: 0,
            }}
          >
            {getUserInitial(user)}
          </div>
        )}
        <div className="min-w-0">
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

      <div className="space-y-3">
        {user.gender && user.gender !== 'unspecified' && (
          <div className="flex items-center gap-2">
            <span className="font-ui text-xs" style={{ color: 'var(--text-muted)', minWidth: 48 }}>性别</span>
            <span className="font-ui text-sm" style={{ color: 'var(--text-body)' }}>{GENDER_LABELS[user.gender]}</span>
          </div>
        )}
        {user.age != null && (
          <div className="flex items-center gap-2">
            <span className="font-ui text-xs" style={{ color: 'var(--text-muted)', minWidth: 48 }}>年龄</span>
            <span className="font-ui text-sm" style={{ color: 'var(--text-body)' }}>{user.age} 岁</span>
          </div>
        )}
        {user.location && (
          <div className="flex items-center gap-2">
            <span className="font-ui text-xs" style={{ color: 'var(--text-muted)', minWidth: 48 }}>常居地</span>
            <span className="font-ui text-sm" style={{ color: 'var(--text-body)' }}>{user.location}</span>
          </div>
        )}
        {skillTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-ui text-xs" style={{ color: 'var(--text-muted)', minWidth: 48 }}>技能</span>
            <div className="flex flex-wrap gap-1">
              {skillTags.map((tag, i) => (
                <span key={i} className="font-ui text-xs" style={{
                  background: 'rgba(52,211,153,0.1)', color: '#34d399',
                  padding: '2px 8px', borderRadius: 50,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {user.bio && (
          <div>
            <span className="font-ui text-xs" style={{ color: 'var(--text-muted)' }}>简介</span>
            <p className="font-ui text-sm mt-0.5" style={{ color: 'var(--text-body)' }}>{user.bio}</p>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-2">
            <span className="font-ui text-xs" style={{ color: 'var(--text-muted)', minWidth: 48 }}>手机</span>
            <span className="font-ui text-sm" style={{ color: 'var(--text-body)' }}>{user.phone}</span>
          </div>
        )}
        {user.website && (
          <div className="flex items-center gap-2">
            <span className="font-ui text-xs" style={{ color: 'var(--text-muted)', minWidth: 48 }}>网站</span>
            <a href={user.website} target="_blank" rel="noopener noreferrer" className="font-ui text-sm" style={{ color: 'var(--color-wheat)' }}>
              {user.website}
            </a>
          </div>
        )}
        {user.interests && user.interests.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-ui text-xs" style={{ color: 'var(--text-muted)', minWidth: 48 }}>兴趣</span>
            <div className="flex flex-wrap gap-1">
              {user.interests.map((tag, i) => (
                <span key={i} className="font-ui text-xs" style={{
                  background: 'rgba(201,169,110,0.12)', color: 'var(--color-wheat)',
                  padding: '2px 8px', borderRadius: 50,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {!hasDetails && (
          <p className="font-ui text-sm" style={{ color: 'var(--text-muted)' }}>暂无更多信息</p>
        )}
      </div>

      <button onClick={onEdit} className="btn-primary w-full mt-6">
        编辑资料
      </button>
    </div>
  )
}

/* ─── Sidebar Nav ─── */

const NAV_ITEMS: { key: Section; label: string; emoji: string }[] = [
  { key: 'info', label: '用户信息', emoji: '👤' },
  { key: 'edit', label: '编辑资料', emoji: '✏️' },
  { key: 'enrolled', label: '参加的活动', emoji: '📋' },
  { key: 'published', label: '发布的活动', emoji: '📌' },
]

/* ─── Main Page ─── */

export default function ProfilePage() {
  const { user, loading, logout, updateProfile } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<Section>('info')

  // Deep-link support: ?section=published|enrolled|edit|info
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const section = params.get('section')
    if (section && ['info', 'edit', 'enrolled', 'published'].includes(section)) {
      setActiveSection(section as Section)
    }
  }, [])

  const handleSave = useCallback(async (data: Partial<User>) => {
    await updateProfile(data)
    setActiveSection('info')
  }, [updateProfile])

  const enrollmentTimelineItems = useMemo(() =>
    MOCK_ENROLLMENTS.map((e) => ({
      id: e.id,
      date: e.enrolledAt,
      render: () => <EnrollmentCard enrollment={e} />,
    })),
    []
  )

  const publishedTimelineItems = useMemo(() =>
    MOCK_PUBLISHED_ACTIVITIES.map((a) => ({
      id: a.id,
      date: a.startDate,
      render: () => <PublishedCard activity={a} />,
    })),
    []
  )

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

  const hasDetails = !!(
    user.bio ||
    user.phone ||
    user.location ||
    user.website ||
    user.gender ||
    user.age != null ||
    (user.skills && user.skills.length > 0) ||
    (user.interests && user.interests.length > 0)
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'info':
        return <UserInfoSection user={user} hasDetails={hasDetails} onEdit={() => setActiveSection('edit')} />
      case 'edit':
        return <ProfileEditor user={user} onSave={handleSave} onCancel={() => setActiveSection('info')} />
      case 'enrolled':
        return (
          <div>
            <h3 className="font-serif mb-4" style={{ fontSize: 16, color: 'var(--text-heading)', fontWeight: 500 }}>
              我参加的活动
            </h3>
            <MonthTimeline items={enrollmentTimelineItems} maxHeight={480} />
          </div>
        )
      case 'published':
        return (
          <div>
            <h3 className="font-serif mb-4" style={{ fontSize: 16, color: 'var(--text-heading)', fontWeight: 500 }}>
              我发布的活动
            </h3>
            <MonthTimeline items={publishedTimelineItems} maxHeight={480} />
          </div>
        )
    }
  }

  return (
    <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div className="max-w-[960px] mx-auto px-6 py-8">
        {/* Mobile: horizontal tab bar */}
        <div className="md:hidden flex gap-1 mb-4 overflow-x-auto pb-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className="flex-shrink-0 font-ui text-xs px-3 py-2 rounded-full transition-all duration-200"
              style={{
                background: activeSection === item.key ? 'rgba(201,169,110,0.15)' : 'transparent',
                color: activeSection === item.key ? 'var(--color-wheat)' : 'var(--text-muted)',
                border: `1px solid ${activeSection === item.key ? 'rgba(201,169,110,0.35)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
              }}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>

        {/* Desktop: left-right layout */}
        <div className="md:flex md:gap-6">
          {/* Left sidebar — desktop only */}
          <div className="hidden md:block w-[200px] flex-shrink-0">
            <div style={cardStyle} className="p-4 sticky top-[100px]">
              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.key
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveSection(item.key)}
                      className="w-full text-left font-ui text-sm px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2.5"
                      style={{
                        background: isActive ? 'rgba(201,169,110,0.1)' : 'transparent',
                        color: isActive ? 'var(--color-wheat)' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => { logout(); router.push('/') }}
                  className="w-full text-left font-ui text-sm px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2.5"
                  style={{
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span className="text-base">🚪</span>
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {/* Profile completion prompt */}
            {!hasDetails && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl mb-4"
                style={{
                  background: 'rgba(201,169,110,0.08)',
                  border: '1px solid rgba(201,169,110,0.2)',
                }}
              >
                <span className="text-xl">✨</span>
                <div className="flex-1">
                  <p className="font-ui text-sm" style={{ color: 'var(--text-heading)' }}>
                    完善个人资料，开启精彩体验
                  </p>
                  <p className="font-ui text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    填写兴趣方向、所在地、技能等信息，我们将为你提供更优质的服务
                  </p>
                </div>
                {activeSection !== 'edit' && (
                <button
                  onClick={() => setActiveSection('edit')}
                  className="font-ui text-xs font-medium px-4 py-2 rounded-lg flex-shrink-0 transition-all duration-300 hover:brightness-110"
                  style={{
                    background: 'var(--color-wheat)',
                    color: 'var(--bg-ink)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  去完善
                </button>
                )}
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={cardStyle}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>

            {/* Mobile logout button */}
            <div className="md:hidden mt-4">
              <button
                onClick={() => { logout(); router.push('/') }}
                className="btn-ghost w-full"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
