/**
 * TTS Maker 全局配置文件
 */

// API配置
export const API_CONFIG = {
  // SiliconFlow API 端点
  TTS_API_ENDPOINT: process.env.NEXT_PUBLIC_TTS_API_ENDPOINT || 'https://api.siliconflow.cn/v1/audio/speech',
  // API密钥，生产环境中应通过环境变量设置
  API_KEY: process.env.TTS_API_KEY || '',
}

// SiliconFlow TTS 配置
export const TTS_CONFIG = {
  // 默认使用的模型
  DEFAULT_MODEL: 'FunAudioLLM/CosyVoice2-0.5B',
  // 默认语音速度 (0.25-4.0)
  DEFAULT_SPEED: 1.0,
  // 默认音频增益 (-10-10)
  DEFAULT_GAIN: 0.0,
  // 语言选项
  LANGUAGES: [
    { id: 'en', name: 'English' },
    { id: 'zh', name: '中文' },
  ],
  // 支持的音色列表
  VOICES: {
    // 英语音色
    en: {
      // 男生音色
      MALE: [
        { id: 'alex_en', name: 'Alex', value: 'FunAudioLLM/CosyVoice2-0.5B:alex' },
        { id: 'benjamin_en', name: 'Benjamin', value: 'FunAudioLLM/CosyVoice2-0.5B:benjamin' },
        { id: 'charles_en', name: 'Charles', value: 'FunAudioLLM/CosyVoice2-0.5B:charles' },
        { id: 'david_en', name: 'David', value: 'FunAudioLLM/CosyVoice2-0.5B:david' },
      ],
      // 女生音色
      FEMALE: [
        { id: 'anna_en', name: 'Anna', value: 'FunAudioLLM/CosyVoice2-0.5B:anna' },
        { id: 'bella_en', name: 'Bella', value: 'FunAudioLLM/CosyVoice2-0.5B:bella' },
        { id: 'claire_en', name: 'Claire', value: 'FunAudioLLM/CosyVoice2-0.5B:claire' },
        { id: 'diana_en', name: 'Diana', value: 'FunAudioLLM/CosyVoice2-0.5B:diana' },
      ]
    },
    // 中文音色
    zh: {
      // 男生音色
      MALE: [
        { id: 'alex_zh', name: '亚历克斯', value: 'FunAudioLLM/CosyVoice2-0.5B:alex' },
        { id: 'benjamin_zh', name: '本杰明', value: 'FunAudioLLM/CosyVoice2-0.5B:benjamin' },
        { id: 'charles_zh', name: '查尔斯', value: 'FunAudioLLM/CosyVoice2-0.5B:charles' },
        { id: 'david_zh', name: '大卫', value: 'FunAudioLLM/CosyVoice2-0.5B:david' },
      ],
      // 女生音色
      FEMALE: [
        { id: 'anna_zh', name: '安娜', value: 'FunAudioLLM/CosyVoice2-0.5B:anna' },
        { id: 'bella_zh', name: '贝拉', value: 'FunAudioLLM/CosyVoice2-0.5B:bella' },
        { id: 'claire_zh', name: '克莱尔', value: 'FunAudioLLM/CosyVoice2-0.5B:claire' },
        { id: 'diana_zh', name: '黛安娜', value: 'FunAudioLLM/CosyVoice2-0.5B:diana' },
      ]
    }
  }
}

// 音频配置
export const AUDIO_CONFIG = {
  // 默认输出格式
  DEFAULT_FORMAT: 'mp3',
  // 支持的格式列表
  SUPPORTED_FORMATS: ['mp3', 'wav', 'opus', 'pcm'],
  // 采样率设置
  SAMPLE_RATES: {
    mp3: [32000, 44100],
    wav: [8000, 16000, 24000, 32000, 44100],
    pcm: [8000, 16000, 24000, 32000, 44100],
    opus: [48000]
  },
  // 默认采样率
  DEFAULT_SAMPLE_RATES: {
    mp3: 44100,
    wav: 44100,
    pcm: 44100,
    opus: 48000
  },
  // 最大文本长度限制(字符数)
  MAX_TEXT_LENGTH: 5000,
}

// 界面配置
export const UI_CONFIG = {
  // 网站名称
  SITE_NAME: "Wade's Tools",
  // 网站描述
  SITE_DESCRIPTION: '简单高效的在线文字转语音工具',
  // 默认语言
  DEFAULT_LANGUAGE: 'en'
} 