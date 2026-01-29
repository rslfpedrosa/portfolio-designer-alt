import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 95],
  },
  // Ensure correct tracing root on Vercel (avoids wrong root when multiple lockfiles exist)
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
