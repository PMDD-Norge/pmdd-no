import withNextBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const withBundleAnalyzer = withNextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    taint: true,
    optimizePackageImports: [
      "next-intl", 
      "@sanity/ui",
      "@sanity/image-url",
      "framer-motion"
    ],
    // typedRoutes: true, // Disabled due to type conflicts
  },
  serverExternalPackages: ['@sanity/vision'],
  allowedDevOrigins: ["http://localhost:3000"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Configure aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "framer-motion": require.resolve("framer-motion"),
    };

    // Exclude heavy Sanity dependencies from main bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Split chunks for better caching (production only)
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            sanity: {
              name: 'sanity',
              test: /[\\/]node_modules[\\/](@sanity|sanity)[\\/]/,
              priority: 40,
              chunks: 'all',
            },
            ui: {
              name: 'ui-libs',
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              priority: 30,
              chunks: 'all',
            },
          },
        },
      };
    }

    return config;
  },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));