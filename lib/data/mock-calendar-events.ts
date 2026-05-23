export interface CalendarEvent {
  id: string
  title: string
  date: string // YYYY-MM-DD
  type: EventType
  location: string
  host: string
  description: string
  price: number
  duration: string
  maxPeople: number
}

export type EventType =
  | 'nature'   // 自然体验
  | 'craft'    // 手作工坊
  | 'healing'  // 疗愈静心
  | 'culture'  // 文化探索
  | 'food'     // 美食体验
  | 'social'   // 社交聚会
  | 'study'    // 研学教育
  | 'sport'    // 户外运动

export interface EventTypeConfig {
  label: string
  color: string
  bg: string
  border: string
}

export const EVENT_TYPE_CONFIG: Record<EventType, EventTypeConfig> = {
  nature:  { label: '自然',  color: '#6b8e5a', bg: 'rgba(107,142,90,0.12)',  border: 'rgba(107,142,90,0.35)' },
  craft:   { label: '手作',  color: '#c9a96e', bg: 'rgba(201,169,110,0.12)', border: 'rgba(201,169,110,0.35)' },
  healing: { label: '疗愈',  color: '#6a9fb5', bg: 'rgba(106,159,181,0.12)', border: 'rgba(106,159,181,0.35)' },
  culture: { label: '文化',  color: '#9b7cb6', bg: 'rgba(155,124,182,0.12)', border: 'rgba(155,124,182,0.35)' },
  food:    { label: '美食',  color: '#d4956a', bg: 'rgba(212,149,106,0.12)', border: 'rgba(212,149,106,0.35)' },
  social:  { label: '社交',  color: '#c97e8a', bg: 'rgba(201,126,138,0.12)', border: 'rgba(201,126,138,0.35)' },
  study:   { label: '研学',  color: '#5aaa9a', bg: 'rgba(90,170,154,0.12)',  border: 'rgba(90,170,154,0.35)' },
  sport:   { label: '运动',  color: '#b87070', bg: 'rgba(184,112,112,0.12)',  border: 'rgba(184,112,112,0.35)' },
}

// 2026年5月~8月的活动数据，分布有随机性
export const CALENDAR_EVENTS: CalendarEvent[] = [
  // ── 5月 ──
  { id: 'm5-1',  title: '云雾茶园采茶体验',        date: '2026-05-03', type: 'nature',  location: '杭州·桐庐',    host: '小鹿',     description: '在海拔800米的云雾茶园，亲手采摘明前龙井，学习古法炒茶工艺', price: 380, duration: '2天1晚', maxPeople: 8 },
  { id: 'm5-2',  title: '古法蓝染体验',              date: '2026-05-03', type: 'craft',   location: '福建·屏南',    host: '蓝姐',     description: '用板蓝根发酵的靛蓝染料，在棉布上扎染出独一无二的图案', price: 260, duration: '半天', maxPeople: 10 },
  { id: 'm5-3',  title: '山野瑜伽 Retreat',          date: '2026-05-06', type: 'healing', location: '杭州·桐庐',    host: '林老师',   description: '在竹林深处的木平台上做晨间瑜伽，聆听溪流与鸟鸣', price: 680, duration: '3天2晚', maxPeople: 12 },
  { id: 'm5-4',  title: '白族扎染亲子营',            date: '2026-05-10', type: 'craft',   location: '云南·大理',    host: '金花',     description: '带孩子体验白族传统扎染，每人带走一件自己染的T恤', price: 360, duration: '半天', maxPeople: 10 },
  { id: 'm5-5',  title: '有机农场采摘日',            date: '2026-05-10', type: 'food',    location: '浙江·莫干山',  host: '阿芳',     description: '当季蔬果采摘+农家土灶午餐，从土地到餐桌的完整体验', price: 180, duration: '半天', maxPeople: 20 },
  { id: 'm5-6',  title: '古道徒步与草药辨识',        date: '2026-05-12', type: 'nature',  location: '福建·屏南',    host: '草药陈',   description: '跟着老药农走千年古道，辨识三十种常见中草药', price: 320, duration: '1天', maxPeople: 12 },
  { id: 'm5-7',  title: '柴烧陶艺工坊',              date: '2026-05-15', type: 'craft',   location: '景德镇·湘湖',  host: '老周',     description: '亲手拉坯、修坯，体验三天三夜柴窑烧制，带走自己烧的器皿', price: 480, duration: '1天', maxPeople: 6 },
  { id: 'm5-8',  title: '洱海骑行环海线',            date: '2026-05-17', type: 'sport',   location: '云南·大理',    host: '风哥',     description: '130km洱海生态廊道骑行，一路苍山洱海相伴', price: 240, duration: '1天', maxPeople: 15 },
  { id: 'm5-9',  title: '稻田音乐节露营',            date: '2026-05-20', type: 'social',  location: '浙江·莫干山',  host: '大田',     description: '秋日稻田里的独立音乐节，帐篷、篝火、民谣与星空', price: 320, duration: '2天1晚', maxPeople: 50 },
  { id: 'm5-10', title: '竹编手艺传承',              date: '2026-05-22', type: 'craft',   location: '四川·明月村',  host: '竹婆婆',   description: '跟八十岁的竹编传承人学习，从劈竹到编筐的完整工艺', price: 200, duration: '半天', maxPeople: 8 },
  { id: 'm5-11', title: '亲子自然研学营',            date: '2026-05-24', type: 'study',   location: '四川·明月村',  host: '自然君',   description: '昆虫观察、植物标本制作、夜间探险，给孩子最好的自然课堂', price: 680, duration: '3天2晚', maxPeople: 15 },
  { id: 'm5-12', title: '老院子开放茶室',            date: '2026-05-27', type: 'culture', location: '云南·沙溪',    host: '阿明',     description: '百年白族院子里，围炉煮茶，听阿明讲茶马古道的故事', price: 120, duration: '半天', maxPeople: 12 },
  { id: 'm5-13', title: '山间温泉疗愈',              date: '2026-05-30', type: 'healing', location: '云南·大理',    host: '温泉张',   description: '苍山脚下的天然温泉，泡完喝一壶普洱茶，身心彻底放松', price: 880, duration: '2天1晚', maxPeople: 10 },
  { id: 'm5-14', title: '乡野木工雕刻',              date: '2026-05-31', type: 'craft',   location: '四川·明月村',  host: '木叔',     description: '从选木到开料，学习传统榫卯结构，亲手做一把木勺或木碗', price: 420, duration: '1天', maxPeople: 8 },

  // ── 6月 ──
  { id: 'm6-1',  title: '茶园民宿管家体验',          date: '2026-06-01', type: 'nature',  location: '杭州·桐庐',    host: '小鹿',     description: '深度入住茶园民宿，学习民宿运营，参与日常农事', price: 1500, duration: '7天6晚', maxPeople: 4 },
  { id: 'm6-2',  title: '古村落摄影 walks',          date: '2026-06-04', type: 'culture', location: '云南·沙溪',    host: '小马',     description: '专业摄影师带队，在沙溪古镇捕捉光影与人文', price: 280, duration: '1天', maxPeople: 8 },
  { id: 'm6-3',  title: '陶艺+茶道慢生活',            date: '2026-06-06', type: 'craft',   location: '景德镇·三宝',  host: '静姐',     description: '上午捏陶下午品茶，在景德镇的山谷里过上两天慢生活', price: 580, duration: '2天1晚', maxPeople: 6 },
  { id: 'm6-4',  title: '陶艺蜜月套餐',              date: '2026-06-08', type: 'social',  location: '景德镇·湘湖',  host: '老周',     description: '情侣专属陶艺体验，为彼此做一对杯子，柴窑烧制后寄送', price: 1280, duration: '2天1晚', maxPeople: 2 },
  { id: 'm6-5',  title: '深山禅修体验',              date: '2026-06-10', type: 'healing', location: '福建·屏南',    host: '慧明师父', description: '古寺清修，晨钟暮鼓，过堂用斋，体验真正的山中一日', price: 800, duration: '3天2晚', maxPeople: 8 },
  { id: 'm6-6',  title: '稻田骑行与星空露营',        date: '2026-06-13', type: 'sport',   location: '浙江·莫干山',  host: '大田',     description: '穿越金色稻田的骑行路线，夜晚在稻田中央露营看银河', price: 560, duration: '2天1晚', maxPeople: 15 },
  { id: 'm6-7',  title: '端午粽子手作节',            date: '2026-06-14', type: 'food',    location: '杭州·桐庐',    host: '小鹿',     description: '亲手包制传统粽子，体验端午文化，品尝地道农家菜', price: 150, duration: '半天', maxPeople: 20 },
  { id: 'm6-8',  title: '端午龙舟观赛',              date: '2026-06-14', type: 'culture', location: '福建·屏南',    host: '蓝姐',     description: '在古村河道旁观看传统龙舟比赛，感受节日氛围', price: 80, duration: '半天', maxPeople: 30 },
  { id: 'm6-9',  title: '萤火虫夜观之旅',            date: '2026-06-18', type: 'nature',  location: '四川·明月村',  host: '自然君',   description: '夏夜走进溪谷，寻找萤火虫的踪迹，聆听蛙鸣虫唱', price: 200, duration: '半天', maxPeople: 15 },
  { id: 'm6-10', title: '手冲咖啡体验课',            date: '2026-06-20', type: 'food',    location: '云南·大理',    host: '风哥',     description: '在苍山脚下的咖啡庄园，学习手冲技巧，品鉴云南小粒咖啡', price: 220, duration: '半天', maxPeople: 10 },
  { id: 'm6-11', title: '古琴雅集',                  date: '2026-06-22', type: 'culture', location: '景德镇·三宝',  host: '静姐',     description: '在竹林茶室中聆听古琴演奏，体验文人雅士的生活方式', price: 180, duration: '半天', maxPeople: 15 },
  { id: 'm6-12', title: '溯溪探险',                  date: '2026-06-25', type: 'sport',   location: '浙江·莫干山',  host: '大田',     description: '沿溪谷逆流而上，穿越瀑布与深潭，感受夏日清凉', price: 380, duration: '1天', maxPeople: 12 },
  { id: 'm6-13', title: '茶道入门工作坊',            date: '2026-06-27', type: 'healing', location: '云南·沙溪',    host: '阿明',     description: '学习中国六大茶类的冲泡方法，体验茶道的仪式感', price: 260, duration: '半天', maxPeople: 8 },
  { id: 'm6-14', title: '乡村建筑考察',              date: '2026-06-28', type: 'study',   location: '福建·屏南',    host: '草药陈',   description: '考察屏南古村落建筑，了解夯土墙与木结构的传统工艺', price: 350, duration: '1天', maxPeople: 10 },
  { id: 'm6-15', title: '星空摄影工作坊',            date: '2026-06-29', type: 'study',   location: '云南·大理',    host: '小马',     description: '在洱海湖畔学习星空摄影，拍摄银河与星轨', price: 450, duration: '1天', maxPeople: 8 },

  // ── 7月 ──
  { id: 'm7-1',  title: '荷塘写生与国画体验',        date: '2026-07-02', type: 'culture', location: '杭州·桐庐',    host: '小鹿',     description: '在荷塘边学习国画技法，用笔墨记录夏日荷韵', price: 280, duration: '半天', maxPeople: 10 },
  { id: 'm7-2',  title: '萤火虫亲子夜探',            date: '2026-07-04', type: 'study',   location: '四川·明月村',  host: '自然君',   description: '带孩子寻找夏夜精灵，了解萤火虫的生态知识', price: 160, duration: '半天', maxPeople: 15 },
  { id: 'm7-3',  title: '高山牧场露营',              date: '2026-07-06', type: 'nature',  location: '云南·大理',    host: '风哥',     description: '在海拔3000米的高山牧场搭帐篷，与牛羊为伴看日出', price: 520, duration: '2天1晚', maxPeople: 12 },
  { id: 'm7-4',  title: '泥塑创意工坊',              date: '2026-07-08', type: 'craft',   location: '景德镇·湘湖',  host: '老周',     description: '用双手捏出想象中的形状，体验泥塑的自由与乐趣', price: 320, duration: '半天', maxPeople: 10 },
  { id: 'm7-5',  title: '森林冥想与呼吸法',          date: '2026-07-10', type: 'healing', location: '浙江·莫干山',  host: '林老师',   description: '在百年银杏树下学习正念冥想，掌握自然呼吸法', price: 360, duration: '半天', maxPeople: 15 },
  { id: 'm7-6',  title: '乡村音乐节',                date: '2026-07-12', type: 'social',  location: '福建·屏南',    host: '大田',     description: '露天草地音乐节，独立乐队+民谣歌手+篝火晚会', price: 280, duration: '1天', maxPeople: 200 },
  { id: 'm7-7',  title: '陶艺夏令营（少儿）',        date: '2026-07-14', type: 'study',   location: '景德镇·三宝',  host: '静姐',     description: '为期一周的少儿陶艺夏令营，从拉坯到上釉完整体验', price: 1680, duration: '5天4晚', maxPeople: 12 },
  { id: 'm7-8',  title: '浆板瑜伽',                  date: '2026-07-16', type: 'sport',   location: '云南·大理',    host: '林老师',   description: '在洱海平静水面上做瑜伽，感受水波与身体的共振', price: 380, duration: '半天', maxPeople: 8 },
  { id: 'm7-9',  title: '农家菜烹饪课',              date: '2026-07-18', type: 'food',    location: '云南·沙溪',    host: '阿明',     description: '向当地阿孃学习三道家常菜，从采摘到上桌全过程', price: 200, duration: '半天', maxPeople: 8 },
  { id: 'm7-10', title: '自然染布体验',              date: '2026-07-20', type: 'craft',   location: '四川·明月村',  host: '竹婆婆',   description: '用草木染料在丝绸上染出自然纹理，制作专属丝巾', price: 300, duration: '半天', maxPeople: 8 },
  { id: 'm7-11', title: '山地越野跑',                date: '2026-07-22', type: 'sport',   location: '浙江·莫干山',  host: '大田',     description: '10km山地越野跑，穿越竹林与茶园，挑战自我极限', price: 180, duration: '半天', maxPeople: 50 },
  { id: 'm7-12', title: '青瓷鉴赏与制作',            date: '2026-07-24', type: 'culture', location: '景德镇·三宝',  host: '老周',     description: '了解青瓷千年历史，亲手制作一件青瓷小器皿', price: 420, duration: '1天', maxPeople: 6 },
  { id: 'm7-13', title: '稻田插秧体验',              date: '2026-07-26', type: 'nature',  location: '杭州·桐庐',    host: '小鹿',     description: '穿上水靴下田插秧，体验"汗滴禾下土"的真实含义', price: 120, duration: '半天', maxPeople: 20 },
  { id: 'm7-14', title: '香道体验',                  date: '2026-07-28', type: 'healing', location: '福建·屏南',    host: '慧明师父', description: '学习传统制香工艺，亲手制作一炉安神香', price: 340, duration: '半天', maxPeople: 10 },
  { id: 'm7-15', title: '乡村电影夜',                date: '2026-07-30', type: 'social',  location: '云南·沙溪',    host: '阿明',     description: '在古村广场放映经典电影，搭配爆米花与冰镇啤酒', price: 60, duration: '半天', maxPeople: 50 },

  // ── 8月 ──
  { id: 'm8-1',  title: '采莲体验',                  date: '2026-08-01', type: 'nature',  location: '杭州·桐庐',    host: '小鹿',     description: '撑竹筏入荷塘，亲手采摘新鲜莲子，品尝莲子羹', price: 150, duration: '半天', maxPeople: 12 },
  { id: 'm8-2',  title: '陶艺+烧烤派对',             date: '2026-08-03', type: 'social',  location: '景德镇·湘湖',  host: '老周',     description: '白天做陶艺，傍晚河畔烧烤，音乐与啤酒的夏夜', price: 380, duration: '1天', maxPeople: 20 },
  { id: 'm8-3',  title: '皮影戏体验',                date: '2026-08-05', type: 'culture', location: '福建·屏南',    host: '蓝姐',     description: '学习传统皮影制作工艺，编排并表演一段皮影戏', price: 280, duration: '半天', maxPeople: 10 },
  { id: 'm8-4',  title: '高山观星露营',              date: '2026-08-07', type: 'nature',  location: '云南·大理',    host: '风哥',     description: '在海拔3500米的山顶露营，用望远镜观测深空天体', price: 680, duration: '2天1晚', maxPeople: 10 },
  { id: 'm8-5',  title: '户外攀岩入门',              date: '2026-08-09', type: 'sport',   location: '浙江·莫干山',  host: '大田',     description: '在专业教练指导下体验自然岩壁攀岩，克服恐惧挑战高度', price: 450, duration: '半天', maxPeople: 8 },
  { id: 'm8-6',  title: '茶艺师认证课',              date: '2026-08-11', type: 'healing', location: '云南·沙溪',    host: '阿明',     description: '系统学习茶艺知识，通过考核可获得初级茶艺师证书', price: 1200, duration: '3天', maxPeople: 6 },
  { id: 'm8-7',  title: '乡村市集摆摊',              date: '2026-08-13', type: 'food',    location: '四川·明月村',  host: '自然君',   description: '在周末乡村市集租个摊位，售卖手作与农产品', price: 50, duration: '半天', maxPeople: 30 },
  { id: 'm8-8',  title: '竹笛制作与吹奏',            date: '2026-08-15', type: 'craft',   location: '福建·屏南',    host: '竹婆婆',   description: '亲手制作一支竹笛，学习基础吹奏技巧', price: 260, duration: '半天', maxPeople: 8 },
  { id: 'm8-9',  title: '稻田收割体验',              date: '2026-08-17', type: 'nature',  location: '杭州·桐庐',    host: '小鹿',     description: '拿起镰刀参与水稻收割，体验丰收的喜悦', price: 100, duration: '半天', maxPeople: 25 },
  { id: 'm8-10', title: '乡村读书会',                date: '2026-08-19', type: 'social',  location: '云南·大理',    host: '风哥',     description: '在洱海边的咖啡馆共读一本乡村主题书籍，分享感悟', price: 80, duration: '半天', maxPeople: 15 },
  { id: 'm8-11', title: '草木染夏令营',              date: '2026-08-21', type: 'study',   location: '四川·明月村',  host: '自然君',   description: '为期三天的草木染深度体验，从采叶到染布完整流程', price: 980, duration: '3天2晚', maxPeople: 10 },
  { id: 'm8-12', title: '桨板漂流',                  date: '2026-08-23', type: 'sport',   location: '浙江·莫干山',  host: '大田',     description: '在溪谷中桨板漂流，穿越急流与平静水面', price: 320, duration: '半天', maxPeople: 12 },
  { id: 'm8-13', title: '蜡染体验',                  date: '2026-08-25', type: 'craft',   location: '云南·大理',    host: '金花',     description: '学习传统蜡染工艺，用蜂蜡在布上绘制图案后染色', price: 290, duration: '半天', maxPeople: 10 },
  { id: 'm8-14', title: '丰收节庆典',                date: '2026-08-28', type: 'social',  location: '福建·屏南',    host: '蓝姐',     description: '参与古村丰收节，祭祀、歌舞、长桌宴，感受农耕文化', price: 200, duration: '1天', maxPeople: 100 },
  { id: 'm8-15', title: '结业陶艺展',                date: '2026-08-30', type: 'culture', location: '景德镇·三宝',  host: '静姐',     description: '展示暑期学员的陶艺作品，评选最佳创意奖', price: 0, duration: '半天', maxPeople: 50 },
]

// 按日期分组，方便日历组件使用
export function getEventsByDate(): Record<string, CalendarEvent[]> {
  const map: Record<string, CalendarEvent[]> = {}
  for (const ev of CALENDAR_EVENTS) {
    if (!map[ev.date]) map[ev.date] = []
    map[ev.date].push(ev)
  }
  // 每天内部按价格排序（让重要活动在前面）
  for (const date in map) {
    map[date].sort((a, b) => b.price - a.price)
  }
  return map
}

// 获取某月的所有活动
export function getEventsByMonth(year: number, month: number): CalendarEvent[] {
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  return CALENDAR_EVENTS.filter((ev) => ev.date.startsWith(prefix))
}

// 提取所有唯一地点
export const ALL_LOCATIONS = Array.from(
  new Set(CALENDAR_EVENTS.map((ev) => ev.location))
).sort()

// 按地点筛选后的按日期分组
export function getEventsByDateFiltered(location?: string): Record<string, CalendarEvent[]> {
  const events = location && location !== '全部'
    ? CALENDAR_EVENTS.filter((ev) => ev.location === location)
    : CALENDAR_EVENTS

  const map: Record<string, CalendarEvent[]> = {}
  for (const ev of events) {
    if (!map[ev.date]) map[ev.date] = []
    map[ev.date].push(ev)
  }
  for (const date in map) {
    map[date].sort((a, b) => b.price - a.price)
  }
  return map
}
