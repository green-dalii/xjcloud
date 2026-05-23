# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
# 启动开发服务器（端口 3001）
PORT=3001 pnpm dev

# 编译检查（静态导出，输出到 dist/）
PORT=3001 pnpm -w build

# 启动 Workers 本地服务器（D1 模拟读写，端口 8787）
cd workers && npx wrangler dev --local

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
- `/explore` → `app/(main)/explore/page.tsx` — 探索页（引导问卷 → Loading → 卡片堆叠）
- `/activities` → `app/(main)/activities/page.tsx` — 全部活动全览页（独立于 explore，带筛选工具栏）
- `/host` → `app/(main)/host/page.tsx` — 「我要造趣」共建者页（未登录 → AuthPrompt 引导；已登录 → MultiStepGuide 身份选择 → landing 内容）
- `/match` → `app/(main)/match/page.tsx` — 匹配页（登录用户搜索优先 UX → Dock 卡片堆叠；未登录引导注册）
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
  - 导航项顺序：探索 → 我要造趣 → 所有活动 → 活动日历 → 分享广场
  - 认证状态：未登录显示「登录/注册」按钮，已登录显示用户头像 + 退出
  - 「探索」链接已登录指向 `/match`，未登录指向 `/explore`
  - Footer：深色底，多栏链接布局
- `app/(main)/layout.tsx` — 所有 (main) 组页面统一渲染 Navbar + Footer
- `components/shared/MultiStepGuide.tsx` — 通用多步引导问卷组件，供 explore 和 host 复用
  - Props：`step`、`totalSteps`、`questions`、`answers`、`onSelect`、`onNext`、`onPrev`、`onSkip`、`onAuth`、`skipLabel`
  - 单选模式：垂直胶囊按钮（圆角全宽，选中麦金高亮），点击自动进入下一步
  - 多选模式：Bento 不规则网格（≤8 选项）或规则网格（>8 选项），配手动「下一步」按钮
  - 第一步可选渲染登录引导按钮（`onAuth` prop）
  - explore 的 `GuideScreen` 和 host 的引导流程都是此组件的薄包装
- `components/shared/TagInput.tsx` — 类 GitHub Topics 标签输入组件
  - Enter/逗号添加标签，Backspace/× 删除，最多 8 个
  - 超出上限禁用输入并提示，hover 显示删除 ×

### Explore 页面组件架构（`app/(main)/explore/page.tsx`）
状态机：`phase: 'guide' | 'loading' | 'cards' | 'list'`，由 `guideStep` 和 `filters` 驱动。

- `GuideScreen` — 4 步引导问卷（性别→出行方式→同行身份→兴趣方向），Framer Motion `AnimatePresence` 切换
  - 单人出行跳过同行身份直接到兴趣方向
  - 第4步：8个活动方向 Bento 多选（3行不规整布局），选中后展示 desc，零 CLS
  - 进度指示器（4个圆点）+ 返回按钮同行显示
  - 支持跳过，直接进入全部活动页面
- `CardStack` — 管理 `currentIndex` 和 swipe actions 历史，渲染 3 层堆叠卡片 + 底部按钮 + 计数器 + 空状态
- `SwipeCard` — Framer Motion `drag` + `useMotionValue`/`useTransform`，桌面端翻转后横向扩展宽度；iOS Safari 3D 翻转需 `-webkit-` 前缀
- `LoadingScreen` — 随机加载文案（6条趣味文案），旋转双环 spinner
- `ResultList` — 响应式网格列表（1/2/3 列），stagger 入场动画，sticky header（用于收藏结果展示）

Mock 数据：`lib/data/mock-activities.ts` — 20 条 `ActivityCard`，`filterActivities()` 按性别/出行方式/同行身份/兴趣方向调整 matchScore。`INTEREST_TAG_MAP` 导出为模块级常量。

### Match 页面组件架构（`app/(main)/match/page.tsx`）
状态机：`phase: 'search' | 'cards'`，登录用户专属。

- `SearchHero` — 搜索引擎式搜索框居中布局，深色渐变背景
  - 6 条口语化占位文案循环轮换（每 3 秒），带淡入淡出过渡
  - 输入框麦金边框聚焦态，Enter 或点击按钮进入卡片展示
- `DockCardStack` — macOS Dock 风格横向堆叠卡片
  - 5 张纸牌横向排列，透视旋转（`rotateY` ±25deg），z-index 堆叠层级
  - 鼠标悬停：目标卡片上浮（`y: -12`）、放大（桌面 1.22x，移动 1.12x）、z-index 提升
  - 其余卡片缩小至 0.88x 向后回退，通过 `spring` 动画平滑过渡
  - 响应式：`useWindowWidth` hook 检测视口宽度，动态调整卡片尺寸
- 资料检查门控：`hasMinimalProfile` 检查 bio/phone/location/skills，未填写展示提示横幅
- 未登录用户展示注册/登录引导页

### Host 页面组件架构（`app/(main)/host/page.tsx`）
状态机：`phase: 'guide' | 'landing'`，登录状态控制渲染。

- 未登录：`AuthPrompt` 深色全屏引导页（登录/注册按钮）
- 已登录：复用 `MultiStepGuide`，第一步问题 "你是以什么身份发起活动？"
  - 选项：「我是想法发起人」（有创意找场地）+「我是在地主理人」（有场地做体验）
  - 引导完成后进入原 landing 内容（视频 Hero + 案例卡片 + 三步创建流程 + CTA）

### Profile 页面组件架构（`app/(main)/profile/page.tsx`）
三个主要区域：用户信息卡片 → 参与活动时间轴 → 发起活动时间轴。

- 资料提示横幅：未填写 bio/phone/location/skills 时显示，点击进入编辑模式并聚焦首个空字段
- 编辑模式：姓名/简介/手机/网站/性别/年龄/常居地（省市级联）/技能标签（TagInput）
- 省市级联：`lib/data/china-regions.ts` 含 34 省对应城市数据，先选省份再动态加载城市
- 月份时间轴：`groupByMonth()` 按月分组活动，`sortMonthKeysDesc()` 降序排列
  - 每月一个时间线节点（竖线 + 圆点），卡片垂直列表
  - 固定高度 500px 容器，超出可滚动
  - 参与活动和发起活动共用同一时间轴模式

### Activities 全部活动页面（`app/(main)/activities/page.tsx`）
独立全览页，独立于 explore 状态机。从 explore "跳过"或卡片浏览完毕跳转至此。

- 筛选架构：城市 tab 常驻（一级分类）→ 搜索框 → 排序（综合/价格/匹配度）→ 筛选面板
- 筛选面板：移动端底部 sheet（`y` 轴滑入），桌面端右侧抽屉（`x` 轴滑入，360px 宽）
  - 时间（单选）、风格方向（可多选，8 个方向）、价格区间（单选）
  - 已选条件以 pill 显示，可逐个清除，"清除全部"一键重置
  - 底部固定"重置"+"查看 N 个结果"按钮
- 卡片网格：响应式 1/2/3 列，stagger 入场动画，空状态处理
- 搜索：实时过滤标题/地点/描述/标签

### 状态管理
- **认证**：自定义 JWT 认证系统（`lib/auth-context.tsx`），替换 NextAuth 的 SessionProvider
  - `AuthProvider` 包裹在 `app/layout.tsx`，替代原 `SessionProvider`
  - `useAuth()` hook 提供 `{ user, login, register, logout, updateProfile }`
  - Token 存储在 `localStorage('xjcloud_token')`，Bearer 方式传 Workers 后端
  - Workers 后端：`POST /api/auth/register|login` + `GET /api/auth/me`（JWT 鉴权）
  - 所有 API 路由在 Workers，前端静态导出不受影响
- **旧 NextAuth**：`lib/auth.ts` 保留但仅用于本地 SQLite 直接鉴权兜底，不再通过 API 路由使用
- **Schema**：`lib/db/schema.ts` 定义了 6 张核心表（users, activities, enrollments, posts, likes, comments）
  - `users.skills` 存储为 JSON 数组（`text('skills', { mode: 'json' }).$type<string[]>()`）
  - `users.location` 格式为 "省 · 市" 级联字符串
  - 新增字段：`gender`/`age`/`skills`（v0.3.7），与 Workers `ALLOWED_PROFILE_FIELDS` 同步
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
