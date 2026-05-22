# Explore 页面 — 引导筛选 + 堆叠卡片 设计文档

> **目标**: 将 `/explore` 页面从静态展示页重构为交互式发现体验，包含引导式问卷筛选和 Tinder-like 堆叠卡片滑动。

---

## 一、用户流程

```
用户点击"开始探索" → /explore
                    ↓
        ┌───────────────────────┐
        │   引导筛选页（第1步）   │
        │  "你的性别？" 男 / 女   │
        └───────────────────────┘
                    ↓ (选择后)
        ┌───────────────────────┐
        │   引导筛选页（第2步）   │
        │ "出行方式？" 单人 / 同行 │
        └───────────────────────┘
                    ↓ (选择"同行"后)
        ┌───────────────────────┐
        │   引导筛选页（第3步）   │
        │ "同行身份？" 伴侣/朋友/  │
        │  父母/子女/其他         │
        └───────────────────────┘
                    ↓ (完成或跳过)
        ┌───────────────────────┐
        │    堆叠卡片交互区       │
        │  每次一张，滑动筛选     │
        └───────────────────────┘
                    ↓ (滑完所有)
        ┌───────────────────────┐
        │   "展示全部结果"按钮   │
        │   → 进入列表视图       │
        └───────────────────────┘
```

**跳过机制**: 每一步筛选页面右下角都有「跳过，看全部」按钮，点击直接进入无筛选的堆叠卡片（mock 全部 20 张）。

---

## 二、Mock 数据结构

```typescript
interface ActivityCard {
  id: string
  title: string           // 活动标题，如"云雾茶园采茶体验"
  location: string        // 地点，如"杭州 · 桐庐"
  host: string            // 主理人，如"小鹿"
  image: string           // 封面图路径，如"/images/featured-tonglu.jpg"
  tags: string[]          // 标签，如["手作", "自然", "亲子友好"]
  price: number           // 价格（元）
  duration: string        // 时长，如"2天1晚"
  maxPeople: number       // 最大人数
  description: string     // 一句话描述
  matchScore: number      // 匹配度（0-100），用于筛选排序
}
```

**筛选规则（mock 逻辑）**:
- 性别男 → 优先推荐体力型活动（徒步、骑行）
- 性别女 → 优先推荐疗愈型活动（瑜伽、茶艺）
- 单人 → 推荐小团体、社交型
- 同行+伴侣 → 推荐浪漫型、私密型
- 同行+亲子 → 推荐亲子友好标签

---

## 三、组件架构

```
app/(main)/explore/page.tsx        # 页面入口，管理整体状态机
├── GuideScreen                    # 引导筛选层（3步问卷）
│   ├── StepIndicator              # 顶部步骤指示器（3个点）
│   └── OptionButton               # 大圆角选项按钮
├── CardStack                      # 堆叠卡片核心组件
│   ├── SwipeCard                  # 单张可拖拽卡片（Framer Motion）
│   │   ├── CardImage              # 封面图（object-cover）
│   │   ├── CardInfo               # 标题/地点/价格/标签
│   │   └── CardActions            # 底部操作按钮（不喜欢/收藏/喜欢）
│   └── EmptyState                 # 卡片滑完后的空状态
├── ActionButtons                  # 底部固定操作栏（左滑/收藏/右滑按钮）
└── ResultList                     # 兜底列表视图（滑完后的全部结果）
```

---

## 四、状态管理

```typescript
type ExploreState =
  | { phase: 'guide'; step: 1 | 2 | 3; filters: Partial<Filters> }
  | { phase: 'cards'; cards: ActivityCard[]; currentIndex: number; likes: string[]; dislikes: string[]; favorites: string[] }
  | { phase: 'list'; cards: ActivityCard[] }

type Filters = {
  gender: 'male' | 'female'
  travelMode: 'solo' | 'group'
  companionType?: 'partner' | 'friend' | 'parent' | 'child' | 'other'
}
```

---

## 五、Framer Motion 动画参数

### 5.1 拖拽卡片（SwipeCard）

```typescript
// 拖拽约束
const dragConstraints = { left: 0, right: 0, top: 0, bottom: 0 }

// 拖拽时实时旋转（随 x 偏移量）
const rotate = useTransform(x, [-300, 300], [-15, 15])

// 拖拽时透明度变化（越靠边越透明）
const opacity = useTransform(x, [-300, 0, 300], [0.5, 1, 0.5])

// 释放判定阈值
const SWIPE_THRESHOLD = 120      // x 超过此值触发左右滑
const SWIPE_VELOCITY = 800       // 速度超过此值也触发
const FAVORITE_THRESHOLD = 120   // y 超过此值触发下滑收藏

// 飞出动画（spring 物理）
const exitSpring = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
  mass: 0.8,
}

// 下层卡片缩放入场
const scaleVariants = {
  hidden: { scale: 0.92, opacity: 0.7, y: 20 },
  visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
}
```

### 5.2 卡片堆叠视觉

- 顶层卡片（当前）：`scale: 1`, `zIndex: 3`, `opacity: 1`
- 第二层：`scale: 0.96`, `zIndex: 2`, `opacity: 0.7`, `translateY: 12px`
- 第三层：`scale: 0.92`, `zIndex: 1`, `opacity: 0.4`, `translateY: 24px`
- 三层以上不渲染（性能优化）

### 5.3 手势反馈

- **拖拽中**：卡片跟随手指/鼠标，带旋转，背景出现方向指示器（左滑出现"✕"红色，右滑出现"♥"绿色，下滑出现"★"金色）
- **释放判定**：
  - x > threshold → 右滑飞出（喜欢）
  - x < -threshold → 左滑飞出（不喜欢）
  - y > threshold → 下滑飞出（收藏）
  - 未达阈值 → spring 回弹到原位

### 5.4 操作按钮点击

三个底部按钮点击时，直接触发对应方向的飞出动画（不拖拽）：
- 左按钮（✕）→ 卡片向左飞出
- 中按钮（★）→ 卡片向下滑出
- 右按钮（♥）→ 卡片向右飞出

---

## 六、筛选页视觉设计

延续 Warm Earth Palette：
- 背景：`--bg-ink` (#2d2a26) 渐变 overlay + 轻微视频/图片背景
- 问题文字：Noto Serif SC，`clamp(24px, 4vw, 40px)`，白色
- 选项按钮：圆角 50px，border `rgba(245,241,234,0.2)`，hover 时背景变为 `rgba(201,169,110,0.15)`，文字高亮为麦金色
- 步骤指示器：3 个小圆点，当前步骤为麦金色实心，其余为半透明白色空心
- 跳过按钮：右下角小字，带下划线 hover 效果

---

## 七、Mock 数据（20 条）

已准备 20 条活动卡片数据，覆盖不同标签（手作、自然、亲子、疗愈、骑行、露营、采摘、瑜伽、茶艺、木工等），地点覆盖莫干山、大理、屏南、景德镇、明月村。

---

## 八、响应式

- **移动端**：全屏卡片，底部操作栏固定，手势为主要交互
- **桌面端**：卡片居中，最大宽度 420px，支持鼠标拖拽 + 按钮点击

---

## 九、技术依赖

- `framer-motion` — 拖拽、spring 动画、AnimatePresence
- 项目中已有的 `gsap` 不需要（本页面只用 framer-motion）

---

## 自检

- [x] 筛选规则覆盖所有组合路径
- [x] 跳过机制在每个步骤都可用
- [x] 手势映射清晰（左/右=不喜欢，下=收藏，点击=详情）
- [x] 兜底列表在卡片滑完后展示
- [x] 动画参数具体（spring stiffness/damping/mass）
- [x] 视觉风格与 Warm Earth Palette 一致
- [x] 移动端和桌面端都考虑到了
