"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const IMPOSSIBLE_UUID = "00000000-0000-0000-0000-000000000000";

async function getAuthedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Votre session a expiré. Reconnectez-vous (page de connexion) puis réessayez.");
  return supabase;
}

async function isAdmin(supabase) {
  const { data } = await supabase.rpc("is_admin");
  return data === true;
}

async function logActivity(supabase, action, detail) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("activity_log").insert({
      user_email: user?.email || null,
      action,
      detail: detail || null,
    });
  } catch {
    // journalisation best-effort : ne bloque jamais l'enregistrement
  }
}

async function finish(supabase, detail, paths = ["/"]) {
  if (supabase && detail) await logActivity(supabase, "modification", detail);
  for (const p of paths) revalidatePath(p);
  return { ok: true };
}

/* ---------- Helpers internes (réutilisés par toutes les pages) ---------- */

function missingRequired(obj, keys) {
  // Ne vérifie que les clés présentes dans l'objet soumis (chaque carte n'envoie que ses champs).
  return (keys || []).filter((k) => k in obj && !String(obj[k] ?? "").trim());
}

async function singletonUpdate(table, label, paths, v, requiredKeys) {
  try {
    const miss = missingRequired(v, requiredKeys);
    if (miss.length) return { ok: false, error: "Enregistrement refusé : remplissez le(s) champ(s) obligatoire(s) (marqués *) — " + miss.join(", ") + "." };
    const supabase = await getAuthedClient();
    const patch = { ...v, updated_at: new Date().toISOString() };
    const { error } = await supabase.from(table).update(patch).eq("id", 1);
    if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };
    return finish(supabase, label, paths);
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function listReplace(table, label, paths, mapRow, items, requiredKeys) {
  try {
    for (let i = 0; i < (items || []).length; i++) {
      const miss = (requiredKeys || []).filter((k) => !String(items[i][k] ?? "").trim());
      if (miss.length) return { ok: false, error: `Enregistrement refusé — ligne #${i + 1} : remplissez le(s) champ(s) obligatoire(s) (marqués *) — ${miss.join(", ")}.` };
    }
    const rows = (items || []).map((it, i) => mapRow(it, i));
    const supabase = await getAuthedClient();
    const { error: delErr } = await supabase.from(table).delete().neq("id", IMPOSSIBLE_UUID);
    if (delErr) return { ok: false, error: delErr.message };
    if (rows.length) {
      const { error } = await supabase.from(table).insert(rows);
      if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };
    }
    return finish(supabase, label, paths);
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/* ---------- Singletons ---------- */

export async function updateHero(v) {
  try {
    const miss = missingRequired(v, ["title", "bg_image_alt"]);
    if (miss.length) return { ok: false, error: "Enregistrement refusé : remplissez le(s) champ(s) obligatoire(s) (marqués *) — " + miss.join(", ") + "." };
    const supabase = await getAuthedClient();
    const { error } = await supabase
      .from("hero")
      .update({
        overline: v.overline,
        title: v.title,
        subtitle: v.subtitle,
        primary_label: v.primary_label,
        primary_href: v.primary_href,
        ghost_label: v.ghost_label,
        ghost_href: v.ghost_href,
        bg_image_url: v.bg_image_url,
        bg_image_alt: v.bg_image_alt,
        youtube_id: v.youtube_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };
    return finish(supabase, "Bandeau d'accueil");
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function updateCitation(v) {
  try {
    const miss = missingRequired(v, ["quote", "bg_image_alt"]);
    if (miss.length) return { ok: false, error: "Enregistrement refusé : remplissez le(s) champ(s) obligatoire(s) (marqués *) — " + miss.join(", ") + "." };
    const supabase = await getAuthedClient();
    const { error } = await supabase
      .from("citation")
      .update({
        quote: v.quote,
        attribution: v.attribution,
        bg_image_url: v.bg_image_url,
        bg_image_alt: v.bg_image_alt,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };
    return finish(supabase, "Citation");
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function updateSettings(v) {
  try {
    const supabase = await getAuthedClient();
    const { error } = await supabase
      .from("site_settings")
      .update({
        inscription_url: v.inscription_url,
        footer_quote: v.footer_quote,
        contact_email: v.contact_email,
        youtube_channel_url: v.youtube_channel_url,
        instagram_url: v.instagram_url,
        facebook_url: v.facebook_url,
        youtube_url: v.youtube_url,
        tiktok_url: v.tiktok_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };
    return finish(supabase, "Réglages du site");
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/* ---------- Listes (remplacement complet, ordre = position) ---------- */

async function replaceList(table, rows, detail, requiredKeys) {
  for (let i = 0; i < rows.length; i++) {
    const miss = (requiredKeys || []).filter((k) => !String(rows[i][k] ?? "").trim());
    if (miss.length) return { ok: false, error: `Enregistrement refusé — ligne #${i + 1} : remplissez le(s) champ(s) obligatoire(s) (marqués *) — ${miss.join(", ")}.` };
  }
  const supabase = await getAuthedClient();
  const { error: delErr } = await supabase.from(table).delete().neq("id", IMPOSSIBLE_UUID);
  if (delErr) return { ok: false, error: delErr.message };
  if (rows.length) {
    const { error } = await supabase.from(table).insert(rows);
    if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };
  }
  return finish(supabase, detail);
}

export async function replaceStats(items) {
  try {
    const rows = items.map((it, i) => ({ value: it.value, title: it.title, subtitle: it.subtitle, sort_order: i + 1 }));
    return await replaceList("stats", rows, "Chiffres clés", ["value", "title"]);
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function replaceProgramme(items) {
  try {
    const rows = items.map((it, i) => ({
      date_label: it.date_label,
      title: it.title,
      body: it.body,
      photo_caption: it.photo_caption,
      image_url: it.image_url,
      image_pos: it.image_pos,
      sort_order: i + 1,
    }));
    return await replaceList("programme_days", rows, "Programme", ["title", "image_url", "photo_caption"]);
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function replaceVideos(items) {
  try {
    const rows = items.map((it, i) => ({ youtube_id: it.youtube_id, title: it.title, subtitle: it.subtitle, sort_order: i + 1 }));
    return await replaceList("videos", rows, "Vidéos", ["youtube_id", "title"]);
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function replaceFaq(items) {
  try {
    const rows = items.map((it, i) => ({ question: it.question, answer: it.answer, sort_order: i + 1 }));
    return await replaceList("faq", rows, "FAQ", ["question", "answer"]);
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/* ---------- Menu de l'en-tête (arborescence 2 niveaux) ---------- */

export async function replaceNav(items) {
  try {
    for (const top of items || []) {
      if (!String(top.label ?? "").trim() || !String(top.href ?? "").trim())
        return { ok: false, error: "Chaque entrée du menu doit avoir un libellé et un lien." };
      for (const c of top.children || []) {
        if (!String(c.label ?? "").trim() || !String(c.href ?? "").trim())
          return { ok: false, error: "Chaque sous-entrée du menu doit avoir un libellé et un lien." };
      }
    }
    const supabase = await getAuthedClient();
    const { error: delErr } = await supabase.from("nav_items").delete().neq("id", IMPOSSIBLE_UUID);
    if (delErr) return { ok: false, error: delErr.message };

    let order = 1;
    for (const top of items) {
      const { data: inserted, error } = await supabase
        .from("nav_items")
        .insert({ label: top.label, href: top.href, sort_order: order++, parent_id: null })
        .select("id")
        .single();
      if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };

      const children = (top.children || []).map((c, i) => ({
        parent_id: inserted.id,
        label: c.label,
        href: c.href,
        sort_order: i + 1,
      }));
      if (children.length) {
        const { error: cErr } = await supabase.from("nav_items").insert(children);
        if (cErr) return { ok: false, error: cErr.message };
      }
    }
    return finish(supabase, "Menu de l'en-tête");
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/* ---------- Pages internes : singletons ---------- */
const META = ["meta_title", "meta_description"];
export async function updatePagePelerinage(v) { return singletonUpdate("page_pelerinage", "Page Le pèlerinage", ["/le-pelerinage"], v, [...META, "hero_image_alt", "eveque_image_alt", "equipe_image_alt", "pourqui_image_alt"]); }
export async function updatePageProgramme(v) { return singletonUpdate("page_programme", "Page Programme", ["/programme"], v, [...META, "hero_image_alt"]); }
export async function updatePagePrier(v) { return singletonUpdate("page_prier", "Page Prier", ["/prier"], v, [...META, "hero_image_alt"]); }
export async function updatePageFaq(v) { return singletonUpdate("page_faq", "Page FAQ", ["/faq"], v, [...META, "hero_image_alt"]); }
export async function updatePageRessources(v) { return singletonUpdate("page_ressources", "Page Ressources", ["/ressources"], v, [...META, "hero_image_alt"]); }
export async function updatePageBoutique(v) { return singletonUpdate("page_boutique", "Page Boutique", ["/boutique"], v, [...META, "hero_image_alt"]); }
export async function updatePageSoutenir(v) { return singletonUpdate("page_soutenir", "Page Nous soutenir", ["/nous-soutenir"], v, [...META, "hero_image_alt"]); }
export async function updatePageRecherche(v) { return singletonUpdate("page_recherche", "Page Recherche", ["/recherche"], v, [...META, "hero_image_alt"]); }

// Pages annexes (À propos / Mentions légales / Contact) — clé = slug
async function simplePageUpdate(slug, label, paths, v, requiredKeys) {
  try {
    const miss = missingRequired(v, requiredKeys);
    if (miss.length) return { ok: false, error: "Enregistrement refusé : remplissez le(s) champ(s) obligatoire(s) (marqués *) — " + miss.join(", ") + "." };
    const supabase = await getAuthedClient();
    const { error } = await supabase.from("simple_pages").update({ ...v, updated_at: new Date().toISOString() }).eq("slug", slug);
    if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };
    return finish(supabase, label, paths);
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
export async function updateApropos(v) { return simplePageUpdate("apropos", "Page À propos", ["/a-propos"], v, [...META, "hero_image_alt"]); }
export async function updateMentions(v) { return simplePageUpdate("mentions", "Page Mentions légales", ["/mentions-legales"], v, [...META, "hero_image_alt"]); }
export async function updateContact(v) { return simplePageUpdate("contact", "Page Contact", ["/contact"], v, [...META, "hero_image_alt"]); }

/* ---------- Pages internes : listes ---------- */
export async function replacePeleCards(items) { return listReplace("pele_presentation_cards", "Présentation (cartes)", ["/le-pelerinage"], (it, i) => ({ title: it.title, text: it.text, sort_order: i + 1 }), items, ["title", "text"]); }
export async function replacePelePartners(items) { return listReplace("pele_partners", "Partenaires", ["/le-pelerinage"], (it, i) => ({ nom: it.nom, tag: it.tag, logo_url: it.logo_url, description: it.description, sort_order: i + 1 }), items, ["nom", "logo_url"]); }
export async function replacePeleGallery(items) { return listReplace("pele_gallery", "Diaporama", ["/le-pelerinage"], (it, i) => ({ image_url: it.image_url, caption: it.caption, sort_order: i + 1 }), items, ["image_url", "caption"]); }

export async function replaceProgDays(items) { return listReplace("prog_days", "Programme (jours)", ["/programme"], (it, i) => ({ number: it.number, date_label: it.date_label, title: it.title, body: it.body, image_url: it.image_url, image_alt: it.image_alt, sort_order: i + 1 }), items, ["title", "image_url", "image_alt"]); }
export async function replaceProgDaily(items) { return listReplace("prog_daily", "Programme (temps du jour)", ["/programme"], (it, i) => ({ title: it.title, text: it.text, sort_order: i + 1 }), items, ["title", "text"]); }
export async function replaceProgFacts(items) { return listReplace("prog_facts", "Programme (infos pratiques)", ["/programme"], (it, i) => ({ key_text: it.key_text, value_text: it.value_text, sort_order: i + 1 }), items, ["key_text", "value_text"]); }

export async function replaceFaqItems(items) { return listReplace("faq_page_items", "FAQ", ["/faq"], (it, i) => ({ category: it.category, question: it.question, answer: it.answer, sort_order: i + 1 }), items, ["category", "question", "answer"]); }

export async function replaceResVideos(items) { return listReplace("res_videos", "Ressources — Vidéos", ["/ressources"], (it, i) => ({ youtube_id: it.youtube_id, title: it.title, subtitle: it.subtitle, sort_order: i + 1 }), items, ["youtube_id", "title"]); }
export async function replaceResPhotos(items) { return listReplace("res_photos", "Ressources — Photos", ["/ressources"], (it, i) => ({ image_url: it.image_url, caption: it.caption, sort_order: i + 1 }), items, ["image_url", "caption"]); }
export async function replaceResDocuments(items) { return listReplace("res_documents", "Ressources — Documents", ["/ressources"], (it, i) => ({ title: it.title, description: it.description, tag: it.tag, url: it.url, sort_order: i + 1 }), items, ["title", "url"]); }
export async function replaceResNewsletters(items) { return listReplace("res_newsletters", "Ressources — Newsletters", ["/ressources"], (it, i) => ({ title: it.title, date_label: it.date_label, description: it.description, url: it.url, sort_order: i + 1 }), items, ["title", "date_label", "url"]); }

export async function replaceShopProducts(items) { return listReplace("shop_products", "Boutique — Produits", ["/boutique"], (it, i) => ({ name: it.name, price: it.price, description: it.description, image_url: it.image_url, sort_order: i + 1 }), items, ["name", "price", "image_url"]); }

export async function replaceSoutenirTiers(items) { return listReplace("soutenir_tiers", "Dons — Paliers", ["/nous-soutenir"], (it, i) => ({ amount: it.amount, real_cost: it.real_cost, sort_order: i + 1 }), items, ["amount", "real_cost"]); }
export async function replaceSoutenirHelp(items) { return listReplace("soutenir_help_cards", "Autres aides", ["/nous-soutenir"], (it, i) => ({ icon: it.icon, title: it.title, body: it.body, sort_order: i + 1 }), items, ["title", "body"]); }

/* ---------- Gestion des éditeurs (admin uniquement) ---------- */

function validEmail(e) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
}

export async function addEditor(email, role) {
  try {
    const supabase = await getAuthedClient();
    if (!(await isAdmin(supabase))) return { ok: false, error: "Réservé à l'administrateur." };
    const e = (email || "").trim().toLowerCase();
    if (!validEmail(e)) return { ok: false, error: "Adresse e-mail invalide." };
    const r = role === "admin" ? "admin" : "editor";
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("app_users")
      .upsert({ email: e, role: r, added_by: user?.email }, { onConflict: "email" });
    if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };
    await logActivity(supabase, "gestion", `Autorisation de ${e} (${r})`);
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function updateRole(email, role) {
  try {
    const supabase = await getAuthedClient();
    if (!(await isAdmin(supabase))) return { ok: false, error: "Réservé à l'administrateur." };
    const e = (email || "").trim().toLowerCase();
    const r = role === "admin" ? "admin" : "editor";
    // Empêcher de retirer le dernier administrateur
    if (r === "editor") {
      const { count } = await supabase.from("app_users").select("email", { count: "exact", head: true }).eq("role", "admin");
      const { data: current } = await supabase.from("app_users").select("role").eq("email", e).maybeSingle();
      if (current?.role === "admin" && (count || 0) <= 1) {
        return { ok: false, error: "Impossible : il doit rester au moins un administrateur." };
      }
    }
    const { error } = await supabase.from("app_users").update({ role: r }).eq("email", e);
    if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };
    await logActivity(supabase, "gestion", `Rôle de ${e} → ${r}`);
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function removeUser(email) {
  try {
    const supabase = await getAuthedClient();
    if (!(await isAdmin(supabase))) return { ok: false, error: "Réservé à l'administrateur." };
    const e = (email || "").trim().toLowerCase();
    const { data: current } = await supabase.from("app_users").select("role").eq("email", e).maybeSingle();
    if (current?.role === "admin") {
      const { count } = await supabase.from("app_users").select("email", { count: "exact", head: true }).eq("role", "admin");
      if ((count || 0) <= 1) {
        return { ok: false, error: "Impossible : il doit rester au moins un administrateur." };
      }
    }
    const { error } = await supabase.from("app_users").delete().eq("email", e);
    if (error) return { ok: false, error: "Échec de l'enregistrement : " + error.message + ". Réessayez ; si le problème persiste, vérifiez vos droits ou reconnectez-vous." };
    await logActivity(supabase, "gestion", `Retrait de ${e}`);
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/* ---------- Connexion (journal) & déconnexion ---------- */

export async function logLogin() {
  try {
    const supabase = await getAuthedClient();
    await logActivity(supabase, "connexion", null);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
