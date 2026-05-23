# xjcloud Workers 后端

Cloudflare Workers + D1 后端服务，为前端 Pages 提供 API。

## 目录结构

```
workers/
├── src/
│   ├── index.ts          # Workers 入口（路由分发）
│   ├── auth.ts           # JWT 认证（替代 NextAuth）
│   ├── db/
│   │   └── client.ts     # D1 + Drizzle ORM 客户端
│   └── routes/
│       ├── health.ts     # 健康检查
│       ├── auth.ts       # 登录/注册
│       ├── users.ts      # 用户信息
│       ├── activities.ts # 活动管理
│       └── posts.ts      # UGC 帖子
├── package.json
├── tsconfig.json
└── wrangler.toml         # 从 wrangler.toml.example 复制并填入真实值
```

## 技术栈

- **Runtime**: Cloudflare Workers (workerd)
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM (`drizzle-orm/d1`)
- **Auth**: JWT (jose library)
- **Deploy**: Wrangler CLI

## 当前 API 路由

```
POST /api/auth/register   → 注册（name, email, password, role）→ 返回 JWT
POST /api/auth/login      → 登录（email, password）→ 返回 JWT
GET  /api/auth/me         → 获取当前用户（需 Bearer token）
PUT  /api/users/me        → 更新 Profile（name, bio, phone, location, avatar, website, interests, gender, age, skills）
```

## Profile 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 姓名 |
| bio | string | 个人简介 |
| phone | string | 手机号 |
| location | string | 所在地（"省 · 市" 格式） |
| avatar | string | 头像 URL |
| website | string | 个人网站 |
| interests | string[] | 兴趣方向（JSON 数组） |
| gender | string | 性别（male/female） |
| age | string | 年龄 |
| skills | string[] | 技能标签（JSON 数组，最多 8 个） |

## 开发命令

```bash
cd workers

# 本地开发
pnpm dev

# 部署到生产
pnpm deploy

# D1 数据库操作
pnpm db:local --command "SELECT * FROM users"
pnpm db:migrate
```

## 与前端的协作

| 前端 (Pages) | 后端 (Workers) |
|-------------|---------------|
| `https://xjcloud.pages.dev` | `https://xjcloud-api.your-subdomain.workers.dev` |
| 静态 HTML/CSS/JS | API 路由 `/api/*` |
| NextAuth (客户端) | JWT (服务器端验证) |
| Mock 数据 | D1 真实数据 |

## 迁移路径

1. 完成 Workers API 开发
2. 前端将 fetch URL 从 Mock 切换到 Workers API
3. 用户数据从本地 SQLite 迁移到 D1

## 注意事项

- `wrangler.toml` 包含敏感信息（database_id, AUTH_SECRET），**不要提交到 Git**
- `wrangler.toml.example` 是模板，复制后填入真实值
- D1 schema 复用根目录 `lib/db/schema.ts`（SQLite 兼容）
