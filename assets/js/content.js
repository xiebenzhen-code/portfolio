/* ════════════════════════════════════════════
   全站文案与数据：改文字、换图只改这个文件
   ════════════════════════════════════════════ */
window.SITE = {
  name: 'Benzhen',
  nameZh: '本真',                       // 中文名，可改
  domain: 'benzhenlab.com',
  roles: ['AI 应用产品', 'Agent 工作流设计', 'AI 视觉设计'],

  /* 开场页 */
  splash: {
    title: ['把想法，', '做成会运行的东西。'],
    images: ['assets/img/msg-street.jpg', 'assets/img/peace-road.jpg', 'assets/img/msg-tavern.jpg', 'assets/img/peace-flower.jpg'],
    enter: '进入作品集'
  },

  /* 首屏 */
  hero: {
    image: 'assets/img/msg-street.jpg',
    title: ['让 AI 真正干活，', '也让画面真正说话。'],
    sub: '我做 AI 应用和 Agent 工作流，也用 AI 做影像与视觉设计。从定义问题到上线验收，从剧本到最后一帧画面。',
    primary: ['查看项目', '#projects'],
    secondary: ['联系我', '#contact']
  },

  /* 个人经历 */
  about: {
    photo: '',                          // 头像路径，例如 'assets/img/avatar.jpg'；留空显示占位
    title: '从片场走到 AI',
    text: [
      '我学电影出身，在剧组里做过编剧、导演、执行等多个岗位，拍过短片和短剧，也写长篇小说。',
      '这段经历让我习惯从具体的人和具体的问题出发。现在我把它用在 AI 上：定义问题、拆解流程、设计 Agent 工作流，调度多个 AI 完成实现，再一项一项验收到上线。同时用 AI 做角色、场景和镜头，完成影像项目。'
    ],
    contact: [
      /* 邮箱不写在这里：改最下方 contact.email，关于区与页尾会一起更新 */
      ['GitHub', 'xiebenzhen-code', 'https://github.com/xiebenzhen-code'],
      ['微信', 'L03240322', '']
    ],
    stats: [
      ['2', '个', 'AI 产品已上线 / 开源'],
      ['948', '项', '自动化测试通过（Signal Map）'],
      ['4', '部', '原创影像项目'],
      ['2', '部', '长篇小说']
    ]
  },

  /* 精选项目
     cover: 封面图；没有截图的 AI 项目用 arch（真实架构）绘制封面
     body 可用块：{h} {p:[]} {list:[]} {img,cap} {pair:[[src,cap],…],frame} {phones:[[src,cap],…]} {flow:[[阶段,…],…],note} {video,cap,poster} {videos:[…]}
       pair  两列并排；界面截图加 frame:true 会有圆角和细边（照片不要加）
       phones 手机截图一排 4 个，等高、底部裁切，手机上变两列
       video 三种填法，按地址自动选播放方式：
         1) .mp4/.webm/.mov 直链 → 原生播放器，不自动播放，先显示 poster
         2) B 站 / YouTube 播放器地址 → 嵌 iframe（B 站要带 autoplay=0，否则一进详情就出声）
         3) 抖音链接 → 封面 + 播放钮，点击去抖音看（抖音不能内嵌，硬嵌会黑屏）
       例：{ video: 'assets/video/undelivered.mp4', poster: 'assets/img/msg-street.jpg', cap: '成片片段' }
       例：{ video: 'https://player.bilibili.com/player.html?bvid=BV1xx411c7XX&autoplay=0', cap: '成片' }
       例：{ video: 'https://v.douyin.com/xxxxxxx/', poster: 'assets/img/msg-street.jpg', cap: '成片片段' }
       poster 可省：省掉时用该项目的 cover 当封面。

       要挂多条视频：把 {video:…} 写成一个 {videos:[{…},{…}]}，会排成两列（手机上单列）。
       一条视频一个块也行，但会上下堆成两个大 16:9，不如 videos 紧凑。
       例：{ videos: [
              { video: 'assets/video/a.mp4', cap: '成片' },
              { video: 'https://v.douyin.com/xxxxxxx/', cap: '花絮 · 抖音' }
            ] }
       视频文件放 assets/video/ 就用相对路径；放 B 站 / 对象存储 / CloudBase 存储就用完整 https 地址，
       后者不占站点体积，换视频不用重新发布整站。 */
  projects: [
    {
      id: 'signal-map', kind: 'AI 应用', title: 'Signal Map',
      line: '信息研究 Agent：把每天涌进来的信息筛掉大半，只留下帮你做判断、而且查得到出处的部分。',
      tags: ['研究 Agent', '检索与证据', '已上线'],
      arch: ['信息源', '抓取清洗', '相关性过滤', '资料库与记忆', '研究 Agent', '网页端'],
      facts: [['角色', '产品定义、规格、Agent 流程设计、验收'], ['形式', '网页端信息研究工具'], ['测试', '948 项自动化测试通过']],
      body: [
        { h: '要解决的问题' },
        { p: ['每天能看到的行业信息远多于一个人需要的。多数工具推得更多、总结得更快，结果是看得更多，判断并没有更好。', 'Signal Map 的目标是让人少看：只留下跟你关心的问题有关、而且查得到出处的信息，并记住你长期在看什么。'] },
        { h: '系统架构' },
        { flow: [
          ['信息源', '36氪、极客公园、海外源', '自建 RSSHub 网关'],
          ['抓取与清洗', '列表与详情抓取', '抓取安全校验'],
          ['相关性过滤', '只留相关内容', '去重'],
          ['资料库与记忆', '资料库', '长期记忆'],
          ['研究 Agent', '检索证据', '生成带出处的结论'],
          ['网页端', '提问', '查看结论与来源']
        ], note: '数据从左到右流动，每个结论都能追溯到原始来源。' },
        { h: '关键决定' },
        { list: [
          '结论必须带出处，查不到来源的内容不进结论。',
          '国内源和海外源都保留；自建 RSSHub，放在带鉴权的 HTTPS 网关后面。',
          '超大网页截断后继续处理，而不是整条丢弃。',
          '镜像由 GitHub Actions 构建推送，再按镜像部署。',
          '上线前分阶段验收：先做免费预检，付费的端到端测试只在最后跑一次。'
        ] }
      ],
      links: [['查看代码', 'https://github.com/xiebenzhen-code/signal-map']]
    },
    {
      id: 'privatebot', kind: 'AI Agent', title: 'PrivateBot',
      line: '多 Agent 工作台：一个地方给多个 AI 派活、审批有风险的操作、查看结果。',
      tags: ['多 Agent 调度', '沙箱执行', '已开源'],
      cover: 'assets/img/pb-desk-dark.jpg',
      coverPos: '50% 0',
      facts: [['角色', '产品与交互设计、规格、调度实现、验收'], ['形式', '个人 AI 工作台'], ['版本', 'v0.1.0 已开源']],
      body: [
        { h: '要解决的问题' },
        { p: ['同时使用 Claude、Codex、WorkBuddy 等多个 coding agent 时，人会变成中间的传话人：把一个的结果复制给另一个，再回来挨个确认。', 'PrivateBot 让几个 AI 自己把活干下去，有风险的操作停下来等人审批；派活和看结果都在同一个地方。'] },
        { h: '系统架构' },
        { flow: [
          ['入口', '网页端', '手机聊天入口'],
          ['调度', '判断任务难度', '分配执行者与审查者'],
          ['执行', 'Claude Code / Codex / WorkBuddy', '沙箱内运行'],
          ['审查', '换一个模型审查', '给出修改意见'],
          ['审批', '规则自动放行', '模型代审', '人工确认'],
          ['结果', '任务记录', '完整接力过程']
        ], note: '每个任务的执行者、审查者和审批记录都留在同一条线程里。' },
        { h: '看它怎么跑' },
        { video: 'assets/video/privatebot.mp4', poster: 'assets/img/privatebot-poster.jpg',
          cap: '30 秒宣传片。纸板定格的做法：文件、对话和终端被送进格子，由它自己跑完流程，你只在需要决定的时候出现。' },
        { h: '界面' },
        { p: ['左边永远是队列，右边永远是同一条线程：谁在做、谁审过、改到第几轮，都在原地，不用来回翻。深色是默认，浅色给白天强光下的屏幕。'] },
        { pair: [
          ['assets/img/pb-desk-dark.jpg', '工作台 · 深色。左边队列不动，右边展开这条任务完整的接力过程'],
          ['assets/img/pb-desk-light.jpg', '同一屏的浅色版本。只换明暗，信息层级完全一致']
        ], frame: true },
        { pair: [
          ['assets/img/pb-crew-dark.jpg', '执行者席位：工作台现在认识 8 个执行者，各带角色和状态点'],
          ['assets/img/pb-crew-light.jpg', '浅色下的同一页。席位可以加，也可以按任务临时指定']
        ], frame: true },
        { phones: [
          ['assets/img/pb-phone-home-dark.jpg', '深色 · 队列'],
          ['assets/img/pb-phone-thread-dark.jpg', '深色 · 线程'],
          ['assets/img/pb-phone-home-light.jpg', '浅色 · 队列'],
          ['assets/img/pb-phone-thread-light.jpg', '浅色 · 线程']
        ] },
        { p: ['手机上只留两件事：派活和审批。截图里是同一条任务的手机视图，和桌面共用同一份线程记录。'] },
        { h: '关键决定' },
        { list: [
          '调度由可配置的大模型判断：不同模型擅长的不一样，谁做谁审不写死。',
          '审批分三层：规则能判的自动过，模型能判的代审，剩下的才找人。',
          '执行放进沙箱，出网走白名单代理，密钥不进执行环境。',
          '行业功能做成可装卸的扩展包，关掉后数据保留。'
        ] }
      ],
      links: [['查看代码', 'https://github.com/xiebenzhen-code/privatebot']]
    },
    {
      id: 'undelivered', kind: 'AI 视觉', title: '未送达的消息',
      line: '风格化 3D 动画短片。没被收到的消息成了货物，被小工人装车运走，最后堆成一座塔。',
      tags: ['世界观', '角色设定', '场景设计'],
      cover: 'assets/img/msg-tavern.jpg',
      facts: [['角色', '编剧、世界观、角色与场景设定、AI 影像生成'], ['形式', '风格化 3D 动画短片']],
      body: [
        { h: '故事' },
        { p: ['人发出去却没有被收到的消息，在这个世界里是有重量、有体积的货物。一群很小的工人负责把它们压缩、装车、运走。消息越堆越高，最后成了一座塔。'] },
        { img: 'assets/img/msg-street.jpg', cap: '街角，夜。室外冷青灰，室内暖黄，这是全片的冷暖规则。' },
        { h: '角色' },
        { img: 'assets/img/msg-047.jpg', cap: '047 号工人三视图。补丁、胶带和工具带都对应他每天要做的动作。' },
        { h: '场景' },
        { p: ['所有场景用同一套材料：旧铁皮、起皮的漆面、木地板、铜把手。颜色只有蓝绿和暖黄两组，靠灯光区分室内外。'] },
        { pair: [['assets/img/msg-tavern.jpg', '酒馆内景'], ['assets/img/msg-hall.jpg', '走廊']] },
        { pair: [['assets/img/msg-doors.jpg', '通往电梯的门'], ['assets/img/msg-lift.jpg', '电梯']] }
      ]
    },
    {
      id: 'before-peace', kind: 'AI 视觉', title: '和平之前',
      line: '历史现实主义短片。一个普通士兵，走在一段他改变不了的历史里。',
      tags: ['角色一致性', '镜头规划', '历史考据'],
      cover: 'assets/img/peace-road.jpg',
      facts: [['角色', '编剧、角色与场景设定、镜头规划、AI 影像生成'], ['形式', '历史现实主义短片']],
      body: [
        { h: '故事' },
        { p: ['主角周青山是个普通士兵。片子不拍壮烈的场面，只跟着他走过村庄、学校和田地，看他怎么担下属于自己的那份损失。'] },
        { img: 'assets/img/peace-road.jpg', cap: '同一个人、同一件棉衣、同一条土路，跨镜头保持一致。' },
        { pair: [['assets/img/peace-flower.jpg', '送行'], ['assets/img/peace-tree.jpg', '换景别，人物不变']] },
        { h: '视觉规则' },
        { p: ['颜色从材料里来：干土、枯秆、旧砖、褪色的棉布，全片只有很少几处红色。光只用天光、油灯和火光，不打英雄逆光。'] }
      ]
    },
    {
      id: 'pixiu', kind: '实拍 · 短片', title: '貔貅',
      line: '实拍短片。10 分 55 秒，整片在 B 站。',
      tags: ['实拍', '短片', '完整成片'],
      cover: 'assets/img/pixiu-cover.jpg',
      wide: true,                       // 2.35:1 的电影画面，正好贴合 21:9 的横卡
      facts: [['形式', '实拍短片'], ['职责', '制片、演员、灯光'], ['时长', '10 分 55 秒']],
      /* TODO 待补（发我我写进去，替换掉下面临时的一句）：
         1. 一句话介绍，替换上面的 line
         2. 缘起或拍摄难点，两三段，放在视频前面或后面
         3. 想加剧照就发图，命名 pixiu-01.jpg 放进 assets/img/ */
      body: [
        { video: 'https://www.bilibili.com/video/BV14DWC6hESZ/',
          poster: 'assets/img/pixiu-cover.jpg',
          cap: '全片 10 分 55 秒，点击封面去 B 站观看。', label: '在 B 站观看全片' }
      ],
      links: [['在 B 站看原片', 'https://www.bilibili.com/video/BV14DWC6hESZ/']]
    },
    {
      id: 'jiayu', kind: '实拍 · 短片', title: '甲鱼',
      line: '实拍短片。28 分 12 秒，整片在 B 站。',
      tags: ['实拍', '短片', '完整成片'],
      cover: 'assets/img/jiayu-cover.jpg',
      wide: true,                       // 和《貔貅》一样是 16:9 满画幅，走横卡
      facts: [['形式', '实拍短片'], ['职责', '制片、演员、灯光'], ['时长', '28 分 12 秒']],
      /* TODO 待补（和《貔貅》一起发我，我写进去）：
         1. 一句话介绍，替换上面的 line
         2. 缘起或拍摄难点
         3. 剧照：命名 jiayu-01.jpg 放进 assets/img/ */
      body: [
        { video: 'https://www.bilibili.com/video/BV16vsG6PEht/',
          poster: 'assets/img/jiayu-cover.jpg',
          cap: '全片 28 分 12 秒，点击封面去 B 站观看。', label: '在 B 站观看全片' }
      ],
      links: [['在 B 站看原片', 'https://www.bilibili.com/video/BV16vsG6PEht/']]
    },
    {
      id: 'dream-knock', kind: '影像 · 短剧', title: '当梦想来敲门',
      line: '短剧合集，在抖音连载。',
      tags: ['短剧', '连载合集', '抖音'],
      wide: true,                       // 压轴项目，封面横跨两栏
      facts: [['形式', '短剧合集，抖音连载'], ['平台', '抖音']],
      /* TODO 待补（能补的都发我，我写进去）：
         1. 一句话介绍，替换上面的 line
         2. 你的职责：编剧 / 导演 / 制作 中的哪几项
         3. 一张剧照（截图也行），命名 assets/img/dream-01.jpg 放进 assets/img/
         4. 想讲的话：缘起、拍法、或某一集的难点
         补齐后把 cover 加上：cover: 'assets/img/dream-01.jpg' */
      body: [
        { video: 'https://v.douyin.com/hvldNOiTPmc/', cap: '抖音合集，点击在抖音中打开', label: '在抖音观看合集' }
      ]
    }
  ],

  /* 个人优势：擅长 / 做法 / 解决 */
  strengths: [
    { title: 'AI Agent 工作流设计',
      good: '把一件复杂的事拆成多个 Agent 协作的流程：谁执行、谁审查、什么时候需要人确认。',
      how: '先画清楚流程和权限边界，再落到调度、沙箱和审批规则上。',
      solve: '让 AI 从"能回答"变成"能把活干完"，同时风险可控。' },
    { title: 'AI 应用从 0 到上线',
      good: '定义问题、写产品规格、调度多个 coding agent 实现，并负责验收。',
      how: '分阶段推进，每一步都有可验证的结果；先免费预检，再做成本最高的端到端测试。',
      solve: '想法很多但落不了地、做出来没人验收的问题。' },
    { title: 'AI 视觉与影像',
      good: '用 AI 完成角色、场景和镜头，保持跨画面的人物与风格一致。',
      how: '先定色彩、材质、光线和镜头规则，再让每一张画面守住规则。',
      solve: 'AI 出图好看但不成体系、角色前后不一致的问题。' },
    { title: '叙事与表达',
      good: '编剧和小说训练出来的结构感，能把产品和项目讲清楚。',
      how: '从具体的人、具体的场景出发，而不是从概念出发。',
      solve: '产品说不清价值、项目展示没人看懂的问题。' }
  ],

  /* 页尾 */
  contact: {
    title: ['有一个想法，', '想把它做成能用的东西？'],
    text: '欢迎聊 AI 应用、Agent 工作流和 AI 视觉相关的工作与合作。',
    email: 'xiebenzhen@gmail.com'
  }
};
