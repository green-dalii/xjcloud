import Link from 'next/link'
import { MapBackground } from '@/components/home/MapBackground'
import { MoodTags } from '@/components/home/MoodTags'

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Hand-drawn map background */}
      <MapBackground />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top: subtle brand */}
        <div className="pt-6 px-6 text-center">
          <h1 className="text-lg font-bold text-xj-earth-dark tracking-wider">
            🌾 乡建协作
          </h1>
          <p className="text-xs text-xj-earth/70 mt-1">
            让乡建人协作起来
          </p>
        </div>

        {/* Middle: mood tags */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 pb-32">
          <p className="text-sm text-white/80 mb-4 font-medium drop-shadow-md">
            今天你想...
          </p>
          <MoodTags />

          {/* Inspiration hint */}
          <div className="mt-8 bg-white/20 backdrop-blur-md rounded-2xl p-4 max-w-xs mx-auto border border-white/30">
            <p className="text-xs text-white/90 text-center leading-relaxed">
              ✨ 今日灵感：龙潭村木艺工坊<br />
              <span className="text-white/60">张师傅教你做木雕小鸟</span>
            </p>
          </div>
        </div>

        {/* Bottom: dual entrance buttons */}
        <div className="fixed bottom-20 left-0 right-0 px-6 flex justify-between items-end pointer-events-none"
          style={{ zIndex: 20 }}
        >
          {/* Explore button - bottom left */}
          <Link
            href="/feed"
            className="pointer-events-auto flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-xj-rice/30">
              <span className="text-2xl">🗺️</span>
            </div>
            <span className="text-sm font-bold text-white drop-shadow-md">
              我要探索
            </span>
          </Link>

          {/* Create button - bottom right */}
          <Link
            href="/activities"
            className="pointer-events-auto flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-xj-sunset/30">
              <span className="text-2xl">✨</span>
            </div>
            <span className="text-sm font-bold text-white drop-shadow-md">
              我要造趣
            </span>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-xs text-white/60">下滑发现更多</span>
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Secondary screen: recent content */}
      <div className="relative z-10 bg-xj-paper px-6 py-12">
        <h2 className="text-xl font-bold text-xj-earth-dark mb-6">
          最近的活动
        </h2>

        <div className="space-y-4">
          {/* Activity card 1 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-xj-earth/10">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-xj-rice/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                🪵
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">龙潭村木艺亲子工坊</h3>
                <p className="text-sm text-gray-500 mt-1">
                  跟着张师傅学木雕，制作属于自己的木制小动物
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>📍 龙潭村</span>
                  <span>👥 8/15 人</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity card 2 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-xj-earth/10">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-xj-sunset/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                🎨
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">四坪古村写生营</h3>
                <p className="text-sm text-gray-500 mt-1">
                  三天两晚古村写生，住民宿、吃农家菜、画老宅
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>📍 四坪村</span>
                  <span>👥 12/20 人</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/activities"
            className="inline-flex items-center gap-1 text-sm text-xj-earth font-medium hover:text-xj-earth-dark transition-colors"
          >
            查看更多活动
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
