/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 太空暗黑主题颜色
        'space-bg': '#0f172a',        // 深蓝黑色背景
        'space-primary': '#1e293b',   // 深蓝色主要元素
        'space-secondary': '#334155',  // 中蓝色次要元素
        'space-accent': '#38bdf8',    // 亮蓝色强调色
        'space-text': '#f8fafc',      // 浅灰色文本
        'space-text-secondary': '#94a3b8',  // 中灰色次要文本
      },
      backgroundImage: {
        'stars-pattern': "url('/images/stars-bg.png')",
      },
      boxShadow: {
        'neon': '0 0 5px rgba(78, 158, 254, 0.5), 0 0 20px rgba(78, 158, 254, 0.3)',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeOut: 'fadeOut 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} 