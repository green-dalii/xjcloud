# 乡建协作平台 - 路线图

## 当前版本: 0.3.9

---

## Phase 1: MVP 骨架 

**目标**: 搭建可运行的前后端骨架，验证技术栈

- [x] Next.js 14 + TypeScript + Tailwind CSS 项目初始化
- [x] Drizzle ORM + SQLite 数据库配置
- [x] 响应式导航布局
- [x] NextAuth v5 认证系统配置
- [x] 注册/登录页面
- [x] Profile 页面
- [x] **首页完整实现** — 双面板视频背景 + hover 伸缩 + 区域选择器 + 底部需求栏
- [x] **探索页 v2** — 引导式筛选问卷 + Tinder 式堆叠卡片 + 列表视图（Framer Motion）
- [x] **共建者页** — 视频 Hero + 案例卡片 + 三步创建流程 + CTA
- [x] **UGC 广场** — 帖子流 + Tab 筛选 + 打赏稻米
- [x] **活动日历** — 月视图 + 日视图 + 地点筛选 + Mock 数据
- [x] **统一 Navbar** — 全页面共享，移动端汉堡菜单，登录/注册按钮
- [x] 种子数据与验证
- [x] **全部活动全览页** — 独立筛选：城市tab + 搜索 + 排序 + 筛选面板（底部sheet/右侧抽屉）
- [x] **Explore 增强** — 第4步 Bento 兴趣方向多选 + 加载文案 + 下滑收藏 toast
- [x] **iOS Safari 修复** — WebKit 3D翻转前缀
- [x] **AI 活动方案生成（Claude API）** — 框架预留，Claude Code 集成点已就位
- [x] **认证系统完善（登录/注册对接 Workers + D1）** — JWT + AuthContext + Workers 全链路打通

---

## Phase 2: 核心功能 (规划中)

**目标**: 实现乡建协作的核心价值——AI 活动方案生成

- [ ] AI 活动方案生成（Claude API 集成）
- [ ] 活动发布与管理
- [ ] 参与者报名系统
- [ ] 服务方对接
- [ ] 稻米积分系统（基础版）

---

## Phase 3: 数据飞轮 (规划中)

**目标**: 让数据流动起来，形成网络效应

- [ ] 推荐算法（基于行为的智能匹配）
- [ ] 内容发现与搜索
- [ ] 驿站/节点系统
- [ ] 评价与信任体系
- [ ] 数据分析仪表盘

---

## Phase 1.5: Cloudflare 部署与架构预留 (进行中)

**目标**: 前端上线 Pages，后端预留 Workers 骨架

- [x] **Cloudflare Pages 静态导出配置** — `output: 'export'`, `distDir: 'dist'`
- [x] **pnpm 包管理器切换** — 本地开发 + Pages 构建环境统一
- [x] **GitHub 集成** — push 自动触发 Pages 部署
- [x] **Workers 后端骨架** — `workers/` 目录：JWT 认证、D1 绑定、路由预留
- [x] **自定义 JWT 认证系统** — AuthContext + Workers auth/users 路由
- [x] **Profile 编辑功能** — 接入 Workers API
- [x] **pnpm 工作区** — workers 共享根目录依赖
- [x] **Host 页面重构** — 「我要造趣」品牌统一，AuthPrompt + MultiStepGuide 引导
- [x] **Match 页面优化** — 搜索优先 UX + macOS Dock 卡片堆叠
- [x] **Profile 编辑增强** — 省市级联 + 技能标签 + 月份时间轴
- [ ] **Pages 部署成功** — Dashboard 构建设置修正后重试
- [ ] **D1 本地开发验证** — `wrangler dev` + D1 本地模拟

---

## Phase 4: 生态扩展 (规划中)

**目标**: 多驿站接入，形成乡建协作网络

- [ ] 多驿站支持
- [ ] 乡建 DAO 治理接入
- [ ] 微信小程序适配
- [ ] Cloudflare D1 迁移（从 SQLite schema 复用）
- [ ] API 开放（供第三方对接）
- [ ] **Cloudflare Workers 后端上线** — 替换 Mock 数据，提供真实 API

---

## 技术债务追踪

| 项目 | 状态 | 计划解决时间 |
|------|------|-------------|
| SQLite → D1 迁移 | 待处理 | Phase 4 |
| 首页 CSS 提取到 globals.css | 已完成 | 0.3.2 |
| 图片上传（本地 → 云存储） | 待处理 | Phase 2 |
