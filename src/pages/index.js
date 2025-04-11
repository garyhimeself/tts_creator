import Head from 'next/head'
import { useState, useEffect } from 'react'
import TextEditor from '../components/TextInput/TextEditor'
import VoiceSelector from '../components/UI/VoiceSelector'
import RangeSlider from '../components/UI/RangeSlider'
import FormatSelector from '../components/UI/FormatSelector'
import Player from '../components/AudioPlayer/Player'
import { synthesizeSpeech } from '../utils/api'
import { TTS_CONFIG, AUDIO_CONFIG, UI_CONFIG } from '../config'

export default function Home() {
  // 语言状态
  const [language, setLanguage] = useState(UI_CONFIG.DEFAULT_LANGUAGE)

  // 文本输入状态
  const [text, setText] = useState('')

  // TTS参数状态
  const [voice, setVoice] = useState(TTS_CONFIG.VOICES[UI_CONFIG.DEFAULT_LANGUAGE].FEMALE[0].value)
  const [speed, setSpeed] = useState(TTS_CONFIG.DEFAULT_SPEED)
  const [gain, setGain] = useState(TTS_CONFIG.DEFAULT_GAIN)
  const [format, setFormat] = useState(AUDIO_CONFIG.DEFAULT_FORMAT)
  const [sampleRate, setSampleRate] = useState(
    AUDIO_CONFIG.DEFAULT_SAMPLE_RATES[AUDIO_CONFIG.DEFAULT_FORMAT]
  )

  // 当语言改变时更新默认音色
  useEffect(() => {
    setVoice(TTS_CONFIG.VOICES[language].FEMALE[0].value);
  }, [language]);

  // 处理状态
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // 成功状态
  const [showSuccess, setShowSuccess] = useState(false)

  // 音频结果状态
  const [audioResult, setAudioResult] = useState(null)

  // 显示工作原理
  const [showHowItWorks, setShowHowItWorks] = useState(true)

  // 生成语音处理函数
  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError(language === 'zh' ? '请输入要转换的文本内容' : 'Please enter text to convert')
      return
    }

    setError('')
    setIsProcessing(true)

    try {
      const options = {
        voice,
        speed,
        gain,
        format,
        sample_rate: sampleRate
      }

      const result = await synthesizeSpeech(text, options)

      console.log('收到的API响应:', {
        ...result,
        data: result.data ? {
          ...result.data,
          audioContent: result.data.audioContent ? '(Base64数据)' : undefined
        } : undefined
      });

      if (result.success) {
        // 根据音频内容类型正确设置音频结果
        let audioSource = '';

        // 检查是否已经是data URL格式
        if (result.data?.audioContent && result.data.audioContent.startsWith('data:')) {
          audioSource = result.data.audioContent;
          console.log('使用data URL格式的音频');
        }
        // 检查是否是Base64编码（需要转换）
        else if (result.data?.audioContent) {
          const mimeType = result.data.mimeType || `audio/${result.data.format || format}`;
          audioSource = `data:${mimeType};base64,${result.data.audioContent}`;
          console.log('将Base64转换为data URL格式');
        }
        // 使用URL
        else if (result.data?.audioUrl) {
          audioSource = result.data.audioUrl;
          console.log('使用音频URL');
        }

        setAudioResult({
          src: audioSource,
          type: result.data?.mimeType || `audio/${result.data?.format || format}`,
          format: result.data?.format || format
        });

        // 显示成功通知
        setShowSuccess(true);

        // 使用浏览器内置通知（如果支持）
        if ('Notification' in window) {
          try {
            // 检查通知权限
            if (Notification.permission === 'granted') {
              new Notification(
                language === 'zh' ? '语音合成完成' : 'Text-to-Speech Complete',
                {
                  body: language === 'zh'
                    ? '您的文本已成功转换为语音，可以播放或下载了'
                    : 'Your text has been converted to speech. Ready to play or download.',
                  icon: '/favicon.ico'
                }
              );
            } else if (Notification.permission !== 'denied') {
              // 请求权限
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  new Notification(
                    language === 'zh' ? '语音合成完成' : 'Text-to-Speech Complete',
                    {
                      body: language === 'zh'
                        ? '您的文本已成功转换为语音，可以播放或下载了'
                        : 'Your text has been converted to speech. Ready to play or download.',
                      icon: '/favicon.ico'
                    }
                  );
                }
              });
            }
          } catch (e) {
            console.log('通知功能出错:', e);
          }
        }

        // 3秒后隐藏成功通知
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);

        console.log('设置音频结果:', {
          hasSource: !!audioSource,
          type: result.data?.mimeType || `audio/${result.data?.format || format}`,
          format: result.data?.format || format
        });
      } else {
        throw new Error(result.error || (language === 'zh' ? '语音合成失败' : 'Speech synthesis failed'))
      }
    } catch (error) {
      console.error('语音生成错误:', error)
      setError(error.message || (language === 'zh'
        ? '语音合成过程中发生错误，请重试'
        : 'An error occurred during speech synthesis, please try again'))
      setAudioResult(null)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-space-bg">
      <Head>
        <title>{UI_CONFIG.SITE_NAME} - {UI_CONFIG.SITE_DESCRIPTION}</title>
      </Head>

      {/* 语言选择器 - 右上角 */}
      <div className="absolute top-4 right-4 md:right-8">
        <div className="flex space-x-2">
          {TTS_CONFIG.LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              type="button"
              className={`px-3 py-1.5 rounded-lg transition-all text-sm ${language === lang.id
                ? 'bg-space-accent text-white'
                : 'bg-space-primary text-space-text-secondary hover:bg-space-secondary'
                }`}
              onClick={() => setLanguage(lang.id)}
              disabled={isProcessing}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      <main className="container-custom pt-10">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-space-text mb-4">
            <span className="text-space-accent">{UI_CONFIG.SITE_NAME}</span>
          </h1>
          <p className="text-space-text-secondary text-lg max-w-2xl mx-auto">
            {language === 'zh' ? UI_CONFIG.SITE_DESCRIPTION : 'Simple and powerful online text-to-speech tool'}
          </p>
        </header>

        {/* How it Works Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-space-text flex items-center">
              <span className="bg-space-accent text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">?</span>
              {language === 'zh' ? '如何使用' : 'How it Works'}
            </h2>
            <button
              className="text-space-accent hover:text-space-accent/80 flex items-center text-sm"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
            >
              {showHowItWorks
                ? (language === 'zh' ? '隐藏详情' : 'Hide details')
                : (language === 'zh' ? '查看详情' : 'Show details')}
              <svg className={`ml-1 w-4 h-4 transform transition-transform ${showHowItWorks ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showHowItWorks && (
            <div className="bg-space-primary/40 rounded-xl p-6 border border-space-primary animate-fadeIn space-y-4 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-space-accent flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="text-space-text font-medium">
                    {language === 'zh' ? '输入文本' : 'Enter Text'}
                  </h3>
                  <p className="text-space-text-secondary mt-1">
                    {language === 'zh'
                      ? '在文本编辑器中输入您想转换为语音的文字内容。'
                      : 'Type or paste the text you want to convert to speech in the editor.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-space-accent flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="text-space-text font-medium">
                    {language === 'zh' ? '选择语言和音色' : 'Choose Language and Voice'}
                  </h3>
                  <p className="text-space-text-secondary mt-1">
                    {language === 'zh'
                      ? '选择您偏好的语言和音色，支持多种男声和女声。'
                      : 'Select your preferred language and voice. Multiple male and female voices are available.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-space-accent flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="text-space-text font-medium">
                    {language === 'zh' ? '调整参数（可选）' : 'Adjust Parameters (Optional)'}
                  </h3>
                  <p className="text-space-text-secondary mt-1">
                    {language === 'zh'
                      ? '根据需要调整语速、音量增益和输出格式等参数。'
                      : 'Fine-tune speech parameters like speed, volume gain, and output format as needed.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-space-accent flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="text-space-text font-medium">
                    {language === 'zh' ? '转换并播放' : 'Convert and Play'}
                  </h3>
                  <p className="text-space-text-secondary mt-1">
                    {language === 'zh'
                      ? '点击"转换为语音"按钮，然后使用内置播放器收听或下载生成的音频文件。'
                      : 'Click the "Convert to Speech" button, then use the built-in player to listen to or download the generated audio.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="card max-w-4xl mx-auto mb-8 bg-space-primary/40 rounded-xl p-8 border border-space-primary shadow-xl">
          <div className="mb-8">
            <label htmlFor="textInput" className="block text-space-text font-medium mb-2 text-xl">
              {language === 'zh' ? '输入文字内容' : 'Enter Text'}
            </label>
            <TextEditor
              value={text}
              onChange={setText}
              disabled={isProcessing}
              placeholder={language === 'zh'
                ? '在此输入要转换为语音的文本...'
                : 'Enter text to convert to speech here...'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-space-primary/60 p-5 rounded-lg">
              <VoiceSelector
                value={voice}
                onChange={setVoice}
                disabled={isProcessing}
                language={language}
                onLanguageChange={() => { }}
              />
            </div>

            <div className="bg-space-primary/60 p-5 rounded-lg space-y-6">
              <RangeSlider
                label={language === 'zh' ? '语速调节' : 'Speech Speed'}
                value={speed}
                onChange={setSpeed}
                min={0.25}
                max={4.0}
                step={0.05}
                disabled={isProcessing}
                description={language === 'zh'
                  ? '调整语音的播放速度，1.0为正常速度'
                  : 'Adjust speech playback speed, 1.0 is normal speed'}
              />

              <RangeSlider
                label={language === 'zh' ? '音量增益' : 'Volume Gain'}
                value={gain}
                onChange={setGain}
                min={-10}
                max={10}
                step={0.5}
                disabled={isProcessing}
                valueSuffix=" dB"
                description={language === 'zh'
                  ? '调整语音的音量大小，0为正常音量'
                  : 'Adjust speech volume, 0 is normal volume'}
              />
            </div>
          </div>

          <div className="mb-8 bg-space-primary/60 p-5 rounded-lg">
            <FormatSelector
              formatValue={format}
              onFormatChange={setFormat}
              sampleRateValue={sampleRate}
              onSampleRateChange={setSampleRate}
              disabled={isProcessing}
              language={language}
            />
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {showSuccess && (
            <div className="mb-6 p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-200 text-sm flex items-center justify-between animate-fadeIn">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  {language === 'zh'
                    ? '语音合成成功！您可以在下方播放或下载。'
                    : 'Speech synthesis successful! You can play or download below.'}
                </span>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="text-green-200 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex justify-center mb-8">
            <button
              className={`btn-primary text-lg px-8 py-3 rounded-lg bg-space-accent hover:bg-space-accent/90 text-white transition-all ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleGenerateSpeech}
              disabled={isProcessing || !text.trim()}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === 'zh' ? '正在转换...' : 'Converting...'}
                </span>
              ) : (language === 'zh' ? '转换为语音' : 'Convert to Speech')}
            </button>
          </div>

          {(audioResult || isProcessing) && (
            <div className="mt-8 bg-space-primary/60 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-space-text mb-4">
                {language === 'zh' ? '语音播放' : 'Audio Player'}
              </h3>
              <Player
                audioSrc={audioResult?.src || ''}
                audioType={audioResult?.type}
                fileName={`wades-tools-${new Date().getTime()}.${audioResult?.format || 'mp3'}`}
              />
            </div>
          )}
        </section>
      </main>

      <footer className="text-center py-6 text-space-text-secondary mt-8">
        <p>© {new Date().getFullYear()} {UI_CONFIG.SITE_NAME} | {language === 'zh' ? '由Wade开发' : 'Developed by Wade'}</p>
        <p className="text-xs mt-2">Powered by SiliconFlow TTS API | <a href="#" className="text-space-accent hover:underline">Contact</a> | <a href="#" className="text-space-accent hover:underline">About</a></p>
      </footer>
    </div>
  )
} 