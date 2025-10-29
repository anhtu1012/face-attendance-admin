/* eslint-disable @typescript-eslint/no-explicit-any */
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Enable optimizePackageImports for common packages
    optimizePackageImports: [
      "antd",
      "@ag-grid-community/core",
      "@ag-grid-community/react",
      "@ag-grid-enterprise/column-tool-panel",
      "@ag-grid-enterprise/menu",
      "react-icons",
    ],
  },
  // Keep webpack config for production builds (when not using turbopack)
  webpack: (config: any, { dev, isServer }: any) => {
    // Only apply webpack optimizations for production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
            },
            agGrid: {
              test: /[\\/]node_modules[\\/]@ag-grid/,
              name: "ag-grid",
              chunks: "all",
              priority: 10,
            },
            antd: {
              test: /[\\/]node_modules[\\/]antd/,
              name: "antd",
              chunks: "all",
              priority: 10,
            },
          },
        },
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "http" as const,
        hostname: "128.199.119.151",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "https" as const,
        hostname: "thegioibut.com",
        pathname: "/**",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
    additionalData: `@use "@/styles/_index.scss" as *;`,
  },
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
