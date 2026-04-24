import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["localhost:3000", "192.168.2.20:3000"],
  images: {
    qualities: [70, 75, 90],
    remotePatterns: [
    ],
  },
};

export default nextConfig;
