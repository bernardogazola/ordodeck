/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  reactStrictMode: false,
  experimental: {
    viewTransition: true,
    authInterrupts: true,
  },
};

export default nextConfig;
