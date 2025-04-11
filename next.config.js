/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true, // 为了支持静态导出
    },
    // 为Cloudflare Pages优化
    distDir: 'out',
}

module.exports = nextConfig 