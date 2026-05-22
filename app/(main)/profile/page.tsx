'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { UserInfo } from '@/components/profile/UserInfo'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/users/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUser(data.data)
        })
        .finally(() => setLoading(false))
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status])

  if (status === 'loading' || loading) {
    return <div className="p-8 text-center text-gray-500">加载中...</div>
  }

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">请先登录</p>
        <a href="/login" className="text-xj-amber font-medium">
          去登录 →
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-6">
      {user && <UserInfo user={user} />}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">我的活动</h3>
        <p className="text-gray-500 text-sm">暂无活动（活动功能即将上线）</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">我的发布</h3>
        <p className="text-gray-500 text-sm">暂无内容（去 Feed 发布第一条吧）</p>
      </div>
    </div>
  )
}
