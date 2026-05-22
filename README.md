# 乡建协作平台 (xjcloud)

> 让乡建人协作起来 —— AI 驱动的乡建活动协作 SaaS + UGC 平台

## 快速开始

```bash
# 安装依赖
npm install
# 数据库迁移
npm run db:push
# 启动开发服务器
PORT=3001 npm run dev
# 访问 http://localhost:3001
```

## 技术栈

- **框架**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS 3.4 + CSS custom properties
- **动画**: GSAP (ScrollTrigger) + CSS transitions
- **ORM**: Drizzle ORM + better-sqlite3
- **认证**: NextAuth.js v5 (Auth.js)
- **数据库**: SQLite（本地）→ Cloudflare D1（生产）

## 设计系统 — Warm Earth Palette

| Token | 值 | 用途 |
|-------|------|------|
| `--bg-ink` | `#2d2a26` | 首页背景、深色区块 |
| `--bg-paper` | `#f5f1ea` | 页面背景、浅色区块 |
| `--color-moss` | `#3d5a3f` | 正文色 |
| `--color-wheat` | `#c9a96e` | 强调色、品牌色 |
| `--color-stone` | `#7a7468` | 副文本色 |
| `--font-serif` | Noto Serif SC | 标题 |
| `--font-display` | Cormorant Garamond | 装饰英文 |
| `--font-ui` | PingFang SC | 正文 |

## 项目结构

```
app/
  (auth)/             # 认证页面（登录/注册）
  (main)/
    page.tsx          # 首页 LandingPage（全屏沉浸，双面板+视频背景）
    explore/
      page.tsx        # 探索页（Hero视频+精选地+气氛视频+GSAP动画）
    host/
      page.tsx        # 共建者页（Hero视频+案例+三步流程+CTA）
    layout.tsx        # 主布局（非首页：Navbar + 内容 + Footer）
  api/                # API 路由
components/
  layout/
    NavbarFooter.tsx  # Navbar（滚动透明→毛玻璃） + Footer
lib/
  db/                 # Drizzle schema + client
  auth.ts             # NextAuth 配置
public/
  images/             # 站点图片（沙溪、桐庐、景德镇等）
  videos/             # 站点视频（田园生活、慢生活）
```

## 文档

- [SPEC](docs/SPEC.md) — 技术规格说明书
- [ROADMAP](ROADMAP.md) — 开发路线图
- [CHANGELOG](CHANGELOG.md) — 变更日志

## Git 工作流

每次提交前更新：README、CHANGELOG、ROADMAP、版本号、CLAUDE.md

---

*基于屏南数智乡建黑客松实地验证 | 2026-05-22*
