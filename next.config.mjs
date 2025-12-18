/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  serverExternalPackages: [
    '@react-email/render',
    '@react-email/components'
  ],
};

export default nextConfig;
