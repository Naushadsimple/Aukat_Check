import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ['10.216.27.132', 'localhost:3000', 'localhost:3001', 'localhost:3002'],
};

export default nextConfig;
