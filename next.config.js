/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  api: {
    externalResolver: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  optimizeFonts:true,
  optimizeCss: true,
  compiler: {
    removeConsole: false,
  },
  experimental: {
    nextScriptWorkers: true,
},
}

module.exports = nextConfig
