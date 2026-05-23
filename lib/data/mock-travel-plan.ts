/* ─── Mock Travel Plan Data ─── */

export interface PlanItem {
  time: string
  title: string
  desc: string
  tips: string
}

export interface PlanCategory {
  category: '吃' | '穿' | '住' | '行'
  icon: string
  label: string
  items: PlanItem[]
}

export interface PlanDay {
  date: string
  dayLabel: string
  weekday: string
  categories: PlanCategory[]
}

export interface TravelPlan {
  title: string
  subtitle: string
  days: PlanDay[]
}

/* ─── Category icon/label mapping ─── */

const CATEGORY_META = {
  '吃': { icon: '🍜', label: '在地食事' },
  '穿': { icon: '🧥', label: '穿戴建议' },
  '住': { icon: '🏠', label: '安住之所' },
  '行': { icon: '🚗', label: '出行方式' },
} as const

/* ─── Plan: 桐庐 ─── */

const PLAN_TONGLU: TravelPlan = {
  title: '桐庐 · 富春江畔的隐逸周末',
  subtitle: '逃离城市的两天一夜，在山水中找回自己的呼吸节奏',
  days: [
    {
      date: '2026-05-30',
      dayLabel: 'Day 1',
      weekday: '周六',
      categories: [
        {
          category: '行', icon: CATEGORY_META['行'].icon, label: CATEGORY_META['行'].label,
          items: [
            {
              time: '08:30',
              title: '从杭州出发，自驾前往',
              desc: '杭新景高速约1.5h直达桐庐出口。建议早点出发避开高峰，沿途富春江风光已是行程的开始。',
              tips: '导航设置"桐庐芦茨村"，高速费约45元。如不方便开车，杭州东站有直达桐庐的巴士，票价38元。',
            },
          ],
        },
        {
          category: '吃', icon: CATEGORY_META['吃'].icon, label: CATEGORY_META['吃'].label,
          items: [
            {
              time: '11:00',
              title: '芦茨村口 · 阿婆土鸡煲',
              desc: '村口开了二十年的老灶头土鸡煲，用的是本地散养土鸡，砂锅文火炖三小时以上。汤色乳白，鸡肉嫩而不柴，配一碟自家腌的酸菜。',
              tips: '建议提前20分钟电话预约，不然现炖要等40分钟。老板电话可问民宿管家要。人均60元。',
            },
            {
              time: '18:30',
              title: '富春江鲜 · 江边渔家',
              desc: '傍晚在江边渔船改的餐厅吃富春江鲜。白水鱼清蒸最鲜，螺蛳用紫苏爆炒，再来一份农家腊肉炒笋干。就着江风下饭，是城市里吃不到的味道。',
              tips: '江边几个渔家餐厅大约19:30就收了，建议18:00之前到。富春江白水鱼是时令菜，春天最肥。人均85元。',
            },
          ],
        },
        {
          category: '穿', icon: CATEGORY_META['穿'].icon, label: CATEGORY_META['穿'].label,
          items: [
            {
              time: '全天',
              title: '初夏山林穿搭指南',
              desc: '5月底桐庐白天25°C左右，早晚降至18°C。建议轻薄长袖+可脱外套的叠穿法，方便进山和江边切换。鞋子务必选防滑运动鞋，石板路和山间小径雨后较滑。',
              tips: '带一把折叠伞，富春江边午后偶尔有阵雨。驱蚊液必带——山里的蚊子比城里凶。',
            },
          ],
        },
        {
          category: '住', icon: CATEGORY_META['住'].icon, label: CATEGORY_META['住'].label,
          items: [
            {
              time: '14:00',
              title: '芦茨村 · 溪畔山房民宿',
              desc: '一座由老宅改建的夯土民宿，保留了原有的木梁结构和天井，每个房间都对着富春江的支流小溪。院子里有棵百年香樟，树下喝茶发呆是正经事。',
              tips: '周末房源紧张，建议至少提前3天预订。推荐二楼的"望溪"房型，有独立露台正对溪流。价格区间480-880元/晚。',
            },
          ],
        },
      ],
    },
    {
      date: '2026-05-31',
      dayLabel: 'Day 2',
      weekday: '周日',
      categories: [
        {
          category: '吃', icon: CATEGORY_META['吃'].icon, label: CATEGORY_META['吃'].label,
          items: [
            {
              time: '08:00',
              title: '民宿早餐 · 现磨豆浆+手工麦饼',
              desc: '民宿主人亲手做的早餐，豆浆是石磨现磨的，麦饼是当地阿姨手工擀的，夹了咸菜笋丁或是红糖芝麻，配一碗白粥，简单却满足。',
              tips: '早餐时间是7:30-9:00，建议坐在院子里吃，清晨的鸟鸣是免费的背景音乐。',
            },
            {
              time: '12:30',
              title: '深澳古村 · 老太婆面馆',
              desc: '深澳古村巷子里藏着一家没有招牌的面馆，只做三种面：片儿川、猪肝面、三鲜面。猪肝现切现炒，浇头铺满碗面，面条是手擀的碱水面，劲道弹牙。',
              tips: '面馆只做午市，1点左右猪肝面就卖完了，早去早吃。人均25元，只收现金。',
            },
          ],
        },
        {
          category: '穿', icon: CATEGORY_META['穿'].icon, label: CATEGORY_META['穿'].label,
          items: [
            {
              time: '全天',
              title: '古村漫步 + 溪边踩水',
              desc: '第二天以轻松闲逛为主，建议棉麻宽松衣裤，带一双可以踩水的凉鞋或拖鞋。深澳古村和荻浦花海之间步行约20分钟，沿途溪流可以随时下水。',
              tips: '如果要去荻浦花海拍照，浅色系衣服更出片。帽子和墨镜也建议带上，下午阳光强烈。',
            },
          ],
        },
        {
          category: '住', icon: CATEGORY_META['住'].icon, label: CATEGORY_META['住'].label,
          items: [
            {
              time: '15:00',
              title: '戴家山 · 云端小筑',
              desc: '第二晚换到山上的民宿，海拔400多米，推开窗就是云海和梯田。主人是一对从上海回来的年轻夫妇，晚上会组织住客一起在院子里烤火、聊天、看星星。',
              tips: '上山最后3公里是土路，底盘低的轿车要慢慢开。山上晚上凉，民宿有备毯子和热茶。价格380-680元/晚，含早餐。',
            },
          ],
        },
        {
          category: '行', icon: CATEGORY_META['行'].icon, label: CATEGORY_META['行'].label,
          items: [
            {
              time: '16:30',
              title: '返程路线建议',
              desc: '从戴家山下山后走S302省道返回杭州，途经分水江水库，可以在观景台稍作停留，傍晚时分水面倒映天光云影，是整个行程的温柔收尾。',
              tips: '建议16:00前出发，避开周日晚高峰进城车流。S302省道路况好但弯多，注意限速。全程约2h。',
            },
          ],
        },
      ],
    },
  ],
}

/* ─── Plan: 沙溪 ─── */

const PLAN_SHAXI: TravelPlan = {
  title: '沙溪 · 茶马古道上的三天慢时光',
  subtitle: '在千年古镇的晨钟暮鼓里，体验真正的"从前慢"',
  days: [
    {
      date: '2026-05-30',
      dayLabel: 'Day 1',
      weekday: '周六',
      categories: [
        {
          category: '行', icon: CATEGORY_META['行'].icon, label: CATEGORY_META['行'].label,
          items: [
            {
              time: '09:00',
              title: '大理出发，搭车前往沙溪',
              desc: '从大理古城出发，沿214国道北上，经洱源、牛街，约2.5h抵达沙溪古镇。沿途有洱海北岸风光和白族村落，可以在牛街稍作休息。',
              tips: '大理古城南门有拼车去沙溪的面包车，约40元/人。自驾的话牛街到沙溪段弯道较多，注意会车。全程约120km。',
            },
          ],
        },
        {
          category: '吃', icon: CATEGORY_META['吃'].icon, label: CATEGORY_META['吃'].label,
          items: [
            {
              time: '12:00',
              title: '寺登街 · 阿妈的火塘烤鱼',
              desc: '沙溪寺登街四方街旁的老院子里，白族阿妈用炭火烤的洱海鲫鱼，外焦里嫩，铺满蒜蓉小米辣和香菜。配上乳扇沙拉和一碗豌豆粉，是古镇最地道的午餐。',
              tips: '火塘烤鱼现烤需要25分钟，可以先去四方街逛一圈再回来吃。人均45元，米饭管够。',
            },
            {
              time: '18:00',
              title: '马帮私房菜 · 老杨家',
              desc: '老杨是沙溪最后一支马帮的后人，他家院子只做一桌菜：火腿炖白云豆、酸菜炒牛肉、清炒野生菌、苦菜汤。食材都是当天从附近村子收来的。',
              tips: '老杨家每天只接待2桌（午/晚各一），需要提前一天预约。人均70元，可以自带一瓶酒。',
            },
          ],
        },
        {
          category: '穿', icon: CATEGORY_META['穿'].icon, label: CATEGORY_META['穿'].label,
          items: [
            {
              time: '全天',
              title: '高原古镇穿搭',
              desc: '沙溪海拔2100米，紫外线强但气温舒适，白天22°C左右。建议长袖棉麻衫+防晒外套，帽子墨镜必备。早晚温差大，需要一件薄针织或披肩。',
              tips: '古镇石板路凹凸不平，不要穿高跟鞋或薄底鞋。带一条围巾，晚上在院子里烤火时可以披上。',
            },
          ],
        },
        {
          category: '住', icon: CATEGORY_META['住'].icon, label: CATEGORY_META['住'].label,
          items: [
            {
              time: '14:00',
              title: '寺登街 · 马圈客栈',
              desc: '前身是茶马古道上的马帮驿站，二楼木屋保留了百年前的格局。院子里的枇杷树是清代种的，树下几张藤椅，抬头能看到玉津桥方向的炊烟。',
              tips: '推荐"马帮"房型，有独立小院和露天浴缸。周末价格480-680元，含白族传统早餐。',
            },
          ],
        },
      ],
    },
    {
      date: '2026-05-31',
      dayLabel: 'Day 2',
      weekday: '周日',
      categories: [
        {
          category: '吃', icon: CATEGORY_META['吃'].icon, label: CATEGORY_META['吃'].label,
          items: [
            {
              time: '07:30',
              title: '周五集市 · 稀豆粉+饵块',
              desc: '沙溪每周五有千年历史的古道集市（虽然叫周五但实际是每周五），附近村子的白族老乡会背着自家产的食材来赶集。一碗稀豆粉配现烤的饵块，5块钱就是完美早餐。',
              tips: '集市早上7点就开始了，中午12点收摊。建议先去吃早点再逛，空着肚子看什么都想吃。',
            },
            {
              time: '12:30',
              title: '白族庭院 · 三坊一照壁',
              desc: '藏在北龙村的白族老宅里的私房菜，院子正对苍山。招牌菜是酸辣鱼（用自家腌的木瓜醋）、雕梅扣肉、和一道只有夏天才有的"菌子开会"——当天从山上采到什么就做什么。',
              tips: '需要提前一天电话预订，老板不接临时客人。从寺登街走过去约15分钟。人均80元，建议4人以上去，可以多点几道菜。',
            },
          ],
        },
        {
          category: '穿', icon: CATEGORY_META['穿'].icon, label: CATEGORY_META['穿'].label,
          items: [
            {
              time: '全天',
              title: '山间徒步穿搭',
              desc: '第二天如果去石宝山或白族村落徒步，建议穿着户外速干衣裤，背一个小背包。山中湿度大，上午草叶上露水多，裤脚容易湿。',
              tips: '石宝山石窟需爬约400级台阶，建议带登山杖或路边捡根树枝。山泉可以直饮，带个水壶即可。',
            },
          ],
        },
        {
          category: '住', icon: CATEGORY_META['住'].icon, label: CATEGORY_META['住'].label,
          items: [
            {
              time: '全天',
              title: '续住马圈客栈',
              desc: '建议同一家民宿住两晚，不用收拾行李。第二天傍晚可以在院子里跟主人学做乳扇，从挤牛奶到晾晒，全过程大约2小时。',
              tips: '乳扇制作体验需要提前跟主人约，费用约60元/人（含材料）。做好的乳扇可以带走。',
            },
          ],
        },
        {
          category: '行', icon: CATEGORY_META['行'].icon, label: CATEGORY_META['行'].label,
          items: [
            {
              time: '15:00',
              title: '返程经洱源，泡一次温泉再走',
              desc: '离开沙溪回大理的路上，在洱源牛街停下来泡个温泉。牛街是滇西有名的地热之乡，路边很多温泉客栈，20元就能泡一个小时的硫磺温泉，洗完一身轻松。',
              tips: '推荐"下山口温泉"，水最干净。记得带泳衣和毛巾。泡完温泉喝一瓶大理酸奶，完美收尾。',
            },
          ],
        },
      ],
    },
  ],
}

/* ─── Plan: 景德镇 ─── */

const PLAN_JINGDEZHEN: TravelPlan = {
  title: '景德镇 · 泥与火的三日匠人之旅',
  subtitle: '在手艺人的千年瓷都，用双手触摸泥土的温度',
  days: [
    {
      date: '2026-05-30',
      dayLabel: 'Day 1',
      weekday: '周六',
      categories: [
        {
          category: '行', icon: CATEGORY_META['行'].icon, label: CATEGORY_META['行'].label,
          items: [
            {
              time: '08:00',
              title: '高铁直达景德镇北站',
              desc: '从杭州/上海/南昌出发均有高铁直达景德镇北站。杭州出发约3h，上海出发约3.5h。到站后打车到市区约20分钟，费用25元左右。',
              tips: '景德镇北站是新区，出站后建议直接叫网约车，出租车站排队较慢。市区内景点之间打车基本10-15元。',
            },
          ],
        },
        {
          category: '吃', icon: CATEGORY_META['吃'].icon, label: CATEGORY_META['吃'].label,
          items: [
            {
              time: '12:00',
              title: '老瓷厂食堂 · 窑工饭',
              desc: '在雕塑瓷厂旁的巷子里，一家由老瓷厂食堂改的餐厅。招牌"窑工三碗"——辣椒炒肉、瓷泥煨鸡、景德板鸭，配一碗瓦罐汤。米饭是用窑温余热蒸的，粒粒分明。',
              tips: '中午11:30开饭，12:30之后招牌菜基本卖完。人均35元，便宜又扎实。进门先找座，再去窗口点菜。',
            },
            {
              time: '18:30',
              title: '陶溪川夜市 · 冷粉+碱水粑',
              desc: '陶溪川创意园区到了晚上变身美食夜市。景德镇冷粉是必吃的——米粉冰镇后拌上剁椒、花生碎、萝卜干和秘制酱汁，配一份煎得焦脆的碱水粑，是逛完市集最好的收尾。',
              tips: '陶溪川夜市周五-周日才有，18:00开始。冷粉推荐"老张冷粉"摊，在园区最里面那排。人均20元。',
            },
          ],
        },
        {
          category: '穿', icon: CATEGORY_META['穿'].icon, label: CATEGORY_META['穿'].label,
          items: [
            {
              time: '全天',
              title: '手作体验穿搭',
              desc: '景德镇5月底气温25-30°C，湿热。做陶艺会沾水和泥，建议穿深色T恤+宽松长裤，鞋子选好洗的运动鞋。女生建议把头发扎起来，不然拉坯时头发会垂到泥里。',
              tips: '陶艺工作室会提供围裙，但袖口还是会脏。带一件换洗的上衣，做完了可以换上干净的逛夜市。',
            },
          ],
        },
        {
          category: '住', icon: CATEGORY_META['住'].icon, label: CATEGORY_META['住'].label,
          items: [
            {
              time: '14:00',
              title: '三宝村 · 泥与火民宿',
              desc: '三宝国际瓷谷里的一家陶艺主题民宿，每个房间配有一个小拉坯机和一筐泥。主人是景漂了十年的陶艺家，客厅里展示着他和住客们的作品。院子里的窑每个月开一次。',
              tips: '三宝村离市区约15分钟车程，环境清幽但吃饭选择少。建议住一晚体验即可，另一晚可以换到市区的酒店。价格380-580元/晚。',
            },
          ],
        },
      ],
    },
    {
      date: '2026-05-31',
      dayLabel: 'Day 2',
      weekday: '周日',
      categories: [
        {
          category: '吃', icon: CATEGORY_META['吃'].icon, label: CATEGORY_META['吃'].label,
          items: [
            {
              time: '08:00',
              title: '抚州弄 · 油条包麻糍',
              desc: '抚州弄是景德镇最老的小吃街。刚出锅的油条裹着手打麻糍，外酥里糯，撒上芝麻和白糖。配一碗豆浆或是当地的浮梁茶，是瓷都人最日常的早餐。',
              tips: '抚州弄早上7点就热闹了，油条包麻糍最出名的那家叫"老徐家"，经常排队。人均8-12元。',
            },
            {
              time: '12:00',
              title: '古窑旁 · 窑火煨汤馆',
              desc: '古窑民俗博览区旁边一家不起眼的小馆子，专门做瓦罐煨汤。土鸡菌菇汤在窑温余热里煨了六个小时，汤清味浓。必点瓷泥煨鸡——用瓷土包裹整鸡慢慢煨熟，敲开泥壳时香气扑鼻。',
              tips: '煨汤要等20分钟，建议先点汤再看菜单。瓷泥煨鸡需提前1小时预订，电话可问住宿管家。人均55元。',
            },
          ],
        },
        {
          category: '穿', icon: CATEGORY_META['穿'].icon, label: CATEGORY_META['穿'].label,
          items: [
            {
              time: '全天',
              title: '逛市集穿搭',
              desc: '如果遇到周六上午的乐天创意市集或周日上午的明清园鬼市，建议穿轻便好走的衣服。鬼市在户外，夏天上午已经很热了。带一把遮阳伞和一顶渔夫帽。',
              tips: '乐天集市（周六上午）和鬼市（周日上午）是景德镇两大不能错过的市集，建议各留2-3小时逛。穿得舒服比穿得好看重要。',
            },
          ],
        },
        {
          category: '住', icon: CATEGORY_META['住'].icon, label: CATEGORY_META['住'].label,
          items: [
            {
              time: '15:00',
              title: '陶溪川 · 国贸饭店（陶溪川店）',
              desc: '第二晚换到陶溪川园区内的酒店，下楼就是夜市和美术馆。价格比民宿贵一些，但位置无敌，晚上逛完夜市走两分钟就回到房间。房间设计融入了青花瓷元素。',
              tips: '周末房源紧，需要提前一周预订。选高层房间可以看到整个陶溪川的夜景。价格680-980元/晚。',
            },
          ],
        },
        {
          category: '行', icon: CATEGORY_META['行'].icon, label: CATEGORY_META['行'].label,
          items: [
            {
              time: '17:00',
              title: '返程提醒',
              desc: '景德镇北站高铁最晚一班约20:00出发。如果买了陶器和瓷器（很难忍住不买），建议出发前在陶溪川门口的快递点打包寄走，大件瓷器手提上高铁很不方便。',
              tips: '快递点每天17:00前收件当天发出。易碎物品他们会帮忙用气泡膜和木架打包，费用约30-80元。',
            },
          ],
        },
      ],
    },
  ],
}

/* ─── Generic Plan: 通用乡村周末 ─── */

const PLAN_GENERIC: TravelPlan = {
  title: '乡村周末慢生活提案',
  subtitle: '放下手机，去附近的山野里过一个有温度的周末',
  days: [
    {
      date: '2026-05-30',
      dayLabel: 'Day 1',
      weekday: '周六',
      categories: [
        {
          category: '行', icon: CATEGORY_META['行'].icon, label: CATEGORY_META['行'].label,
          items: [
            {
              time: '09:00',
              title: '从城市出发，1-2小时到达目的地',
              desc: '选择一个距离城市1-2小时车程的乡村目的地，不远不近刚刚好——足够离开日常的半径，又不会在路上消耗太多精力。建议走国道或省道，沿途风景本身就是旅行的开始。',
              tips: '出发前检查胎压和油量/电量。乡村加油站间距较大，建议出发前加满。带上车载手机支架，乡村道路导航信号偶有延迟。',
            },
          ],
        },
        {
          category: '吃', icon: CATEGORY_META['吃'].icon, label: CATEGORY_META['吃'].label,
          items: [
            {
              time: '12:00',
              title: '村口农家菜 · 用胃感受一个地方',
              desc: '乡村的第一顿午饭，建议去村里人常去的农家菜馆。点菜原则：问老板"今天什么最新鲜"比看菜单靠谱。时令蔬菜、当天宰的鸡、河里现捞的鱼——这些是城市里永远吃不到的原味。',
              tips: '乡村饭馆很多没有菜单，进厨房看菜点菜更有趣。人均40-60元基本能吃得很好了。大胆问老板推荐，他们最知道什么好吃。',
            },
            {
              time: '18:00',
              title: '在地特色晚餐 · 围炉而坐',
              desc: '晚餐推荐选择民宿主人推荐的本地馆子。很多乡村民宿自己也提供晚餐，主人下厨做几道家常菜，住客们围坐一桌，边吃边聊。这往往是整个行程中最温暖的时刻。',
              tips: '如果民宿提供晚餐，建议预订时一并预约。通常50-80元/人，含3-4道菜+汤。有时主人会拿出自家酿的果酒分享。',
            },
          ],
        },
        {
          category: '穿', icon: CATEGORY_META['穿'].icon, label: CATEGORY_META['穿'].label,
          items: [
            {
              time: '全天',
              title: '舒适自在是乡村穿搭的第一原则',
              desc: '初夏乡村早晚温差大（约8-10°C），建议"叠穿法"：纯棉T恤+薄衬衫+可收纳的防风外套。鞋子选防滑运动鞋或徒步鞋，凉鞋只适合在民宿院子穿。',
              tips: '必备小物：驱蚊液（乡村蚊虫多）、遮阳帽（农田旁几乎没有遮挡）、防晒霜、一个小背包（方便短途散步时带水）。',
            },
          ],
        },
        {
          category: '住', icon: CATEGORY_META['住'].icon, label: CATEGORY_META['住'].label,
          items: [
            {
              time: '14:00',
              title: '选一间有故事的院子住下来',
              desc: '乡村住宿首推老宅改建的民宿——夯土墙、木梁结构、天井小院，比标准化酒店更有温度。入住后别急着出门，先在院子里坐一会儿，听听风声和鸟叫，让身体从城市节奏里慢下来。',
              tips: '预订前在App上看真实住客评价中的图片（不要只看精修图）。确认热水和WiFi情况。周末房源建议提前3-5天预订，价格通常300-800元/晚。',
            },
          ],
        },
      ],
    },
    {
      date: '2026-05-31',
      dayLabel: 'Day 2',
      weekday: '周日',
      categories: [
        {
          category: '吃', icon: CATEGORY_META['吃'].icon, label: CATEGORY_META['吃'].label,
          items: [
            {
              time: '08:00',
              title: '民宿早餐 · 慢下来的早晨',
              desc: '乡村民宿的早餐通常比五星级酒店更让人难忘——现磨的豆浆、土鸡蛋煎的荷包蛋、自家腌的小菜、刚从地里摘的蔬菜。坐在院子里，听着鸟叫，看着远山吃早餐。',
              tips: '早餐时间建议问好民宿主人，农家早餐一般7:30-9:00。如果起得早，可以先在村里散个步再回来吃。',
            },
            {
              time: '12:30',
              title: '寻找隐藏的美食小店',
              desc: '第二天中午，可以开车去隔壁村子探索一下。每个地方都有一些"本地人才知道"的小馆子——可能没有招牌，可能只做一两个菜，但味道能让所有网红店汗颜。问问民宿主人或路边晒太阳的老人，他们会告诉你。',
              tips: '"你们平时去哪家吃饭？"这句话比"附近有什么好吃的餐厅"更容易得到真实答案。带上现金，很多乡村小店不支持扫码支付。',
            },
          ],
        },
        {
          category: '穿', icon: CATEGORY_META['穿'].icon, label: CATEGORY_META['穿'].label,
          items: [
            {
              time: '全天',
              title: '活动穿搭 · 看天气选衣服',
              desc: '第二天的穿搭取决于你计划的活动。田间散步/采摘：长袖长裤（防晒防虫）+ 运动鞋。河边/溪边：速干短裤+溯溪鞋。逛古镇/市集：棉麻宽松款+好走的平底鞋。',
              tips: '无论什么活动，都建议多带一双袜子。走在田埂或溪边容易弄湿鞋袜，干爽的袜子能拯救剩下的半天。',
            },
          ],
        },
        {
          category: '住', icon: CATEGORY_META['住'].icon, label: CATEGORY_META['住'].label,
          items: [
            {
              time: '——',
              title: '同家民宿续住，省去搬行李的麻烦',
              desc: '两晚住同一家民宿更从容——不用收拾行李、不用赶check-out时间、还能和主人多聊聊。很多民宿连住两晚有折扣，提前问一下。',
              tips: 'check-out通常是12:00-14:00，如果不续住可以跟主人商量把行李寄存在前台，下午回来取。',
            },
          ],
        },
        {
          category: '行', icon: CATEGORY_META['行'].icon, label: CATEGORY_META['行'].label,
          items: [
            {
              time: '16:00',
              title: '带着满足回家，不走回头路',
              desc: '如果时间允许，返程建议选一条与来时不同的路。可能多花20分钟，但能看到不一样的风景。经过小镇可以停下来买点当地特产——笋干、蜂蜜、土鸡蛋，比景区纪念品更有意义。',
              tips: '建议16:00前出发，避开周日晚高峰进城。回家路上可以提前在App上叫一份外卖，到家时它刚好送到——从乡村模式温柔过渡回城市。',
            },
          ],
        },
      ],
    },
  ],
}

/* ─── Plan resolver ─── */

export function getTravelPlan(query: string, userLocation?: string): TravelPlan {
  const q = query.toLowerCase()
  const loc = userLocation?.toLowerCase() || ''

  if (/桐庐|富春江|杭州/.test(q) || /桐庐|杭州/.test(loc)) {
    return PLAN_TONGLU
  }
  if (/沙溪|大理|云南/.test(q) || /沙溪|大理|云南/.test(loc)) {
    return PLAN_SHAXI
  }
  if (/景德镇|陶艺|陶瓷|瓷/.test(q) || /景德镇|江西/.test(loc)) {
    return PLAN_JINGDEZHEN
  }

  // Default to generic with query-customized title
  return {
    ...PLAN_GENERIC,
    title: query ? `${query} · 你的专属周末方案` : PLAN_GENERIC.title,
  }
}

/* ─── Loading messages ─── */

export const LOADING_MESSAGES = [
  '正在翻阅当地的四季物候，了解这个季节最美的打开方式…',
  '在向在地的老人家打听，哪些馆子是本地人私藏的…',
  '正和民宿主人聊着，问这周末还有没有带院子的房间…',
  '在整理几条不大众的路线，避开人流，只走心动的小径…',
  '正在挑选适合这个季节的活动，有些得看天气和时令…',
  '在向做过这条线的旅人取经，看哪里值得多待一会儿…',
  '差不多了，帮你在吃穿住行之间，串起一条不急不赶的路…',
]
