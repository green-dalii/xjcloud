'use client'

import { Navbar, Footer } from '@/components/layout/NavbarFooter'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
