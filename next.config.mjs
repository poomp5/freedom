/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "promptpay.io" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      ...(process.env.R2_PUBLIC_URL
        ? [{ protocol: "https", hostname: new URL(process.env.R2_PUBLIC_URL).hostname }]
        : []),
    ],
  },
  serverExternalPackages: ['@prisma/client'],
};


export default nextConfig;
