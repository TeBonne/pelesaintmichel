// Site privé par défaut (partage à des amis, pas d'indexation par les moteurs de recherche).
// Le jour du lancement officiel : mettre NEXT_PUBLIC_SITE_INDEXABLE=true dans .env (voir README).
const INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

/** @type {import('next').NextConfig} */
const config = {
  // Racine du projet (évite l'avertissement « multiple lockfiles » et fiabilise le déploiement)
  outputFileTracingRoot: import.meta.dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ndooziefenxvphuamybn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Tant que le site est privé : interdit l'indexation sur TOUTES les pages (Google, Bing, etc.)
          ...(INDEXABLE ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]),
        ],
      },
    ];
  },
};

export default config;
