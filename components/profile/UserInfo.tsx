interface UserInfoProps {
  user: {
    name: string
    email: string
    role: string
    riceBalance: number
    createdAt: string
  }
}

export function UserInfo({ user }: UserInfoProps) {
  const roleLabels: Record<string, string> = {
    participant: '参与者',
    organizer: '组织者',
    provider: '服务方',
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-xj-amber rounded-full flex items-center justify-center text-white text-2xl">
          {user.name[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-xj-amber/10 text-xj-amber px-2 py-0.5 rounded-full">
              {roleLabels[user.role] || user.role}
            </span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              🌾 {user.riceBalance} 稻米
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
