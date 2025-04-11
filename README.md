# Wade's Tools - Text to Speech

一个简单高效的在线文字转语音工具，支持多种语言和音色。

## 功能特点

- 支持中文和英文界面
- 多种男声和女声音色选择
- 可调节语速和音量增益
- 支持多种音频格式输出（MP3, WAV, OPUS等）
- 可自定义采样率
- 即时播放和下载生成的音频

## 技术栈

- Next.js
- React
- Tailwind CSS
- SiliconFlow TTS API

## 如何使用

1. 克隆项目
```bash
git clone https://github.com/garyhimeself/tts_creator.git
```

2. 安装依赖
```bash
npm install
```

3. 设置环境变量
创建`.env.local`文件并添加以下内容：
```
NEXT_PUBLIC_TTS_API_ENDPOINT=https://api.siliconflow.cn/v1/audio/speech
TTS_API_KEY=your_api_key_here
NEXT_PUBLIC_USE_REAL_API=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. 运行开发服务器
```bash
npm run dev
```

## 部署

项目已部署在Cloudflare Pages上，访问[Wade's Tools](https://tts-creator.pages.dev)体验。

## 许可

MIT