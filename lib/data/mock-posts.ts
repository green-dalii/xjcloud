export interface Post {
  id: string
  author: {
    name: string
    handle: string
    avatar?: string
    color: string
  }
  content: string
  image?: string
  timestamp: string
  category: 'all' | 'task' | 'product' | 'activity'
  stats: {
    comments: number
    reposts: number
    likes: number
    rice: number
  }
}

const GRADIENTS = [
  'linear-gradient(135deg, #4a6741, #6b8e5a)',
  'linear-gradient(135deg, #8b6f47, #c9a96e)',
  'linear-gradient(135deg, #c9a96e, #d4b87a)',
  'linear-gradient(135deg, #5a7d50, #3d5a3f)',
  'linear-gradient(135deg, #b85c48, #c9a96e)',
]

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: { name: '枫丝语', handle: 'augustus.web5.xjdao.xyz', color: GRADIENTS[0] },
    content: '「寻找乐土」',
    timestamp: '1天前',
    category: 'all',
    stats: { comments: 3, reposts: 1, likes: 12, rice: 8 },
  },
  {
    id: '2',
    author: { name: '李展唐', handle: 'lizhantang5656.web5.xjdao.xyz', color: GRADIENTS[1] },
    content: '乡建的核心，是以人为主体的。解决人的问题，就是解决乡建的问题。\n\n第一，乡建在地人的特色是什么？资源产品好，就搞资源产品，民族文化浓，就搞民族文化，有什么搞什么，没有什么就不要强搞。把一帮会唱歌的，拉进会养牛的村子，那不是乡建，那是走马观花，那是旅游观光。\n\n第二，参加乡建的人有什么需求？希望赚钱，希望做事！乡村没有钱赚，那我不可能去的，乡村没有我能做的事做，那我不可能去的，哪有钱赚我去哪儿，哪儿有事做我去哪儿，我要生活！\n\n也就是说，搞乡建，就是改造在地的特色，使人有钱赚，使人有事做，人自然就会来。\n\n插队下乡，那可不是什么一挥手就去的事，那是城里没事做没钱赚，去了有活做有馒头吃。',
    image: '/images/mock-food.jpg',
    timestamp: '7天前',
    category: 'all',
    stats: { comments: 28, reposts: 15, likes: 156, rice: 42 },
  },
  {
    id: '3',
    author: { name: '阿木', handle: 'amu.xiayun.web5.xjdao.xyz', color: GRADIENTS[2] },
    content: '本周六在屏南龙潭村有个「柴火灶体验」，自己做柴火饭，吃现成的。名额有限，先到先得！',
    timestamp: '2小时前',
    category: 'activity',
    stats: { comments: 6, reposts: 3, likes: 45, rice: 23 },
  },
  {
    id: '4',
    author: { name: '禾子', handle: 'hezi.dali.web5.xjdao.xyz', color: GRADIENTS[3] },
    content: '有人知道大理银桥镇的有机农场还在招义工吗？想带两个朋友过去待两周。',
    timestamp: '3天前',
    category: 'task',
    stats: { comments: 12, reposts: 2, likes: 34, rice: 5 },
  },
  {
    id: '5',
    author: { name: '茶小匠', handle: 'chacha.jdz.web5.xjdao.xyz', color: GRADIENTS[4] },
    content: '景德镇手作陶瓷体验课，拉坯+釉下彩绘，作品可以带回家。今天刚开窑，效果超预期！',
    image: '/images/mock-ceramic.jpg',
    timestamp: '5天前',
    category: 'product',
    stats: { comments: 18, reposts: 8, likes: 89, rice: 31 },
  },
]

export const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'task', label: '任务' },
  { key: 'product', label: '商品' },
  { key: 'activity', label: '活动' },
] as const
