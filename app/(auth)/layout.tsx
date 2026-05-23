'use client'

import { Navbar } from '@/components/layout/NavbarFooter'
import PageProgress from '@/components/layout/PageProgress'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-container page-bg"
      style={{ paddingTop: 80 }}
    >
      <PageProgress />
      <Navbar />
      <div className="auth-card"
        style={{ marginTop: 20 }}
      >
        {children}
      </div>
    </div>
  )
}
