import { createClient } from "@/lib/supabase/server";

/* Helpers génériques */
async function getSingleton(supabase, table) {
  const { data } = await supabase.from(table).select("*").eq("id", 1).maybeSingle();
  return data || null;
}
async function getList(supabase, table) {
  const { data } = await supabase.from(table).select("*").order("sort_order", { ascending: true });
  return data || [];
}

/** En-tête/pied de page communs (menu + réglages) pour les pages internes. */
export async function getChrome() {
  const supabase = await createClient();
  const [nav, settings] = await Promise.all([
    supabase.from("nav_items").select("*").order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
  ]);
  return { nav: buildNavTree(nav.data), settings: settings.data || null };
}

export async function getPelerinageContent() {
  const s = await createClient();
  const [page, cards, partners, gallery, chrome] = await Promise.all([
    getSingleton(s, "page_pelerinage"),
    getList(s, "pele_presentation_cards"),
    getList(s, "pele_partners"),
    getList(s, "pele_gallery"),
    getChrome(),
  ]);
  return { page, cards, partners, gallery, ...chrome };
}

export async function getProgrammeContent() {
  const s = await createClient();
  const [page, days, daily, facts, chrome] = await Promise.all([
    getSingleton(s, "page_programme"),
    getList(s, "prog_days"),
    getList(s, "prog_daily"),
    getList(s, "prog_facts"),
    getChrome(),
  ]);
  return { page, days, daily, facts, ...chrome };
}

export async function getPrierContent() {
  const s = await createClient();
  const [page, chrome] = await Promise.all([getSingleton(s, "page_prier"), getChrome()]);
  return { page, ...chrome };
}

export async function getFaqPageContent() {
  const s = await createClient();
  const [page, items, chrome] = await Promise.all([
    getSingleton(s, "page_faq"),
    getList(s, "faq_page_items"),
    getChrome(),
  ]);
  // Regroupe les items par catégorie, dans l'ordre d'apparition
  const cats = [];
  const byName = new Map();
  for (const it of items) {
    const name = it.category || "Questions";
    if (!byName.has(name)) {
      const cat = { id: name, name, items: [] };
      byName.set(name, cat);
      cats.push(cat);
    }
    byName.get(name).items.push(it);
  }
  return { page, items, categories: cats, ...chrome };
}

export async function getRessourcesContent() {
  const s = await createClient();
  const [page, videos, photos, documents, newsletters, chrome] = await Promise.all([
    getSingleton(s, "page_ressources"),
    getList(s, "res_videos"),
    getList(s, "res_photos"),
    getList(s, "res_documents"),
    getList(s, "res_newsletters"),
    getChrome(),
  ]);
  return { page, videos, photos, documents, newsletters, ...chrome };
}

export async function getBoutiqueContent() {
  const s = await createClient();
  const [page, products, chrome] = await Promise.all([
    getSingleton(s, "page_boutique"),
    getList(s, "shop_products"),
    getChrome(),
  ]);
  return { page, products, ...chrome };
}

export async function getSoutenirContent() {
  const s = await createClient();
  const [page, tiers, help, chrome] = await Promise.all([
    getSingleton(s, "page_soutenir"),
    getList(s, "soutenir_tiers"),
    getList(s, "soutenir_help_cards"),
    getChrome(),
  ]);
  return { page, tiers, help, ...chrome };
}

export async function getRechercheContent() {
  const s = await createClient();
  const [page, chrome] = await Promise.all([getSingleton(s, "page_recherche"), getChrome()]);
  return { page, ...chrome };
}

/** Construit l'arborescence du menu (2 niveaux) à partir des lignes plates. */
function buildNavTree(rows) {
  const list = rows || [];
  const tops = list.filter((r) => !r.parent_id);
  return tops.map((t) => ({
    id: t.id,
    label: t.label,
    href: t.href,
    children: list
      .filter((r) => r.parent_id === t.id)
      .map((c) => ({ label: c.label, href: c.href })),
  }));
}

/** Menu de l'en-tête sous forme d'arbre. */
export async function getNav() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("nav_items")
    .select("*")
    .order("sort_order", { ascending: true });
  return buildNavTree(data);
}

/**
 * Récupère tout le contenu de la page d'accueil en une passe.
 * Les valeurs nulles laissent les composants retomber sur leurs valeurs
 * par défaut (le site reste affichable même si une table est vide).
 */
export async function getHomeContent() {
  const supabase = await createClient();
  const [hero, stats, programme, citation, videos, faq, settings, nav] = await Promise.all([
    supabase.from("hero").select("*").eq("id", 1).maybeSingle(),
    supabase.from("stats").select("*").order("sort_order", { ascending: true }),
    supabase.from("programme_days").select("*").order("sort_order", { ascending: true }),
    supabase.from("citation").select("*").eq("id", 1).maybeSingle(),
    supabase.from("videos").select("*").order("sort_order", { ascending: true }),
    supabase.from("faq").select("*").order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("nav_items").select("*").order("sort_order", { ascending: true }),
  ]);

  return {
    hero: hero.data || null,
    stats: stats.data || [],
    programme: programme.data || [],
    citation: citation.data || null,
    videos: videos.data || [],
    faq: faq.data || [],
    settings: settings.data || null,
    nav: buildNavTree(nav.data),
  };
}
