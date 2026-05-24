# 爱故乡驿站 (xjcloud → XJRain)

> GitHub 仓库名保留 `xjcloud`，但产品品牌已升级为 **XJRain**。

## 为什么是 xjrain？

**xjcloud** 诞生之初，我们想用云计算（Cloud）来连接乡村。但「云」终究飘在天上——AI、token、代码，若只停留在虚拟世界，就无法真正改变土地。

于是我们选择让它落下来。

**XJRain** 是一个「雨平台」——而不是传统意义的「云」（Cloud）平台。我们致力于将 AI、数据和代码化作雨水（Rain），轻轻飘落，浇灌真实的大地。它让每一行代码都落进泥土，长出庄稼、手艺和人情。

> *From cloud to rain. Virtual to earthly. Making technology nourish real land.*

## 团队

| 成员 | 角色 |
|------|------|
| 田野老师 | 经验丰富 · 富有情怀的老乡建工作者 |
| Greener | 全栈架构师（AI PUAer） |
| 丸丸 | 用户体验交互（UI/UX）· 内容运营 |
| 晓玫 | 用户体验交互（UI/UX）· 内容运营 |

## 快速开始

```bash
# 安装依赖
pnpm install
# 数据库迁移
npx drizzle-kit push --config=drizzle.config.ts
# 启动 Workers 后端（终端 1）
cd workers && pnpm dev
# 启动前端开发服务器（终端 2）
PORT=3001 pnpm dev
# 访问 http://localhost:3001
```

## 技术栈

- **框架**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS 3.4 + CSS custom properties（全局主题系统，无页面私有 CSS）
- **动画**: Framer Motion + GSAP (ScrollTrigger) + CSS transitions
- **ORM**: Drizzle ORM + better-sqlite3（本地）/ D1（生产，通过 Workers）
- **认证**: 自定义 JWT（AuthContext + Workers 后端） + NextAuth v5（本地 SQLite 兜底）
- **数据库**: SQLite（本地）→ Cloudflare D1（生产）

## 设计系统 — Warm Earth Palette

所有颜色、字体、间距均通过 `globals.css` 的 CSS 变量定义，**禁止任何页面写私有内嵌 CSS**。

| Token | 值 | 用途 |
|-------|------|------|
| `--bg-ink` | `#2d2a26` | 深色背景 |
| `--bg-ink-light` | `#3a3630` | 次深色背景 |
| `--bg-paper` | `#f5f1ea` | 浅色背景 |
| `--color-moss` | `#3d5a3f` | 苔藓绿（次要强调） |
| `--color-forest` | `#4a6741` | 森林绿 |
| `--color-wheat` | `#c9a96e` | 麦金（主强调色） |
| `--color-wheat-light` | `#d4b87a` | 麦金浅（hover） |
| `--color-earth` | `#8b6f47` | 大地色 |
| `--color-clay` | `#b85c48` | 赤陶色 |
| `--color-danger` | `#ff6b6b` | 危险/删除 |
| `--color-success` | `#34d399` | 成功/采纳 |
| `--color-warning` | `#fbbf24` | 收藏/提示 |
| `--text-heading` | `#f5f1ea` | 标题文字 |
| `--text-primary` | `rgba(245,241,234,0.85)` | 主要文字 |
| `--text-body` | `rgba(245,241,234,0.75)` | 正文文字 |
| `--text-secondary` | `rgba(245,241,234,0.55)` | 次要文字 |
| `--text-muted` | `rgba(245,241,234,0.35)` | 弱化文字 |
| `--text-dim` | `rgba(245,241,234,0.25)` | 极弱文字 |
| `--border-subtle` | `rgba(245,241,234,0.08)` | 极浅边框 |
| `--border-default` | `rgba(245,241,234,0.15)` | 默认边框 |
| `--border-strong` | `rgba(245,241,234,0.25)` | 强调边框 |
| `--font-serif` | Noto Serif SC | 标题 |
| `--font-display` | Cormorant Garamond | 装饰英文 |
| `--font-ui` | PingFang SC | 正文 |

## 项目结构

```
app/
  (auth)/               # 认证页面（登录/注册）— Warm Earth 深色主题
  (main)/
    page.tsx            # 首页 LandingPage（全屏沉浸，双面板+视频背景）
    explore/
      page.tsx          # 探索页（4步引导问卷 → Loading → 堆叠卡片）
    activities/
      page.tsx          # 全部活动全览页（独立筛选：城市tab+搜索+排序+筛选面板）
    match/
      page.tsx          # 匹配页（登录用户搜索优先 → Dock 卡片堆叠）
    host/
      page.tsx          # 共建者页
    square/
      page.tsx          # UGC 广场（帖子流 + 打赏稻米）
    calendar/
      page.tsx          # 活动日历（月视图，server component）
      day/[date]/
        page.tsx        # 日视图（单日活动详情列表）
    about/
      page.tsx          # 关于我们（品牌理念 + 团队 + 二维码）
    layout.tsx          # 主布局（Navbar + 内容 + Footer）
  api/                  # API 路由
components/
  layout/
    NavbarFooter.tsx    # Navbar（滚动透明→毛玻璃）+ Footer
  explore/
    GuideScreen.tsx     # 4步引导问卷（含Bento多选）
    LoadingScreen.tsx   # 匹配加载动画（随机趣味文案）
    CardStack.tsx       # 堆叠卡片管理器
    SwipeCard.tsx       # 可拖拽单卡片（翻转+宽度扩展）
    ResultList.tsx      # 结果列表
  square/
    SquareFeed.tsx      # UGC 帖子流（Tab + 帖子卡片 + 操作栏）
    RiceModal.tsx       # 打赏稻米弹窗
  calendar/
    CalendarPageClient.tsx  # 日历客户端状态管理
    ActivityCalendar.tsx    # 月视图组件
    EventDetailModal.tsx    # 活动详情弹窗
lib/
  data/
    mock-activities.ts      # 20 条乡建活动 mock 数据 + INTEREST_OPTIONS + INTEREST_TAG_MAP
    mock-posts.ts           # UGC 帖子 mock 数据
    mock-calendar-events.ts # 60 个日历活动 mock 数据
  db/                   # Drizzle schema + client
  auth.ts               # NextAuth 配置
public/
  images/               # 站点图片
  videos/               # 站点视频
```

## 页面路由

| 路由 | 描述 | 状态 |
|------|------|------|
| `/` | 首页 — Hero 全屏沉浸首屏 + 双面板视频第二屏 | ✅ |
| `/explore` | 探索 — 4步引导问卷 + Bento多选 + 卡片堆叠 | ✅ |
| `/activities` | 全部活动 — 独立全览页 + 筛选工具栏 | ✅ |
| `/match` | 匹配 — 登录用户 AI 方案搜索 + Dock 卡片堆叠 | ✅ |
| `/host` | 共建者 — 视频 Hero + 案例展示 | ✅ |
| `/calendar` | 活动日历 — 月视图 + 地点筛选 | ✅ |
| `/calendar/day/[date]` | 日视图 — 单日活动详情 | ✅ |
| `/square` | 广场 — UGC 帖子流 + 打赏稻米 | ✅ |
| `/about` | 关于 — 品牌理念 + 团队 + 二维码 | ✅ |
| `/login` | 登录 — 深色主题认证 | ✅ |
| `/register` | 注册 — 深色主题认证 | ✅ |
| `/profile` | 个人中心 | ✅ |

## 文档

- [SPEC](docs/SPEC.md) — 技术规格说明书
- [ROADMAP](ROADMAP.md) — 开发路线图
- [CHANGELOG](CHANGELOG.md) — 变更日志
- [CLAUDE.md](CLAUDE.md) — 开发指引

## Git 工作流

每次提交前更新：README、CHANGELOG、ROADMAP、版本号、CLAUDE.md

---

*基于屏南数智乡建黑客松实地验证 | 2026-05-23*
