export interface ActivityCard {
  id: string
  title: string
  location: string
  host: string
  image: string
  tags: string[]
  price: number
  duration: string
  maxPeople: number
  description: string
  matchScore: number
}

export type Gender = 'male' | 'female'
export type TravelMode = 'solo' | 'group'
export type CompanionType = 'partner' | 'friend' | 'parent' | 'child' | 'other'
export type ActivityInterest = 'weekend' | 'nearby' | 'family' | 'food' | 'craft' | 'culture' | 'solo' | 'friends'

export interface Filters {
  gender?: Gender
  travelMode?: TravelMode
  companionType?: CompanionType
  interests?: ActivityInterest[]
}

export const INTEREST_OPTIONS: { value: ActivityInterest; label: string; subtitle: string; desc: string; emoji: string }[] = [
  { value: 'weekend', label: '周末想出走', subtitle: '周末短逃离', desc: '不用请假，换个地方把自己找回来。', emoji: '🏕️' },
  { value: 'nearby', label: '附近也有新鲜事', subtitle: '附近探索', desc: '不用远行，城市边上也藏着生活彩蛋。', emoji: '🚶' },
  { value: 'family', label: '带孩子去撒欢', subtitle: '亲子自然', desc: '摸泥巴、认植物、看小动物，比补习班开心。', emoji: '🌱' },
  { value: 'food', label: '去吃一顿当地饭', subtitle: '在地美食', desc: '不只填饱肚子，也尝尝一个地方的脾气。', emoji: '🍜' },
  { value: 'craft', label: '想动手做点什么', subtitle: '手作体验', desc: '陶艺、木工、编织，给双手找点正事。', emoji: '🎨' },
  { value: 'culture', label: '跟着本地人走走', subtitle: '人文探访', desc: '少走网红路线，多听一点真正的故事。', emoji: '📖' },
  { value: 'solo', label: '一个人也很好', subtitle: '独处放空', desc: '找个安静地方发发呆，没人问你"然后呢"。', emoji: '🍵' },
  { value: 'friends', label: '别再说改天了', subtitle: '朋友聚会', desc: '一顿饭、一场露营，把群聊变成见面。', emoji: '🍻' },
]

export const INTEREST_TAG_MAP: Record<ActivityInterest, string[]> = {
  weekend: ['自然', '手作', '疗愈', '露营', '徒步'],
  nearby: ['社交', '文化', '老宅改造'],
  family: ['亲子友好', '自然', '采摘', '研学'],
  food: ['美食', '乡宴', '家宴', '地方菜'],
  craft: ['手作', '陶艺', '木工', '扎染', '非遗'],
  culture: ['文化', '老宅改造', '研学'],
  solo: ['疗愈', '自然', '禅修', '瑜伽', '茶艺'],
  friends: ['社交', '聚会', '音乐', '露营'],
}

export const ALL_ACTIVITIES: ActivityCard[] = [
  {
    id: '1', title: '云雾茶园采茶体验', location: '杭州 · 桐庐', host: '小鹿',
    image: '/images/featured-tonglu.jpg', tags: ['自然', '手作', '疗愈'],
    price: 380, duration: '2天1晚', maxPeople: 8,
    description: '在海拔800米的云雾茶园，亲手采摘明前龙井，学习古法炒茶工艺',
    matchScore: 95,
  },
  {
    id: '2', title: '老院子开放茶室', location: '云南 · 沙溪', host: '阿明',
    image: '/images/featured-shaxi.jpg', tags: ['老宅改造', '社交', '文化'],
    price: 120, duration: '半天', maxPeople: 12,
    description: '百年白族院子里，围炉煮茶，听阿明讲茶马古道的故事',
    matchScore: 88,
  },
  {
    id: '3', title: '柴烧陶艺工坊', location: '景德镇 · 湘湖', host: '老周',
    image: '/images/featured-jingdezhen.jpg', tags: ['手作', '艺术', '深度体验'],
    price: 480, duration: '1天', maxPeople: 6,
    description: '亲手拉坯、修坯，体验三天三夜柴窑烧制，带走自己烧的器皿',
    matchScore: 92,
  },
  {
    id: '4', title: '稻田骑行与星空露营', location: '浙江 · 莫干山', host: '大田',
    image: '/images/featured-tonglu.jpg', tags: ['骑行', '露营', '自然'],
    price: 560, duration: '2天1晚', maxPeople: 15,
    description: '穿越金色稻田的骑行路线，夜晚在稻田中央露营看银河',
    matchScore: 85,
  },
  {
    id: '5', title: '古法蓝染体验', location: '福建 · 屏南', host: '蓝姐',
    image: '/images/featured-shaxi.jpg', tags: ['手作', '非遗', '亲子友好'],
    price: 260, duration: '半天', maxPeople: 10,
    description: '用板蓝根发酵的靛蓝染料，在棉布上扎染出独一无二的图案',
    matchScore: 78,
  },
  {
    id: '6', title: '山野瑜伽 Retreat', location: '杭州 · 桐庐', host: '林老师',
    image: '/images/featured-tonglu.jpg', tags: ['疗愈', '瑜伽', '自然'],
    price: 680, duration: '3天2晚', maxPeople: 12,
    description: '在竹林深处的木平台上做晨间瑜伽，聆听溪流与鸟鸣',
    matchScore: 90,
  },
  {
    id: '7', title: '乡野木工雕刻', location: '四川 · 明月村', host: '木叔',
    image: '/images/featured-jingdezhen.jpg', tags: ['手作', '木工', '深度体验'],
    price: 420, duration: '1天', maxPeople: 8,
    description: '从选木到开料，学习传统榫卯结构，亲手做一把木勺或木碗',
    matchScore: 82,
  },
  {
    id: '8', title: '有机农场采摘日', location: '浙江 · 莫干山', host: '阿芳',
    image: '/images/featured-shaxi.jpg', tags: ['采摘', '亲子友好', '美食'],
    price: 180, duration: '半天', maxPeople: 20,
    description: '当季蔬果采摘+农家土灶午餐，从土地到餐桌的完整体验',
    matchScore: 75,
  },
  {
    id: '9', title: '古道徒步与草药辨识', location: '福建 · 屏南', host: '草药陈',
    image: '/images/featured-tonglu.jpg', tags: ['徒步', '自然', '研学'],
    price: 320, duration: '1天', maxPeople: 12,
    description: '跟着老药农走千年古道，辨识三十种常见中草药',
    matchScore: 80,
  },
  {
    id: '10', title: '陶艺+茶道慢生活', location: '景德镇 · 三宝', host: '静姐',
    image: '/images/featured-jingdezhen.jpg', tags: ['手作', '茶艺', '疗愈'],
    price: 580, duration: '2天1晚', maxPeople: 6,
    description: '上午捏陶下午品茶，在景德镇的山谷里过上两天慢生活',
    matchScore: 93,
  },
  {
    id: '11', title: '洱海骑行环海线', location: '云南 · 大理', host: '风哥',
    image: '/images/featured-shaxi.jpg', tags: ['骑行', '自然', '风景'],
    price: 240, duration: '1天', maxPeople: 15,
    description: '130km洱海生态廊道骑行，一路苍山洱海相伴',
    matchScore: 87,
  },
  {
    id: '12', title: '白族扎染亲子营', location: '云南 · 大理', host: '金花',
    image: '/images/featured-shaxi.jpg', tags: ['亲子友好', '手作', '非遗'],
    price: 360, duration: '半天', maxPeople: 10,
    description: '带孩子体验白族传统扎染，每人带走一件自己染的T恤',
    matchScore: 91,
  },
  {
    id: '13', title: '深山禅修体验', location: '福建 · 屏南', host: '慧明师父',
    image: '/images/featured-tonglu.jpg', tags: ['疗愈', '禅修', '静心'],
    price: 800, duration: '3天2晚', maxPeople: 8,
    description: '古寺清修，晨钟暮鼓，过堂用斋，体验真正的山中一日',
    matchScore: 89,
  },
  {
    id: '14', title: '竹编手艺传承', location: '四川 · 明月村', host: '竹婆婆',
    image: '/images/featured-jingdezhen.jpg', tags: ['手作', '非遗', '文化'],
    price: 200, duration: '半天', maxPeople: 8,
    description: '跟八十岁的竹编传承人学习，从劈竹到编筐的完整工艺',
    matchScore: 76,
  },
  {
    id: '15', title: '茶园民宿管家体验', location: '杭州 · 桐庐', host: '小鹿',
    image: '/images/featured-tonglu.jpg', tags: ['深度体验', '民宿', '自然'],
    price: 1500, duration: '7天6晚', maxPeople: 4,
    description: '深度入住茶园民宿，学习民宿运营，参与日常农事',
    matchScore: 84,
  },
  {
    id: '16', title: '古村落摄影 walks', location: '云南 · 沙溪', host: '小马',
    image: '/images/featured-shaxi.jpg', tags: ['摄影', '文化', '风景'],
    price: 280, duration: '1天', maxPeople: 8,
    description: '专业摄影师带队，在沙溪古镇捕捉光影与人文',
    matchScore: 79,
  },
  {
    id: '17', title: '陶艺蜜月套餐', location: '景德镇 · 湘湖', host: '老周',
    image: '/images/featured-jingdezhen.jpg', tags: ['浪漫', '手作', '深度体验'],
    price: 1280, duration: '2天1晚', maxPeople: 2,
    description: '情侣专属陶艺体验，为彼此做一对杯子，柴窑烧制后寄送',
    matchScore: 97,
  },
  {
    id: '18', title: '稻田音乐节露营', location: '浙江 · 莫干山', host: '大田',
    image: '/images/featured-tonglu.jpg', tags: ['音乐', '露营', '聚会'],
    price: 320, duration: '2天1晚', maxPeople: 50,
    description: '秋日稻田里的独立音乐节，帐篷、篝火、民谣与星空',
    matchScore: 86,
  },
  {
    id: '19', title: '亲子自然研学营', location: '四川 · 明月村', host: '自然君',
    image: '/images/featured-shaxi.jpg', tags: ['亲子友好', '研学', '自然'],
    price: 680, duration: '3天2晚', maxPeople: 15,
    description: '昆虫观察、植物标本制作、夜间探险，给孩子最好的自然课堂',
    matchScore: 94,
  },
  {
    id: '20', title: '山间温泉疗愈', location: '云南 · 大理', host: '温泉张',
    image: '/images/featured-tonglu.jpg', tags: ['疗愈', '温泉', '放松'],
    price: 880, duration: '2天1晚', maxPeople: 10,
    description: '苍山脚下的天然温泉，泡完喝一壶普洱茶，身心彻底放松',
    matchScore: 83,
  },
]

export function filterActivities(filters: Filters): ActivityCard[] {
  let result = [...ALL_ACTIVITIES]

  if (filters.gender === 'male') {
    result = result.map(a => ({
      ...a,
      matchScore: a.tags.some(t => ['骑行', '徒步', '露营', '木工'].includes(t))
        ? a.matchScore + 10
        : a.matchScore,
    }))
  } else if (filters.gender === 'female') {
    result = result.map(a => ({
      ...a,
      matchScore: a.tags.some(t => ['瑜伽', '茶艺', '疗愈', '手作'].includes(t))
        ? a.matchScore + 10
        : a.matchScore,
    }))
  }

  if (filters.travelMode === 'solo') {
    result = result.map(a => ({
      ...a,
      matchScore: a.tags.some(t => ['社交', '聚会'].includes(t)) || a.maxPeople <= 8
        ? a.matchScore + 8
        : a.matchScore,
    }))
  } else if (filters.travelMode === 'group' && filters.companionType === 'partner') {
    result = result.map(a => ({
      ...a,
      matchScore: a.tags.some(t => ['浪漫', '疗愈', '深度体验'].includes(t)) || a.maxPeople <= 6
        ? a.matchScore + 12
        : a.matchScore,
    }))
  } else if (filters.travelMode === 'group' && filters.companionType === 'child') {
    result = result.map(a => ({
      ...a,
      matchScore: a.tags.includes('亲子友好')
        ? a.matchScore + 15
        : a.matchScore,
    }))
  }

  // Interest-based scoring
  if (filters.interests && filters.interests.length > 0) {
    result = result.map(a => {
      let boost = 0
      for (const interest of filters.interests!) {
        const tags = INTEREST_TAG_MAP[interest]
        if (tags && a.tags.some(t => tags.includes(t))) {
          boost += 6
        }
      }
      return { ...a, matchScore: a.matchScore + boost }
    })
  }

  return result.sort((a, b) => b.matchScore - a.matchScore)
}
