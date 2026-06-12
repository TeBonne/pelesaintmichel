import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { PageHero, Section, CtaBand } from "@/components/page/Blocks";
import FaqAccordion from "@/components/page/FaqAccordion";
import { getFaqPageContent } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import Breadcrumb from "@/components/page/Breadcrumb";
import RelatedLinks from "@/components/page/RelatedLinks";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getFaqPageContent();
  return pageMeta({
    title: page?.meta_title || "FAQ 2026 — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/faq",
    image: page?.hero_image_url,
  });
}

export default async function FaqPage() {
  const { page, items, categories, nav, settings } = await getFaqPageContent();
  const p = page || {};
  const inscriptionUrl = settings?.inscription_url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (items || []).map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <SiteHeader nav={nav} socialLinks={settings} inscriptionUrl={inscriptionUrl} active="FAQ" />
      <main id="contenu">
        <Breadcrumb current="FAQ" path="/faq" />
        <PageHero kicker={p.hero_kicker} title={p.hero_title} subtitle={p.hero_subtitle} photo={p.hero_image_url} pos={p.hero_pos} alt={p.hero_image_alt} />
        <Section>
          <FaqAccordion categories={categories} />
          {p.contact_text && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--ink-soft)", textAlign: "center", marginTop: 28 }}>{p.contact_text}</p>
          )}
        </Section>
        <RelatedLinks current="faq" />
        <CtaBand title={p.cta_title} sub={p.cta_sub} label={p.cta_label || "S'inscrire"} href={p.cta_href || inscriptionUrl || "#"} />
      </main>
      <SiteFooter settings={settings} socialLinks={settings} nav={nav} />
    </>
  );
}
