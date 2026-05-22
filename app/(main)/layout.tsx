'use client'

import { usePathname } from 'next/navigation'
import { Navbar, Footer } from '@/components/layout/NavbarFooter'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      {!isHome && <Navbar />}
      <main className={isHome ? '' : 'min-h-screen'}>
        {children}
      </main>
      {!isHome && <Footer />}
    </>
  )
}
