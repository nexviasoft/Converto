import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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