# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.8] - 2026-05-23

### Added
- **首页 Hero 首屏** — 双屏滚动设计，新增全屏沉浸式 Hero section
  - 背景图 `hero-aerial-village.jpg` + 深色渐变 dark overlay + Ken Burns 缓慢缩放动画
  - Slogan "开启一种新的生活方式"（移动端分段换行），副标题 "简单 · 美好"
  - CTA 按钮 "出发~ 🚀" 跳转到第二屏双面板
  - 底部 "向下探索" 滚动提示（麦金线条动效）

### Changed
- **品牌重命名** — "原乡" → "爱故乡驿站"（全项目替换，含 Navbar Logo split-letter 样式）
- **首页第二屏双面板文案更新**
  - 左侧：主标题 "一段旅行，一份心情"，描述 "聆听时光故事，亲近乡土文明"
  - 右侧：主标题 "去乡村田园里，创造美好空间"，描述 "不止是组织者，你也是这片土地的讲述者与守护者"
- **左侧面板按钮** — "开始探索" → "我要探索"
- **Match 页面按钮** — "帮我找到最适合的活动" → "帮我梳理方案"
- **注册成功文案** — "欢迎加入爱故乡驿站"

### Removed
- **首页底部栏** — 删除 "说一句..." 输入条
- **Hero tagline** — 删除 "为自己寻觅一个心灵归属地" 及其 CSS 类

### Fixed
- **Host 确认按钮** — 完成后跳转到 Profile 的 "发布的活动" 标签（`?section=published` 深链接）
- **Profile 深链接** — 支持 `?section=published|enrolled|edit|info` URL 参数（`window.location.search`，兼容静态导出）

## [0.3.7] - 2026-05-23

### Added
- **Match 页面搜索优先 UX** — 登录用户进入 `/match` 首先展示搜索框（搜索引擎式体验）
  - 旋转占位文案：6 条口语化描述循环轮换，模拟真实搜索体验
  - 搜索 Hero 居中布局，深色渐变背景，麦金边框聚焦态
  - 输入后按 Enter 或点击按钮进入 Dock 卡片展示
- **macOS Dock 风格卡片堆叠 (`/match`)** — 替换死板网格卡片
  - 5 张卡片横向堆叠，透视旋转（rotateY ±25deg）+ z-index 层级
  - 悬停时卡片上浮、放大（桌面 1.22x / 移动端 1.12x）、聚焦，其余卡片后退缩小
  - Framer Motion spring 物理动画，`stiffness: 300, damping: 20`
  - 响应式：移动端卡片 100×140px，桌面端 140×200px
- **MultiStepGuide 抽象组件** — `components/shared/MultiStepGuide.tsx`
  - 通用多步引导问卷：进度指示器（圆点）、返回按钮、问题切换动画
  - 单选模式：垂直胶囊按钮（圆角全宽，选中麦金高亮）
  - 多选模式：Bento 不规则网格（≤8 选项）或规则网格（>8 选项），选中展开 desc
  - 支持跳过、登录引导（onAuth）、自定义跳过文案
- **Host 页面 (`/host`) 全面重构 — 「我要造趣」**
  - 未登录用户：AuthPrompt 深色全屏引导（登录/注册按钮），替代直接展示内容
  - 已登录用户：复用 MultiStepGuide，第一步选择身份（想法发起人 / 在地主理人）
  - 引导完成后进入原 landing 内容：视频 Hero + 案例卡片 + 三步创建流程 + CTA
- **Profile 页面技能标签输入** — 类似 GitHub Topics 的 TagInput 组件
  - Enter 或逗号添加标签，Backspace 或 × 删除
  - 最多 8 个标签，超出禁用输入并提示
  - 已选标签以麦金圆角 pill 展示，hover 显示删除 ×
- **Profile 省市级联选择器** — `lib/data/china-regions.ts` 含 34 省市区数据
  - 先选省份，再动态加载该省城市列表
  - 表单保存时合并为 `location: "省 · 市"`
- **Profile 月份时间轴** — 「我参与的活动」和「我发起的活动」统一时间轴展示
  - `groupByMonth()` 按月分组，`sortMonthKeysDesc()` 降序排列
  - 每月一条时间线节点，卡片垂直列表
  - 固定高度容器（500px），超出可滚动
- **Profile 资料补全提示** — 未填写 bio/phone/location/skills 时显示顶部横幅
  - 文案："完善个人资料，获取更精准的活动匹配"
  - 点击跳转到编辑模式并自动聚焦第一个空字段

### Changed
- **导航栏重命名与重排** — "共建" → "我要造趣"，"广场" → "分享广场"
  - 新顺序：探索 → 我要造趣 → 所有活动 → 活动日历 → 分享广场
- **首页右面板 CTA** — "成为主理人" → "我要造趣"
- **Explore GuideScreen** — 重构为 MultiStepGuide 的薄包装层，零行为变更
- **Schema 扩展** — `users` 表新增 `gender`/`age`/`skills` 字段
  - `skills` 存储为 JSON 数组（`text('skills', { mode: 'json' }).$type<string[]>()`）
  - 旧 comma-separated string 数据已迁移到 JSON 数组格式
- **Workers 后端 Profile 支持**
  - `ALLOWED_PROFILE_FIELDS` 包含 `gender`/`age`/`skills`
  - `USER_PROJECTION` 包含新字段
  - `safeRole` 签名修正为接受 `string | null | undefined`
- **AuthContext 类型更新** — `skills: string | null` → `skills: string[] | null`

### Fixed
- **Profile 编辑按钮文字居中** — 退出登录、取消编辑按钮文字垂直居中
- **Match 页面 404 错误** — Next.js dev server chunk 缓存失效，清理 `.next` 后恢复
- **Profile 保存 Internal Server Error** — D1 `users` 表缺失 `gender`/`age`/`skills` 列，已 ALTER TABLE 补齐

## [0.3.6] - 2026-05-23

### Added
- **精确匹配页面 (`/match`)** — 登录用户专属的个性化匹配页
  - 基于用户 Profile 的 `interests` 和 `location` 做精确匹配
  - 利用 `INTEREST_TAG_MAP` 将兴趣方向映射为活动标签，计算匹配分数
  - 未登录用户引导注册/登录
  - 未填写 Profile 时提示完善个人资料
- **Navbar "探索" 动态路由** — 已登录指向 `/match`，未登录指向 `/explore`

### Changed
- **Explore 页面** — 登录用户访问 `/explore` 自动重定向到 `/match`
- **注册成功后跳转** — 从 `/explore` 改为 `/match`
- **Session 机制全面统一** — `useSession`/`SessionProvider`/`signIn`/`signOut` 已从所有 `.tsx` 组件中完全移除

## [0.3.5] - 2026-05-23

### Added
- **自定义 JWT 认证系统** — 替换 NextAuth v5 API 路由，适配 Cloudflare Pages 静态导出
  - `lib/auth-context.tsx` — AuthContext + AuthProvider + useAuth hook
  - Token 存储于 localStorage，Bearer 方式传递到 Workers 后端
  - 注册后自动登录并跳转 `/explore`
- **Workers 后端核心路由**
  - `POST /api/auth/register` — 注册（bcrypt 哈希密码，D1 写入）
  - `POST /api/auth/login` — 登录（密码验证，JWT 签发，7天过期）
  - `GET /api/auth/me` — 获取当前用户完整 Profile（需 Bearer token）
  - `PUT /api/users/me` — 更新 Profile（name/bio/phone/location/avatar/website/interests）
- **Profile 页面重构** — 真实数据 + 编辑模式
  - 完整信息展示：姓名/邮箱/角色/稻米/简介/手机/所在地/网站/兴趣
  - 编辑模式：表单替换只读视图，保存 → Workers API → 即时刷新
  - 头像支持 URL 自定义，默认首字母圆圈
- **Explore 卡片耗尽状态增强** — 未登录用户新增「注册/登录获取更精准匹配」按钮（引导到 `/login`）
- **D1 Drizzle 客户端** — `workers/src/db/client.ts`，共享 `lib/db/schema.ts`
- **Workers 中间件** — CORS / JSON / 方法检查 / 鉴权，统一封装在 `workers/src/middleware.ts`

### Changed
- **认证系统架构变更** — NextAuth `SessionProvider` → 自定义 `AuthProvider`
  - `app/layout.tsx` — SessionProvider 替换为 AuthProvider
  - `components/auth/LoginForm.tsx` — `signIn()` 替换为 `useAuth().login()`
  - `components/auth/RegisterForm.tsx` — `fetch('/api/auth/register')` 替换为 `useAuth().register()`
  - `components/layout/NavbarFooter.tsx` — `useSession` 替换为 `useAuth`，`signOut` 替换为 `logout`
- **pnpm 工作区配置** — 添加 `pnpm-workspace.yaml`，workers 共享根目录依赖
- **Schema 扩展** — users 表新增 bio/phone/location/interests/website 字段（avatar 已有）
- **环境变量** — `.env.local` 新增 `NEXT_PUBLIC_API_URL=http://localhost:8787`

### Removed
- **NextAuth 依赖解耦** — 保留 `next-auth` 包但不再使用 SessionProvider/useSession/signIn/signOut，仅 `lib/auth.ts` 和 `lib/db/client.ts` 作为本地 SQLite 鉴权兜底

## [0.3.4] - 2026-05-23

### Added
- **独立活动全览页面 (`/activities`)** — 独立于 explore 的完整活动浏览页面
  - 筛选架构：城市 tab 常驻（一级分类）+ 搜索框 + 排序（综合/价格/匹配度）+ 筛选面板
  - 筛选面板：移动端底部 sheet（y 轴滑入），桌面端右侧抽屉（x 轴滑入，360px）
  - 面板内分类：时间（单选）、风格方向（可多选）、价格区间（单选）
  - 已选条件 pill 显示，可逐个清除或一键重置，"查看 N 个结果"按钮
  - 搜索实时过滤标题/地点/描述/标签
  - 卡片响应式网格（1/2/3 列），stagger 入场动画，空状态处理
- **Explore 引导问卷第 4 步** — 活动兴趣方向 Bento 多选
  - 8 个方向（周末短逃离/附近探索/亲子自然/在地美食/手作体验/人文探访/独处放空/朋友聚会）
  - Bento 不规则网格布局（3 行：7+5, 4+4+4, 3+6+3），每个卡片含 emoji + 标题 + subtitle + 选中展开 desc
  - 零 CLS：固定高度 + desc 通过 opacity 切换
- **趣味加载文案** — 6 条随机加载文案替代原机械文案（"搓搓期待的小手…"等）
- **下滑收藏 toast** — 卡片下滑时显示黄色"已收藏"提示
- **Navbar 新增"所有活动"入口** — 导航顺序：探索/所有活动/共建/活动日历/广场

### Changed
- **Explore 引导问卷交互增强**
  - 进度指示器（4 圆点）与"返回上一步"按钮同行显示，flex 三栏对齐
  - 单人出行跳过同行身份选择，直接进入兴趣方向
  - 第 4 步标题增加"（可多选）"提示
  - 下一步按钮全宽居中
  - Bento 元素高度缩小（88/96px），修复桌面端溢出
- **CardStack 翻转优化** — 桌面端翻转后卡片宽度扩展（max-width: 680px），高度调整（calc(100vh - 240px)）
- **Explore 跳转更新** — "跳过，看全部结果"和"展示全部结果"跳转到 `/activities` 独立页面
- **SwipeCard iOS 修复** — 添加 `-webkit-` 前缀修复 iOS Safari 3D 翻转透明度问题

### Security
- **数据层增强** — `INTEREST_TAG_MAP` 提升为模块级导出，供 activities 页面及 Workers 后端复用
- **`Filters` 接口扩展** — 新增 `interests?: ActivityInterest[]` 多选字段

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
