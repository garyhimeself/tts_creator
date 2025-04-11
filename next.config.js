/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: true, // 为了支持静态导出
    },
    // 确保API路由在静态导出中正常工作
    trailingSlash: true,
    // 为Cloudflare Pages优化
    target: 'serverless',
}

module.exports = nextConfig 