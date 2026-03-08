import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [
    { protocol: "https", hostname: "covers.openlibrary.org" },
    { protocol: "https", hostname: "e5utc0vycpuj8gub.public.blob.vercel-storage.com" }
  ]}
};

export default nextConfig;
