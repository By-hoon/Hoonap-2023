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
        destination: "/",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/",
        permanent: true,
      },
      {
        source: "/story/edit",
        destination: "/story/list",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
