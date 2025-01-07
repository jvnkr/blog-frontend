import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    ENV: process.env.ENV,
  },
  experimental: {
    scrollRestoration: true,
    serverActions: {
      allowedOrigins: ["localhost:3000", "frontend:3000"],
    },
  },
};

export default nextConfig;
