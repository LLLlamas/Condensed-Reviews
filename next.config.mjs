/** @type {import('next').NextConfig} */
const nextConfig = {
  // Linting is run separately via `npm run lint` with the project's own flat
  // ESLint config; Next's build-time lint double-lints with conflicting rules.
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.amazon.com' },
    ],
  },
};
export default nextConfig;
