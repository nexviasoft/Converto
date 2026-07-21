import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 2,
  },
  async redirects() {
    return [
      {
        source: "/:fromFmt-to-:toFmt",
        destination: "/convert/:fromFmt-to-:toFmt",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;