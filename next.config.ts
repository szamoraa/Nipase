import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** Pin Turbopack to this app so `public/` resolves here (avoids wrong root when parent has a lockfile). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  /** Cursor / browser previews often use 127.0.0.1; without this, dev assets (HMR) can be blocked. */
  allowedDevOrigins: ["127.0.0.1"],
  /** Limit `next/image` srcset variants so dev-time Sharp resizes don't spike CPU. */
  images: {
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [128, 256, 384, 640],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;
