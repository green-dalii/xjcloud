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
    <div
      style={{
        background: 'rgba(45, 42, 38, 0.6)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: 24,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center text-2xl"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--color-wheat)',
            color: 'var(--bg-ink)',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            flexShrink: 0,
          }}
        >
          {user.name[0]}
        </div>
        <div>
          <h2
            className="font-serif"
            style={{ fontSize: 20, color: 'var(--text-heading)', fontWeight: 500 }}
          >
            {user.name}
          </h2>
          <p
            className="font-ui"
            style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}
          >
            {user.email}
          </p>
          <div className="flex gap-2" style={{ marginTop: 6 }}>
            <span
              className="font-ui text-xs"
              style={{
                background: 'var(--wheat-bg)',
                color: 'var(--color-wheat)',
                padding: '2px 10px',
                borderRadius: 50,
              }}
            >
              {roleLabels[user.role] || user.role}
            </span>
            <span
              className="font-ui text-xs"
              style={{
                background: 'var(--success-bg)',
                color: 'var(--color-success)',
                padding: '2px 10px',
                borderRadius: 50,
              }}
            >
              {user.riceBalance} 稻米
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
