import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** Walk up to find the directory that actually contains node_modules/next (supports git worktrees). */
function findTurbopackRoot(start: string): string {
  let dir = start;
  while (true) {
    if (fs.existsSync(path.join(dir, "node_modules", "next"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return start;
    dir = parent;
  }
}

const turbopackRoot = findTurbopackRoot(projectRoot);

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/story", destination: "/about", permanent: true }];
  },
  turbopack: {
    root: turbopackRoot,
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
