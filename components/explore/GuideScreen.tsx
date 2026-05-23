'use client'

import type { Filters } from '@/lib/data/mock-activities'
import { INTEREST_OPTIONS } from '@/lib/data/mock-activities'
import MultiStepGuide from '@/components/shared/MultiStepGuide'
import type { GuideQuestion } from '@/components/shared/MultiStepGuide'

interface GuideScreenProps {
  step: number
  filters: Filters
  onSelect: (key: keyof Filters, value: string) => void
  onNext: (key?: keyof Filters, value?: string) => void
  onPrev?: () => void
  onSkip: () => void
  onAuth?: () => void
}

const QUESTIONS: GuideQuestion[] = [
  {
    key: 'gender',
    question: '你的性别？',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    key: 'travelMode',
    question: '出行方式？',
    options: [
      { label: '单人', value: 'solo' },
      { label: '与人同行', value: 'group' },
    ],
  },
  {
    key: 'companionType',
    question: '同行身份是？',
    options: [
      { label: '伴侣', value: 'partner' },
      { label: '朋友', value: 'friend' },
      { label: '父母', value: 'parent' },
      { label: '子女', value: 'child' },
      { label: '其他', value: 'other' },
    ],
  },
  {
    key: 'interests',
    question: '想往哪个方向走？',
    options: INTEREST_OPTIONS.map((o) => ({
      label: o.label,
      value: o.value,
      subtitle: o.subtitle,
      desc: o.desc,
      emoji: o.emoji,
    })),
    multi: true,
  },
]

export default function GuideScreen({ step, filters, onSelect, onNext, onPrev, onSkip, onAuth }: GuideScreenProps) {
  return (
    <MultiStepGuide
      step={step}
      totalSteps={4}
      questions={QUESTIONS}
      answers={filters as Record<string, string | string[]>}
      onSelect={(key, value) => onSelect(key as keyof Filters, value)}
      onNext={() => onNext()}
      onPrev={onPrev}
      onSkip={onSkip}
      onAuth={onAuth}
    />
  )
}
