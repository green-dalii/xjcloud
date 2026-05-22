'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#2d2a26] overflow-hidden">
      {/* Top Navigation */}
      <nav className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 md:px-8 z-20 bg-black/15 backdrop-blur-md">
        <div className="text-[#f5f1ea] text-lg font-semibold tracking-wider">
          乡<span className="text-[#c9a96e]">·</span>遇见
        </div>
        <div className="flex gap-4 md:gap-6">
          <Link href="/activities" className="text-[#f5f1ea] text-sm no-underline opacity-80 hover:opacity-100 transition-opacity">
            活动
          </Link>
          <Link href="/feed" className="text-[#f5f1ea] text-sm no-underline opacity-80 hover:opacity-100 transition-opacity hidden md:block">
            在地故事
          </Link>
          <Link href="/profile" className="text-[#f5f1ea] text-sm no-underline opacity-80 hover:opacity-100 transition-opacity">
            登录
          </Link>
        </div>
      </nav>

      {/* Split Screen */}
      <div className="flex flex-col md:flex-row h-screen w-full group/split">
        {/* Left Panel - Traveler */}
        <div className="flex-1 relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer md:hover:flex-[1.4] group-left min-h-[50vh]">
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #4a6741 0%, #6b8e5a 50%, #8ba87a 100%)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(255,220,150,0.2) 0%, transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(150,200,120,0.3) 0%, transparent 50%)
              `
            }}
          />

          {/* Floating dots */}
          <div
            className="absolute rounded-full bg-white/60"
            style={{ width: 6, height: 6, top: '25%', right: '15%', animation: 'float 4s ease-in-out infinite' }}
          />
          <div
            className="absolute rounded-full bg-white/60"
            style={{ width: 4, height: 4, top: '60%', left: '20%', animation: 'float 4s ease-in-out 1s infinite' }}
          />

          {/* Avatars */}
          <div className="absolute top-20 left-4 md:left-14 flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#f5f1ea] bg-gradient-to-br from-[#c9a96e] to-[#8b6f47] flex items-center justify-center text-white text-xs">A</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#f5f1ea] bg-gradient-to-br from-[#c9a96e] to-[#8b6f47] flex items-center justify-center text-white text-xs">B</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#f5f1ea] bg-gradient-to-br from-[#c9a96e] to-[#8b6f47] flex items-center justify-center text-white text-xs">C</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#f5f1ea]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              238人在路上
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 text-[#f5f1ea] z-10">
            <span className="inline-block w-fit px-3.5 py-1.5 border border-[#f5f1ea]/50 rounded-full text-xs tracking-widest mb-6 backdrop-blur-sm">
              F O R · T R A V E L E R
            </span>
            <h2 className="text-4xl font-light leading-snug mb-3 tracking-wide">
              找一个周末<br />
              <strong className="font-semibold text-white">去别人的生活里住几天</strong>
            </h2>
            <p className="text-sm opacity-85 mb-9 leading-relaxed">
              从插秧到围炉，128个真实在地体验<br />等你解锁
            </p>
            <Link
              href="/feed"
              className="inline-flex items-center gap-3 w-fit px-7 py-3.5 bg-[#f5f1ea]/95 text-[#2d2a26] rounded-full text-sm font-medium transition-all hover:bg-white hover:translate-x-1"
            >
              开始探索
              <span className="w-6 h-6 rounded-full bg-[#2d2a26] text-[#f5f1ea] flex items-center justify-center text-xs">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 left-1/2 w-0.5 z-[5] opacity-40 -translate-x-1/2"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, #f5f1ea 20%, #f5f1ea 80%, transparent 100%)' }}
        />

        {/* Right Panel - Host */}
        <div className="flex-1 relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer md:hover:flex-[1.4] group-right min-h-[50vh]">
          {/* Background */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #8b6f47 0%, #a08560 50%, #c9a96e 100%)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 70% 20%, rgba(255,200,120,0.25) 0%, transparent 45%),
                radial-gradient(circle at 30% 80%, rgba(180,130,80,0.3) 0%, transparent 50%)
              `
            }}
          />

          {/* Floating dot */}
          <div
            className="absolute rounded-full bg-white/60"
            style={{ width: 8, height: 8, bottom: '20%', right: '30%', animation: 'float 4s ease-in-out 2s infinite' }}
          />

          {/* Avatars */}
          <div className="absolute top-20 right-4 md:right-14 flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-[#f5f1ea]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              62位主理人在线
            </div>
            <div className="flex -space-x-2 ml-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#f5f1ea] bg-gradient-to-br from-[#c9a96e] to-[#8b6f47] flex items-center justify-center text-white text-xs">阿</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#f5f1ea] bg-gradient-to-br from-[#c9a96e] to-[#8b6f47] flex items-center justify-center text-white text-xs">木</div>
              <div className="w-8 h-8 rounded-full border-2 border-[#f5f1ea] bg-gradient-to-br from-[#c9a96e] to-[#8b6f47] flex items-center justify-center text-white text-xs">茶</div>
            </div>
          </div>

          {/* Content - right aligned on desktop, left on mobile */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 text-[#f5f1ea] z-10 items-start text-left md:items-end md:text-right">
            <span className="inline-block w-fit px-3.5 py-1.5 border border-[#f5f1ea]/50 rounded-full text-xs tracking-widest mb-6 backdrop-blur-sm">
              F O R · H O S T
            </span>
            <h2 className="text-4xl font-light leading-snug mb-3 tracking-wide">
              把你的院子<br />
              <strong className="font-semibold text-white">分享给懂的人</strong>
            </h2>
            <p className="text-sm opacity-85 mb-9 leading-relaxed">
              不止是民宿主，你是这片土地的<br />讲述者与守护者
            </p>
            <Link
              href="/activities"
              className="inline-flex items-center gap-3 w-fit px-7 py-3.5 bg-[#f5f1ea]/95 text-[#2d2a26] rounded-full text-sm font-medium transition-all hover:bg-white hover:translate-x-1"
            >
              成为主理人
              <span className="w-6 h-6 rounded-full bg-[#2d2a26] text-[#f5f1ea] flex items-center justify-center text-xs">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3.5 bg-[#f5f1ea]/95 rounded-full shadow-xl z-10 backdrop-blur-xl max-w-[90vw]">
        <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#c9a96e] flex items-center justify-center text-white text-xs md:text-sm flex-shrink-0">
          ✦
        </div>
        <div className="text-[#2d2a26] text-xs md:text-sm truncate">
          说一句 <strong className="text-[#4a6741]">&ldquo;我想要这样的周末&rdquo;</strong>，让主理人来找你 →
        </div>
      </div>

      {/* CSS for hover flex behavior - desktop only */}
      <style jsx>{`
        @media (min-width: 768px) {
          .group\/split:hover .group-left {
            flex: 0.7;
          }
          .group\/split:hover .group-left:hover {
            flex: 1.4;
          }
          .group\/split:hover .group-right {
            flex: 0.7;
          }
          .group\/split:hover .group-right:hover {
            flex: 1.4;
          }
        }
      `}</style>
    </div>
  )
}
