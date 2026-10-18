# Shay Chen / 陈乐涵 — 墨印的期刊

本地 Astro 双语个人网站。深色水墨首屏、书法字标，向下进入带章节、页边批注和图注的期刊排版。工程与 Slow Erosion 艺术指导独立成章。通过 GitHub Actions 部署到 GitHub Pages。

网站：https://shaychen817.github.io/ShayChen/

仓库：https://github.com/ShayChen817/ShayChen

## 运行与预览

Node.js 22.12+；本机使用 24.11。

```powershell
cd D:\SCp\website
npm install
npm run dev
```

开发入口：http://127.0.0.1:4321/en/ 与 `/zh/`。

```powershell
npm run build
npm run preview -- --port 4322
```

构建预览：http://127.0.0.1:4322/en/ 与 `/zh/`。简历可从首屏身份文字右侧倾斜的朱砂红票签下载，也可通过 `/cv/` 查看。

## 已落实的内容与交互

- 首屏身份为 Engineer · Guitarist / 工程师 · 吉他手，正文说明电子、软件、AI 与艺术指导。
- 首屏中央注明来自北京，现居比利时鲁汶。
- 中文姓名陈乐涵；GitHub 为 `https://github.com/ShayChen817`。
- 公开联系方式：`shay04817@gmail.com`、`+32 456777145`、`+86 18701126817`，按用户要求保留双号码。号码悬停或键盘选中显示对应比利时 / 中国国旗。
- Sweco 排在经历第一项，日期为 2026 年 10 月至今。KU Leuven 采用相同的日期、校名、学位与品牌 logo 排版。
- 首屏名字两侧触发半透明大幅照片：左侧肖像、右侧尼斯生活照。电脑端半屏滑入，手机端点按后铺满首屏背景；Escape 或点按外部关闭。
- 红色 CV 入口位于身份文字右侧，采用横向倾斜票签、裁角、细边框和虚线分隔的下载箭头；悬停时轻抬并微微回正。
- 个人小标识使用 default 照片衍生的宣纸白底、墨黑肖像徽记，应用于页眉、页脚和网站图标。照片原件与正文中的真实照片保持不变。
- LinkedIn、GitHub、邮件、电话与下载入口使用 SVG 图标。
- 经历列表悬停或键盘选中显示 Sweco、DataCamp、KNOQS 官方 logo 与品牌色；触屏保留 logo。
- 项目采用文字行式布局，移除 AI 项目封面。KNOQS 项目悬停显示官方 logo。
- 荣誉条目有细线、标题、年份与星号的轻微悬停反馈，前两项可打开对应项目注记。
- Slow Erosion 使用官方 logo 与官网链接；双语文案采用用户提供的 2023 年武汉组建背景、音乐风格及缓慢侵蚀理念，明确由陈乐涵命名。
- 加入高中乐队 The Attic 的吉他手经历，以及面向 500 多位观众现场演出的记录。
- 排练照片使用 CSS 低饱和、石青色调滤镜。所有真人照片只做裁切、缩放和调色，没有重新生成或修改面部。
- 已移除演讲照片、首屏悬停提示及 Ecce homo / 试观此人文案。

## 修改入口

- `src/i18n/content.ts`：中英文文案、身份、联系信息、公司资料。
- `src/components/Journal.astro`：页面结构、元信息和结构化数据。
- `src/styles/main.css`：布局、响应式与交互视觉。
- `src/scripts/journal.ts`：照片触发、目录、项目注记、阅读进度与复制邮箱。
- `src/scripts/InkShader.ts`：直接采样高精度水墨底图，以小幅、非累积的纹理坐标位移表现缓慢流动和鼠标扰动。24fps 上限；渲染匹配屏幕像素密度，最多 480 万像素；离屏或隐藏暂停，减少动态或 WebGL 不可用时显示同一底图。
- `src/scripts/WriteName.ts`：沿单独的笔画路径揭示书法字标，开场约 3 秒；减少动态偏好下立即显示完整文字。
- `public/assets/ShayChen_CV.pdf`：最新 `D:\SCp\ShayChen_CV.pdf` 的原样副本。
- `scripts/prepare-assets.mjs`：生成照片格式、背景、肖像网站图标、分享图，并同步最新 CV。需要本机原稿；CI 使用仓库中已生成的 public 素材。
- 肖像徽记由内置 imagegen 根据用户原照生成。本机原稿与提示词在 `art-source/portrait-badge.png`、`art-source/portrait-badge-prompt.json`；已替换早期反白线稿。
- `scripts/trace-wordmark.py`：将 `art-source/wordmark-calligraphy.png` 矢量化，需要 Pillow、vtracer。
- `scripts/subset-fonts.py`：子集化思源宋体与霞鹜文楷，需要 fonttools、brotli。增加中文内容后重新运行。
- `scripts/verify.mjs`：本地浏览器检查，默认使用 4322，可通过 TEST_URL 覆盖。输出 `qa/verification.json` 与截图。

原始 brief、照片与 CV 保留在上级目录，不改动。Astro 已更新至 7，依赖锁定在 `package-lock.json`。

## 剩余占位符

未知信息使用 `{{NAME}}`，不编造项目链接或经历。

| 内容 | 占位符 |
| --- | --- |
| Sweco 一句话工作说明 | `SWECO_ONE_LINE` |
| 项目合作者 | `ASK_YOUR_DATA_TEAMMATES`, `AQUA_SEAL_TEAMMATES` |
| 项目源码或演示 | `ASK_YOUR_DATA_URL`, `AQUA_SEAL_URL` |
| 可选更多项目 | `MORE_PROJECTS` |
| 北京机器人比赛年份 | `BEIJING_20_YEAR`, `BEIJING_21_YEAR` |
| 乐队封面、海报与发行 | `ART_DIRECTION_WORKS`, `BAND_RELEASES` |
| 排练照片地点与年份 | `BAND_PLACE`, `BAND_PHOTO_YEAR` |
| 其余照片年份 | `PORTRAIT_YEAR`, `NICE_YEAR` |
| 设计工具 | `DESIGN_TOOLS` |

## 素材来源

- 真人照片：用户原图，网站只使用肖像、尼斯生活照和乐队排练照。
- 当前首屏底图通过内置 imagegen 精修，原稿为 `art-source/hero-ink-final.png`（1672×941），完整提示词在 `art-source/hero-ink-final-prompt.json`。网页直接使用该图的高质量 WebP，手机使用单独裁切；动画只做轻微位移，保留墨丝、透明层次与颗粒。早期低分辨率流体渲染已替换。字标的提示词记录在 `art-source/wordmark-prompt.json`，经二值描摹转换为 SVG；项目配图只保留在原稿档案，不在页面使用。
- Sweco：[官方媒体 logo](https://www.swecogroup.com/press-releases/logo/)，白色标识；页面配色参考其官方样式。
- DataCamp：[Waffles 品牌组件](https://waffles.datacamp.com/components/brand/)，使用官方 SVG 路径与品牌绿 `#03EF62`。
- KU Leuven：[官方网站标识](https://stijl.kuleuven.be/releases/latest/img/svg/logo.svg)，保留原有深蓝与浅蓝。
- KNOQS：[官网](https://knoqs.com/)，logo 源为 `/assets/knoqs-logo-NSFHa7d6.png`。
- Slow Erosion：[官网](http://slow-erosion.asia/)，logo 源为 `/assets/img/logo-red-vivid.png?v=20260609-07`。当前官网 HTTPS 证书过期，使用可正常访问的公开 HTTP 地址；未绕过证书检查。
- 字体按其附带 OFL 许可自托管，许可副本在 `public/assets/brand/licenses/`。

## 验证和部署

运行 `npm run build` 检查 TypeScript / Astro 并输出静态页面。运行 `node scripts/verify.mjs` 检查双语桌面 / 手机布局、照片切换、公司标识、下载文件、目录、项目注记、复制邮箱、减少动态、无 JS 内容与 axe 无障碍规则。`node scripts/verify-motion.mjs` 检查开场书写、水墨动画更新与减少动态时暂停。

`.github/workflows/deploy.yml` 在每次推送 `main` 后自动构建和发布。GitHub Pages 的 Source 使用 GitHub Actions。生产环境设置 `SITE_URL=https://shaychen817.github.io`、`BASE_PATH=/ShayChen`，生成对应的资源链接、canonical、hreflang 与分享图 URL。

本地默认 `BASE_PATH=/`，继续使用 `/en/` 和 `/zh/`。`BUILD_DIR` 可指定独立构建目录。原始照片、素材研究档案与 QA 截图留在本机，不上传到源码仓库；部署使用已生成的网页素材。保留 `vercel.json` 便于以后迁移。

部署参考：[Astro GitHub Pages 官方指南](https://docs.astro.build/en/guides/deploy/github/)。
