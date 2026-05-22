# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.1] - 2026-05-22

### Added
- **引导页到卡片堆的 Loading 过渡** — 完成问卷后进入 2.5 秒匹配加载动画，含旋转双环 spinner + 文字轮播 + 呼吸点缀点

### Changed
- **卡片交互优化**
  - 点击卡片不再翻转，仅点击底部 ✓ 按钮触发翻转显示详情
  - 点击 ✓ 按钮时控件区域显示"已采纳"绿色提示（同收藏按钮的延时逻辑）
  - 卡片翻转后背面显示"✓ 已采纳"盖章印章（带弹簧入场动画）
  - 翻转后卡片**整体**放大（容器 scale 1.03/1.07），翻转完成后延迟 500ms 启动，过渡 700ms
  - 翻回时先缩小再翻转再右滑移出，三阶段时序衔接
  - 卡片堆整体下移（pt-20/24），避免靠上过近
- **引导页增加注册/登录引导** — 第一步"你的性别？"下方增加虚线边框的"注册/登录进行更个性化的精准匹配"按钮
- **空状态增加更多操作** — 卡片刷完后增加"展示收藏的结果"、"我要提出需求"、"完善共创需求 →"三个按钮，后两者导航至 `/host`

## [0.3.0] - 2026-05-22

### Added
- **探索页 (`/explore`) 完全重构** — 引导式筛选 + 堆叠卡片交互
  - 3 步引导问卷：性别 → 出行方式 → 同行身份，支持随时跳过
  - 问卷结果驱动 mock 数据过滤，按 matchScore 排序
  - Tinder 式堆叠卡片：3 层视觉堆叠（scale 0.92/0.96/1.0 + translateY）
  - 拖拽手势：左滑移除（不喜欢）、右滑移除（喜欢）、下滑收藏、点击进入详情
  - Framer Motion spring 物理动画：拖拽旋转、方向指示器透明度、卡片飞出的 exit 动画
  - 底部固定操作按钮（✕ / ★ / ♥）支持点击触发对应动作
  - 卡片耗尽后展示统计页（浏览数 / 收藏数）+「展示全部结果」按钮
  - 列表视图：响应式网格（1/2/3 列），stagger 入场动画，sticky header
- 新组件：`GuideScreen`, `SwipeCard`, `CardStack`, `ResultList`
- Mock 活动数据：`lib/data/mock-activities.ts` — 20 条乡建体验活动

## [0.2.0] - 2026-05-22

### Changed
- **Complete frontend redesign**: replaced entire homepage with immersive split-screen video background layout
  - Dual entrance: Traveler ("找一个周末去别人的生活里住几天") + Host ("把你的院子分享给懂的人")
  - Real video backgrounds (hero-farm-life.mp4 + lifestyle-slow-living.mp4) instead of static images
  - Desktop hover expand/collapse effect (flex 1→1.4 / 1→0.7) with 0.7s cubic-bezier transition
  - Mobile responsive: stacked vertical panels, fixed bottom bar
  - Region selector dropdown with five villages
- **New pages**: Explore (/explore) and Host (/host) with video heroes, GSAP ScrollTrigger animations
- **Unified design system — Warm Earth Palette**:
  - Colors: bg-ink (#2d2a26), bg-paper (#f5f1ea), color-moss (#3d5a3f), color-wheat (#c9a96e)
  - Fonts: Noto Serif SC (headings), Cormorant Garamond (display), PingFang SC (UI)
  - CSS custom properties for all tokens in globals.css
- New Navbar component with scroll-aware transparency and backdrop blur
- New Footer component
- Added gsap and tailwindcss-animate dependencies
- Tailwind config extended with shadcn-compatible color tokens, marquee animation

### Removed
- Old homepage implementations (v2 hand-drawn map, v4 static photo backgrounds)
- Old Header and BottomNav components (replaced by Navbar and Footer)
- Tailwind utility CSS for split-panel hover (replaced by LandingPage's inline CSS)

## [0.1.0] - 2026-05-22

### Added
- Next.js 14 project initialization with TypeScript, Tailwind CSS, App Router
- Drizzle ORM schema with 6 tables: users, posts, activities, enrollments, likes, comments
- SQLite database with better-sqlite3 driver
- Seed data with 2 test users
- Responsive navigation: Header (desktop) + BottomNav (mobile)
- NextAuth v5 configuration with Credentials provider and JWT sessions
- Custom auth types for role-based access
- Registration API endpoint with validation
- Login/Register pages with forms
- Profile page with user info API
