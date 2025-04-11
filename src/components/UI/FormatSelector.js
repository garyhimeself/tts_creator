import React, { useState, useEffect } from 'react';
import { AUDIO_CONFIG } from '../../config';

/**
 * 格式选择器组件
 * 用于选择输出音频格式和采样率
 */
export default function FormatSelector({
  formatValue,
  onFormatChange,
  sampleRateValue,
  onSampleRateChange,
  disabled,
  language = 'en'
}) {
  // 获取当前格式支持的采样率列表
  const [sampleRates, setSampleRates] = useState(
    AUDIO_CONFIG.SAMPLE_RATES[formatValue] || []
  );

  // 当格式变化时，更新采样率列表，并设置默认采样率
  useEffect(() => {
    const availableSampleRates = AUDIO_CONFIG.SAMPLE_RATES[formatValue] || [];
    setSampleRates(availableSampleRates);

    // 检查当前选择的采样率是否在新格式支持的范围内
    const defaultSampleRate = AUDIO_CONFIG.DEFAULT_SAMPLE_RATES[formatValue];

    if (!availableSampleRates.includes(sampleRateValue)) {
      onSampleRateChange(defaultSampleRate);
    }
  }, [formatValue, sampleRateValue, onSampleRateChange]);

  // 多语言文本
  const texts = {
    outputFormat: language === 'zh' ? '输出格式' : 'Output Format',
    sampleRate: language === 'zh' ? '采样率 (Hz)' : 'Sample Rate (Hz)',
    recommended: language === 'zh' ? '(推荐)' : '(Recommended)',
    opusHelpText: language === 'zh'
      ? 'Opus 格式只支持 48000 Hz 采样率'
      : 'Opus format only supports 48000 Hz sample rate',
    sampleRateHelpText: language === 'zh'
      ? '选择合适的采样率可以平衡音质和文件大小'
      : 'Choose an appropriate sample rate to balance audio quality and file size'
  };

  return (
    <div className="space-y-4">
      {/* 音频格式选择 */}
      <div>
        <label className="block text-space-text font-medium mb-2">
          {texts.outputFormat}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AUDIO_CONFIG.SUPPORTED_FORMATS.map((format) => (
            <div
              key={format}
              className={`p-2 text-center rounded-lg cursor-pointer transition-all border ${formatValue === format
                ? 'bg-space-accent/20 border-space-accent text-space-accent'
                : 'bg-space-primary/40 border-transparent hover:border-space-accent/30 text-space-text'
                }`}
              onClick={() => !disabled && onFormatChange(format)}
            >
              .{format}
            </div>
          ))}
        </div>
      </div>

      {/* 采样率选择 */}
      <div>
        <label className="block text-space-text font-medium mb-2">
          {texts.sampleRate}
        </label>
        <select
          value={sampleRateValue}
          onChange={(e) => onSampleRateChange(parseInt(e.target.value))}
          disabled={disabled || sampleRates.length <= 1}
          className="input-field bg-space-primary text-space-text px-4 py-2 rounded-lg w-full"
        >
          {sampleRates.map((rate) => (
            <option key={rate} value={rate}>
              {rate} Hz {rate === AUDIO_CONFIG.DEFAULT_SAMPLE_RATES[formatValue] ? texts.recommended : ''}
            </option>
          ))}
        </select>
        <p className="text-xs text-space-text-secondary mt-1">
          {formatValue === 'opus'
            ? texts.opusHelpText
            : texts.sampleRateHelpText}
        </p>
      </div>
    </div>
  );
} 