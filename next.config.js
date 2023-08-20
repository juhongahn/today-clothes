/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["puppeteer"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'tong.visitkorea.or.kr',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
