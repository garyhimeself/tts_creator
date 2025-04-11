/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true, // 为了支持静态导出
    },
    // 静态导出配置
    output: 'export',
    // 为Cloudflare Pages优化
    distDir: 'out',
}

module.exports = nextConfig 