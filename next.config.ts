import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:from-to-:to",
        destination: "/convert/:from-to-:to",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;