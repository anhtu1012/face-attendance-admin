/* eslint-disable @typescript-eslint/no-explicit-any */
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify is default in Next.js 15, remove deprecated option
  experimental: {
    // Enable compilation optimizations
    optimizePackageImports: ["@ant-design/icons", "antd", "react-icons"],
    turbotrace: {
      // Reduce bundle analysis time
      logLevel: "error",
    },
  },
  // Improve build performance
  webpack: (config: any, { dev, isServer }: any) => {
    if (!dev && !isServer) {
      // Enable webpack optimizations for production
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
    ],
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
    // Using @use/@forward instead of @import
    additionalData: `@use "@/styles/_index.scss" as *;`,
  },
  reactStrictMode: true,

  // i18n: {
  //   locales: ["en", "vi"], // Khai báo các ngôn ngữ
  //   defaultLocale: "vi",
  // },
};

export default withNextIntl(nextConfig);
