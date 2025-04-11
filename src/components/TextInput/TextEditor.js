import React, { useState } from 'react';
import { AUDIO_CONFIG } from '../../config';

/**
 * 文本输入编辑器组件
 * 提供文本输入功能和字数统计
 */
export default function TextEditor({ value, onChange, placeholder, disabled }) {
  const [textLength, setTextLength] = useState(value ? value.length : 0);
  
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setTextLength(newText.length);
    onChange(newText);
  };
  
  // 计算剩余可输入字符数
  const remainingChars = AUDIO_CONFIG.MAX_TEXT_LENGTH - textLength;
  const isExceeded = remainingChars < 0;
  
  return (
    <div className="space-y-2">
      <textarea 
        value={value}
        onChange={handleTextChange}
        disabled={disabled}
        className={`input-field min-h-[200px] focus:border-space-accent transition-all ${
          isExceeded ? 'border-red-500 focus:ring-red-500/50' : ''
        }`}
        placeholder={placeholder || "在这里输入您想要转换成语音的文字..."}
        maxLength={AUDIO_CONFIG.MAX_TEXT_LENGTH}
      />
      
      <div className={`text-right text-sm ${
        isExceeded ? 'text-red-500' : 'text-space-text-secondary'
      }`}>
        {textLength} / {AUDIO_CONFIG.MAX_TEXT_LENGTH} 字符
        {isExceeded && 
          <span className="ml-2 font-medium">
            超出{Math.abs(remainingChars)}个字符
          </span>
        }
      </div>
    </div>
  );
} 