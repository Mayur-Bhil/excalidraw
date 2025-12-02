import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages:["@repo/ui"],
    turbopack: {
    root: 'D:\\projects\\draw-app', // Absolute path
  },
};

export default nextConfig;
