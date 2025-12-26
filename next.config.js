/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    webpackBuildWorker: true,
  },
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
