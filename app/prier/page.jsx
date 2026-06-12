import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { PageHero, SubNav, Section, SectionWide, SectionHead, Prose, CtaBand, InfoCard } from "@/components/page/Blocks";
import { getPrierContent } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import Breadcrumb from "@/components/page/Breadcrumb";
import RelatedLinks from "@/components/page/RelatedLinks";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getPrierContent();
  return pageMeta({
    title: page?.meta_title || "Prier & se former — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/prier",
    image: page?.hero_image_url,
  });
}

const SUB = [
  ["Prière à saint Michel", "#priere"],
  ["Le chapelet", "#chapelet"],
  ["La neuvaine", "#neuvaine"],
  ["Les anges", "#anges"],
];

export default async function PrierPage() {
  const { page, nav, settings } = await getPrierContent();
  const p = page || {};
  const inscriptionUrl = settings?.inscription_url;

  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <SiteHeader nav={nav} socialLinks={settings} inscriptionUrl={inscriptionUrl} active="Prier" />
      <main id="contenu">
        <Breadcrumb current="Prier" path="/prier" />
        <PageHero kicker={p.hero_kicker} title={p.hero_title} subtitle={p.hero_subtitle} photo={p.hero_image_url} pos={p.hero_pos} alt={p.hero_image_alt} />
        <SubNav items={SUB} active="Prière à saint Michel" />

        <Section id="priere">
          <SectionHead over={p.priere_overline} title={p.priere_title} />
          {p.priere_text && <Prose text={p.priere_text} />}
          {p.priere_prayer && (
            <blockquote style={{ fontFamily: "var(--font-serif)", fontSize: 21, fontStyle: "italic", lineHeight: 1.6, color: "var(--navy-700)", borderLeft: "3px solid var(--gold-500)", padding: "4px 0 4px 24px", margin: "18px 0 0" }}>
              {p.priere_prayer}
            </blockquote>
          )}
        </Section>

        <SectionWide id="chapelet" bg="var(--ivory)">
          <SectionHead over={p.chapelet_overline} title={p.chapelet_title} />
          <div className="pele-grid-2">
            <Prose text={p.chapelet_body} />
            <div>
              <InfoCard title={p.chapelet_howto_title} icon={null} text={p.chapelet_howto_text} />
            </div>
          </div>
        </SectionWide>

        <Section id="neuvaine">
          <SectionHead over={p.neuvaine_overline} title={p.neuvaine_title} />
          <Prose text={p.neuvaine_body} />
        </Section>

        <SectionWide id="anges" bg="var(--parchment-2)">
          <SectionHead over={p.anges_overline} title={p.anges_title} />
          <Prose text={p.anges_body} />
        </SectionWide>

        <RelatedLinks current="prier" />
        <CtaBand title={p.cta_title} sub={p.cta_sub} label={p.cta_label || "S'inscrire"} href={p.cta_href || inscriptionUrl || "#"} />
      </main>
      <SiteFooter settings={settings} socialLinks={settings} nav={nav} />
    </>
  );
}
