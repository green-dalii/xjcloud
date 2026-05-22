# 乡建协作平台 MVP 技术规格说明书

日期：2026-05-22
状态：待审核

---

## 一、项目定位

**目标**：搭建一个乡建协作 SaaS+UGC 平台的 MVP，验证 AI 活动方案生成的核心价值，为后续数据飞轮奠定技术基础。

**核心原则**：
- 最小技术债：每一行代码都要有明确的后续迁移路径
- 清晰模块化：职责单一，边界明确，易于理解和修改
- 渐进式：MVP 验证价值，后期平滑扩展
- Python Zen：Simple is better than complex. Readability counts.

---

## 二、技术选型

| 层级 | 技术 | 理由 |
|------|------|------|
| **框架** | Next.js 14 (App Router) + TypeScript | 全栈一体，本地一条命令启动，TypeScript 类型安全 |
| **样式** | Tailwind CSS | 快速开发，响应式设计友好 |
| **ORM** | Drizzle ORM + better-sqlite3 | 支持 SQLite 和 D1，迁移路径平滑，无代码生成 |
| **认证** | NextAuth.js (Auth.js v5) | Next.js 官方推荐，支持 session/JWT，简单配置 |
| **数据库** | SQLite（本地文件） | MVP 零配置，后期迁 D1 或 PG 只改连接配置 |
| **版本控制** | Git | 用户已指定 |

**迁移路径**：
- SQLite → D1：改 `drizzle.config.ts` 的 driver 配置
- SQLite → PostgreSQL：改 driver + 连接字符串
- NextAuth → 自建认证：session 机制可复用

---

## 三、架构设计

### 3.1 目录结构

```
xjcloud/
├── app/                    # Next.js App Router
│   ├── (auth)/             # 认证路由组（布局分离）
│   │   ├── login/
│   │   └── register/
│   ├── (main)/             # 主应用路由组
│   │   ├── page.tsx        # 首页（AI First 框架 + Feed）
│   │   ├── feed/           # UGC 内容流
│   │   ├── profile/        # 用户档案
│   │   └── activities/     # 活动相关
│   ├── api/                # API 路由
│   │   ├── auth/[...nextauth]/  # NextAuth
│   │   ├── posts/          # UGC 内容 API
│   │   ├── activities/     # 活动 API
│   │   └── users/          # 用户 API
│   └── layout.tsx          # 根布局（响应式导航）
│
├── lib/                    # 核心库
│   ├── db/                 # Drizzle schema + client
│   │   ├── schema.ts       # 数据模型定义
│   │   ├── client.ts       # 数据库连接
│   │   └── migrations/     # Drizzle 生成迁移文件
│   ├── auth/               # NextAuth 配置
│   │   ├── config.ts       # auth options
│   │   └── session.ts      # session 辅助函数
│   ├── api/                # API 辅助函数
│   │   ├── response.ts     # 统一响应格式
│   │   ├── validate.ts     # 输入验证
│   └── utils/              # 通用工具
│
├── components/             # UI 组件
│   ├── ui/                 # 基础组件（Button, Card, Input）
│   ├── layout/             # 布局组件（Header, Footer, TabNav）
│   ├── feed/               # UGC Feed 组件
│   ├── auth/               # 认证表单组件
│   └── activity/           # 活动组件
│
├── public/                 # 静态资源
├── drizzle.config.ts       # Drizzle 配置
├── next.config.js          # Next.js 配置
└── tailwind.config.js      # Tailwind 配置
```

### 3.2 响应式导航

- **移动端（<768px）**：底部 Tab 导航（发现/发布/消息/我的）
- **桌面端（≥768px）**：顶部导航栏 + 搜索框 + 用户头像，侧边栏可选
- **实现方式**：Next.js 组件内 CSS 媒体查询 + Tailwind breakpoints

---

## 四、数据模型

### 4.1 核心表（MVP 最小集）

```typescript
// lib/db/schema.ts

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(), // bcrypt hash
  avatar: text('avatar'), // URL or null
  riceBalance: integer('rice_balance').default(0), // 稻米积分
  role: text('role', { enum: ['participant', 'organizer', 'provider'] }).default('participant'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  authorId: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  images: text('images', { mode: 'json' }).$type<string[]>().default([]),
  activityId: text('activity_id').references(() => activities.id), // 可关联活动
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
});

export const activities = sqliteTable('activities', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizerId: text('organizer_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type'), // 'workshop' | 'tour' | 'experience' | etc.
  status: text('status', { enum: ['draft', 'published', 'completed', 'cancelled'] }).default('draft'),
  capacity: integer('capacity'),
  enrolledCount: integer('enrolled_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
});

export const enrollments = sqliteTable('enrollments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  activityId: text('activity_id').notNull().references(() => activities.id),
  participantId: text('participant_id').notNull().references(() => users.id),
  status: text('status', { enum: ['pending', 'confirmed', 'cancelled'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
});

export const likes = sqliteTable('likes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text('post_id').notNull().references(() => posts.id),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
});

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text('post_id').notNull().references(() => posts.id),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
});
```

### 4.2 迁移策略

- **生成迁移**：`drizzle-kit generate:sqlite`
- **执行迁移**：`drizzle-kit push:sqlite`（MVP 直接 push，后期改用 migrate）
- **种子数据**：手动插入 2-3 个测试用户和内容，用于开发验证

---

## 五、API 设计

### 5.1 认证 API

```
POST /api/auth/register
  Body: { name, email, password }
  Response: { success, user }

POST /api/auth/[...nextauth]
  由 NextAuth 自动处理 login/session
```

### 5.2 内容 API

```
GET /api/posts
  Query: ?page=1&limit=10
  Response: { posts: Post[], total, page }

POST /api/posts
  Body: { content, images[]?, activityId? }
  Response: { success, post }

POST /api/posts/:id/like
  Response: { success, likesCount }

POST /api/posts/:id/comment
  Body: { content }
  Response: { success, comment }
```

### 5.3 用户 API

```
GET /api/users/me
  Response: { user: User }

PUT /api/users/me
  Body: { name?, avatar? }
  Response: { success, user }
```

### 5.4 活动 API（占位）

```
GET /api/activities
  Response: { activities: Activity[] }

POST /api/activities
  Body: { title, description, type, capacity }
  Response: { success, activity }
```

### 5.5 响应格式规范

```typescript
// 成功
{ success: true, data: {...} }

// 错误
{ success: false, error: { code: string, message: string } }
```

---

## 六、页面设计

### 6.1 首页（`app/(main)/page.tsx`）

**移动优先响应式**：
- **顶部**：品牌 Logo + 搜索入口（桌面端完整搜索框）
- **中部**：AI First 占位区域（"一键生成活动方案"入口，带简短引导文案）
- **下部**：UGC Feed 列流（最新 10 条，支持点赞评论）
- **底部**：移动端 Tab 导航（桌面端隐藏）

**AI First 占位区域**：
```
┌────────────────────────────┐
│  🎯 让活动策划从难如登天    │
│     变成一键生成            │
│                            │
│  [开始生成你的第一场活动]   │
│                            │
│  已有 3 位乡建人用AI策划    │
│  本周活动                   │
└────────────────────────────┘
```

### 6.2 注册页（`app/(auth)/register/page.tsx`）

**表单字段**：
- 姓名（必填）
- 邮箱（必填，唯一）
- 密码（必填，≥6位）
- 角色（可选：参与者/组织者/服务方，默认参与者）

**交互**：
- 提交 → 调用 `/api/auth/register`
- 成功 → 自动登录 → 跳转首页
- 失败 → 显示错误提示（邮箱已存在等）

### 6.3 登录页（`app/(auth)/login/page.tsx`）

**表单字段**：
- 箱
- 密码

**交互**：
- 提交 → NextAuth session 创建
- 成功 → 跳转首页
- 失败 → 显示错误提示

### 6.4 UGC Feed 页（`app/(main)/feed/page.tsx`）

**布局**：
- 移动端：单列卡片流
- 桌面端：双列或三列网格

**卡片内容**：
```
┌──────────────────────────────┐
│  👤 用户名 · 2小时前          │
│                              │
│  "周末带娃去了张木匠那儿..." │
│                              │
│  [图片] [图片]               │
│                              │
│  ❤️ 23   💬 5                │
└──────────────────────────────┘
```

**交互**：
- 点赞 → 调用 `/api/posts/:id/like` → 实时更新计数
- 评论 → 点击展开评论输入框 → 提交到 `/api/posts/:id/comment`
- 分页 → 滚动加载（桌面端）或"加载更多"按钮（移动端）

### 6.5 Profile 页（`app/(main)/profile/page.tsx`）

**布局**：
```
┌──────────────────────────────┐
│  [头像]  用户名               │
│          role: 参与者         │
│          🌾 稻米积分: 128     │
│                              │
│  基本信息                     │
│  链箱: user@example.com     │
│                              │
│  我的活动                     │
│  · 木艺工坊 (已参与)          │
│  · 写生营 (已报名)            │
│                              │
│  我的发布                     │
│  · "张木匠体验..."            │
└──────────────────────────────┘
```

**数据来源**：
- `/api/users/me` → 用户基本信息
- `/api/activities?participantId=me` → 参与的活动
- `/api/posts?authorId=me` → 发布的内容

---

## 七、组件设计

### 7.1 响应式导航组件

```typescript
// components/layout/Navigation.tsx

export function Navigation() {
  return (
    <>
      {/* 桌面端顶部导航 */}
      <header className="hidden md:block">
        <nav>Logo | 发现 | 发布 | 消息 | 搜索 | 用户头像</nav>
      </header>

      {/* 移动端底部Tab */}
      <nav className="fixed bottom-0 md:hidden">
        <TabNav tabs={['发现', '发布', '消息', '我的']} />
      </nav>
    </>
  );
}
```

### 7.2 UGC 卡片组件

```typescript
// components/feed/PostCard.tsx

interface PostCardProps {
  post: Post & { author: User };
  onLike?: () => void;
  onComment?: () => void;
}

export function PostCard({ post, onLike, onComment }) {
  return (
    <Card>
      <UserInfo author={post.author} time={post.createdAt} />
      <Content text={post.content} images={post.images} />
      <ActionBar likes={post.likesCount} comments={post.commentsCount} />
    </Card>
  );
}
```

---

## 八、开发流程

### 8.1 本地运行命令

```bash
# 安装依赖
npm install

# 数据库迁移
npm run db:push

# 启动开发服务器
npm run dev
```

### 8.2 Git 管理

- **分支策略**：main（稳定）+ dev（开发）
- **提交规范**：feat/fix/refactor/docs + 简短描述
- **提交频率**：每个独立功能完成后立即 commit

---

## 九、MVP 交付标准

| 功能 | 交付标准 |
|------|----------|
| 注册登录 | 用户能注册、登录、保持 session，Profile 页显示用户信息 |
| UGC Feed | 用户能发布内容、查看内容流、点赞、评论 |
| Profile | 显示用户基本信息、稻米积分（占位）、参与的活动列表 |
| 首页 | AI First 占位区域 + UGC Feed 入口，响应式布局正常 |
| Git 历史 | 每个 commit 有明确意义，可追溯开发过程 |

---

## 十、后期扩展路径

### 10.1 迁移到 Cloudflare D1

```typescript
// drizzle.config.ts 修改
export default {
  driver: 'd1-http', // 改为 D1
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  d1Config: {
    accountId: process.env.CF_ACCOUNT_ID,
    databaseId: process.env.CF_D1_DB_ID,
    token: process.env.CF_API_TOKEN,
  },
};
```

### 10.2 添加 AI 活动方案生成

- 新增 `/api/activities/generate-plan` endpoint
- 调用 Claude API 或其他 LLM 服务
- 前端增加活动策划表单和方案展示组件

### 10.3 接入乡建 DAO 积分系统

- 扩展 `riceBalance` 的转账 API
- 实现积分任务中心
- 接入 DAO 治理接口

---

## 十一、风险与应对

| 风险 | 应对 |
|------|------|
| SQLite 性能瓶颈 | MVP 用户量小，后期迁 D1/PG 后自然解决 |
| NextAuth 配置复杂 | 使用官方 starter 模板，最小配置 |
| 响应式布局调试耗时 | 先实现移动端，桌面端用 Tailwind 快速适配 |
| Drizzle 文档不熟 | 参考官方 examples，先实现基本 CRUD |

---

**本规格说明书基于用户需求和技术选型讨论，遵循最小技术债和渐进式原则。请审核后开始实施。**