'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: '探索', href: '/explore' },
  { label: '日历', href: '/calendar' },
  { label: '共建', href: '/host' },
  { label: '广场', href: '/square' },
]

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isHome = pathname === '/'
  const isAuthPage = pathname === '/login' || pathname === '/register'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Home page: transparent when not scrolled, otherwise same as other pages
  const isTransparent = isHome && !scrolled && !mobileOpen

  const bgStyle = isTransparent
    ? { backgroundColor: 'transparent', backdropFilter: 'none' as const, WebkitBackdropFilter: 'none' as const }
    : { backgroundColor: 'rgba(245, 241, 234, 0.92)', backdropFilter: 'blur(14px) saturate(160%)' as const, WebkitBackdropFilter: 'blur(14px) saturate(160%)' as const }

  const textColor = isTransparent ? 'var(--text-heading)' : 'var(--bg-ink)'
  const mutedColor = isTransparent ? 'var(--text-secondary)' : 'rgba(45,42,38,0.55)'

  if (isAuthPage) {
    // Auth pages: minimal nav with just logo
    return (
      <nav className="fixed top-0 left-0 w-full z-50" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center h-14">
          <button
            onClick={() => router.push('/')}
            className="transition-colors duration-500"
            style={{
              color: 'var(--text-heading)',
              letterSpacing: 2,
              fontSize: 17,
              fontWeight: 600,
              fontFamily: 'var(--font-serif)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            原<span style={{ color: 'var(--color-wheat)' }}>乡</span>
          </button>
        </div>
      </nav>
    )
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
        style={bgStyle}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 flex items-center justify-between h-14">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="transition-colors duration-500"
            style={{
              color: textColor,
              letterSpacing: 2,
              fontSize: 17,
              fontWeight: 600,
              fontFamily: 'var(--font-serif)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            原<span style={{ color: 'var(--color-wheat)' }}>乡</span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className="font-ui text-xs tracking-widest uppercase cursor-pointer transition-colors duration-500"
                style={{ color: mutedColor, background: 'none', border: 'none' }}
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'authenticated' && session?.user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-80"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'var(--color-wheat)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--bg-ink)',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: 'var(--font-ui)',
                    }}
                  >
                    {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                  </div>
                  <span
                    className="font-ui text-xs"
                    style={{ color: mutedColor }}
                  >
                    {session.user.name || session.user.email?.split('@')[0]}
                  </span>
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="font-ui text-xs tracking-wider cursor-pointer transition-colors duration-300"
                  style={{ color: mutedColor, background: 'none', border: 'none' }}
                >
                  退出
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="font-ui text-xs tracking-widest uppercase transition-all duration-500"
                style={{
                  color: isTransparent ? 'rgba(245,241,234,0.8)' : 'var(--color-moss)',
                  border: isTransparent ? '1px solid var(--border-default)' : '1px solid rgba(61,90,63,0.25)',
                  borderRadius: 50,
                  padding: '8px 18px',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                }}
              >
                登录 / 注册
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                background: textColor,
                transform: mobileOpen ? 'rotate(45deg) translateY(3.5px)' : 'none',
              }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                background: textColor,
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                background: textColor,
                transform: mobileOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.div
              className="absolute top-14 left-0 right-0"
              style={{
                background: 'rgba(245, 241, 234, 0.97)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-6 py-6 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    className="font-ui text-sm tracking-wider py-3 text-left transition-colors duration-200"
                    style={{
                      color: pathname === item.href ? 'var(--color-moss)' : 'var(--bg-ink)',
                      fontWeight: pathname === item.href ? 600 : 400,
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      cursor: 'pointer',
                    }}
                    onClick={() => { router.push(item.href); setMobileOpen(false) }}
                  >
                    {item.label}
                  </button>
                ))}

                {/* Mobile auth */}
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  {status === 'authenticated' && session?.user ? (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => { router.push('/profile'); setMobileOpen(false) }}
                        className="flex items-center gap-3"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'var(--color-wheat)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--bg-ink)',
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: 'var(--font-ui)',
                          }}
                        >
                          {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                        </div>
                        <span className="font-ui text-sm" style={{ color: 'var(--bg-ink)' }}>
                          {session.user.name || session.user.email?.split('@')[0]}
                        </span>
                      </button>
                      <button
                        onClick={() => { signOut({ callbackUrl: '/' }); setMobileOpen(false) }}
                        className="font-ui text-xs tracking-wider"
                        style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        退出
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { router.push('/login'); setMobileOpen(false) }}
                      className="btn-primary w-full"
                    >
                      登录 / 注册
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function Footer() {
  const router = useRouter()

  return (
    <footer style={{ backgroundColor: 'var(--bg-ink)', padding: 'var(--footer-py) 0 var(--footer-pb)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div>
            <h3 style={{
              fontSize: 'clamp(26px, 2.8vw, 38px)',
              fontWeight: 300,
              color: 'var(--text-heading)',
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-serif)',
              lineHeight: 1.2,
            }}>
              原乡
            </h3>
            <p style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              maxWidth: 300,
              marginTop: 14,
              fontFamily: 'var(--font-ui)',
            }}>
              一个深度去中心化的乡村生活共建与探索平台。连接土地与人，重建城乡之间的情感纽带。
            </p>
          </div>
          <div className="flex gap-14">
            <div>
              <p className="font-ui text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--text-dim)' }}>探索</p>
              <ul className="space-y-3">
                {[
                  { label: '活动日历', href: '/calendar' },
                  { label: '共建地地图', href: '#' },
                  { label: '生活方式', href: '#' },
                  { label: '行前指南', href: '#' },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      className="font-ui text-sm cursor-pointer transition-colors duration-300 hover:text-wheat"
                      style={{ color: 'var(--text-secondary)', background: 'none', border: 'none' }}
                      onClick={() => router.push(item.href)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-ui text-xs tracking-widest uppercase mb-5" style={{ color: 'var(--text-dim)' }}>共建</p>
              <ul className="space-y-3">
                {['创建活动', '成为共建者', '能力需求', '灵感库'].map((item) => (
                  <li key={item}>
                    <span className="font-ui text-sm cursor-default transition-colors duration-300 hover:text-wheat" style={{ color: 'var(--text-secondary)' }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full mb-7" style={{ height: 1, backgroundColor: 'var(--border-subtle)' }} />
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-ui text-xs" style={{ color: 'var(--text-dim)' }}>© 2026 原乡. All rights reserved.</p>
          <p className="font-display text-xs" style={{ color: 'var(--text-dim)', fontStyle: 'italic', letterSpacing: '0.05em' }}>Rediscover the origin of life</p>
        </div>
      </div>
    </footer>
  )
}
