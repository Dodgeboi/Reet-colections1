/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // product photos uploaded to Vercel Blob in production
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    // The JSON data files are read at runtime; make sure they ship with the
    // serverless bundle so first-run reads work before Blob storage exists.
    outputFileTracingIncludes: { "/**/*": ["./data/**"] },
  },
};
module.exports = nextConfig;
