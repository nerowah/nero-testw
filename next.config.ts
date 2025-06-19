import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  distDir: "dist",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;