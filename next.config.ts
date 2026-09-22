import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/mai/dashboard", destination: "/dashboard" },
      { source: "/mai/dashboard/:path*", destination: "/dashboard/:path*" },
      { source: "/wact/dashboard", destination: "/dashboard" },
      { source: "/wact/dashboard/:path*", destination: "/dashboard/:path*" },
    ];
  },
};

export default nextConfig;
