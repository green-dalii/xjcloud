# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Cloudflare Pages 静态导出配置**
  - `next.config.mjs` — `output: 'export'`, `distDir: 'dist'`, `images.unoptimized: true`, `trailingSlash: true`
  - 日历日视图动态路由 — 添加 `generateStaticParams()`，预渲染 57 个有活动的日期页面
  - API 路由临时移至 `app/_api-backup/`（静态导出不支持 API 路由，未来 Workers 后端替代）
  - 构建验证通过：68 个静态页面成功生成
- **环境变量配置体系**
  - `.env.example` — 环境变量模板，包含 NextAuth、数据库、LLM、Cloudflare 配置项及注释说明
  - `.env.local` — 本地开发环境变量（已配置 `AUTH_SECRET`，被 `.gitignore` 保护不提交）
  - `AUTH_SECRET` 集成 — `lib/auth.ts` 从环境变量读取，解决 `MissingSecret` 错误
  - `DATABASE_URL` 集成 — `lib/db/client.ts` 和 `drizzle.config.ts` 从环境变量读取数据库路径，默认回退 `./xjcloud.db`

### Fixed
- **Profile 页面移除后端 API 依赖** — 静态导出后 `/api/users/me` 端点不存在，改为从 `useSession` 直接获取用户信息
- **删除 `public/` 根目录重复图片** — `featured-jingdezhen.jpg`、`featured-tonglu.jpg` 与 `public/images/` 重复

### Security
- **`.gitignore` 强化隐私保护**
  - 忽略 `.env`（无后缀）、`*.db`、`xjcloud.db`、`wrangler.toml`、`.wrangler/`、`*.key`、`*.secret`
  - 将已追踪的 `xjcloud.db` 从 Git 历史移除（`git rm --cached`）

## [0.3.3] - 2026-05-23

### Added
- **活动日历系统 (`/calendar` + `/calendar/day/[date]`)** — 完整月视图+日视图
  - 月视图 7×6 网格，严格等宽（`min-width: 0; overflow: hidden` 防内容撑开）
  - 顶部区域选择器按地点筛选活动，支持"全部地点"
  - 活动标签：圆点 + 类型 + 标题（桌面端显示完整，移动端仅圆点+类型）
  - 活动过多显示 "···"，点击日期格子统一跳转日视图（避免月视图弹窗触控冲突）
  - 日视图：日期导航、活动详情卡片、信息网格（价格/时长/名额）
  - 日历 Mock 数据：2026年5月~8月共 60 个活动，8种类型
  - 移动优先响应式：基础样式移动端，`@media (min-width: 769px)` 桌面增强
- **统一 Navbar 系统** — 所有页面共享同一组件 `components/layout/NavbarFooter.tsx`
  - 自动检测 pathname：首页透明→毛玻璃，其他页面实底
  - 桌面端：Logo + 4 导航链接（探索/日历/共建/广场）+ 登录/注册按钮 或 用户头像
  - 移动端：汉堡菜单 → Framer Motion 滑出面板，含导航链接 + 认证区
  - 认证页（/login、/register）：最小化仅显示 Logo
- **Profile 页面设计系统对齐** — 替换旧 Tailwind 类（`text-gray-500`、`bg-white` 等）为 Warm Earth CSS 变量

### Changed
- **首页 (`/`)** — 移除嵌入式旧 nav，完全复用共享 NavbarFooter
- **Auth 布局 (`app/(auth)/layout.tsx`)** — 使用共享 Navbar，移除重复代码
- **Square 页面 (`/square`)** — 修复 fixed Navbar 遮挡：page 加 `paddingTop: 56`，`feed-container` paddingTop 从 120px 调为 64px

### Removed
- **死代码清理**
  - `components/layout/Header.tsx` — 旧 Header（未引用）
  - `components/layout/BottomNav.tsx` — 旧底部导航（未引用）
  - `components/home/MapBackground.tsx` — 旧首页 SVG 背景（未引用）
  - `components/home/MoodTags.tsx` — 旧首页情绪标签（未引用）
  - `components/home/` 空目录
- **未使用 CSS 清理** — `globals.css` 移除旧 nav 类（`.nav-transparent`、`.nav-logo`、`.nav-center`、`.nav-links`、`.nav-link`、`.nav-right`）约 70 行，移除重复 `@keyframes`

## [0.3.2] - 2026-05-23

### Added
- **UGC 广场页面 (`/square`)** — 复刻 Twitter 式帖子流，深色 Warm Earth 主题
  - 顶部 Tab 导航：全部 / 任务 / 商品 / 活动
  - 帖子卡片：头像 + 用户名/@id + 时间 + 正文 + 图片 + 操作栏
  - 操作栏：评论 / 转发 / 点赞（红心可切换）/ 打赏稻米
  - 打赏稻米弹窗：输入数量 + 确认，前端累加计数（暂无后台 API）
  - Framer Motion tab 切换动画
- **Navbar 增加「广场」入口** — 导航栏统一为 探索 / 指南 / 共建 / 广场，点击可跳转
- **水稻图标** — 打赏按钮改用稻穗线条图标（茎 + 下垂谷粒椭圆 + 叶子），更直观可辨识
- **打赏稻米步进器** — 数值输入改为 − / + 按钮控件，最小值约束为 1，禁用态视觉反馈

### Changed
- **全局主题系统重构**
  - 首页内嵌 `<style>` 标签全部提取到 `globals.css` 的 `@layer components`
  - 新增完整 CSS 变量体系：文字透明度层级、边框层级、wheat/ success/ danger/ warning 变体、间距、圆角、动画曲线
  - 所有组件改用 CSS 变量，杜绝硬编码颜色
  - 新增可复用组件类：`.glass-surface`、`.page-bg`、`.btn-primary`、`.btn-outline`、`.btn-ghost`、`.auth-*`、`.feed-*`、`.modal-*`
- **UGC 广场修复**
  - Feed Tab header 改为 `top: 56px` 避开 Navbar，帖子容器 `padding-top: 120px` 同步下移
  - Mock 帖子数据全部使用项目真实图片（桐庐、沙溪、景德镇、航拍村落）
  - 新增 2 条带图文的长篇乡建攻略帖子
- **Auth 页面风格统一** — 登录/注册页改用深色 Warm Earth 主题（毛玻璃卡片 + 麦金按钮），与首页视觉一致
- **Footer / Navbar 硬编码颜色 → CSS 变量** — 统一使用全局主题 token
- **卡片放大调整** — 桌面端 scale 1.12（移动端不放大），卡片堆垂直居中

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
