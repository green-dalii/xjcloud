'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export default function PageProgress() {
  const pathname = usePathname()
  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)
  const rafRef = useRef<number>(0)
  const observerRef = useRef<MutationObserver | null>(null)
  const startedAt = useRef<number>(0)
  const stableTimer = useRef<ReturnType<typeof setTimeout>>()

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (observerRef.current) observerRef.current.disconnect()
    if (stableTimer.current) clearTimeout(stableTimer.current)
  }, [])

  useEffect(() => {
    cleanup()
    setDone(false)
    setVisible(true)
    setWidth(0)
    startedAt.current = performance.now()

    // Phase 1: Animate to ~80% quickly using requestAnimationFrame
    const animatePhase1 = () => {
      const elapsed = performance.now() - startedAt.current
      const target = 80
      // Fast ramp-up that decelerates: reaches ~80% in about 500ms
      const progress = Math.min(target, (1 - Math.exp(-elapsed / 180)) * target)

      setWidth(progress)

      if (progress < target - 0.5) {
        rafRef.current = requestAnimationFrame(animatePhase1)
      }
    }
    rafRef.current = requestAnimationFrame(animatePhase1)

    // Phase 2: Detect DOM stability with MutationObserver
    const observe = new MutationObserver(() => {
      if (stableTimer.current) clearTimeout(stableTimer.current)

      stableTimer.current = setTimeout(() => {
        // DOM stable for 150ms → complete
        setWidth(100)
        observe.disconnect()

        // Fade out after completion
        setTimeout(() => {
          setDone(true)
          setTimeout(() => setVisible(false), 250)
        }, 200)
      }, 150)
    })

    observerRef.current = observe
    observe.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    // Safety timeout: force complete after 5s if still not done
    const safety = setTimeout(() => {
      setWidth(100)
      observe.disconnect()
      setTimeout(() => {
        setDone(true)
        setTimeout(() => setVisible(false), 250)
      }, 200)
    }, 5000)

    return () => {
      cleanup()
      clearTimeout(safety)
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
        width: `${width}%`,
        opacity: visible ? 1 : 0,
        transition: done ? 'opacity 0.25s ease' : 'none',
        pointerEvents: 'none',
      }}
    />
  )
}
