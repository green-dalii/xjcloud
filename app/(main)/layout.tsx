import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 pb-20 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </>
  )
}
