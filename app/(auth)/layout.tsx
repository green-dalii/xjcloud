'use client'

import { useRouter } from 'next/navigation'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div className="auth-container page-bg">
      {/* Minimal nav — just logo */}
      <nav
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push('/')}
          style={{
            color: 'var(--text-heading)',
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 2,
            fontFamily: 'var(--font-serif)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          原<span style={{ color: 'var(--color-wheat)' }}>乡</span>
        </button>
      </nav>

      <div className="auth-card">
        {children}
      </div>
    </div>
  )
}
