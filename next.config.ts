import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  output: 'standalone', // เพิ่มบรรทัดนี้สำหรับ Docker
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  experimental: {
    appDir: true, // เปิดใช้งาน App Router ถ้ายังไม่ได้เปิด
    serverActions: {
      bodySizeLimit: '25mb'
    }
  },
}

export default nextConfig;