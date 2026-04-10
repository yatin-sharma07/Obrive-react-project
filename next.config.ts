// next.config.ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/, // support .mdx files
});

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],

  // Standalone output for Docker optimization
  output: "standalone",

  // Target modern browsers to eliminate legacy polyfills
  experimental: {
    optimizePackageImports: ["gsap", "framer-motion", "lucide-react"],
  },

  // Disable SWC features that might inject polyfills (still fine in dev)
  compiler: {
    removeConsole: true,
  },

  transpilePackages: [],

  // Image optimization — reduce TTL to 0 in dev
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: isDev ? 0 : 31536000, // <-- 0 in dev
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  compress: true,
  poweredByHeader: false,

  // Disable the RSC/HMR "fetch cache" during development
  // (prevents server components HMR from reusing stale fetch results)
  serverComponentsHmrCache: isDev ? false : true,

  // Keep dev on-demand entries from being buffered for long
  onDemandEntries: isDev
    ? {
        maxInactiveAge: 1_000, // 1s - evict quickly in dev
        pagesBufferLength: 1,
      }
    : {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
      },

  // Webpack tweaks: explicitly disable webpack cache in dev
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      // disable webpack module/chunk caching in dev
      // (Webpack default is memory cache; turning this off forces rebuilds)
      // @ts-ignore
      config.cache = false;
    }

    // Keep your other bundling optimizations for prod unchanged:
    if (!isServer && !dev) {
      config.target = ["web", "es2020"];
      if (config.module && config.module.rules) {
        config.module.rules.forEach((rule: any) => {
          if (rule.use && Array.isArray(rule.use)) {
            rule.use.forEach((loader: any) => {
              if (loader.loader && loader.loader.includes("swc-loader")) {
                if (!loader.options) loader.options = {};
                loader.options.jsc = {
                  ...loader.options.jsc,
                  target: "es2020",
                };
              }
            });
          }
        });
      }

      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: "framework",
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 40,
            enforce: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            reuseExistingChunk: true,
          },
          animations: {
            test: /[\\/]node_modules[\\/](gsap|framer-motion)[\\/]/,
            name: "animations",
            priority: 20,
            reuseExistingChunk: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
            name: "ui",
            priority: 15,
            reuseExistingChunk: true,
          },
          commons: {
            name: "commons",
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // In dev: *force* no-cache headers for everything (so browser/CDN won't stash)
  async headers() {
    if (isDev) {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value:
                "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
            },
            { key: "Pragma", value: "no-cache" },
            { key: "Expires", value: "0" },
            // keep basic security headers too
            { key: "X-DNS-Prefetch-Control", value: "on" },
            { key: "X-Frame-Options", value: "DENY" },
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          ],
        },
      ];
    }

    // Production headers (keep your existing behavior)
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Link",
            value:
              "<https://www.googletagmanager.com>; rel=preconnect, <https://unpkg.com>; rel=preconnect, <https://storage.googleapis.com>; rel=preconnect",
          },
        ],
      },
      {
        source:
          "/(.*)\\.(js|css|woff|woff2|eot|ttf|otf|svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|ogg|mov)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [];
  },
};

export default withMDX(nextConfig);
