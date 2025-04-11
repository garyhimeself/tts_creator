import { API_CONFIG, TTS_CONFIG, AUDIO_CONFIG } from '../config';

/**
 * 调用文本转语音API
 * @param {string} text - 需要转换的文本内容
 * @param {Object} options - 转换选项
 * @returns {Promise<Object>} - 返回包含音频URL的对象
 */
export async function synthesizeSpeech(text, options = {}) {
  try {
    // 构建API请求参数
    const payload = {
      model: options.model || TTS_CONFIG.DEFAULT_MODEL,
      input: text,
      voice: options.voice || TTS_CONFIG.VOICES.FEMALE[0].value, // 默认使用第一个女声
      speed: options.speed || TTS_CONFIG.DEFAULT_SPEED,
      gain: options.gain || TTS_CONFIG.DEFAULT_GAIN,
      response_format: options.format || AUDIO_CONFIG.DEFAULT_FORMAT,
    };

    // 如果指定了采样率，添加到请求参数中
    if (options.sample_rate) {
      payload.sample_rate = options.sample_rate;
    } else {
      // 使用默认采样率
      payload.sample_rate = AUDIO_CONFIG.DEFAULT_SAMPLE_RATES[payload.response_format];
    }

    console.log('环境变量:', {
      NODE_ENV: process.env.NODE_ENV,
      USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API,
      API_ENDPOINT: process.env.NEXT_PUBLIC_TTS_API_ENDPOINT
    });

    console.log('调用API转换文本', payload);

    // 前端开发阶段使用模拟数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_REAL_API !== 'true') {
      console.log('使用模拟数据');
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 返回模拟数据
      return {
        success: true,
        audioUrl: '/api/audio-mock', // 开发环境使用模拟API
        format: payload.response_format,
        duration: text.length * 0.1, // 模拟音频时长(秒)
      };
    }

    console.log('使用真实API');
    // 实际API调用
    const response = await fetch('/api/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('API响应状态:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API错误:', errorData);
      throw new Error(errorData.error || '语音合成请求失败');
    }

    const data = await response.json();
    console.log('API响应数据结构:', Object.keys(data), '成功状态:', data.success);

    // 检查音频内容是否存在
    if (data.data && data.data.audioContent) {
      console.log('收到Base64音频数据，长度:', data.data.audioContent.length);

      // 将Base64转换为data URL格式
      const mimeType = data.data.mimeType || `audio/${data.data.format || payload.response_format}`;
      data.data.audioContent = `data:${mimeType};base64,${data.data.audioContent}`;
      console.log('转换为data URL格式:', data.data.audioContent.substring(0, 50) + '...');
    } else if (data.data && data.data.audioUrl) {
      console.log('收到音频URL:', data.data.audioUrl);
    } else {
      console.warn('未收到音频数据或URL');
    }

    return data;
  } catch (error) {
    console.error('语音合成出错:', error);
    throw new Error(error.message || '语音合成失败，请重试');
  }
} 