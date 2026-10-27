# 用 GitHub 免费"注册"一个网站（GitHub Pages 全流程）

> 一句话原理：**GitHub Pages = 免费静态网站托管**。你把 HTML/CSS/JS 文件放进一个仓库，
> GitHub 就把它们变成 `https://你的用户名.github.io/` 这样一个真实网址，全球可访问、免费、不用服务器、不用备案（境内访问速度一般，见文末说明）。

先明确边界，避免走弯路：

| 能做 | 不能做 |
| --- | --- |
| 个人主页、作品集、博客、文档站、项目介绍页 | PHP / Java / Python 后端接口（没有服务器运行环境） |
| 纯静态前端（HTML/CSS/JS，可接 Vue/React 打包产物） | 数据库、用户登录系统（除非接第三方服务如 Supabase） |
| 自定义域名 + 免费 HTTPS 证书 | 超大文件、视频存储（仓库软限制 1GB，单文件 100MB） |
| 用 GitHub Actions 自动构建部署 | 国内高速稳定访问（GitHub Pages 无 CDN 备案，速度看运营商） |

---

## 1. 这个文件夹里有什么（你已经拿到的全部"程序"）

```
my-github-site/
├─ index.html                    ← 首页（全部内容都在这里）
├─ 404.html                      ← 访问不存在的页面时显示
├─ assets/
│  ├─ style.css                  ← 全部样式（配色、排版、深色模式、手机适配）
│  └─ main.js                    ← 全部交互（主题切换、菜单、滚动动画、文件列表）
├─ files/                        ← ★ 你自己的文件放这里（简历、照片、资料）
│  ├─ files.js                   ← 文件清单：加一行 = 网页多一张下载卡片
│  ├─ example.txt                ← 示例文件，可以删
│  └─ README.txt                 ← 这个文件夹怎么用（说明）
├─ .nojekyll                     ← 空文件，告诉 GitHub"别用 Jekyll 处理我的站点"
├─ .gitignore                    ← 哪些垃圾文件不要提交
├─ .github/workflows/deploy.yml  ← 自动部署脚本（可选，见第 6 节模式二）
└─ README.md                     ← 本文件
```

**你不需要写任何一行新代码就能上线。** 只要改 `index.html` 里的文字（文件里用 `【改】` 标了所有该改的地方）。

---

## 2. 先在本地打开看一眼

双击 `index.html` 就能在浏览器里看效果（不需要联网、不需要安装任何东西）。

想更接近线上环境（相对路径、404 页都正常），在这个文件夹里打开 PowerShell 运行：

```powershell
python -m http.server 8000
```

然后浏览器访问 <http://localhost:8000>。看完按 `Ctrl + C` 关掉。

---

## 3. 第一步：注册 GitHub 账号

1. 打开 <https://github.com/signup>
2. 填邮箱 → 设置密码 → 起用户名 → 输入邮箱收到的验证码
3. **用户名要想好**：它会出现在你的网址里（`用户名.github.io`），只能包含字母、数字、连字符，注册后可以改但旧链接会失效
4. 免费计划（Free）就够用，不需要付费

---

## 4. 第二步：新建仓库（Repository）

登录后点右上角 **+** → **New repository**，然后：

| 填写项 | 填什么 | 说明 |
| --- | --- | --- |
| Repository name | `你的用户名.github.io` | ⭐ **关键**：这样网址才是 `https://用户名.github.io/`，不带多余路径 |
| Description | 随便写 | 可留空 |
| 可见性 | **Public** | ⚠️ 免费账号的 **Private 仓库不能开 Pages**，必须公开 |
| Initialize with README | 不勾 | 我们的文件里已经有 README |

> 仓库名叫别的可不可以？可以，那样网址会变成 `https://用户名.github.io/仓库名/`。
> 缺点：所有图片、链接都多一层路径，容易踩坑；**新手强烈建议用 `用户名.github.io` 这个命名。**

> 💡 **本模板已经填成 zdy**：如果你的 GitHub 用户名也是 `zdy`（没被注册过），仓库名就填 `zdy.github.io`，
> 上线后网址是 <https://zdy.github.io/>，页面不用再改任何东西就能用。
> 如果用户名不是 zdy，那么页面上的 zdy 也可以保留成昵称，也可以在 `index.html` 里搜 `zdy` 一次性替换。

点 **Create repository**。

---

## 5. 第三步：把文件传上去（三种方式，任选一种）

### 方式 A：网页上传（零安装，最省事）

1. 在新建的仓库页面点 **Add file** → **Upload files**
2. 打开本机的 `my-github-site` 文件夹，**全选里面的内容**（`index.html`、`404.html`、`assets` 文件夹、`.nojekyll`、`.github` 文件夹等）拖进浏览器窗口
   - 注意：拖进去的是**文件夹里的东西**，不要把整个 `my-github-site` 文件夹套一层
3. 下面的 Commit changes 说明里随便写 `first commit`，点 **Commit changes**
4. `.nojekyll` 这类点开头的文件在 Windows 资源管理器里默认隐藏，先勾选"查看 → 显示 → 隐藏的项目"再拖

> 网页上传的缺点：以后每次改内容都要重新上传一遍。长期维护建议用方式 B 或 C。

### 方式 B：GitHub Desktop（图形界面，适合不想碰命令行）

1. 下载安装 <https://desktop.github.com/>
2. 登录 GitHub → **File** → **Clone repository** → 选中你刚建的仓库 → 选一个本地目录
3. 把 `my-github-site` 里的文件复制到克隆下来的那个目录（覆盖掉里面的 README 也没关系）
4. 左下角填一句提交说明 → **Commit to main** → 右上角 **Push origin**

### 方式 C：命令行 git（最专业，改起来最爽）

先装 Git：<https://git-scm.com/download/win>，装完重开一个终端。

```powershell
# 进到网站文件夹
cd "你的路径\my-github-site"

# 第一次用 git 要设置身份（只设一次）
git config --global user.name  "你的名字"
git config --global user.email "你的邮箱"

# 初始化并关联远程仓库（把 用户名 换成你自己的）
git init -b main
git add .
git commit -m "first commit"
git remote add origin https://github.com/用户名/用户名.github.io.git
git push -u origin main
```

第一次 `push` 会弹出浏览器让你授权登录 GitHub，点允许即可。

---

## 6. 第四步：开启 Pages（让文件变成网站）

打开仓库 → 上方 **Settings** → 左侧 **Pages**。你会看到 **Build and deployment** 区域，有两种模式，**二选一**：

### 模式一：从分支部署（最简单，推荐第一次用）

- **Source** 选 `Deploy from a branch`
- **Branch** 选 `main`，文件夹选 `/ (root)`，点 **Save**
- 等 1~3 分钟，页面顶部会出现绿底提示：`Your site is live at https://用户名.github.io/`

⚠️ 用了这个模式，就**把仓库里的 `.github/workflows/deploy.yml` 删掉**（否则每次 push 会多跑一个失败的部署任务，网页本身不受影响，但看着闹心）。

### 模式二：用 Actions 部署（改一次自动发一次，推荐长期用）

- **Source** 选 `GitHub Actions`
- 仓库里保留 `.github/workflows/deploy.yml`（文件已经在项目里了）
- 以后每次 `push` 到 `main` 分支，GitHub 会自动打包并发布
- 到仓库 **Actions** 标签页能看到运行记录，绿的 = 成功

---

## 7. 第五步：访问你的网站

浏览器打开：

```
https://你的用户名.github.io/
```

打不开就等 1~3 分钟（首次部署 + CDN 缓存），刷新时按 `Ctrl + F5` 强制刷新。

---

## 8. 以后怎么更新内容

| 你用的方式 | 更新步骤 |
| --- | --- |
| 网页上传 | Add file → Upload files，重新传改过的文件 → Commit |
| GitHub Desktop | 本地改文件 → Commit → Push |
| 命令行 | `git add .` → `git commit -m "改了什么"` → `git push` |

推上去后，模式一约 10~60 秒生效，模式二看 Actions 跑完（几十秒）。

---

## 9. 改造成你自己的网站（必改清单）

打开 `index.html`，搜索 `【改】`，共 5 处：

1. `<title>zdy · 个人主页</title>` —— 浏览器标签上的名字
2. `meta name="description"` —— 搜索引擎看到的简介
3. `og:url` —— 换成你的真实网址
4. 正文里的昵称 zdy（想换成别的就全局替换）、技能、项目卡片（3 个 `<article class="card project">`，多复制几个就是更多项目）
5. 邮箱 `you@example.com` 和 GitHub 链接（`https://github.com/` 一共 5 处）换成你的

`assets/style.css` 顶部第 1 节是**全部配色变量**，只改 `--accent`、`--accent-2` 两行就能换掉整个网站的主色调。

想换浏览器标签上那个小图标？改 `index.html` 里 `<link rel="icon" ...>` 那行（现在是用 SVG 画的一个字母方块）。

---

## 10. 把你的文件放上去（简历、照片、资料——这就是给你的接口）

首页有个「我的文件」区块，内容来自 `files/files.js` 这个清单文件。三步搞定：

**第 1 步：把文件复制进 `files/` 文件夹**

```
files/
├─ files.js
├─ example.txt      ← 你的 resume.pdf、photo.jpg、作品集.zip 就放这一层
└─ 你的文件.pdf
```

**第 2 步：打开 `files/files.js`，照着示例加一段**

```js
window.MY_FILES = [
  {
    name: "我的简历",
    file: "files/resume.pdf",
    desc: "2026 版，一页纸",
    tag: "PDF"
  },
  {
    name: "作品集压缩包",
    file: "files/works.zip",
    desc: "12 个作品，含源文件",
    tag: "ZIP"
  }
];
```

| 字段 | 填什么 |
| --- | --- |
| `name` | 网页上显示的大标题 |
| `file` | **必须写成 `files/你的文件名`**（从网站根目录算起） |
| `desc` | 一行说明，会显示在标题下面 |
| `tag` | 左上角小徽章，PDF/DOC/IMG/ZIP 随意；不写就自动取文件后缀 |

**第 3 步：刷新网页**（传到 GitHub 后就是 `git push`），卡片自动出现，点「下载」直接保存。

几个限制要知道：

- 单个文件 ≤ 50MB 比较稳（GitHub 超过 50MB 会警告，超过 100MB 直接拒收），整个仓库 ≤ 1GB
- 文件名别带空格，用 `-` 或 `_`；中文名能用，但个别旧浏览器下载后可能乱码
- 想**不显示**在列表里也可以：把文件丢进 `files/`，在正文里直接写 `<a href="files/xxx.pdf">下载</a>` 即可
- 加完刷新没反应？99% 是 `file` 路径写错了（少了 `files/`，或者后缀大小写不一致）

---

## 11. 可选：绑定自己的域名

前提：你自己买了一个域名（阿里云/腾讯云/Cloudflare 等，几十块一年）。

1. 在 `my-github-site` 根目录新建一个文本文件，名叫 `CNAME`（**没有扩展名**），里面只写一行你的域名，例如 `www.example.com`
2. 域名服务商后台加解析记录：
   - 根域名 `example.com` → 4 条 `A` 记录指向 `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`
   - 或子域名 `www` → 1 条 `CNAME` 记录指向 `你的用户名.github.io`
3. 回到仓库 Settings → Pages → **Custom domain** 填域名 → Save → 勾选 **Enforce HTTPS**（证书自动签发，可能要等十几分钟）

---

## 12. 常见故障排查

| 现象 | 原因 / 解决 |
| --- | --- |
| 打开是 404 | ① 还没部署完，等 2 分钟；② 仓库名拼错；③ 文件名不是 `index.html`（必须叫这个，小写） |
| 页面出来了但**没有样式**、白底黑字 | 路径大小写错了。`assets/style.css` 必须完全一致，`Assets`、`Style.css` 在 Linux 服务器上就是 404 |
| Settings 里找不到 Pages | 仓库是 Private。免费账号需把仓库改成 Public（Settings → General → 最下面 Change visibility） |
| Actions 里红叉 "Get Pages site failed" | 你选了 `Deploy from a branch` 却保留了 `deploy.yml`。删掉该文件，或改用 GitHub Actions 模式 |
| 改了文件但页面没变 | CDN 缓存，等 1~2 分钟 + `Ctrl + F5`；也可以去 Actions 看有没有部署成功 |
| 文件夹以 `_` 开头（如 `_next/`）的资源 404 | 这就是 `.nojekyll` 的作用，确认它被提交上去了（仓库根目录能看到它） |
| 中文显示成乱码 | HTML 里必须有 `<meta charset="UTF-8">`，本模板已有；编辑器另存为时要选 UTF-8 |
| 「我的文件」区块是空的 | `files/files.js` 没被传上去（在仓库里确认有这个文件），或者浏览器缓存了旧版本，`Ctrl + F5` |
| 点「下载」提示 404 | `files.js` 里 `file` 的路径写错：必须写成 `files/xxx.pdf`，且文件名、后缀大小写要和真实文件完全一致 |
| 文件传不上去 | 单个文件超过 100MB 会被拒收；超过 50MB 会警告。先压缩，或用 Git LFS |

---

## 13. 发布前检查清单

- [ ] 仓库名 = `用户名.github.io`，可见性 = Public
- [ ] `index.html` 在**仓库根目录**，不是嵌套在某个文件夹里
- [ ] `assets/style.css`、`assets/main.js` 也在，且大小写一致
- [ ] `files/` 文件夹和里面的 `files.js` 一起传上去了
- [ ] 把所有 `【改】` 的地方改成自己的信息
- [ ] Settings → Pages 已经 Save 过
- [ ] 手机上也打开看一眼（模板已做响应式，但你的长文字可能撑破布局）
- [ ] 点一下「我的文件」里的「下载」，确认能真的下下来
- [ ] `https://用户名.github.io/随便什么` 能显示 404 页

---

## 附：免费的下一步

- 想要**博客**：改用 Jekyll / Hugo / Astro 模板，或直接上 <https://pages.github.com/> 官方示例
- 想要**表单/评论/后端**：接 <https://supabase.com>（免费额度）或 Cloudflare Workers
- 想要**国内快**：把仓库同步到 Gitee Pages（需实名，且已限制新用户）、或部署到 Cloudflare Pages（免费、全球 CDN，推荐）
