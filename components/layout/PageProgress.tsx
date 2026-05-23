'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageProgress() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    // Start animation
    setVisible(true)
    // Force layout reflow so the bar starts from 0
    requestAnimationFrame(() => {
      setAnimating(true)
    })

    // Complete after ~500ms
    timeoutRef.current = setTimeout(() => {
      setAnimating(false)
      // Fade out after completion
      setTimeout(() => setVisible(false), 250)
    }, 550)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [pathname])

  return (
    <div
      role="progressbar"
      aria-hidden={!visible}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        height: 2,
        background: 'linear-gradient(to right, var(--color-wheat), rgba(201,169,110,0.6))',
        width: animating ? '100%' : '0%',
        opacity: visible ? 1 : 0,
        transition: animating
          ? 'width 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
          : 'width 0s, opacity 0.25s ease',
        pointerEvents: 'none',
      }}
    />
  )
}
