import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { PageHero, Section, SectionWide, SectionHead, Prose, CtaBand, InfoCard } from "@/components/page/Blocks";
import { getSoutenirContent } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import Breadcrumb from "@/components/page/Breadcrumb";
import RelatedLinks from "@/components/page/RelatedLinks";

export const revalidate = 3600;

export async function generateMetadata() {
  const { page } = await getSoutenirContent();
  return pageMeta({
    title: page?.meta_title || "Nous soutenir — Pèlerinage de Saint Michel",
    description: page?.meta_description,
    path: "/nous-soutenir",
    image: page?.hero_image_url,
  });
}

function Tier({ amount, real, label, href }) {
  return (
    <div style={{ background: "var(--ivory)", border: "1px solid var(--line)", borderTop: "3px solid var(--gold-500)", borderRadius: "var(--r-md)", padding: "26px 22px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 40, color: "var(--navy-700)", lineHeight: 1 }}>{amount}</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--ink-soft)", margin: "10px 0 14px" }}>
        soit <strong style={{ color: "var(--gold-700)" }}>{real}</strong> après réduction d'impôt
      </div>
      <a href={href || "#"} style={{ display: "inline-block", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--navy-800)", background: "var(--gold-500)", padding: "10px 18px", borderRadius: "var(--r-sm)" }}>
        {label || "Je donne"}
      </a>
    </div>
  );
}

export default async function SoutenirPage() {
  const { page, tiers, help, nav, settings } = await getSoutenirContent();
  const p = page || {};
  const inscriptionUrl = settings?.inscription_url;

  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <SiteHeader nav={nav} socialLinks={settings} inscriptionUrl={inscriptionUrl} active="Nous soutenir" />
      <main id="contenu">
        <Breadcrumb current="Nous soutenir" path="/nous-soutenir" />
        <PageHero kicker={p.hero_kicker} title={p.hero_title} subtitle={p.hero_subtitle} photo={p.hero_image_url} pos={p.hero_pos} alt={p.hero_image_alt} />

        <Section>
          <SectionHead over={p.why_overline} title={p.why_title} />
          <Prose text={p.why_body} />
        </Section>

        <SectionWide bg="var(--ivory)">
          <SectionHead over={p.dons_overline} title={p.dons_title} center />
          {p.dons_info && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--ink-soft)", textAlign: "center", maxWidth: 600, margin: "0 auto 28px" }}>{p.dons_info}</p>
          )}
          <div className="pele-grid-3">
            {(tiers || []).map((t) => (
              <Tier key={t.id} amount={t.amount} real={t.real_cost} label={p.dons_button_label} href={p.dons_button_href} />
            ))}
          </div>
        </SectionWide>

        <Section>
          <SectionHead over={p.help_overline} title={p.help_title} />
          <div className="pele-grid-2">
            {(help || []).map((c) => (
              <InfoCard key={c.id} icon={c.icon} title={c.title} text={c.body} />
            ))}
          </div>
        </Section>

        <RelatedLinks current="nous-soutenir" />
        <CtaBand title={p.cta_title} sub={p.cta_sub} label={p.cta_label || "Faire un don"} href={p.cta_href || "#"} />
      </main>
      <SiteFooter settings={settings} socialLinks={settings} />
    </>
  );
}
