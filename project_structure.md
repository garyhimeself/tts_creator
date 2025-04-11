# TTS Maker 项目结构规划

## 项目概述

TTS Maker 是一个基于 Next.js 开发的文字转语音网站，采用太空暗黑主题设计。项目使用 Node.js 环境，调用 SiliconFlow 的 API 实现文本到语音的转换功能。

## 目录结构

```
tts-maker/
│
├── public/                  # 静态资源目录
│   ├── fonts/              # 字体文件
│   ├── images/             # 图片资源
│   └── favicon.ico         # 网站图标
│
├── src/                    # 源代码目录
│   ├── pages/              # 页面文件目录
│   │   ├── index.js        # 首页
│   │   ├── _app.js         # 应用入口
│   │   ├── _document.js    # HTML文档
│   │   └── api/            # API路由
│   │       └── synthesize.js  # 文字转语音API端点
│   │
│   ├── components/         # 组件目录
│   │   ├── Layout/         # 布局组件
│   │   │   ├── Header.js   # 页头组件
│   │   │   ├── Footer.js   # 页脚组件
│   │   │   └── Layout.js   # 主布局组件
│   │   │
│   │   ├── TextInput/      # 文本输入相关组件
│   │   │   └── TextEditor.js  # 文本编辑器组件
│   │   │
│   │   ├── AudioPlayer/    # 音频播放相关组件
│   │   │   ├── Player.js   # 音频播放器组件
│   │   │   └── Controls.js # 播放控制组件
│   │   │
│   │   └── UI/             # 通用UI组件
│   │       ├── Button.js   # 按钮组件
│   │       ├── Card.js     # 卡片组件
│   │       └── Loader.js   # 加载动画组件
│   │
│   ├── styles/             # 样式文件目录
│   │   ├── globals.css     # 全局样式
│   │   └── theme.js        # 主题配置
│   │
│   ├── utils/              # 工具函数目录
│   │   ├── api.js          # API调用函数
│   │   └── audio.js        # 音频处理函数
│   │
│   └── config/             # 配置文件目录
│       └── index.js        # 全局配置
│
├── .env.local              # 环境变量文件（本地开发）
├── .env.production         # 环境变量文件（生产环境）
├── next.config.js          # Next.js配置文件
├── tailwind.config.js      # Tailwind CSS配置
├── package.json            # 项目依赖和脚本
└── README.md               # 项目说明文档
```

## 主要目录和文件说明

### 1. `public/` 目录

存放静态资源文件，如图片、字体等，这些文件可以直接通过网址访问。

- **fonts/**: 存放网站使用的字体文件
- **images/**: 存放网站使用的图片资源，如背景图、图标等
- **favicon.ico**: 网站图标，显示在浏览器标签页上

### 2. `src/pages/` 目录

Next.js 的页面路由系统，每个文件对应一个路由页面。

- **index.js**: 网站首页，包含主要的文本输入和语音转换功能
- **_app.js**: 应用程序入口，包含全局样式和状态
- **_document.js**: 自定义 HTML 文档结构
- **api/synthesize.js**: 处理文本转语音请求的服务器端 API 路由

### 3. `src/components/` 目录

存放可复用的 React 组件，按功能分类。

- **Layout/**: 页面布局相关组件
- **TextInput/**: 文本输入相关组件
- **AudioPlayer/**: 音频播放相关组件
- **UI/**: 通用 UI 组件，如按钮、卡片等

### 4. `src/styles/` 目录

存放样式相关文件。

- **globals.css**: 全局 CSS 样式
- **theme.js**: 主题配置，定义颜色、字体等

### 5. `src/utils/` 目录

存放工具函数和辅助方法。

- **api.js**: 封装 API 调用相关函数，如调用 SiliconFlow API
- **audio.js**: 处理音频相关的工具函数

### 6. `src/config/` 目录

存放项目配置信息。

- **index.js**: 全局配置参数，如 API 端点、默认设置等

### 7. 配置文件

- **.env.local**: 本地开发环境的环境变量，包含 API 密钥等敏感信息
- **next.config.js**: Next.js 配置文件
- **tailwind.config.js**: Tailwind CSS 配置文件
- **package.json**: 项目依赖和脚本定义

## 数据流说明

1. **用户输入文本** → TextEditor 组件捕获输入
2. **点击转换按钮** → 调用 api.js 中的函数发送请求
3. **请求发送到** → pages/api/synthesize.js 处理
4. **API 路由** → 调用 SiliconFlow API
5. **接收响应** → 返回生成的音频文件 URL
6. **更新状态** → AudioPlayer 组件加载并播放音频

## 太空暗黑主题设计

主题将在 `src/styles/theme.js` 和 `tailwind.config.js` 中定义，采用以下颜色方案：

- 背景色：深蓝黑色 (#050A1A)
- 主要元素：深蓝色 (#0F2447)
- 强调色：亮蓝色 (#4E9EFE)
- 文本颜色：浅灰色 (#E1E1E6)
- 次要文本：中灰色 (#979AAC)

界面将包含星空元素和科技感的设计元素，如发光边缘、渐变效果等。 