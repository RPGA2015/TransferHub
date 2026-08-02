import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      { source: "/marketplace", destination: "/en/marketplace", permanent: false },
      { source: "/waitlist", destination: "/en/waitlist", permanent: false },
    ];
  },
};

export default nextConfig;
