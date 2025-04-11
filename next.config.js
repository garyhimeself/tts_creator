/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true, // 为了支持静态导出
    },
}

module.exports = nextConfig 