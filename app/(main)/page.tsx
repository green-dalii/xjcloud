'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="relative h-screen bg-[#1a1a1a] overflow-hidden">
      {/* Top Navigation */}
      <nav className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 md:px-8 z-30">
        <div className="text-white/90 text-lg font-semibold tracking-wider drop-shadow-lg">
          乡<span className="text-emerald-400">·</span>遇见
        </div>
        <div className="flex gap-4 md:gap-6">
          <Link href="/activities" className="text-white/80 text-sm hover:text-white transition-colors drop-shadow-md">
            活动
          </Link>
          <Link href="/feed" className="text-white/80 text-sm hover:text-white transition-colors drop-shadow-md hidden md:block">
            在地故事
          </Link>
          <Link href="/profile" className="text-white/80 text-sm hover:text-white transition-colors drop-shadow-md">
            登录
          </Link>
        </div>
      </nav>

      {/* Split Screen */}
      <div className="split-hover-effect h-full w-full">
        {/* Left Panel - Traveler */}
        <div data-panel="left" className="group cursor-pointer">
          {/* Background Image */}
          <Image
            src="/featured-tonglu.jpg"
            alt="茶园晨雾"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Overlay - emerald/teal tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/75 via-teal-900/60 to-slate-900/50" />
          {/* Light spot overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, rgba(52,211,153,0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(20,184,166,0.1) 0%, transparent 40%)
              `
            }}
          />

          {/* Floating dots */}
          <div className="absolute top-[28%] right-[18%] w-1.5 h-1.5 rounded-full bg-white/50 animate-[float_4s_ease-in-out_infinite]" />
          <div className="absolute top-[55%] left-[22%] w-1 h-1 rounded-full bg-white/40 animate-[float_4s_ease-in-out_1s_infinite]" />

          {/* Avatars - hidden on small mobile */}
          <div className="absolute top-16 md:top-20 left-4 md:left-10 flex items-center gap-2 z-10">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white/80 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-[10px] md:text-xs">A</div>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white/80 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-[10px] md:text-xs">B</div>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white/80 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-[10px] md:text-xs">C</div>
            </div>
            <div className="flex items-center gap-1 text-[10px] md:text-xs text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              238人在路上
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end md:justify-center px-6 md:px-12 pb-12 md:pb-0 text-white z-10">
            <span className="inline-block w-fit px-3 py-1 border border-white/40 rounded-full text-[10px] md:text-xs tracking-[0.2em] mb-3 md:mb-5 backdrop-blur-sm bg-white/5">
              寻找生活
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-light leading-tight md:leading-snug mb-2 md:mb-3 tracking-wide">
              找一个周末<br />
              <strong className="font-semibold">去别人的生活里住几天</strong>
            </h2>
            <p className="text-xs md:text-sm text-white/75 mb-5 md:mb-8 leading-relaxed max-w-md">
              从插秧到围炉，128个真实在地体验等你解锁
            </p>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 md:gap-3 w-fit px-5 md:px-7 py-2.5 md:py-3.5 bg-white/95 text-slate-900 rounded-full text-sm font-medium transition-all hover:bg-white hover:translate-x-1 shadow-lg"
            >
              开始探索
              <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Divider - horizontal on mobile, vertical on desktop */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px z-20 opacity-30 -translate-x-1/2 bg-gradient-to-b from-transparent via-white/60 to-transparent" />
        <div className="md:hidden absolute left-0 right-0 top-1/2 h-px z-20 opacity-30 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        {/* Right Panel - Host */}
        <div data-panel="right" className="group cursor-pointer">
          {/* Background Image */}
          <Image
            src="/featured-jingdezhen.jpg"
            alt="陶艺工坊"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Overlay - warm amber/sienna tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 via-orange-900/60 to-stone-900/50" />
          {/* Light spot overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 60% 30%, rgba(251,191,36,0.12) 0%, transparent 45%),
                radial-gradient(circle at 40% 70%, rgba(217,119,6,0.1) 0%, transparent 40%)
              `
            }}
          />

          {/* Floating dot */}
          <div className="absolute bottom-[25%] right-[28%] w-2 h-2 rounded-full bg-white/40 animate-[float_4s_ease-in-out_2s_infinite]" />

          {/* Avatars - hidden on small mobile */}
          <div className="absolute top-16 md:top-20 right-4 md:right-10 flex items-center gap-2 z-10">
            <div className="flex items-center gap-1 text-[10px] md:text-xs text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              62位主理人在线
            </div>
            <div className="flex -space-x-2 ml-1">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white/80 bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white text-[10px] md:text-xs">阿</div>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white/80 bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white text-[10px] md:text-xs">木</div>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white/80 bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white text-[10px] md:text-xs">茶</div>
            </div>
          </div>

          {/* Content - right aligned on desktop */}
          <div className="absolute inset-0 flex flex-col justify-end md:justify-center px-6 md:px-12 pb-12 md:pb-0 text-white z-10 items-start md:items-end text-left md:text-right">
            <span className="inline-block w-fit px-3 py-1 border border-white/40 rounded-full text-[10px] md:text-xs tracking-[0.2em] mb-3 md:mb-5 backdrop-blur-sm bg-white/5">
              分享土地
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-light leading-tight md:leading-snug mb-2 md:mb-3 tracking-wide">
              把你的院子<br />
              <strong className="font-semibold">分享给懂的人</strong>
            </h2>
            <p className="text-xs md:text-sm text-white/75 mb-5 md:mb-8 leading-relaxed max-w-md">
              不止是民宿主，你是这片土地的讲述者与守护者
            </p>
            <Link
              href="/activities"
              className="inline-flex items-center gap-2 md:gap-3 w-fit px-5 md:px-7 py-2.5 md:py-3.5 bg-white/95 text-slate-900 rounded-full text-sm font-medium transition-all hover:bg-white hover:translate-x-1 shadow-lg"
            >
              成为主理人
              <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-16 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 md:py-2.5 bg-white/95 rounded-full shadow-2xl z-30 backdrop-blur-xl max-w-[92vw]">
        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white text-[10px] md:text-xs flex-shrink-0">
          ✦
        </div>
        <div className="text-slate-800 text-[11px] md:text-sm truncate">
          说一句 <strong className="text-emerald-700">&ldquo;我想要这样的周末&rdquo;</strong>，让主理人来找你 →
        </div>
      </div>
    </div>
  )
}
