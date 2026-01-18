/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tacos.tedawf.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
