/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  images: {
    // Workaround/Patch for Next.js CVE: Unbounded next/image disk cache growth
    // Caps the local disk cache at 50MB to prevent storage exhaustion.
    maximumDiskCacheSize: 50 * 1024 * 1024,
  }
};



export default nextConfig;
