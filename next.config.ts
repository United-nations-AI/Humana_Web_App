import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Allow Android emulator (10.0.2.2) and iOS simulator to access dev resources
  allowedDevOrigins: ["10.0.2.2", "localhost"],
};

export default nextConfig;
