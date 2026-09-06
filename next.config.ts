import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `output: "standalone"` is only for the Docker/VPS image. Vercel builds its own
  // serverless output, so it's omitted here.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
