import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://34.124.138.25/:path*",
      },
    ];
  },
};
export default nextConfig;
