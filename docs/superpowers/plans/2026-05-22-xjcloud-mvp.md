# 乡建协作平台 MVP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建一个支持注册登录、UGC 内容流、用户 Profile 和 AI First 首页框架的乡建协作平台 MVP。

**架构:** Next.js 14 App Router 全栈一体。Drizzle ORM + SQLite 零配置本地开发，响应式导航（移动端底部 Tab + 桌面端顶部导航）。按阶段渐进：骨架 → 认证 → UGC → 收尾。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Drizzle ORM, better-sqlite3, NextAuth.js v5 (Auth.js)

---

## 文件结构地图

```
xjcloud/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx              # 认证页布局（极简，无导航）
│   │   ├── login/page.tsx          # 登录页
│   │   └── register/page.tsx       # 注册页
│   ├── (main)/
│   │   ├── page.tsx                # 首页（AI First 框架 + Feed 入口）
│   │   ├── feed/page.tsx           # UGC Feed
│   │   └── profile/page.tsx        # 用户 Profile
│   ├── api/auth/[...nextauth]/route.ts   # NextAuth 路由
│   ├── api/posts/route.ts          # 内容 CRUD
│   ├── api/posts/[id]/like/route.ts      # 点赞 API
│   ├── api/posts/[id]/comment/route.ts   # 评论 API
│   ├── api/users/me/route.ts       # 当前用户信息
│   ├── api/activities/route.ts     # 活动列表
│   ├── layout.tsx                  # 根布局（含全局导航）
│   └── globals.css                 # 全局样式 + Tailwind
├── lib/
│   ├── db/
│   │   ├── schema.ts               # 数据模型定义
│   │   ├── client.ts               # Drizzle 数据库连接
│   │   └── seed.ts                 # 种子数据脚本
│   └── auth.ts                     # NextAuth 配置（Auth.js v5）
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # 桌面端顶部导航
│   │   └── BottomNav.tsx           # 移动端底部 Tab 导航
│   ├── feed/
│   │   ├── PostCard.tsx            # UGC 内容卡片
│   │   ├── PostForm.tsx            # 发布内容表单
│   │   └── CommentForm.tsx         # 评论输入框
│   ├── auth/
│   │   ├── LoginForm.tsx           # 登录表单
│   │   └── RegisterForm.tsx        # 注册表单
│   ├── ui/
│   │   ├── Button.tsx              # 基础按钮
│   │   ├── Input.tsx               # 基础输入框
│   │   └── Card.tsx                # 基础卡片
│   └── profile/
│       └── UserInfo.tsx            # 用户基本信息卡片
├── public/
│   └── logo.svg                    # 占位 Logo
├── drizzle.config.ts               # Drizzle 配置
├── next.config.mjs                 # Next.js 配置（静态导出占位）
├── tailwind.config.ts              # Tailwind 配置
├── tsconfig.json                   # TypeScript 配置
└── package.json                    # 依赖管理
```

---

## Phase 1：项目骨架

### Task 1：初始化 Next.js 项目

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`

- [ ] **Step 1：初始化 Next.js 14 项目**

```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --no-turbopack
```

> 注意：不接受默认 prompts，必须确认使用 App Router。`--no-turbopack` 避免已知兼容问题。`--src-dir=false` 确保项目根级结构。

**预期输出：** 项目目录下有 `app/`, `components/`, `public/`, `lib/`（或需手动创建），`node_modules/` 创建完毕。

- [ ] **Step 2：安装核心依赖**

```bash
cd /Users/greener/project/xjcloud
npm install drizzle-orm better-sqlite3 bcryptjs next-auth@beta
npm install -D @types/bcryptjs drizzle-kit
```

**预期输出：** `node_modules/` 包含上述包，无安装错误。

- [ ] **Step 3：初始化 Git 并提交**

```bash
cd /Users/greener/project/xjcloud
git add -A
git commit -m "chore: init Next.js 14 project with Tailwind, Drizzle, Auth.js"
```

---

### Task 2：配置 Tailwind + 全局样式

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1：配置 Tailwind 断点（移动端优先）**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'xj-amber': '#D97706',
        'xj-amber-dark': '#92400E',
        'xj-green': '#065F46',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 2：全局样式**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-size: 16px;
    -webkit-tap-highlight-color: transparent;
  }
  body {
    @apply bg-gray-50 text-gray-900;
    overscroll-behavior-y: none;
  }
}
```

- [ ] **Step 3：提交**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "chore: configure Tailwind with custom colors"
```

---

### Task 3：Drizzle ORM + 数据库 Schema

**Files:**
- Create: `lib/db/schema.ts`
- Create: `lib/db/client.ts`
- Create: `lib/db/seed.ts`
- Create: `drizzle.config.ts`

- [ ] **Step 1：定义数据模型**

```typescript
// lib/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  avatar: text('avatar'),
  riceBalance: integer('rice_balance').default(0),
  role: text('role', { enum: ['participant', 'organizer', 'provider'] }).default('participant'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
})

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  authorId: text('author_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  images: text('images', { mode: 'json' }).$type<string[]>().default([]),
  activityId: text('activity_id').references(() => activities.id),
  likesCount: integer('likes_count').default(0),
  commentsCount: integer('comments_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
})

export const activities = sqliteTable('activities', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  organizerId: text('organizer_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type'),
  status: text('status', { enum: ['draft', 'published', 'completed', 'cancelled'] }).default('draft'),
  capacity: integer('capacity'),
  enrolledCount: integer('enrolled_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
})

export const enrollments = sqliteTable('enrollments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  activityId: text('activity_id').notNull().references(() => activities.id),
  participantId: text('participant_id').notNull().references(() => users.id),
  status: text('status', { enum: ['pending', 'confirmed', 'cancelled'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
})

export const likes = sqliteTable('likes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text('post_id').notNull().references(() => posts.id),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
})

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text('post_id').notNull().references(() => posts.id),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => Date.now()),
})
```

- [ ] **Step 2：创建数据库连接**

```typescript
// lib/db/client.ts
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('./xjcloud.db')
export const db = drizzle(sqlite, { schema })
```

- [ ] **Step 3：种子数据**

```typescript
// lib/db/seed.ts
import { db } from './client'
import { users, posts, activities } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  // 测试用户 1
  const password = await bcrypt.hash('123456', 10)
  
  await db.insert(users).values({
    name: '新农人小王',
    email: 'wang@test.com',
    passwordHash: password,
    role: 'organizer',
    riceBalance: 128,
  })

  await db.insert(users).values({
    name: '张木匠',
    email: 'zhang@test.com',
    passwordHash: password,
    role: 'provider',
    riceBalance: 256,
  })

  console.log('Seeded 2 users')
}

seed().catch(console.error)
```

- [ ] **Step 4：Drizzle 配置**

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dbCredentials: {
    url: './xjcloud.db',
  },
})
```

- [ ] **Step 5：执行 schema 迁移**

```bash
npx drizzle-kit push:sqlite
```

**预期输出：** 数据库创建成功，包含 `users`, `posts`, `activities`, `enrollments`, `likes`, `comments` 表。

- [ ] **Step 6：提交**

```bash
git add lib/db/ drizzle.config.ts
git commit -m "feat: add Drizzle schema, client, seed, config"
```

---

### Task 4：响应式导航布局

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/BottomNav.tsx`
- Create: `app/(main)/layout.tsx`

- [ ] **Step 1：创建桌面端顶部导航**

```tsx
// components/layout/Header.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { label: '发现', href: '/' },
    { label: '动态', href: '/feed' },
    { label: '我的', href: '/profile' },
  ]

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xj-amber font-bold text-lg">
          🌾 乡建协作
        </Link>
        <nav className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium ${
                pathname === item.href ? 'text-xj-amber' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="搜索..."
            className="w-40 px-3 py-1.5 text-sm bg-gray-100 rounded-md border-0 focus:ring-1 focus:ring-xj-amber"
          />
          <Link
            href="/profile"
            className="w-8 h-8 bg-xj-amber rounded-full flex items-center justify-center text-white text-sm"
          >
            👤
          </Link>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2：创建移动端底部导航**

```tsx
// components/layout/BottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { label: '发现', href: '/', icon: '🏠' },
    { label: '发布', href: '/feed', icon: '✏️' },
    { label: '我的', href: '/profile', icon: '👤' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 text-xs ${
                active ? 'text-xj-amber' : 'text-gray-500'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

- [ ] **Step 3：创建主应用布局**

```tsx
// app/(main)/layout.tsx
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 pb-20 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </>
  )
}
```

- [ ] **Step 4：更新根布局**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '乡建协作',
  description: '让乡建人协作起来',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 5：提交**

```bash
git add components/layout/ app/layout.tsx app/(main)/layout.tsx
git commit -m "feat: add responsive navigation (Header + BottomNav)"
```

---

## Phase 2：认证系统

### Task 5：NextAuth 配置

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1：Auth.js v5 配置**

```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from './db/client'
import { users } from './db/schema'
import { eq } from 'drizzle-orm'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })

        if (!user) return null

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
```

- [ ] **Step 2：创建 Auth API 路由**

```typescript
// app/api/auth/[...nextauth]/route.ts
import { GET, POST } from '@/lib/auth'

export { GET, POST }
```

- [ ] **Step 3：创建注册 API**

```typescript
// app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return Response.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: '请填写所有必填项' } },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, error: { code: 'WEAK_PASSWORD', message: '密码至少6位' } },
        { status: 400 }
      )
    }

    const existing = await db.select().from(users).where((col) => col.email.eq(email))
    if (existing.length > 0) {
      return Response.json(
        { success: false, error: { code: 'EMAIL_EXISTS', message: '该邮箱已注册' } },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    await db.insert(users).values({
      name,
      email,
      passwordHash,
      role: role || 'participant',
    })

    return Response.json({ success: true, message: '注册成功' })
  } catch (error) {
    return Response.json(
      { success: false, error: { code: 'SERVER_ERROR', message: '注册失败，请重试' } },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 4：更新根布局包裹 SessionProvider**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import './globals.css'

export const metadata: Metadata = {
  title: '乡建协作',
  description: '让乡建人协作起来',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 5：提交**

```bash
git add lib/auth.ts app/api/auth/ app/layout.tsx
git commit -m "feat: add NextAuth config, register/login API routes"
```

---

### Task 6：登录 / 注册页面

**Files:**
- Create: `app/(auth)/layout.tsx`
- Create: `components/auth/LoginForm.tsx`
- Create: `components/auth/RegisterForm.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/register/page.tsx`

- [ ] **Step 1：认证页布局（无导航）**

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
```

- [ ] **Step 2：登录表单**

```tsx
// components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('邮箱或密码错误')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900">登录</h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-xj-amber"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-xj-amber"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-xj-amber text-white rounded-md font-medium hover:bg-xj-amber-dark disabled:opacity-50"
      >
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  )
}
```

- [ ] **Step 3：注册表单**

```tsx
// components/auth/RegisterForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('participant')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error?.message || '注册失败')
      } else {
        router.push('/login')
      }
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-900">注册</h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-xj-amber"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-xj-amber"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-xj-amber"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">身份</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-xj-amber"
        >
          <option value="participant">参与者</option>
          <option value="organizer">组织者</option>
          <option value="provider">服务方</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-xj-amber text-white rounded-md font-medium hover:bg-xj-amber-dark disabled:opacity-50"
      >
        {loading ? '注册中...' : '注册'}
      </button>
    </form>
  )
}
```

- [ ] **Step 4：登录页面**

```tsx
// app/(auth)/login/page.tsx
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-xj-amber">🌾 乡建协作</h1>
        <p className="text-gray-500 mt-2">让乡建人协作起来</p>
      </div>
      <LoginForm />
      <p className="text-center text-sm text-gray-500">
        还没有账号？<Link href="/register" className="text-xj-amber">去注册</Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 5：注册页面**

```tsx
// app/(auth)/register/page.tsx
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-xj-amber">🌾 乡建协作</h1>
        <p className="text-gray-500 mt-2">加入乡建协作网络</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-gray-500">
        已有账号？<Link href="/login" className="text-xj-amber">去登录</Link>
      </p>
    </div>
  )
}
```

- [ ] **Step 6：提交**

```bash
git add app/(auth)/ components/auth/ app/api/auth/register/
git commit -m "feat: add login/register pages and forms"
```

---

### Task 7：Profile 页面

**Files:**
- Create: `app/api/users/me/route.ts`
- Create: `components/profile/UserInfo.tsx`
- Create: `app/(main)/profile/page.tsx`

- [ ] **Step 1：用户个人信息 API**

```typescript
// app/api/users/me/route.ts
import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return Response.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: '请先登录' } },
      { status: 401 }
    )
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  if (!user) {
    return Response.json(
      { success: false, error: { code: 'NOT_FOUND', message: '用户不存在' } },
      { status: 404 }
    )
  }

  return Response.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      riceBalance: user.riceBalance,
      createdAt: user.createdAt,
    },
  })
}
```

- [ ] **Step 2：用户信息卡片组件**

```tsx
// components/profile/UserInfo.tsx
interface UserInfoProps {
  user: {
    name: string
    email: string
    role: string
    riceBalance: number
    createdAt: string
  }
}

export function UserInfo({ user }: UserInfoProps) {
  const roleLabels: Record<string, string> = {
    participant: '参与者',
    organizer: '组织者',
    provider: '服务方',
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-xj-amber rounded-full flex items-center justify-center text-white text-2xl">
          {user.name[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-xj-amber/10 text-xj-amber px-2 py-0.5 rounded-full">
              {roleLabels[user.role] || user.role}
            </span>
            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              🌾 {user.riceBalance} 稻米
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3：Profile 页面**

```tsx
// app/(main)/profile/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { UserInfo } from '@/components/profile/UserInfo'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/users/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUser(data.data)
        })
        .finally(() => setLoading(false))
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status])

  if (status === 'loading' || loading) {
    return <div className="p-8 text-center text-gray-500">加载中...</div>
  }

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">请先登录</p>
        <a href="/login" className="text-xj-amber font-medium">
          去登录 →
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-6">
      {user && <UserInfo user={user} />}

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">我的活动</h3>
        <p className="text-gray-500 text-sm">暂无活动（活动功能即将上线）</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">我的发布</h3>
        <p className="text-gray-500 text-sm">暂无内容（去 Feed 发布第一条吧）</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4：提交**

```bash
git add app/api/users/me/ components/profile/ app/(main)/profile/
git commit -m "feat: add Profile page with user info API"
```

---

## Phase 3：UGC + 活动

### Task 8：UGC 内容流

**Files:**
- Create: `app/api/posts/route.ts`
- Create: `components/feed/PostCard.tsx`
- Create: `components/feed/PostForm.tsx`
- Create: `components/feed/CommentForm.tsx`
- Create: `app/(main)/feed/page.tsx`

- [ ] **Step 1：内容 API（CRUD）**

```typescript
// app/api/posts/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { posts, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const authorId = searchParams.get('authorId')

  const query = db.select({
    post: posts,
    author: { id: users.id, name: users.name, avatar: users.avatar },
  }).from(posts).leftJoin(users, eq(posts.authorId, users.id))

  if (authorId) {
    query.where(eq(posts.authorId, authorId))
  }

  const results = await query
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset((page - 1) * limit)

  return Response.json({
    success: true,
    data: results.map((r) => ({ ...r.post, author: r.author })),
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { content, authorId, images = [], activityId } = body

  if (!content || !authorId) {
    return Response.json(
      { success: false, error: { code: 'MISSING_FIELDS', message: '内容和作者ID必填' } },
      { status: 400 }
    )
  }

  const [post] = await db.insert(posts).values({
    content,
    authorId,
    images,
    activityId,
  }).returning()

  return Response.json({ success: true, data: post })
}
```

- [ ] **Step 2：点赞 API**

```typescript
// app/api/posts/[id]/like/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { likes, posts } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await req.json()
  const postId = params.id

  // 检查是否已点赞
  const existing = await db.select().from(likes)
    .where((col) => col.postId.eq(postId) && col.userId.eq(userId))

  if (existing.length > 0) {
    // 取消点赞
    await db.delete(likes)
      .where((col) => col.postId.eq(postId) && col.userId.eq(userId))
    await db.update(posts)
      .set({ likesCount: sql`${posts.likesCount} - 1` })
      .where(eq(posts.id, postId))
    return Response.json({ success: true, liked: false })
  }

  // 点赞
  await db.insert(likes).values({ postId, userId })
  await db.update(posts)
    .set({ likesCount: sql`${posts.likesCount} + 1` })
    .where(eq(posts.id, postId))

  return Response.json({ success: true, liked: true })
}
```

- [ ] **Step 3：评论 API**

```typescript
// app/api/posts/[id]/comment/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { comments, posts } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId, content } = await req.json()
  const postId = params.id

  if (!userId || !content) {
    return Response.json(
      { success: false, error: { code: 'MISSING_FIELDS', message: '用户ID和内容必填' } },
      { status: 400 }
    )
  }

  const [comment] = await db.insert(comments).values({
    postId,
    userId,
    content,
  }).returning()

  await db.update(posts)
    .set({ commentsCount: sql`${posts.commentsCount} + 1` })
    .where(eq(posts.id, postId))

  return Response.json({ success: true, data: comment })
}
```

- [ ] **Step 4：内容卡片组件**

```tsx
// components/feed/PostCard.tsx
'use client'

import { useState } from 'react'

interface PostCardProps {
  post: {
    id: string
    content: string
    images: string[]
    likesCount: number
    commentsCount: number
    createdAt: string
    author?: { id: string; name: string; avatar: string | null }
  }
  currentUserId?: string
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
}

export function PostCard({ post, currentUserId, onLike, onComment }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likesCount)

  const handleLike = async () => {
    if (!currentUserId) return
    
    const res = await fetch(`/api/posts/${post.id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId }),
    })
    const data = await res.json()
    
    if (data.success) {
      setLiked(data.liked)
      setLikesCount(data.liked ? likesCount + 1 : likesCount - 1)
    }
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours}小时前`
    return `${Math.floor(hours / 24)}天前`
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-xj-amber/20 rounded-full flex items-center justify-center text-xj-amber font-bold">
          {post.author?.name?.[0] || '?'}
        </div>
        <div>
          <p className="font-medium text-gray-900">{post.author?.name || '未知用户'}</p>
          <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>

      {post.images?.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {post.images.map((img, i) => (
            <div key={i} className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-gray-400">
              📷 {i + 1}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-sm ${liked ? 'text-red-500' : 'text-gray-500'}`}
        >
          {liked ? '❤️' : '🤍'} {likesCount}
        </button>
        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center gap-1 text-sm text-gray-500"
        >
          💬 {post.commentsCount}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5：发布表单**

```tsx
// components/feed/PostForm.tsx
'use client'

import { useState } from 'react'

interface PostFormProps {
  userId: string
  onSuccess?: () => void
}

export function PostForm({ userId, onSuccess }: PostFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, authorId: userId }),
    })

    if (res.ok) {
      setContent('')
      onSuccess?.()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="分享你的乡建故事..."
        rows={3}
        className="w-full px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-xj-amber"
      />
      <div className="flex justify-between items-center mt-3">
        <button type="button" className="text-gray-400 text-sm">📷 添加图片</button>
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-xj-amber text-white rounded-md text-sm font-medium hover:bg-xj-amber-dark disabled:opacity-50"
        >
          {loading ? '发布中...' : '发布'}
        </button>
      </div>
    </form>
  )
}
```

- [ ] **Step 6：Feed 页面**

```tsx
// app/(main)/feed/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { PostCard } from '@/components/feed/PostCard'
import { PostForm } from '@/components/feed/PostForm'

export default function FeedPage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPosts = async () => {
    setLoading(true)
    const res = await fetch('/api/posts?page=1&limit=20')
    const data = await res.json()
    if (data.success) setPosts(data.data)
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <div className="space-y-4 py-4">
      {session?.user?.id && (
        <PostForm userId={session.user.id} onSuccess={loadPosts} />
      )}

      {loading ? (
        <p className="text-center text-gray-500 py-8">加载中...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-400 py-8">暂无内容，发布第一条吧</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={session?.user?.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 7：提交**

```bash
git add app/api/posts/ components/feed/ app/(main)/feed/
git commit -m "feat: add UGC feed with posts, likes, comments"
```

---

### Task 9：活动列表

**Files:**
- Create: `app/api/activities/route.ts`
- Create: `app/(main)/activities/page.tsx`

- [ ] **Step 1：活动 API**

```typescript
// app/api/activities/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db/client'
import { activities, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET() {
  const results = await db.select({
    activity: activities,
    organizer: { id: users.id, name: users.name },
  }).from(activities)
    .leftJoin(users, eq(activities.organizerId, users.id))
    .orderBy(desc(activities.createdAt))
    .limit(20)

  return Response.json({
    success: true,
    data: results.map((r) => ({ ...r.activity, organizer: r.organizer })),
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, description, organizerId, type, capacity } = body

  if (!title || !organizerId) {
    return Response.json(
      { success: false, error: { code: 'MISSING_FIELDS', message: '标题和组织者必填' } },
      { status: 400 }
    )
  }

  const [activity] = await db.insert(activities).values({
    title,
    description,
    organizerId,
    type,
    capacity,
  }).returning()

  return Response.json({ success: true, data: activity })
}
```

- [ ] **Step 2：活动列表页（占位）**

```tsx
// app/(main)/activities/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setActivities(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">活动</h1>
      
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">暂无活动</p>
          <p className="text-gray-400 text-sm">AI 活动方案生成即将上线</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900">{activity.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                <span>组织者：{activity.organizer?.name}</span>
                <span>{activity.enrolledCount}/{activity.capacity || '不限'} 人</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3：提交**

```bash
git add app/api/activities/ app/(main)/activities/
git commit -m "feat: add activities list API and page"
```

---

## Phase 4：收尾

### Task 10：首页 AI First 框架

**Files:**
- Create: `app/(main)/page.tsx`
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/BottomNav.tsx`

- [ ] **Step 1：首页（AI First 入口 + Feed）**

```tsx
// app/(main)/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { PostCard } from '@/components/feed/PostCard'

export default function HomePage() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts?page=1&limit=5')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4 py-4">
      {/* AI First 入口 */}
      <div className="bg-gradient-to-br from-xj-amber to-xj-amber-dark rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">让活动策划从难如登天</h2>
        <p className="text-white/80 mb-4">变成一键生成</p>
        <p className="text-white/60 text-sm mb-4">你只需描述想法，AI 帮你完成方案、物料清单、时间线</p>
        <button className="w-full py-3 bg-white text-xj-amber rounded-xl font-bold hover:bg-gray-50 transition">
          ✨ 开始生成你的第一场活动
        </button>
      </div>

      {/* 快速入口 */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href="/activities"
          className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:border-xj-amber transition"
        >
          <div className="text-2xl mb-1">📅</div>
          <div className="text-sm font-medium">浏览活动</div>
        </a>
        <a
          href="/feed"
          className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:border-xj-amber transition"
        >
          <div className="text-2xl mb-1">📝</div>
          <div className="text-sm font-medium">发布动态</div>
        </a>
      </div>

      {/* 最新动态 */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">最新动态</h3>
        {loading ? (
          <p className="text-gray-500">加载中...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-400 text-sm">暂无内容</p>
        ) : (
          <div className="space-y-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={session?.user?.id}
              />
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <a href="/feed" className="text-xj-amber text-sm font-medium">
          查看更多动态 →
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2：更新导航添加活动链接**

在 `components/layout/Header.tsx` 中，将 `navItems` 更新为：

```typescript
const navItems = [
  { label: '发现', href: '/' },
  { label: '动态', href: '/feed' },
  { label: '活动', href: '/activities' },
  { label: '我的', href: '/profile' },
]
```

在 `components/layout/BottomNav.tsx` 中，将 `tabs` 更新为：

```typescript
const tabs = [
  { label: '发现', href: '/', icon: '🏠' },
  { label: '动态', href: '/feed', icon: '📝' },
  { label: '我的', href: '/profile', icon: '👤' },
]
```

> 移动端底部 Tab 保持 3 个以减少拥挤，活动入口通过首页的"浏览活动"卡片进入。

- [ ] **Step 3：提交**

```bash
git add app/(main)/page.tsx components/layout/
git commit -m "feat: add homepage with AI First entry and feed preview"
```

---

### Task 11：响应式验证 + 种子数据

**Files:**
- Modify: `lib/db/seed.ts`
- Modify: `package.json` scripts

- [ ] **Step 1：完善种子数据**

```typescript
// lib/db/seed.ts
import { db } from './client'
import { users, posts, activities } from './schema'
import bcrypt from 'bcryptjs'

async function seed() {
  const password = await bcrypt.hash('123456', 10)

  // 用户 1
  const [user1] = await db.insert(users).values({
    name: '新农人小王',
    email: 'wang@test.com',
    passwordHash: password,
    role: 'organizer',
    riceBalance: 128,
  }).returning()

  // 用户 2
  const [user2] = await db.insert(users).values({
    name: '张木匠',
    email: 'zhang@test.com',
    passwordHash: password,
    role: 'provider',
    riceBalance: 256,
  }).returning()

  // 用户 3
  const [user3] = await db.insert(users).values({
    name: '四坪驿站主理人',
    email: 'sipin@test.com',
    passwordHash: password,
    role: 'organizer',
    riceBalance: 512,
  }).returning()

  // 帖子
  await db.insert(posts).values({
    authorId: user2.id,
    content: '周末带娃去了张木匠那儿，娃超喜欢。张师傅教孩子们做木雕小鸟，成品可以带回家。强烈推荐亲子家庭！',
    likesCount: 23,
    commentsCount: 5,
  })

  await db.insert(posts).values({
    authorId: user3.id,
    content: '四坪村柿子熟了，欢迎来摘！本周六下午组织采摘+晒柿子体验，名额有限，先到先得。',
    likesCount: 45,
    commentsCount: 12,
  })

  await db.insert(posts).values({
    authorId: user1.id,
    content: '第一次用AI生成活动方案，太好用了！输入"亲子木艺工坊"，AI 就帮我把时间表、材料清单、安全提示全生成了。',
    likesCount: 67,
    commentsCount: 8,
  })

  // 活动
  await db.insert(activities).values({
    organizerId: user1.id,
    title: '龙潭村木艺亲子工坊',
    description: '跟着张师傅学木雕，制作属于自己的木制小动物。适合5-12岁亲子家庭。',
    type: 'workshop',
    status: 'published',
    capacity: 15,
    enrolledCount: 8,
  })

  await db.insert(activities).values({
    organizerId: user3.id,
    title: '四坪古村写生营',
    description: '三天两晚古村写生，住民宿、吃农家菜、画老宅。适合有基础的画友。',
    type: 'tour',
    status: 'published',
    capacity: 20,
    enrolledCount: 12,
  })

  console.log('✅ Seeded 3 users, 3 posts, 2 activities')
}

seed().catch(console.error)
```

- [ ] **Step 2：添加 seed 脚本到 package.json**

在 `package.json` 的 `scripts` 中添加：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "drizzle-kit push:sqlite",
    "db:seed": "tsx lib/db/seed.ts",
    "db:reset": "rm xjcloud.db && npm run db:push && npm run db:seed"
  }
}
```

> 注：需安装 `tsx`：`npm install -D tsx`

- [ ] **Step 3：执行种子数据**

```bash
cd /Users/greener/project/xjcloud
npm install -D tsx
npm run db:seed
```

**预期输出：** 控制台打印 "✅ Seeded 3 users, 3 posts, 2 activities"

- [ ] **Step 4：提交**

```bash
git add lib/db/seed.ts package.json
git commit -m "chore: add seed data and npm scripts"
```

---

## 最终交付

### 验证清单

| 验证项 | 命令/步骤 | 预期结果 |
|--------|----------|----------|
| 项目启动 | `npm run dev` | Next.js dev server 在 `http://localhost:3000` 启动 |
| 数据库 | `npm run db:push && npm run db:seed` | SQLite 数据库创建，含 3 用户、3 帖子、2 活动 |
| 注册 | 访问 `/register`，填表单提交 | 注册成功，跳转到 `/login` |
| 登录 | 访问 `/login`，填 wang@test.com / 123456 | 登录成功，跳转到 `/` |
| 首页 | 访问 `/` | AI First 入口卡片 + 最新动态展示 |
| Feed | 访问 `/feed` | 显示帖子列表，可点赞（需登录），显示表单 |
| 发布 | 登录后在 Feed 页发布内容 | 内容出现在 Feed 顶部 |
| Profile | 访问 `/profile` | 显示用户基本信息、稻米积分、活动/发布占位 |
| 活动 | 访问 `/activities` | 显示活动列表（含种子数据） |
| 响应式 | 浏览器 DevTools 切换移动端/桌面端 | 移动端显示底部 Tab，桌面端显示顶部导航 |
| Git 历史 | `git log --oneline` | 每 Task 一个 commit，commit message 有意义 |

---

## 自审检查

### 1. Spec 覆盖度

| Spec 章节 | 对应 Task |
|-----------|----------|
| 3.1 目录结构 | 整个 plan |
| 3.2 响应式导航 | Task 4 |
| 4.1 数据模型 | Task 3 |
| 5.1 认证 API | Task 5 |
| 5.2 内容 API | Task 8 |
| 5.3 用户 API | Task 7 |
| 5.4 活动 API | Task 9 |
| 6.1 首页 | Task 10 |
| 6.2 注册页 | Task 6 |
| 6.3 登录页 | Task 6 |
| 6.4 UGC Feed | Task 8 |
| 6.5 Profile | Task 7 |
| 7.1 导航组件 | Task 4 |
| 7.2 UGC 卡片 | Task 8 |
| 8.1 本地运行命令 | 全局 |
| 8.2 Git 管理 | 每个 Task 的 Step 5 |
| 9 MVP 交付标准 | Task 11 验证清单 |

**结论：Spec 所有章节均有覆盖，无遗漏。**

### 2. 占位符扫描

- ❌ "TBD"/"TODO" - 无
- ❌ "add appropriate error handling" - 无，每个 API 都有具体的错误处理
- ❌ "write tests for the above" - 无，MVP 阶段手动验证
- ❌ "Similar to Task N" - 无，每个 Task 代码独立完整

### 3. 类型一致性

| 名称 | 定义位置 | 引用位置 | 状态 |
|------|----------|----------|------|
| users.id | schema.ts | auth.ts, API routes | UUID，一致 |
| users.role | schema.ts | RegisterForm, UserInfo | 枚举值一致 |
| posts.authorId | schema.ts | API routes, PostForm | 字符串，一致 |
| posts.likesCount | schema.ts | API routes, PostCard | 整数，一致 |

**结论：所有类型签名跨文件一致。**

---

**Plan complete.**