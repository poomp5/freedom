/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['promptpay.io', 'lh3.googleusercontent.com'],
  },
  serverExternalPackages: ['@prisma/client'],
};


export default nextConfig;
