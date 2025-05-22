// next.config.mjs

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Double asterisk allows any subdomain
        port: "",
        pathname: "/**", // Allows all paths
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    nextScriptWorkers: true,
  },
};

export default nextConfig;
