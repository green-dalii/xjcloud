'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { label: '发现', href: '/' },
    { label: '动态', href: '/feed' },
    { label: '我的', href: '/profile' },
  ]

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xj-amber font-bold text-lg">
          🌾 乡建协作
        </Link>
        <nav className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium ${
                pathname === item.href ? 'text-xj-amber' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="搜索..."
            className="w-40 px-3 py-1.5 text-sm bg-gray-100 rounded-md border-0 focus:ring-1 focus:ring-xj-amber"
          />
          <Link
            href="/profile"
            className="w-8 h-8 bg-xj-amber rounded-full flex items-center justify-center text-white text-sm"
          >
            👤
          </Link>
        </div>
      </div>
    </header>
  )
}
