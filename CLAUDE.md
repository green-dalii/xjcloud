# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
# 启动开发服务器（端口 3001）
PORT=3001 pnpm dev

# 编译检查（静态导出，输出到 dist/）
PORT=3001 pnpm build

# 数据库迁移
pnpm db:push

# Lint 检查
pnpm lint
```

## 项目概述

乡建协作平台 (xjcloud) — AI 驱动的乡村活动协作 SaaS + UGC 平台。Next.js 14 App Router + TypeScript + Tailwind CSS，数据库用 SQLite（Drizzle ORM），后期迁移到 Cloudflare D1。

## 设计系统

**Warm Earth Palette**：所有颜色通过 globals.css 的 CSS custom properties 定义，Tailwind 配置中有一套兼容 shadcn 的 HSL 令牌。

核心色板：深墨 `#2d2a26` | 米纸 `#f5f1ea` | 苔藓绿 `#3d5a3f` | 麦金 `#c9a96e` | 石头灰 `#7a7468`

字体：标题用 Noto Serif SC，装饰英文用 Cormorant Garamond，正文用 PingFang SC。在 globals.css 中通过 `--font-*` 变量定义，Tailwind 扩展了 `fontFamily: { serif, display }`。

## 关键架构

### 路由结构
- `/` → `app/(main)/page.tsx` — 首页，全屏沉浸双面板（视频背景 + hover 伸缩）
- `/explore` → `app/(main)/explore/page.tsx` — 探索页
- `/host` → `app/(main)/host/page.tsx` — 共建者页
- `/calendar` → `app/(main)/calendar/page.tsx` — 活动日历（server component + metadata）
- `/calendar/day/[date]` → `app/(main)/calendar/day/[date]/page.tsx` — 日视图（带 `generateStaticParams()`）
- `/square` → `app/(main)/square/page.tsx` — UGC 广场
- `/profile` → `app/(main)/profile/page.tsx` — 个人中心
- `/login`, `/register` → `app/(auth)/` — 认证页
- `/api/*` → `app/_api-backup/` — API 路由（当前禁用，静态导出不支持；未来 Cloudflare Workers 替代）

### 项目目录结构（无 src/）
项目采用 Next.js 14 App Router 官方推荐结构，不使用 `src/` 目录：
- `app/` — 路由页面和布局（按路由组 `(main)` / `(auth)` 组织）
- `components/` — React 组件（按功能子目录组织）
- `lib/` — 工具函数、数据层、配置（`lib/auth.ts`, `lib/db/`, `lib/data/`）
- `public/` — 静态资源（视频、图片）

App Router 的 `app/` 目录本身即是约定入口，加 `src/` 是多一层无意义的嵌套。`lib/` 作为共享工具层，未来提取为 Workers 后端共享包时路径更直接。

### 核心组件
- `components/layout/NavbarFooter.tsx` — 统一 Navbar + Footer，所有页面共享
  - Navbar：自动检测 pathname（首页透明→毛玻璃，其他页面实底）+ 滚动状态 + 移动端汉堡菜单
  - 认证状态：未登录显示「登录/注册」按钮，已登录显示用户头像 + 退出
  - Footer：深色底，多栏链接布局
- `app/(main)/layout.tsx` — 所有 (main) 组页面统一渲染 Navbar + Footer

### Explore 页面组件架构（`app/(main)/explore/page.tsx`）
状态机：`phase: 'guide' | 'cards' | 'list'`，由 `guideStep` 和 `filters` 驱动。

- `GuideScreen` — 3 步引导问卷（性别→出行方式→同行身份），Framer Motion `AnimatePresence` 切换，支持跳过
- `CardStack` — 管理 `currentIndex` 和 swipe actions 历史，渲染 3 层堆叠卡片 + 底部按钮 + 计数器 + 空状态
- `SwipeCard` — Framer Motion `drag` + `useMotionValue`/`useTransform`，实时旋转/透明度/方向指示器，spring exit 动画（variants 驱动方向）
- `ResultList` — 响应式网格列表（1/2/3 列），stagger 入场动画，sticky header

Mock 数据：`lib/data/mock-activities.ts` — 20 条 `ActivityCard`，`filterActivities()` 按性别/出行方式/同行身份调整 matchScore。

### 状态管理
- 认证通过 NextAuth v5 (Auth.js beta) + JWT session，`app/layout.tsx` 包裹 `SessionProvider`
- 首页视频播放依赖 `mounted` 状态：服务端渲染占位 div，客户端 hydration 后渲染完整内容（避免 SSR/CSR mismatch）

### Calendar 页面组件架构（`components/calendar/`）
- `CalendarPageClient.tsx` — 客户端状态管理：currentDate、locationFilter、view切换
- `ActivityCalendar.tsx` — 月视图渲染：7×6 网格、活动标签、地点筛选器
- `EventDetailModal.tsx` — 活动详情弹窗（仅在日视图中使用）
- Mock 数据：`lib/data/mock-calendar-events.ts` — 60 个活动，8 种类型，支持 `getEventsByDateFiltered()`

### 设计系统原则
- **移动优先**：所有页面基础样式为移动端，`@media (min-width: 769px)` 做桌面增强
- **无私有 CSS**：所有颜色/字体通过 `globals.css` CSS 变量，禁止页面内嵌 `<style>` 或硬编码色值
- **Grid 防撑开**：`grid-template-columns: repeat(7, 1fr)` 的子元素必须加 `min-width: 0; overflow: hidden`

### 修改代码前的强制检查
每次修改、删除或重构前必须执行：
1. **影响范围** — `grep -r` 确认被修改项的所有引用方
2. **编译验证** — `npm run build` 必须零错误通过
3. **运行时验证** — 浏览器验证修改页面的核心功能路径
4. **删除确认** — 删除文件前 `grep -r` 确认零引用，删除后检查 `git status`

### 静态导出与部署
- `next.config.mjs` 配置 `output: 'export'`, `distDir: 'dist'`, `images.unoptimized: true`, `trailingSlash: true`
- 动态路由（如 `/calendar/day/[date]`）必须导出 `generateStaticParams()`，否则静态构建失败
- 构建输出到 `dist/` 目录（已加入 `.gitignore`），用于 Cloudflare Pages 部署
- API 路由在静态导出中不支持，当前已移至 `app/_api-backup/`，未来由 Cloudflare Workers 提供后端

### Cloudflare Pages 构建设置（Dashboard 中配置）
| 字段 | 值 |
|------|-----|
| Framework preset | `None`（禁用自动检测，避免 wrangler 误判为 Workers） |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Deploy command | 留空 |

### 未来架构：Pages + Workers
- **前端**：`app/` + `components/` + `lib/data/` → Cloudflare Pages（静态托管 `dist/`）
- **后端**：`workers/` → Cloudflare Workers（D1 数据库 + JWT 认证）
- **共享**：`lib/db/schema.ts` 可被 Workers 复用（D1 也是 SQLite）
- `workers/README.md` 有完整的后端开发指南
- `workers/wrangler.toml.example` 是配置模板，复制后填入真实值

### 首页特殊处理
- 首页 (`page.tsx`) 使用 `'use client'`，所有 CSS 在 `globals.css` 的 `@layer components` 中管理
- 视频播放通过 `useEffect([mounted])` 在组件挂载后触发（避免 SSR/CSR mismatch）
