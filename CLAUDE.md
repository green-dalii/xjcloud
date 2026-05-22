# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
# 启动开发服务器（端口 3001）
PORT=3001 npm run dev

# 编译检查
PORT=3001 npm run build

# 数据库迁移
npm run db:push

# Lint 检查
npm run lint
```

## 项目概述

乡建协作平台 (xjcloud) — AI 驱动的乡村活动协作 SaaS + UGC 平台。Next.js 14 App Router + TypeScript + Tailwind CSS，数据库用 SQLite（Drizzle ORM），后期迁移到 Cloudflare D1。

## 设计系统

**Warm Earth Palette**：所有颜色通过 globals.css 的 CSS custom properties 定义，Tailwind 配置中有一套兼容 shadcn 的 HSL 令牌。

核心色板：深墨 `#2d2a26` | 米纸 `#f5f1ea` | 苔藓绿 `#3d5a3f` | 麦金 `#c9a96e` | 石头灰 `#7a7468`

字体：标题用 Noto Serif SC，装饰英文用 Cormorant Garamond，正文用 PingFang SC。在 globals.css 中通过 `--font-*` 变量定义，Tailwind 扩展了 `fontFamily: { serif, display }`。

## 关键架构

### 路由结构
- `/` → `app/(main)/page.tsx` — 首页，全屏沉浸双面板（视频背景 + hover 伸缩），不走 layout 的 Navbar/Footer
- `/explore` → `app/(main)/explore/page.tsx` — 探索页，带 Navbar/Footer
- `/host` → `app/(main)/host/page.tsx` — 共建者页，带 Navbar/Footer
- `/login`, `/register` → `app/(auth)/` — 认证页
- `/api/*` → `app/api/` — API 路由

### 核心组件
- `components/layout/NavbarFooter.tsx` — Navbar（scroll 透明→毛玻璃渐变）+ Footer
- `app/(main)/layout.tsx` — 根据 pathname 决定是否渲染 Navbar/Footer（首页不渲染）

### 状态管理
- 认证通过 NextAuth v5 (Auth.js beta) + JWT session，`app/layout.tsx` 包裹 `SessionProvider`
- 首页视频播放依赖 `mounted` 状态：服务端渲染占位 div，客户端 hydration 后渲染完整内容（避免 SSR/CSR mismatch）

### 首页特殊处理
- 首页 (`page.tsx`) 使用 `'use client'`，内嵌 `<style>` 标签管理所有首屏 CSS
- 视频播放通过 `useEffect([mounted])` 在组件挂载后触发
- 区域选择器使用 ref + document click listener 实现外部点击关闭
