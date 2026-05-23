# xjcloud Workers 后端

Cloudflare Workers + D1 后端服务，为前端 Pages 提供 API。

## 目录结构

```
workers/
├── src/
│   ├── index.ts           # Workers 入口（路由分发）
│   ├── auth.ts            # JWT 工具（createToken / verifyToken / authMiddleware）
│   ├── middleware.ts       # CORS + JSON 解析 + 错误处理 + requireAuth
│   ├── db/
│   │   └── client.ts      # D1 + Drizzle ORM 客户端
│   └── routes/
│       ├── health.ts      # GET /api/health
│       ├── auth.ts        # POST register|login + GET /me
│       └── users.ts       # PUT /api/users/me
├── package.json
├── tsconfig.json
├── wrangler.toml          # 从 wrangler.toml.example 复制并填入真实值
└── wrangler.toml.example
```

## 技术栈

- **Runtime**: Cloudflare Workers (workerd)
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM (`drizzle-orm/d1`)
- **Auth**: JWT (`jose` + `bcryptjs`)
- **Deploy**: Wrangler CLI

## API 路由

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/health` | 健康检查 | 无 |
| POST | `/api/auth/register` | 注册（name, email, password, role）→ 返回 JWT + user | 无 |
| POST | `/api/auth/login` | 登录（email, password）→ 返回 JWT + user | 无 |
| GET | `/api/auth/me` | 获取当前用户信息 | Bearer token |
| PUT | `/api/users/me` | 更新 Profile | Bearer token |

### PUT /api/users/me 支持的字段

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 姓名 |
| role | string | participant / organizer / provider |
| bio | string | 个人简介 |
| phone | string | 手机号 |
| location | string | 所在地（"省 · 市" 格式） |
| avatar | string | 头像 URL |
| website | string | 个人网站 |
| interests | string[] | 兴趣方向（JSON 数组） |
| gender | string | male / female |
| age | number | 年龄 |
| skills | string[] | 技能标签（JSON 数组） |

## 错误响应格式

所有错误返回 `{ error: string }` 并带对应 HTTP 状态码。错误提示均为中文。

## 开发命令

```bash
cd workers

# 本地开发（端口 8787，模拟 D1 读写）
pnpm dev

# 部署到生产
pnpm deploy

# D1 数据库本地查询
pnpm db:local --command "SELECT * FROM users"

# D1 数据库迁移
pnpm db:migrate
```

## 与前端协作

| 前端 (Pages) | 后端 (Workers) |
|-------------|---------------|
| `https://xjcloud.pages.dev` | `https://xjcloud-api.greenerdalii.workers.dev` |
| 静态 HTML/CSS/JS | API 路由 `/api/*` |
| AuthContext + localStorage Token | JWT 验证 |
| `.env.local` 中 `NEXT_PUBLIC_API_URL` 指向 Workers | CORS 白名单允许 Pages 域名 |

前端通过 `NEXT_PUBLIC_API_URL` 环境变量连接 Workers 后端：
- 本地开发：`NEXT_PUBLIC_API_URL=http://localhost:8787`
- 生产环境：`NEXT_PUBLIC_API_URL=https://xjcloud-api.greenerdalii.workers.dev`

前端 Pages 构建时自动注入生产环境变量，本地通过 `.env.local` 覆盖。

## 注意事项

- `wrangler.toml` 包含敏感信息（database_id, AUTH_SECRET），**不要提交到 Git**
- `wrangler.toml.example` 是配置模板，复制后填入真实值
- D1 schema 复用根目录 `lib/db/schema.ts`（SQLite 兼容）
- 本地 D1 和生产 D1 是独立数据库，账号不互通
- 所有 API 路径必须带 `/api/` 前缀，不匹配的路由返回 404
