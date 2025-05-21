/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@azure/storage-blob"],
    serverActions: true,
  },
  env: {
    NEXT_PUBLIC_ENABLE_VISION: process.env.ENABLE_VISION || "false",
    NEXT_PUBLIC_ENABLE_DALLE: process.env.ENABLE_DALLE || "false",
    NEXT_PUBLIC_AZURE_GOV: process.env.AZURE_GOV || "false"
  }
};

module.exports = nextConfig;
