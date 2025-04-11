import React from 'react';
import { TTS_CONFIG } from '../../config';

/**
 * 音色选择器组件
 * 允许用户从预设的男声和女声音色中选择
 */
export default function VoiceSelector({ value, onChange, disabled, language, onLanguageChange }) {
  const voices = TTS_CONFIG.VOICES[language] || TTS_CONFIG.VOICES.en;
  const { MALE, FEMALE } = voices;

  return (
    <div>
      <label className="block text-space-text font-medium mb-4">
        {language === 'zh' ? '选择音色' : 'Select Voice'}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 女声音色 */}
        <div className="space-y-2">
          <h3 className="text-sm text-space-accent font-medium">
            {language === 'zh' ? '女声音色' : 'Female Voices'}
          </h3>
          <div className="space-y-2">
            {FEMALE.map((voice) => (
              <div
                key={voice.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${value === voice.value
                  ? 'bg-space-accent/20 border border-space-accent'
                  : 'bg-space-primary/40 border border-transparent hover:border-space-accent/30'
                  }`}
                onClick={() => !disabled && onChange(voice.value)}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${value === voice.value ? 'bg-space-accent' : 'bg-space-text-secondary/30'
                    }`} />
                  <span className="text-space-text">{voice.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 男声音色 */}
        <div className="space-y-2">
          <h3 className="text-sm text-space-accent font-medium">
            {language === 'zh' ? '男声音色' : 'Male Voices'}
          </h3>
          <div className="space-y-2">
            {MALE.map((voice) => (
              <div
                key={voice.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${value === voice.value
                  ? 'bg-space-accent/20 border border-space-accent'
                  : 'bg-space-primary/40 border border-transparent hover:border-space-accent/30'
                  }`}
                onClick={() => !disabled && onChange(voice.value)}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${value === voice.value ? 'bg-space-accent' : 'bg-space-text-secondary/30'
                    }`} />
                  <span className="text-space-text">{voice.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 