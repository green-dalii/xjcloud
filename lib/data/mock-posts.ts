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
  'linear-gradient(135deg, #3d5a3f, #4a6741)',
  'linear-gradient(135deg, #7a7468, #c9a96e)',
]

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: { name: '枫丝语', handle: 'augustus.web5.xjdao.xyz', color: GRADIENTS[0] },
    content: '「寻找乐土」—— 在云南大理银桥镇住了一周，每天清晨被稻田的蛙鸣叫醒，傍晚和当地阿孃学做乳扇。这里的生活节奏让我重新理解了什么叫"在地"。',
    image: '/images/featured-tonglu.jpg',
    timestamp: '1天前',
    category: 'all',
    stats: { comments: 3, reposts: 1, likes: 12, rice: 8 },
  },
  {
    id: '2',
    author: { name: '李展唐', handle: 'lizhantang5656.web5.xjdao.xyz', color: GRADIENTS[1] },
    content: '乡建的核心，是以人为主体的。解决人的问题，就是解决乡建的问题。\n\n第一，乡建在地人的特色是什么？资源产品好，就搞资源产品，民族文化浓，就搞民族文化，有什么搞什么，没有什么就不要强搞。把一帮会唱歌的，拉进会养牛的村子，那不是乡建，那是走马观花，那是旅游观光。\n\n第二，参加乡建的人有什么需求？希望赚钱，希望做事！乡村没有钱赚，那我不可能去的，乡村没有我能做的事做，那我不可能去的，哪有钱赚我去哪儿，哪儿有事做我去哪儿，我要生活！\n\n也就是说，搞乡建，就是改造在地的特色，使人有钱赚，使人有事做，人自然就会来。\n\n插队下乡，那可不是什么一挥手就去的事，那是城里没事做没钱赚，去了有活做有馒头吃。',
    image: '/images/hero-aerial-village.jpg',
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
    content: '有人知道大理银桥镇的有机农场还在招义工吗？想带两个朋友过去待两周。\n\n附上一张上周去沙溪古镇拍的照片，早晨的晨雾太美了。',
    image: '/images/featured-shaxi.jpg',
    timestamp: '3天前',
    category: 'task',
    stats: { comments: 12, reposts: 2, likes: 34, rice: 5 },
  },
  {
    id: '5',
    author: { name: '茶小匠', handle: 'chacha.jdz.web5.xjdao.xyz', color: GRADIENTS[4] },
    content: '景德镇手作陶瓷体验课，拉坯+釉下彩绘，作品可以带回家。今天刚开窑，效果超预期！\n\n课程地点在三宝蓬艺术聚落，周边还有很多有趣的陶艺工作室可以逛。',
    image: '/images/featured-jingdezhen.jpg',
    timestamp: '5天前',
    category: 'product',
    stats: { comments: 18, reposts: 8, likes: 89, rice: 31 },
  },
  {
    id: '6',
    author: { name: '稻田守望者', handle: 'watchman.pingnan.web5.xjdao.xyz', color: GRADIENTS[5] },
    content: '屏南漈下村的稻田进入灌浆期了，预计还有两周就可以收割。今年尝试了"稻鱼共生"模式，田里放了鲫鱼苗，等收完稻子还能抓鱼。\n\n有想体验割稻的朋友可以提前预约，我们提供镰刀、斗笠和农家午饭。',
    image: '/images/featured-tonglu.jpg',
    timestamp: '1天前',
    category: 'activity',
    stats: { comments: 22, reposts: 11, likes: 203, rice: 67 },
  },
  {
    id: '7',
    author: { name: '老窑工', handle: 'oldkiln.jdz.web5.xjdao.xyz', color: GRADIENTS[6] },
    content: '景德镇瑶里古镇有一座明代古窑遗址，现在还在使用柴烧。每次开窑都是一场赌博，温度、湿度、木柴种类都会影响最终成色。\n\n但正是这种不确定性，让每一件柴烧器物都是独一无二的。这周的这批杯子釉色特别温润，像雨过天青。',
    image: '/images/featured-jingdezhen.jpg',
    timestamp: '3天前',
    category: 'product',
    stats: { comments: 15, reposts: 7, likes: 128, rice: 45 },
  },
]

export const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'task', label: '任务' },
  { key: 'product', label: '商品' },
  { key: 'activity', label: '活动' },
] as const
