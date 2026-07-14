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
      // Pages exemples /* renommées pour suivre les noms d'offres actuels
      // (Vitrine Essentielle → Présence, Site Autonome → Autonome,
      // Croissance Digitale → Machine) : anciennes URLs redirigées pour
      // éviter une 404 sèche sur un lien déjà partagé/en cache.
      {
        source: "/exemples/vitrine-essentielle",
        destination: "/exemples/presence",
        permanent: false,
      },
      {
        source: "/exemples/vitrine-essentielle/:path*",
        destination: "/exemples/presence/:path*",
        permanent: false,
      },
      {
        source: "/exemples/site-autonome",
        destination: "/exemples/autonome",
        permanent: false,
      },
      {
        source: "/exemples/site-autonome/:path*",
        destination: "/exemples/autonome/:path*",
        permanent: false,
      },
      {
        source: "/exemples/croissance-digitale",
        destination: "/exemples/machine",
        permanent: false,
      },
      {
        source: "/exemples/croissance-digitale/:path*",
        destination: "/exemples/machine/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
