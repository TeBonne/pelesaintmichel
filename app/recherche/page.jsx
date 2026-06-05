import { Suspense } from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { PageHero, Section } from "@/components/page/Blocks";
import SearchClient from "@/components/page/SearchClient";
import { getRechercheContent } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import Breadcrumb from "@/components/page/Breadcrumb";
import RelatedLinks from "@/components/page/RelatedLinks";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getRechercheContent();
  return pageMeta({
    title: page?.meta_title || "Recherche — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/recherche",
    image: page?.hero_image_url,
    robots: { index: false, follow: true }, // page de recherche : pas d'indexation (évite les URL ?q= dupliquées)
  });
}

export default async function RecherchePage() {
  const { page, nav, settings } = await getRechercheContent();
  const p = page || {};

  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <SiteHeader nav={nav} socialLinks={settings} inscriptionUrl={settings?.inscription_url} />
      <main id="contenu">
        <Breadcrumb current="Recherche" path="/recherche" />
        <PageHero kicker={p.hero_kicker} title={p.hero_title} subtitle={p.hero_subtitle} photo={p.hero_image_url} pos={p.hero_pos} alt={p.hero_image_alt} />
        <Section>
          <Suspense fallback={null}>
            <SearchClient />
          </Suspense>
        </Section>
        <RelatedLinks current="recherche" />
      </main>
      <SiteFooter settings={settings} socialLinks={settings} />
    </>
  );
}
