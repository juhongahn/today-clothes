/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
    optimizeCss: true,
  },
  plugins: ["transform-remove-console"],
  rules: {
    "no-console": "off",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "tong.visitkorea.or.kr",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
