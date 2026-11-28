import { cvUrl } from '../lib/cv';
export type Locale = 'en' | 'zh';
export const identity = {
  name: 'Shay Chen', chineseName: '陈乐涵', email: 'shay04817@gmail.com',
  phones: [
    { country:'be', number:'+32 456 77 71 45', en:'Belgium', zh:'比利时' },
    { country:'cn', number:'+86 18701126817', en:'China', zh:'中国' }
  ] as const,
  linkedin: 'https://www.linkedin.com/in/shay-chen-a3a1592b4/', github: 'https://github.com/ShayChen817', knoqs: 'https://knoqs.com/',
  cv: cvUrl, band: 'http://slow-erosion.asia/', updated: '2026-11-29'
};
export const chapters = ['abstract', 'engineering', 'works', 'recognition', 'art', 'notes', 'toolkit', 'contact'] as const;
export const employers = {
  Sweco: { url:'https://www.swecogroup.com/', logo:'sweco-logo.png', color:'#c6b37c' },
  DataCamp: { url:'https://www.datacamp.com/', logo:'datacamp-logo.svg', color:'#03EF62' },
  KNOQS: { url:'https://knoqs.com/', logo:'knoqs-logo.png', color:'#58b395' }
} as const;
export const copy = {
  en: {
    lang: 'en', other: 'zh', title: 'Shay Chen — Engineering & Music', description: 'Shay Chen / 陈乐涵. Engineer working across electronics, software and AI, guitarist, and Art & Design Director of Slow Erosion. Based in Leuven, Belgium.',
    skip: 'Skip to content', index: 'Index', close: 'Close index', contents: 'A table of contents', journal: 'A journal printed in ink', edition: 'Selected work · 2025—2026',
    role: 'Engineer · Guitarist', location: 'From Beijing · Based in Leuven, Belgium', scroll: 'Scroll to read',
    nav: ['Abstract · About', 'Engineering', 'Selected works', 'Recognition', 'Music & art direction', 'Field notes', 'Toolkit', 'Correspondence · Contact'],
    cv: 'Download CV (PDF)', view: 'View CV', email: 'Email', phone: 'Telephone',
    abstractTitle: 'Precision in the system.\nFeeling in the details.',
    abstract: "I'm Shay — 陈乐涵.\n\nAn engineer working at the intersection of electronics, software, and AI, currently studying Engineering Technology (Electronics & ICT) at KU Leuven.\n\nI build systems meant to exist beyond the prototype — from backend infrastructure and multi-tenant platforms to AI-powered workflows. I'm drawn to problems that demand both technical depth and independent judgment, and I care as much about why something is built as how it works.\n\nOutside engineering, I'm a guitarist and the art & design director of Slow Erosion, where I explore the visual identity of music.\n\nI have a soft spot for thoughtful engineering, unconventional ideas, and things made with intention.",
    abstractMargin: 'Two practices.\nOne way of seeing.', portraitAlt: 'Shay Chen in a navy jacket against a deep blue studio background.', portraitCaption: 'Portrait · Leuven',
    engineeringTitle: 'Engineering', engineeringAbstract: 'Engineering roles I held while studying at KU Leuven.', engineeringMargin: 'Structure before spectacle.\nCare at every layer.',
    experience: [
      {company:'Sweco', arrangement:'Internship', role:'Product Engineer Intern', date:'Oct 2026 — present', place:'Leuven, Belgium', text:'Working on software product development in an engineering consultancy setting.', stack:'', note:''},
      {company:'DataCamp', arrangement:'Paid internship', role:'Full-Stack Engineer Intern', date:'Jul — Sep 2026', place:'Leuven, Belgium', text:'Built internal tools and dashboards with TypeScript and React, and used AWS services to support workflow automation.', stack:'TypeScript · React · AWS', note:''},
      {company:'KNOQS', arrangement:'Part-time contract', role:'Backend / AI Engineer', date:'Apr — Oct 2026', place:'Belgium', headline:'Building from Zero to One', text:'I was the main backend engineer at KNOQS from the first commit through production. I built the backend of an AI knowledge platform for European SMEs.\n\nWorking with the founding team, I connected enterprise data to AI workflows and carried features from their first design through deployment. I used LLM evaluations and added a verification gate that withheld answers without enough source evidence. I also set up, deployed and monitored the production environment myself.\n\nKNOQS was an opening chapter for me as an engineer. I learned to make decisions while the requirements were still taking shape, and to stay responsible for what happened after a feature shipped.', stack:'FastAPI · PostgreSQL · Docker · Coolify', note:'Further product details are under NDA.'}
    ], educationLabel:'Education', education: ['KU Leuven · Bachelor of Engineering Technology (ICT) · 2024—present'],
    worksTitle: 'Selected works', worksAbstract: 'Built, tested, put to work.', worksMargin: 'Three projects.\nSystems made tangible.', plate:'Project', detail:'Read project note', closeDetail:'Close project note', illustration:'Concept illustration',
    projects: [
      {id:'data', title:'Ask Your Data', year:'2026', category:'AI / DATA GOVERNANCE', summary:'From governance metadata to answers you can trace.', description:'A metadata-grounded assistant that turns Collibra governance data into traceable, context-aware SQL with Claude. A deterministic Pandas rule engine checks the numbers: 20 of 20 metric outputs verified.', stack:'Python · Flask · RAG · Collibra API · Databricks · Render', award:'Grand Prize, Collibra Track + Best Technical Award', context:'Next Level Challenge · Leuven · 300+ participants', citation:'Ask Your Data. Next Level Challenge Hackathon, Leuven.', link:'', alt:'Abstract branching data lineage in mineral blue ink, reflected in a pool.'},
      {id:'aqua', title:'Aqua Seal', year:'2025', category:'WEB3 / DIGITAL OWNERSHIP', summary:'A quiet mark. Verifiable ownership.', description:'Decentralised IP protection through invisible watermarks for images, audio and PDFs. A React / TypeScript frontend and FastAPI backend verify ownership against on-chain metadata using MetaMask, CAMP Network and Origin SDK.', stack:'FastAPI · React · TypeScript · Docker · CAMP Network', award:'Grand Prize, CAMP Network Track', context:'WAIB Summit Hackathon · Monaco', citation:'Aqua Seal. WAIB Summit Hackathon, Monaco.', link:'', alt:'Circular ink ripples with a faint geometric watermark at their centre.'},
      {id:'knoqs', title:'KNOQS', year:'2026', category:'BACKEND / KNOWLEDGE SYSTEMS', summary:'I led backend development for a multi-tenant AI knowledge platform, from the first commit to production.', description:'What makes an AI answer verifiable? In a knowledge system, hybrid retrieval can surface candidate passages, and the answer can cite the passages that support each claim.\n\nA verification gate checks those claims against the retrieved text before release. If the evidence is insufficient, the system withholds the answer. Evaluation should cover both outcomes: supported answers that pass and unsupported answers that are withheld.', stack:'Hybrid retrieval · LLM evaluation', award:'Backend / AI engineering · Apr–Oct 2026', context:'Belgium · Confidential under NDA', citation:'Chen, S. (2026). KNOQS. Backend / AI engineering, Belgium.', link:'', alt:'Separate translucent paper layers, suspended in a dark architectural composition.'}
    ], recognitionTitle:'Recognition', recognitionAbstract:'A few milestones along the way.',
    awards:[
      ['2026','Grand Prize + Best Technical Award','Next Level Challenge · Collibra Track / Overall'],
      ['2025','Grand Prize','WAIB Summit, Monaco · CAMP Network Track'],
      ['','Youth robotics competitions, Beijing','District champion and city-level prizes']
    ], artTitle:'Music & art direction', artAbstract:'The other side of the practice.', artRole:'Art & Design Director', artMargin:'Sound takes shape.\nA visual language for music.',
    earlyStage:'Early days, on stage', atticRole:'High-school band · Guitarist', atticText:'Performed with The Attic, my high-school band, for an audience of more than 500.', audience:'PEOPLE IN THE AUDIENCE',
    bandIntro:'Slow Erosion is a metalcore band from Wuhan, China, formed in 2023 by former members of DOPAINE. Its sound draws on the coldness of black metal, the vastness of post-rock and the haze of shoegaze — suspended between violence and dream, oppression and weightlessness.',
    artStatement:'I named the band Slow Erosion. The name speaks to the gradual wearing away of the self under systems, technology, capital and social order. It is the starting point for my art direction: a dark dream shaped around quiet dispossession, numbness and the slow loss of our capacity to resist. The end arrives as a low, prolonged sigh.', artCredit:'Naming & art direction / Shay Chen', bandAlt:'Shay Chen playing a white electric guitar in a rehearsal room.', bandCaption:'Rehearsal', bandVisit:'Visit Slow Erosion', bandFacts:'Wuhan, China · Formed in 2023 · Metalcore / black metal / post-rock / shoegaze',
    notesTitle:'Field notes', notesAbstract:'A little life, in the margins.', notesText:'A pause by the sea in Nice. A little distance from the screen. The work is better when life gets a say.', stageAlt:'Shay presenting Ask Your Data with a microphone at the Next Level Challenge.', stageCaption:'Next Level Challenge · Leuven · 2026', niceAlt:'Shay at a blue railing overlooking the sea and the Promenade des Anglais in Nice.', niceCaption:'Promenade des Anglais · Nice',
    toolkitTitle:'Toolkit', toolkitAbstract:'An index of things I work with.', skillLabels:['Daily toolkit', 'Also used'],
    contactTitle:'Correspondence · Contact', contactAbstract:'Good work begins with a conversation.', contactText:'Open to backend, AI and full-stack roles, and to art direction for music.', copy:'Copy email', copied:'Copied', copyFailed:'Please select and copy the email above.', contactMargin:'Based in Leuven.\nConnected elsewhere.', footerLine:'Build carefully.\nLeave a mark.', colophon:'Set in Instrument Serif, Newsreader, Noto Serif SC, LXGW WenKai & IBM Plex Mono. Built with Astro.', updated:'Last updated', top:'Back to the beginning',
  },
  zh: {
    lang:'zh-CN', other:'en', title:'陈乐涵 Shay Chen — 工程与音乐', description:'陈乐涵的个人期刊。电子工程、软件与 AI，吉他演奏与 Slow Erosion 乐队艺术指导。现居比利时鲁汶。',
    skip:'跳至正文', index:'目录', close:'关闭目录', contents:'本期目录', journal:'墨印的期刊', edition:'作品选集 · 2025—2026',
    role:'工程师 · 吉他手', location:'来自北京 · 现居比利时鲁汶', scroll:'向下阅读',
    nav:['摘要 · 关于我','工程实践','项目选集','荣誉','音乐与艺术指导','札记','工具索引','来信 · 联系方式'], cv:'下载简历（PDF）', view:'查看简历', email:'邮件', phone:'电话',
    abstractTitle:'系统里的精确。\n细节中的感受。', abstract:"我是 Shay，陈乐涵。\n\n电子与信息工程背景，目前就读于鲁汶大学，主要从事软件系统与人工智能相关的工程实践。\n\n比起停留在原型和概念，我更喜欢构建真正投入使用的系统。从后端架构、多租户平台到人工智能应用，我关心技术如何运作，也关心一个方案为什么值得被选择。\n\n工程之外，我是一名吉他手，也是 Slow Erosion 的艺术与设计总监，负责探索音乐在视觉上的表达。\n\n我偏爱有判断力的设计、非惯常的想法，以及那些经过认真思考才被创造出来的东西。", abstractMargin:'两种实践。\n同一种目光。', portraitAlt:'陈乐涵穿深蓝色外套，在蓝色背景前拍摄的肖像。', portraitCaption:'肖像 · 鲁汶',
    engineeringTitle:'工程实践', engineeringAbstract:'在鲁汶大学读本科期间的工程经历。', engineeringMargin:'先有结构，再有表达。\n每一层都值得认真。',
    experience:[
      {company:'Sweco',arrangement:'实习',role:'产品工程师实习生',date:'2026 年 10 月 — 至今',place:'比利时，鲁汶',text:'在工程咨询环境中参与软件产品开发。',stack:'',note:''},
      {company:'DataCamp',arrangement:'带薪实习',role:'全栈工程师实习生',date:'2026 年 7 — 9 月',place:'比利时，鲁汶',text:'使用 TypeScript 和 React 开发内部工具与看板，并借助 AWS 服务支持工作流程自动化。',stack:'TypeScript · React · AWS',note:''},
      {company:'KNOQS',arrangement:'兼职合同',role:'后端 / AI 工程师',date:'2026 年 4 月 — 10 月',place:'比利时',headline:'从零到一', text:'从第一次提交代码到平台上线，我一直是 KNOQS 的主要后端工程师。我负责为欧洲中小企业搭建 AI 知识平台的后端。\n\n我和创始团队一起把企业数据接入 AI 工作流，从最初的技术设计一直跟到功能上线。我通过 LLM 评测检查回答质量，并在交付前核验来源。证据不足时，系统会暂缓作答。生产环境也由我搭建、部署和监控。\n\n这段经历是我工程生涯的开篇。我学会了在需求还未明朗时做判断，也学会了在功能交付之后，继续为它的运行负责。', stack:'FastAPI · PostgreSQL · Docker · Coolify',note:'产品细节受保密协议约束。'}
    ],educationLabel:'教育',education:['鲁汶大学 · 工程技术学士（ICT）· 2024 至今'],
    worksTitle:'项目选集',worksAbstract:'构建、验证，让它真正工作。',worksMargin:'三个项目。\n把系统变成可见之物。',plate:'项目',detail:'阅读项目注记',closeDetail:'关闭项目注记',illustration:'概念配图',
    projects:[
      {id:'data',title:'Ask Your Data',year:'2026',category:'AI / 数据治理',summary:'从治理元数据，到可追溯的答案。',description:'以 Collibra 治理元数据为依据，借助 Claude 生成可追溯、懂上下文的 SQL；确定性的 Pandas 规则引擎负责校验，20 项指标输出全部通过验证。',stack:'Python · Flask · RAG · Collibra API · Databricks · Render',award:'Collibra 赛道总冠军 + 全场最佳技术奖',context:'Next Level Challenge · 鲁汶 · 300+ 参赛者',citation:'Ask Your Data. Next Level Challenge Hackathon, Leuven.',link:'',alt:'矿物蓝水墨绘成的数据谱系树，倒映在静水中。'},
      {id:'aqua',title:'Aqua Seal',year:'2025',category:'WEB3 / 数字所有权',summary:'不显眼的印记，可验证的归属。',description:'去中心化的数字版权保护：为图像、音频与 PDF 嵌入隐形水印，以 React / TypeScript 前端和 FastAPI 后端，通过 MetaMask、CAMP Network 与 Origin SDK 对照链上元数据验证所有权。',stack:'FastAPI · React · TypeScript · Docker · CAMP Network',award:'CAMP Network 赛道总冠军',context:'WAIB Summit 黑客松 · 摩纳哥',citation:'Aqua Seal. WAIB Summit Hackathon, Monaco.',link:'',alt:'黑色水面上的圆形涟漪，中心藏着隐约的几何水印。'},
      {id:'knoqs',title:'KNOQS',year:'2026',category:'后端 / 知识系统',summary:'从首次提交到上线，我负责多租户 AI 知识平台的后端开发。',description:'怎样让 AI 回答可以核验？知识系统可以用混合检索找出候选资料，并给回答里的关键论断标上对应出处。\n\n在交付前，系统逐项检查论断能否从检索到的资料得到支持。证据不足时就暂缓作答。评测应同时覆盖两类情况：有证据的回答能否通过，证据不足的回答能否被拦下。',stack:'Hybrid retrieval · LLM evaluation',award:'后端与 AI 工程 · 2026 年 4 月至 10 月',context:'比利时 · 产品细节受保密协议约束',citation:'Chen, S. (2026). KNOQS. Backend / AI engineering, Belgium.',link:'',alt:'悬于暗色空间中的半透明宣纸，各层彼此独立。'}
    ],recognitionTitle:'荣誉',recognitionAbstract:'一路走来的几个刻度。',awards:[
      ['2026','总冠军 + 全场最佳技术奖','Next Level Challenge · Collibra 赛道 / 全场'],['2025','总冠军','WAIB Summit，摩纳哥 · CAMP Network 赛道'],['','北京青少年机器人竞赛','区级冠军及市级奖项']
    ],artTitle:'音乐与艺术指导',artAbstract:'实践的另一面。',artRole:'艺术设计总监',artMargin:'让声音有形。\n为音乐建立视觉语言。',
    earlyStage:'更早的舞台',atticRole:'高中乐队 · 吉他手',atticText:'高中时与乐队 The Attic 一起，曾面向 500 多位观众现场演出。',audience:'现场观众',
    bandIntro:'Slow Erosion 来自中国武汉，由 DOPAINE 前成员于 2023 年正式组建。以金属核为根，融入黑金属的冷峻、后摇的辽阔与盯鞋的朦胧，声音悬于暴烈与梦境、压迫与失重之间。',
    artStatement:'Slow Erosion 这个名字由我取定。它指向一种缓慢发生的侵蚀：个体在制度、技术、资本与社会秩序中，逐渐失去锋芒、感知与抵抗的能力。这也是我做艺术指导的出发点——让暗色的梦境承载难以命名的压力、麻木与精神剥落。终点没有轰然降临，只留下一声低沉而绵长的叹息。',artCredit:'乐队命名与艺术指导 / 陈乐涵',bandAlt:'陈乐涵在排练室演奏白色电吉他。',bandCaption:'排练',bandVisit:'访问乐队官网',bandFacts:'中国武汉 · 2023 年成立 · 金属核 / 黑金属 / 后摇 / 盯鞋',
    notesTitle:'札记',notesAbstract:'在页边，留一点生活。',notesText:'在尼斯的海边停一停，离屏幕远一点。生活参与进来，作品才会更好。',stageAlt:'Shay 在 Next Level Challenge 手持麦克风介绍 Ask Your Data。',stageCaption:'Next Level Challenge · 鲁汶 · 2026',niceAlt:'陈乐涵在尼斯海边的蓝色栏杆旁，远处是英国人大道与地中海。',niceCaption:'英国人大道 · 尼斯',
    toolkitTitle:'工具索引',toolkitAbstract:'日常使用之物，按类归档。',skillLabels:['日常主力','用过的工具'],contactTitle:'来信 · 联系方式',contactAbstract:'好的作品，从一次交谈开始。',contactText:'欢迎后端、AI、全栈相关机会，也欢迎音乐相关的视觉合作。',copy:'复制邮箱',copied:'已复制',copyFailed:'请选中并复制上方邮箱。',contactMargin:'现居鲁汶。\n连接更远的地方。',footerLine:'慎造，\n留痕。',colophon:'字体：Instrument Serif、Newsreader、思源宋体、霞鹜文楷与 IBM Plex Mono。基于 Astro 构建。',updated:'最后更新',top:'回到开篇',
  }
} as const;
export const skills = {
  en: [
    ['Python · SQL · FastAPI', 'PostgreSQL (RLS) · Alembic', 'Redis · pgvector', 'RAG · LLM evaluation', 'Docker · Kubernetes · Coolify', 'Prometheus · Grafana'],
    ['TypeScript · React · Next.js', 'Flask · Pandas · Databricks', 'AWS · Collibra API']
  ],
  zh: [
    ['Python · SQL · FastAPI', 'PostgreSQL 行级安全（RLS）· Alembic', 'Redis · pgvector', 'RAG · LLM 评测', 'Docker · Kubernetes · Coolify', 'Prometheus · Grafana'],
    ['TypeScript · React · Next.js', 'Flask · Pandas · Databricks', 'AWS · Collibra API']
  ]
};
export type Copy = typeof copy[Locale];
