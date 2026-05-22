'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      {!isHome && <Header />}
      <main className={isHome ? '' : 'max-w-6xl mx-auto px-4 pb-20 md:pb-8'}>
        {children}
      </main>
      {!isHome && <BottomNav />}
    </>
  )
}
