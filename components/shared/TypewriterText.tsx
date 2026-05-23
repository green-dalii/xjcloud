'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterTextProps {
  text: string
  /** Pause after typing this many characters (before continuing with rest) */
  pauseAtIndex: number
  /** Insert <br> after this many characters (for mobile line break) */
  breakAtIndex?: number
  midPauseMs?: number
  typeInterval?: number
  initialDelay?: number
  className?: string
  onDone?: () => void
}

export default function TypewriterText({
  text,
  pauseAtIndex,
  breakAtIndex,
  midPauseMs = 2200,
  typeInterval = 110,
  initialDelay = 800,
  className,
  onDone,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [cursorOn, setCursorOn] = useState(true)
  const [done, setDone] = useState(false)
  const cancelled = useRef(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  // Cursor blink (forever)
  useEffect(() => {
    const iv = setInterval(() => setCursorOn(v => !v), 530)
    return () => clearInterval(iv)
  }, [])

  // Typewriter — run once, stop at completion
  useEffect(() => {
    cancelled.current = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(() => { if (!cancelled.current) fn() }, ms)
      timers.push(t)
    }

    const typeForward = (i: number) => {
      if (i >= text.length) {
        setDone(true)
        onDoneRef.current?.()
        return
      }
      setDisplayed(text.slice(0, i + 1))
      const delay = typeInterval + (i === pauseAtIndex - 1 ? midPauseMs : 0)
      schedule(() => typeForward(i + 1), delay)
    }

    schedule(() => typeForward(0), initialDelay)

    return () => {
      cancelled.current = true
      timers.forEach(clearTimeout)
    }
  }, [text, pauseAtIndex, midPauseMs, typeInterval, initialDelay])

  const splitAt = breakAtIndex ?? text.length
  const before = displayed.slice(0, splitAt)
  const after = displayed.slice(splitAt)

  return (
    <h1 className={className}>
      {before}
      {after.length > 0 && breakAtIndex != null && <br />}
      {after}
      <span
        aria-hidden="true"
        style={{
          opacity: cursorOn ? 1 : 0,
          transition: 'opacity 0.1s ease',
          fontWeight: 200,
          color: done ? '#c9a96e' : '#f5f1ea',
        }}
      >
        |
      </span>
    </h1>
  )
}
