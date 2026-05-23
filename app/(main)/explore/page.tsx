'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import GuideScreen from '@/components/explore/GuideScreen'
import LoadingScreen from '@/components/explore/LoadingScreen'
import CardStack from '@/components/explore/CardStack'
import ResultList from '@/components/explore/ResultList'
import { filterActivities, ALL_ACTIVITIES } from '@/lib/data/mock-activities'
import type { Filters, ActivityInterest } from '@/lib/data/mock-activities'

function shufflePick10<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, 10)
}

export default function ExplorePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [phase, setPhase] = useState<'guide' | 'loading' | 'cards' | 'list'>('guide')
  const [guideStep, setGuideStep] = useState(1)
  const [filters, setFilters] = useState<Filters>({})
  const [cards, setCards] = useState(() => shufflePick10(ALL_ACTIVITIES))

  // Redirect logged-in users to /match
  useEffect(() => {
    if (user) {
      router.replace('/match')
    }
  }, [user, router])

  // Auto-transition from loading to cards after delay
  useEffect(() => {
    if (phase === 'loading') {
      const t = setTimeout(() => {
        setPhase('cards')
      }, 2500)
      return () => clearTimeout(t)
    }
  }, [phase])

  const handleSelect = useCallback((key: keyof Filters, value: string) => {
    if (key === 'interests') {
      setFilters((prev) => {
        const current = prev.interests || []
        const exists = current.includes(value as ActivityInterest)
        if (exists) {
          return { ...prev, interests: current.filter((i) => i !== value) }
        }
        return { ...prev, interests: [...current, value as ActivityInterest] }
      })
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }))
    }
  }, [])

  const handleNext = useCallback((key?: keyof Filters, value?: string) => {
    let latestFilters = filters
    if (key && value) {
      latestFilters = { ...filters, [key]: value }
      setFilters(latestFilters)
    }

    if (guideStep === 1) {
      setGuideStep(2)
    } else if (guideStep === 2) {
      if (latestFilters.travelMode === 'solo') {
        setGuideStep(4)
      } else {
        setGuideStep(3)
      }
    } else if (guideStep === 3) {
      setGuideStep(4)
    } else if (guideStep === 4) {
      const filtered = filterActivities(latestFilters)
      setCards(shufflePick10(filtered))
      setPhase('loading')
    }
  }, [guideStep, filters])

  const handlePrev = useCallback(() => {
    if (guideStep === 4 && filters.travelMode === 'solo') {
      setGuideStep(2)
    } else if (guideStep > 1) {
      setGuideStep(guideStep - 1)
    }
  }, [guideStep, filters])

  const handleSkip = useCallback(() => {
    router.push('/activities')
  }, [router])

  const handleShowAll = useCallback(() => {
    router.push('/activities')
  }, [router])

  const handleShowSaved = useCallback((savedIds: string[]) => {
    const savedCards = ALL_ACTIVITIES.filter((c) => savedIds.includes(c.id))
    setCards(savedCards)
    setPhase('list')
  }, [])

  const handleBackToCards = useCallback(() => {
    setPhase('cards')
  }, [])

  return (
    <div>
      {phase === 'guide' && (
        <GuideScreen
          step={guideStep}
          filters={filters}
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          onAuth={() => router.push('/login')}
        />
      )}
      {phase === 'loading' && <LoadingScreen />}
      {phase === 'cards' && (
        <CardStack
          cards={cards}
          onShowAll={handleShowAll}
          onShowSaved={handleShowSaved}
          onNavigateToHost={() => router.push('/host')}
        />
      )}
      {phase === 'list' && (
        <ResultList cards={cards} onBack={handleBackToCards} />
      )}
    </div>
  )
}
