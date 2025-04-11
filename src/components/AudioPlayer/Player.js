import React, { useState, useRef, useEffect } from 'react';
import { formatDuration, downloadAudio } from '../../utils/audio';

/**
 * 音频播放器组件
 * 用于播放和下载生成的语音
 */
export default function Player({ audioSrc, audioType, fileName }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);
  
  // 如果是Base64编码的音频，转换为Blob URL
  const [audioUrl, setAudioUrl] = useState('');
  
  useEffect(() => {
    // 清理之前的Blob URL
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }
    
    if (audioSrc) {
      setIsLoading(true);
      
      if (audioSrc.startsWith('data:') || audioSrc.startsWith('blob:')) {
        // 已经是URL格式，直接使用
        setAudioUrl(audioSrc);
      } else if (audioSrc.startsWith('/')) {
        // 相对路径，直接使用
        setAudioUrl(audioSrc);
      } else {
        // 假设是Base64编码，将其转换为Blob URL
        try {
          const binary = atob(audioSrc);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: audioType || 'audio/mpeg' });
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        } catch (error) {
          console.error('音频转换错误:', error);
          setAudioUrl('');
        }
      }
    } else {
      setAudioUrl('');
    }
  }, [audioSrc, audioType]);
  
  // 音频事件处理
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const handleLoadedData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    // 绑定事件
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      // 移除事件监听
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);
  
  // 播放/暂停控制
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('播放出错:', error);
      });
    }
  };
  
  // 进度条控制
  const handleSeek = (e) => {
    if (!audioRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // 下载音频
  const handleDownload = () => {
    if (!audioUrl) return;
    
    const defaultName = `tts-audio-${new Date().getTime()}.${(audioType || 'audio/mpeg').split('/')[1]}`;
    downloadAudio(audioUrl, fileName || defaultName);
  };
  
  return (
    <div className="bg-space-primary/40 rounded-xl p-4 border border-space-primary">
      {/* 隐藏的音频元素 */}
      <audio 
        ref={audioRef} 
        src={audioUrl}
        preload="metadata"
      />
      
      {/* 播放器界面 */}
      <div className="space-y-3">
        {/* 播放控制和时间显示 */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            disabled={!audioUrl || isLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              !audioUrl || isLoading 
                ? 'bg-space-primary/50 text-space-text-secondary cursor-not-allowed' 
                : 'bg-space-accent hover:bg-space-accent/90 text-white shadow-neon'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" cy="12" r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : isPlaying ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  d="M5 3l14 9-14 9V3z" 
                  fill="currentColor" 
                  stroke="none"
                />
              </svg>
            )}
          </button>
          
          <div className="text-space-text-secondary text-sm">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </div>
          
          <button
            onClick={handleDownload}
            disabled={!audioUrl || isLoading}
            className={`p-2 rounded-lg transition-all ${
              !audioUrl || isLoading 
                ? 'bg-space-primary/50 text-space-text-secondary cursor-not-allowed' 
                : 'bg-space-primary hover:bg-space-primary/90 text-space-accent'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
              />
            </svg>
          </button>
        </div>
        
        {/* 进度条 */}
        <input
          type="range"
          value={currentTime}
          min={0}
          max={duration || 0}
          step={0.1}
          onChange={handleSeek}
          disabled={!audioUrl || isLoading || duration === 0}
          className="w-full h-1.5 bg-space-primary/80 rounded-lg appearance-none cursor-pointer accent-space-accent"
        />
      </div>
    </div>
  );
} 