import type { ActivityCard } from './mock-activities'

export type Gender = 'male' | 'female' | 'unspecified'

export type EnrollmentStatus = 'registered' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled'

export const ENROLLMENT_STATUS_LABEL: Record<EnrollmentStatus, string> = {
  registered: '已预约',
  confirmed: '已确认',
  ongoing: '正在参与',
  completed: '已结束',
  cancelled: '已取消',
}

export const ENROLLMENT_STATUS_COLOR: Record<EnrollmentStatus, { bg: string; text: string; border: string }> = {
  registered: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  confirmed: { bg: 'rgba(52,211,153,0.1)', text: '#34d399', border: 'rgba(52,211,153,0.2)' },
  ongoing: { bg: 'rgba(201,169,110,0.12)', text: '#c9a96e', border: 'rgba(201,169,110,0.25)' },
  completed: { bg: 'rgba(245,241,234,0.06)', text: 'var(--text-muted)', border: 'rgba(245,241,234,0.1)' },
  cancelled: { bg: 'rgba(255,107,107,0.08)', text: '#ff6b6b', border: 'rgba(255,107,107,0.15)' },
}

export type PublishedActivityStatus = 'draft' | 'planning' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export const PUBLISHED_STATUS_LABEL: Record<PublishedActivityStatus, string> = {
  draft: '已发起',
  planning: '活动筹划中',
  upcoming: '等待开始',
  ongoing: '进行中',
  completed: '已结束',
  cancelled: '已取消',
}

export const PUBLISHED_STATUS_COLOR: Record<PublishedActivityStatus, { bg: string; text: string; border: string }> = {
  draft: { bg: 'rgba(245,241,234,0.06)', text: 'var(--text-muted)', border: 'rgba(245,241,234,0.1)' },
  planning: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  upcoming: { bg: 'rgba(201,169,110,0.12)', text: '#c9a96e', border: 'rgba(201,169,110,0.25)' },
  ongoing: { bg: 'rgba(52,211,153,0.1)', text: '#34d399', border: 'rgba(52,211,153,0.2)' },
  completed: { bg: 'rgba(245,241,234,0.06)', text: 'var(--text-muted)', border: 'rgba(245,241,234,0.1)' },
  cancelled: { bg: 'rgba(255,107,107,0.08)', text: '#ff6b6b', border: 'rgba(255,107,107,0.15)' },
}

export interface MyEnrollment {
  id: string
  activity: ActivityCard
  status: EnrollmentStatus
  enrolledAt: string
}

export interface MyPublishedActivity {
  id: string
  title: string
  location: string
  image: string
  startDate: string
  endDate: string
  status: PublishedActivityStatus
  enrolledCount: number
  capacity: number
}

// Mock data for the test user "林小夏"
export const MOCK_ENROLLMENTS: MyEnrollment[] = [
  {
    id: 'en-1',
    activity: {
      id: 'act-1', title: '云雾茶园采茶体验', location: '杭州 · 桐庐',
      host: '小鹿', image: '/images/featured-tonglu.jpg', tags: ['自然', '手作', '疗愈'],
      price: 380, duration: '2天1晚', maxPeople: 8,
      description: '在海拔800米的云雾茶园，亲手采摘明前龙井，学习古法炒茶工艺',
      matchScore: 95,
    },
    status: 'ongoing',
    enrolledAt: '2026-05-15',
  },
  {
    id: 'en-2',
    activity: {
      id: 'act-2', title: '稻田骑行与星空露营', location: '浙江 · 莫干山',
      host: '大田', image: '/images/featured-tonglu.jpg', tags: ['骑行', '露营', '自然'],
      price: 560, duration: '2天1晚', maxPeople: 15,
      description: '穿越金色稻田的骑行路线，夜晚在稻田中央露营看银河',
      matchScore: 85,
    },
    status: 'confirmed',
    enrolledAt: '2026-05-10',
  },
  {
    id: 'en-3',
    activity: {
      id: 'act-3', title: '古法蓝染体验', location: '福建 · 屏南',
      host: '蓝姐', image: '/images/featured-shaxi.jpg', tags: ['手作', '非遗', '亲子友好'],
      price: 280, duration: '1天', maxPeople: 10,
      description: '用板蓝根染布，体验植物染色的治愈过程',
      matchScore: 78,
    },
    status: 'completed',
    enrolledAt: '2026-04-20',
  },
  {
    id: 'en-4',
    activity: {
      id: 'act-4', title: '乡村手作面包工坊', location: '云南 · 沙溪',
      host: '阿芳', image: '/images/featured-shaxi.jpg', tags: ['手作', '美食', '疗愈'],
      price: 200, duration: '半天', maxPeople: 6,
      description: '用柴火烤炉做欧包，学习天然酵母发酵',
      matchScore: 82,
    },
    status: 'cancelled',
    enrolledAt: '2026-03-15',
  },
]

// Mock published activities for "林小夏" (organizer)
export const MOCK_PUBLISHED_ACTIVITIES: MyPublishedActivity[] = [
  {
    id: 'pub-1',
    title: '桐庐古村落探访',
    location: '杭州 · 桐庐',
    image: '/images/featured-tonglu.jpg',
    startDate: '2026-06-15',
    endDate: '2026-06-17',
    status: 'upcoming',
    enrolledCount: 6,
    capacity: 12,
  },
  {
    id: 'pub-2',
    title: '春季采茶体验营',
    location: '杭州 · 西湖',
    image: '/images/featured-tonglu.jpg',
    startDate: '2026-04-01',
    endDate: '2026-04-03',
    status: 'completed',
    enrolledCount: 10,
    capacity: 10,
  },
  {
    id: 'pub-3',
    title: '周末乡村瑜伽静修',
    location: '浙江 · 莫干山',
    image: '/images/featured-shaxi.jpg',
    startDate: '2026-07-01',
    endDate: '2026-07-03',
    status: 'planning',
    enrolledCount: 2,
    capacity: 15,
  },
  {
    id: 'pub-4',
    title: '乡村摄影工作坊',
    location: '江西 · 婺源',
    image: '/images/featured-jingdezhen.jpg',
    startDate: '2026-03-01',
    endDate: '2026-03-05',
    status: 'cancelled',
    enrolledCount: 0,
    capacity: 8,
  },
]
