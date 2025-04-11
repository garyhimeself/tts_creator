import fs from 'fs';
import path from 'path';

/**
 * 模拟音频文件API路由
 * 用于开发环境下测试音频播放功能
 */
export default function handler(req, res) {
  try {
    // 这里返回一个静态的测试音频文件
    // 实际项目中，需要替换为真实的音频文件或流
    const mockAudioPath = path.join(process.cwd(), 'public', 'test-audio.mp3');
    
    // 如果测试音频不存在，返回404
    if (!fs.existsSync(mockAudioPath)) {
      return res.status(404).json({ error: '模拟音频文件不存在' });
    }
    
    // 设置正确的Content-Type
    res.setHeader('Content-Type', 'audio/mpeg');
    
    // 读取并返回文件
    const audioBuffer = fs.readFileSync(mockAudioPath);
    res.send(audioBuffer);
  } catch (error) {
    console.error('模拟音频API错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
} 