'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserInfo } from '@/components/profile/UserInfo'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
        <div className="max-w-[600px] mx-auto px-6 py-8 text-center font-ui" style={{ color: 'var(--text-secondary)' }}>
          加载中...
        </div>
      </div>
    )
  }

  if (!session) {
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

  // 静态导出阶段：从 session 提取用户信息，后端 API 暂未启用
  const user = {
    name: session.user?.name || session.user?.email?.split('@')[0] || '用户',
    email: session.user?.email || '',
    role: session.user?.role || 'participant',
    riceBalance: 0,
    createdAt: new Date().toISOString(),
  }

  return (
    <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div className="max-w-[600px] mx-auto px-6 py-8 space-y-6">
        <UserInfo user={user} />

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
