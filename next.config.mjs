/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Anciennes versions archivées (app/_archive, hors routing public) :
    // les URLs historiques redirigent proprement vers la racine.
    return [
      { source: "/v2", destination: "/", permanent: false },
      { source: "/v2/:path*", destination: "/", permanent: false },
      { source: "/v3", destination: "/", permanent: false },
      { source: "/v3/:path*", destination: "/", permanent: false },
      { source: "/signature", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
