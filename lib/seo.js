/** Construit les métadonnées SEO d'une page (title, description, canonical, robots, Open Graph, Twitter).
 *  Les URLs relatives sont résolues via metadataBase (défini dans app/layout.jsx). */
export function pageMeta({ title, description, path = "/", image, robots }) {
  const desc = description || undefined;
  const images = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    ...(robots ? { robots } : {}),
    openGraph: {
      type: "website",
      siteName: "Pèlerinage de Saint Michel",
      locale: "fr_FR",
      title,
      description: desc,
      url: path,
      images,
    },
    twitter: { card: "summary_large_image", title, description: desc, images: image ? [image] : undefined },
  };
}
