/**
 * 音频处理相关工具函数
 */

/**
 * 格式化音频时长为可读格式
 * @param {number} seconds - 秒数
 * @returns {string} - 格式化后的时间 (mm:ss)
 */
export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '--:--';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 下载音频文件
 * @param {string} url - 音频文件URL
 * @param {string} filename - 下载文件名
 */
export function downloadAudio(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'tts-audio.mp3';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 检查文本是否超出最大长度限制
 * @param {string} text - 输入文本
 * @param {number} maxLength - 最大长度限制
 * @returns {boolean} - 是否超出限制
 */
export function isTextTooLong(text, maxLength) {
  return text && text.length > maxLength;
} 