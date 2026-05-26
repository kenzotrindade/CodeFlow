import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["10.45.31.61", "localhost:3000", "192.168.1.178"],
};

export default nextConfig;
