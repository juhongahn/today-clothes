/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Production 환경에서만 Source Maps를 활성화합니다.
    if (!isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },
  experimental: {
    appDir: true,
    optimizeCss: true
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
