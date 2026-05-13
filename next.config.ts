import type { NextConfig } from "next";

/**
 * Static export configuration for GitHub Pages hosting.
 * - output: 'export' produces a static `out/` folder of HTML/CSS/JS
 * - basePath/assetPrefix scope assets under /poc-release-center on github.io
 * - trailingSlash makes GitHub Pages URLs work without server-side rewrites
 *
 * Override basePath via NEXT_PUBLIC_BASE_PATH for forks or custom domains.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/poc-supported-release-center";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
