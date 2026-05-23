'use client'

import { Navbar, Footer } from '@/components/layout/NavbarFooter'
import PageProgress from '@/components/layout/PageProgress'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageProgress />
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
