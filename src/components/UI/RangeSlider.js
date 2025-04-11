import React from 'react';

/**
 * 范围滑块组件
 * 用于控制语速、音量增益等连续值参数
 */
export default function RangeSlider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  disabled,
  showValue = true,
  valuePrefix = '',
  valueSuffix = '',
  description
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-space-text font-medium">
          {label}
        </label>
        {showValue && (
          <span className="text-space-accent font-medium">
            {valuePrefix}{value}{valueSuffix}
          </span>
        )}
      </div>
      
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="w-full h-2 bg-space-primary rounded-lg appearance-none cursor-pointer 
                 accent-space-accent focus:outline-none"
      />
      
      {description && (
        <p className="text-xs text-space-text-secondary mt-1">
          {description}
        </p>
      )}
      
      <div className="flex justify-between text-xs text-space-text-secondary">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
} 