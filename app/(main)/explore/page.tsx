'use client'

import { useState, useCallback } from 'react'
import GuideScreen from '@/components/explore/GuideScreen'
import CardStack from '@/components/explore/CardStack'
import ResultList from '@/components/explore/ResultList'
import { filterActivities, ALL_ACTIVITIES } from '@/lib/data/mock-activities'
import type { Filters } from '@/lib/data/mock-activities'

export default function ExplorePage() {
  const [phase, setPhase] = useState<'guide' | 'cards' | 'list'>('guide')
  const [guideStep, setGuideStep] = useState(1)
  const [filters, setFilters] = useState<Filters>({})
  const [cards, setCards] = useState(ALL_ACTIVITIES)

  const handleSelect = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleNext = useCallback(() => {
    if (guideStep === 1) {
      setGuideStep(2)
    } else if (guideStep === 2) {
      const f = { ...filters, travelMode: filters.travelMode }
      if (f.travelMode === 'solo') {
        // Solo: skip step 3, go directly to cards
        const filtered = filterActivities(f)
        setCards(filtered)
        setPhase('cards')
      } else {
        setGuideStep(3)
      }
    } else if (guideStep === 3) {
      const filtered = filterActivities(filters)
      setCards(filtered)
      setPhase('cards')
    }
  }, [guideStep, filters])

  const handleSkip = useCallback(() => {
    setCards(ALL_ACTIVITIES)
    setPhase('cards')
  }, [])

  const handleShowAll = useCallback(() => {
    setCards(ALL_ACTIVITIES)
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
        />
      )}
      {phase === 'cards' && (
        <CardStack cards={cards} onShowAll={handleShowAll} />
      )}
      {phase === 'list' && (
        <ResultList cards={cards} onBack={handleBackToCards} />
      )}
    </div>
  )
}
