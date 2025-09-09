import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  experimental: {},
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
