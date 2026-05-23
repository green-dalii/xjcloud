import CalendarPageClient from '@/components/calendar/CalendarPageClient'

export const metadata = {
  title: '活动日历 - 原乡',
  description: '探索乡村活动的月度日历视图',
}

export default function CalendarPage() {
  return (
    <main className="page-bg" style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 60 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        <CalendarPageClient />
      </div>
    </main>
  )
}
