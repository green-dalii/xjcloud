'use client'

const moods = [
  { label: '想发呆', icon: '🍃', color: 'bg-xj-rice/80' },
  { label: '想动手', icon: '🛠️', color: 'bg-xj-earth/80' },
  { label: '想社交', icon: '🔥', color: 'bg-xj-sunset/80' },
]

export function MoodTags() {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      {moods.map((mood) => (
        <button
          key={mood.label}
          className={`${mood.color} backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:scale-105 transition-transform active:scale-95`}
        >
          <span className="mr-1.5">{mood.icon}</span>
          {mood.label}
        </button>
      ))}
    </div>
  )
}
