# 乡建协作平台 (xjcloud)

> 让乡建人协作起来 —— AI 驱动的乡建活动协作 SaaS + UGC 平台

## 快速开始

```bash
# 安装依赖
npm install

# 数据库迁移
npm run db:push

# 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

## 技术栈

- **框架**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS
- **ORM**: Drizzle ORM + better-sqlite3
- **认证**: NextAuth.js v5 (Auth.js)
- **数据库**: SQLite（本地开发）→ Cloudflare D1（生产）

## 项目结构

```
app/
  (auth)/          # 认证页面（登录/注册）
  (main)/          # 主应用页面（发现/动态/Profile）
  api/             # API 路由
components/        # UI 组件
lib/
  db/              # Drizzle schema + client
  auth.ts          # NextAuth 配置
public/            # 静态资源
```

## 文档

- [SPEC](docs/SPEC.md) — 技术规格说明书
- [ROADMAP](ROADMAP.md) — 开发路线图
- [CHANGELOG](CHANGELOG.md) — 变更日志
- [Implementation Plan](docs/superpowers/plans/2026-05-22-xjcloud-mvp.md) — 实施计划

## Git 工作流

每次提交前更新：README、CHANGELOG、ROADMAP、版本号、CLAUDE.md

---

*基于屏南数智乡建黑客松实地验证 | 2026-05-22*
