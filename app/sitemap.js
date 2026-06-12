import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

const BASE = "https://www.pelesaintmichel.fr";

// /recherche est volontairement absent (noindex).
const PAGES = [
  { path: "/", table: "hero", priority: 1 },
  { path: "/le-pelerinage", table: "page_pelerinage", priority: 0.8 },
  { path: "/programme", table: "page_programme", priority: 0.8 },
  { path: "/prier", table: "page_prier", priority: 0.7 },
  { path: "/faq", table: "page_faq", priority: 0.7 },
  { path: "/ressources", table: "page_ressources", priority: 0.6 },
  { path: "/boutique", table: "page_boutique", priority: 0.6 },
  { path: "/nous-soutenir", table: "page_soutenir", priority: 0.7 },
  { path: "/a-propos", table: "simple_pages", slug: "apropos", priority: 0.5 },
  { path: "/contact", table: "simple_pages", slug: "contact", priority: 0.5 },
  { path: "/mentions-legales", table: "simple_pages", slug: "mentions", priority: 0.3 },
];

export default async function sitemap() {
  const lastmod = {};
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    await Promise.all(
      PAGES.map(async (pg) => {
        const { data } = await sb.from(pg.table).select("updated_at").eq(pg.slug ? "slug" : "id", pg.slug ?? 1).maybeSingle();
        if (data?.updated_at) lastmod[pg.path] = new Date(data.updated_at);
      })
    );
  } catch {
    // en cas d'erreur, on renvoie le sitemap sans dates
  }
  return PAGES.map((pg) => ({
    url: BASE + pg.path,
    lastModified: lastmod[pg.path],
    changeFrequency: "weekly",
    priority: pg.priority,
  }));
}
