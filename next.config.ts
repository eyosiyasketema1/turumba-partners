import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allow sharper photos where we ask for them (default is 75 only)
  images: { qualities: [75, 90] },
};

export default nextConfig;
