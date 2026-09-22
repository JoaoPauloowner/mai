import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/mai/login", destination: "/login" },
      { source: "/mai/cadastro", destination: "/cadastro" },
      { source: "/wact/login", destination: "/login" },
      { source: "/wact/cadastro", destination: "/cadastro" },
      { source: "/shoppers/login", destination: "/login" },
      { source: "/shoppers/cadastro", destination: "/cadastro" },
      { source: "/mai/dashboard", destination: "/dashboard" },
      { source: "/mai/dashboard/:path*", destination: "/dashboard/:path*" },
      { source: "/wact/dashboard", destination: "/dashboard" },
      { source: "/wact/dashboard/:path*", destination: "/dashboard/:path*" },
      { source: "/shoppers/dashboard", destination: "/shoppers/dashboard" },
      { source: "/shoppers/dashboard/:path*", destination: "/shoppers/dashboard/:path*" },
    ];
  },
};

export default nextConfig;
