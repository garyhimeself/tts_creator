import { API_CONFIG, AUDIO_CONFIG, TTS_CONFIG } from '../../config';

/**
 * 处理文本转语音的API路由
 * 实现与SiliconFlow TTS API的集成
 */
export default async function handler(req, res) {
  // 只接受POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    console.log('环境变量:', {
      NODE_ENV: process.env.NODE_ENV,
      USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API,
      API_KEY: process.env.TTS_API_KEY ? '已设置' : '未设置',
      API_ENDPOINT: process.env.NEXT_PUBLIC_TTS_API_ENDPOINT
    });

    const {
      input,
      model = TTS_CONFIG.DEFAULT_MODEL,
      voice = TTS_CONFIG.VOICES.FEMALE[0].value,
      speed = TTS_CONFIG.DEFAULT_SPEED,
      gain = TTS_CONFIG.DEFAULT_GAIN,
      response_format = AUDIO_CONFIG.DEFAULT_FORMAT,
      sample_rate
    } = req.body;

    console.log('接收到的请求参数:', {
      input: input?.length > 50 ? `${input.substring(0, 50)}...` : input,
      model,
      voice,
      speed,
      gain,
      response_format,
      sample_rate
    });

    // 验证输入
    if (!input || input.trim() === '') {
      return res.status(400).json({ error: '请提供有效的文本内容' });
    }

    // 检查文本长度
    if (input.length > AUDIO_CONFIG.MAX_TEXT_LENGTH) {
      return res.status(400).json({
        error: `文本内容超出最大长度限制 (${AUDIO_CONFIG.MAX_TEXT_LENGTH}字符)`
      });
    }

    // 检查API密钥是否配置
    if (!API_CONFIG.API_KEY) {
      console.error('SiliconFlow API密钥未配置');
      return res.status(500).json({ error: 'API配置错误，请联系管理员' });
    }

    // 构建请求参数
    const requestBody = {
      model,
      input,
      voice,
      speed,
      gain,
      response_format,
      stream: false // 根据文档添加stream参数
    };

    // 如果指定了采样率，添加到请求参数
    if (sample_rate) {
      requestBody.sample_rate = sample_rate;
    }

    // 根据文档，如果需要添加情感等特殊指令，可以使用特殊标记
    if (!input.includes('<|endofprompt|>')) {
      requestBody.input = `<|endofprompt|>${input}`;
    }

    console.log('向SiliconFlow API发送请求:', {
      ...requestBody,
      input: input.length > 50 ? `${input.substring(0, 50)}...` : input
    });

    // 设置为开发模式时使用模拟数据
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_REAL_API !== 'true') {
      console.log('使用模拟数据');
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 返回模拟响应
      return res.status(200).json({
        success: true,
        message: '语音合成成功',
        data: {
          audioUrl: '/api/audio-mock',
          format: response_format,
          duration: input.length * 0.1,
          createdAt: new Date().toISOString(),
        }
      });
    }

    console.log('使用真实API');
    // 实际调用SiliconFlow API
    try {
      console.log('使用的API密钥:', API_CONFIG.API_KEY ? API_CONFIG.API_KEY.substring(0, 10) + '...' : '未设置');
      console.log('使用的API端点:', API_CONFIG.TTS_API_ENDPOINT);

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`
        },
        body: JSON.stringify(requestBody)
      };

      console.log('完整请求头:', JSON.stringify(requestOptions.headers));

      const response = await fetch(API_CONFIG.TTS_API_ENDPOINT, requestOptions);

      console.log('SiliconFlow API响应状态:', response.status);
      console.log('SiliconFlow API响应头:', JSON.stringify(Object.fromEntries([...response.headers])));

      if (!response.ok) {
        let errorMessage = `API请求失败: ${response.status}`;
        try {
          const errorText = await response.text();
          console.error('API错误响应原始内容:', errorText);
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
            console.error('SiliconFlow API错误:', errorData);
          } catch (jsonError) {
            console.error('不是JSON格式的错误响应');
          }
        } catch (e) {
          console.error('解析错误响应失败:', e);
        }
        throw new Error(errorMessage);
      }

      // 获取二进制音频数据
      const audioBuffer = await response.arrayBuffer();
      console.log('收到音频数据大小:', audioBuffer.byteLength);

      // 将音频数据转换为Base64编码
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      // 返回音频数据的Base64编码
      const audioData = {
        success: true,
        message: '语音合成成功',
        data: {
          audioContent: base64Audio,
          format: response_format,
          mimeType: getMimeType(response_format),
          createdAt: new Date().toISOString(),
        }
      };

      console.log('返回的音频数据:', {
        ...audioData,
        data: {
          ...audioData.data,
          audioContent: base64Audio.substring(0, 50) + '...'
        }
      });

      return res.status(200).json(audioData);

    } catch (apiError) {
      console.error('SiliconFlow API错误:', apiError);
      return res.status(500).json({ error: `API调用失败: ${apiError.message}` });
    }

  } catch (error) {
    console.error('TTS API处理错误:', error);
    return res.status(500).json({ error: '服务器内部错误，请稍后再试' });
  }
}

/**
 * 根据音频格式获取对应的MIME类型
 */
function getMimeType(format) {
  const mimeTypes = {
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'opus': 'audio/opus',
    'pcm': 'audio/pcm',
  };

  return mimeTypes[format] || 'audio/mpeg';
} 