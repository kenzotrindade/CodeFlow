import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["10.45.31.84", "localhost:3000", "192.168.1.129"],
};

export default nextConfig;
