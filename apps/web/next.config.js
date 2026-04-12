/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@orbit-core/sdk'],
}

module.exports = nextConfig
