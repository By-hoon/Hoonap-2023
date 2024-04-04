/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/welcome",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/welcome",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
