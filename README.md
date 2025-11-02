# We Are ESAP

> **向那卫星许愿**

**The ESAP Project**（逃离计划）是一个科幻世界观创作企划，讲述仿生人与人类共存的未来故事。

在这个世界里：馈散粒子改变了计算的本质，流体钛让意识得以延续，我们在寻找存在的意义。

**🌐 在线访问**: [weare.esaps.net](https://weare.esaps.net)

---

## 📖 项目简介

这是 ESAP Project 的官方网站项目，基于 Next.js 15 构建，展示 ESAP 世界观、核心成员档案、技术设定、时间线等内容。

### 特性

- ✨ **简洁科幻风格**：现代化的 UI 设计，深浅色主题切换
- 🎨 **三角形 LOGO 动画**：独特的三色（黄/粉/蓝）动态 LOGO
- 🎭 **角色卡片系统**：精美的角色展示卡片，带悬停动效
- 📱 **响应式设计**：完美适配桌面端、平板、手机
- 🚀 **高性能**：基于 Next.js 15 App Router，服务端渲染
- 🔧 **可扩展架构**：JSON 数据驱动，易于添加新角色

---

## 🛠️ 技术栈

### 核心框架
- **[Next.js 15](https://nextjs.org/)** - React 框架（App Router）
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全
- **[Tailwind CSS v4](https://tailwindcss.com/)** - 原子化 CSS

### 功能库
- **[Framer Motion](https://www.framer.com/motion/)** - 动画库
- **[next-themes](https://github.com/pacocoursey/next-themes)** - 主题切换

### 数据存储
- **JSON 文件** - 角色数据存储（`website/data/characters/*.json`）
- **API Routes** - 提供数据接口（`/api/characters`）

---

## 🚀 本地开发

### 环境要求

- Node.js 18.17 或更高版本
- pnpm（推荐）或 npm

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/AptS-1547/WeAreESAP.git
cd WeAreESAP/website

# 安装依赖（推荐使用 pnpm）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

开发服务器将运行在 [http://localhost:3000](http://localhost:3000)

---

## 🎭 如何贡献角色

我们欢迎社区贡献新的角色设定！在提交之前，请确保你的角色符合 ESAP 的世界观设定。

### 📋 角色数据结构

角色数据存储在 `website/data/characters/` 目录下，每个角色一个 JSON 文件。

#### 必需字段

```json
{
  "id": "角色编号（如 0152）",
  "name": "角色姓名",
  "code": "角色代号（如 AptS:0152）",
  "color": {
    "primary": "主题色（十六进制）",
    "dark": "深色调（十六进制）"
  },
  "role": "角色定位",
  "species": "种族/物种",
  "quote": "角色引言",
  "description": "简短描述（一句话）",
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "tier": "member"
}
```

#### 可选但推荐字段

```json
{
  "nickname": "角色昵称",
  "backgroundImage": "背景图片路径",
  "meta": {
    "background": "角色背景故事",
    "relationship": "与其他角色的关系",
    "abilities": ["能力1", "能力2"],
    "characterTraits": [
      "性格特征描述1",
      "性格特征描述2"
    ]
  }
}
```

### 📝 字段说明

#### `tier` - 角色层级
- `"core"` - 核心成员，在首页和角色列表页都显示
- `"member"` - 普通成员，只在角色列表页显示（**新角色默认使用此值**）
- `"guest"` - 访客角色，预留字段

#### `color` - 颜色主题
请选择一个不与现有角色重复的颜色。已使用的颜色：
- 🟡 黄色 `#ffd93d` - 1547（卞雨涵）
- 🩷 粉色 `#ff69b4` - 1548（蔡颖茵）
- 🔵 蓝色 `#4da6ff` - 1549（肖雨昕）
- 🟢 绿色 `#1abc9c` - 0152（顾星澈）
- ⚫ 灰色 `#585858` - 1738（陆清弦）
- 🟣 紫色 `#8b4fb3` - 4869（白漠笙）

#### `keywords` - 关键词
建议 3-4 个关键词，简洁概括角色特质。

### 🔄 贡献流程

#### 方式一：提交 Issue（推荐新手）

1. 前往 [Issues](https://github.com/AptS-1547/WeAreESAP/issues/new) 创建新 Issue
2. 使用模板 "新角色提案"
3. 详细描述你的角色设定
4. 等待核心成员审核和反馈
5. 审核通过后，我们会帮你创建角色数据文件

#### 方式二：Fork & Pull Request（推荐有经验的开发者）

1. **Fork 本仓库**到你的 GitHub 账户

2. **克隆到本地**
   ```bash
   git clone https://github.com/你的用户名/WeAreESAP.git
   cd WeAreESAP
   ```

3. **创建新分支**
   ```bash
   git checkout -b add-character-你的角色ID
   ```

4. **添加角色数据文件**
   - 在 `website/data/characters/` 目录下创建新的 JSON 文件
   - 文件名格式：`角色ID.json`（如 `0152.json`）
   - 参考现有角色文件的格式

5. **测试你的角色**
   ```bash
   cd website
   pnpm install
   pnpm dev
   ```
   访问 `http://localhost:3000/characters` 查看你的角色是否正确显示

6. **提交你的更改**
   ```bash
   git add website/data/characters/你的角色ID.json
   git commit -m "feat: 添加新角色 - 角色姓名 (ID)"
   ```

7. **推送到你的 Fork**
   ```bash
   git push origin add-character-你的角色ID
   ```

8. **创建 Pull Request**
   - 前往你的 Fork 页面
   - 点击 "Compare & pull request"
   - 填写 PR 描述，说明角色设定和特点
   - 提交 PR 等待审核

### ✅ 审核标准

你的角色需要满足以下条件才能被接受：

1. **符合世界观设定**
   - 角色设定不与 ESAP 世界观冲突
   - 理解馈散粒子、流体钛等核心设定（如适用）

2. **不与现有角色冲突**
   - 角色背景、关系不与已有角色设定矛盾
   - 颜色主题不重复

3. **完整的数据格式**
   - 包含所有必需字段
   - JSON 格式正确，能通过验证
   - 图片路径正确（如有）

4. **有深度的设定**
   - 角色性格鲜明，有独特特征
   - 有合理的背景故事
   - 关系设定有逻辑性

5. **尊重原作**
   - 尊重核心成员（1547、1548、1549）的设定
   - 不擅自修改他人的角色设定

### 📄 参考示例

查看 `website/data/characters/0152.json` 了解一个完整的角色数据文件应该是什么样的。

---

## 📞 联系我们

- **GitHub Issues**: [提交问题或建议](https://github.com/AptS-1547/WeAreESAP/issues)
- **GitHub Discussions**: [加入讨论](https://github.com/AptS-1547/WeAreESAP/discussions)
- **邮箱**: 待补充
- **社区群组**: 待补充

---

## 📂 项目结构

```
WeAreESAP/
├── docs/                    # 原始文档（Markdown）
│   └── 网站文档/            # 网站内容源文件
├── website/                 # Next.js 网站项目
│   ├── app/                # 页面和路由
│   ├── components/         # React 组件
│   ├── data/
│   │   └── characters/    # 角色数据（JSON）
│   ├── types/             # TypeScript 类型定义
│   └── public/            # 静态资源
└── README.md              # 本文件
```

---

## 📜 许可证

本项目采用 **[Apache License 2.0](LICENSE)** 开源。

角色设定和世界观内容采用 **[CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hans)** 协议授权。

**The ESAP Project** © 2021-2025 by AptS:1547, AptS:1548 and contributors

您可以自由地分享、演绎本作品，甚至用于商业目的，只需署名原作者。

---

## 🌟 致谢

感谢所有为 ESAP Project 做出贡献的创作者和开发者！

特别感谢：
- **AptS:1547** - 项目创始人、世界观构建
- **AptS:1548** - 角色设定、故事创作
- 所有社区贡献者

---

<div align="center">

**"天上没有星星，但我们造了一颗"**

向那卫星许愿 | [weare.esaps.net](https://weare.esaps.net)

</div>
