import withPWA from 'next-pwa'

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {   reactStrictMode: true,

  turbopack: {}, // 👈 fixes Next 16 crash with webpack plugins
}


export default pwaConfig(nextConfig)