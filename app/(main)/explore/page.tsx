'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import GuideScreen from '@/components/explore/GuideScreen'
import LoadingScreen from '@/components/explore/LoadingScreen'
import CardStack from '@/components/explore/CardStack'
import ResultList from '@/components/explore/ResultList'
import { filterActivities, ALL_ACTIVITIES } from '@/lib/data/mock-activities'
import type { Filters } from '@/lib/data/mock-activities'

export default function ExplorePage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'guide' | 'loading' | 'cards' | 'list'>('guide')
  const [guideStep, setGuideStep] = useState(1)
  const [filters, setFilters] = useState<Filters>({})
  const [cards, setCards] = useState(ALL_ACTIVITIES)

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
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleNext = useCallback(() => {
    if (guideStep === 1) {
      setGuideStep(2)
    } else if (guideStep === 2) {
      const f = { ...filters, travelMode: filters.travelMode }
      if (f.travelMode === 'solo') {
        const filtered = filterActivities(f)
        setCards(filtered)
        setPhase('loading')
      } else {
        setGuideStep(3)
      }
    } else if (guideStep === 3) {
      const filtered = filterActivities(filters)
      setCards(filtered)
      setPhase('loading')
    }
  }, [guideStep, filters])

  const handleSkip = useCallback(() => {
    setCards(ALL_ACTIVITIES)
    setPhase('list')
  }, [])

  const handleShowAll = useCallback(() => {
    setCards(ALL_ACTIVITIES)
    setPhase('list')
  }, [])

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
